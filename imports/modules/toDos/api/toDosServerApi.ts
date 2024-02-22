// region Imports
import { Recurso } from '../config/Recursos';
import { toDosSch, IToDos } from './toDosSch';
import { IContext } from '/imports/typings/IContext';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { segurancaApi } from '/imports/seguranca/api/SegurancaApi'; 
import { string } from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { toDosApi } from './toDosApi';
import { check } from 'meteor/check';
// endregion

class ToDosServerApi extends ProductServerBase<IToDos> {
	constructor() {
		super('toDos', toDosSch, {
			resources: Recurso
			// saveImageToDisk: true,
		});

		const self = this;

		this.addTransformedPublication(
			'concludedToDosList',
			(filter = {}, options = {}) => {
				const userId = Meteor.userId();
				console.log(filter); 
				return this.defaultListCollectionPublication({
					concluded: true,
					$or: [
						{$and: [{ personal: true, }, { createdby: userId, }]},
						{personal: false,}
					  ],
					...filter,
				}, {
					projection: { title: 1, description: 1, createdby: 1, concluded: 1},
					...options
				});
			},
			(doc: IToDos & { nomeUsuario: string }) => {
				const userProfileDoc = userprofileServerApi.getCollectionInstance().findOne({ _id: doc.createdby });
				return { ...doc, nomeUsuario: userProfileDoc?.username };
			}
		);

		this.addTransformedPublication(
			'notConcludedToDosList',
			(filter = {}, options = {}) => {
				const userId = Meteor.userId();

				return this.defaultListCollectionPublication({
					concluded: false,
					$or: [
						{$and: [{ personal: true, }, { createdby: userId, }]},
						{personal: false,}
					  ],
					...filter,
				}, {
					projection: { title: 1, description: 1, createdby: 1, concluded: 1},
					...options
				});
			},
			(doc: IToDos & { nomeUsuario: string }) => {
				const userProfileDoc = userprofileServerApi.getCollectionInstance().findOne({ _id: doc.createdby });
				return { ...doc, nomeUsuario: userProfileDoc?.username };
			}
		);

		this.addPublication('toDosDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {});
		});
		

		this.registerMethod('setSituation', this.setSituation);

		this.addRestEndpoint(
			'view',
			(params, options) => {
				console.log('Params', params);
				console.log('options.headers', options.headers);
				return { status: 'ok' };
			},
			['post']
		);

		this.addRestEndpoint(
			'view/:toDosId',
			(params, options) => {
				console.log('Rest', params);
				if (params.toDosId) {
					return self
						.defaultCollectionPublication(
							{
								_id: params.toDosId
							},
							{}
						)
						.fetch();
				} else {
					return { ...params };
				}
			},
			['get']
		);

		this.beforeInsert = this.beforeInsert.bind(this);

		this.addTransformedPublication('homeToDosList', () => {
			const userId = Meteor.userId;
			const options = {
				sort: {
					lastupdate: -1,
				},
				limit: 5,
				projection: {
					title: 1,
					createdby: 1,
					concluded: 1,
				}
			}
			const filter = {
				$or: [
					{$and: [{ personal: true, }, { createdby: userId, }]},
					{personal: false,}
				  ],
			};
			return this.defaultListCollectionPublication(filter, options);
		}, (doc: IToDos & { nomeUsuario: string }) => {
			const userProfileDoc = userprofileServerApi.getCollectionInstance().findOne({ _id: doc.createdby });

			return { ...doc, nomeUsuario: userProfileDoc?.username, situation: doc.concluded ? 'Concluída' : 'Não concluída' };
		});
	}

	beforeInsert(_docObj: IToDos, _context: IContext) {
		if (this.defaultResources && this.defaultResources[`${this.collectionName?.toUpperCase()}_CREATE`]) {
			segurancaApi.validarAcessoRecursos(_context.user, [`${this.collectionName?.toUpperCase()}_CREATE`]);
		}


		if (!_docObj.hasOwnProperty('concluded')) _docObj.concluded = false;

		return true;
	}

	beforeUpdate(_docObj: IToDos | Partial<IToDos>, _context: IContext) {
		check(_docObj._id, String);
		const id = _docObj._id;

		if (this.defaultResources && this.defaultResources[`${this.collectionName?.toUpperCase()}_UPDATE`]) {
			segurancaApi.validarAcessoRecursos(_context.user, [`${this.collectionName?.toUpperCase()}_UPDATE`]);
		}
		const task = this.getCollectionInstance().findOne({_id: id}) || {};

		if(_context.user._id !== task.createdby) throw new Meteor.Error('Somente o usuário que criou a tarefa pode editá-la', 'Usuário não autorizado');

		return true;
	}

	beforeRemove(_docObj: IToDos | Partial<IToDos>, _context: IContext) {
		check(_docObj._id, String);
		const id = _docObj._id;
		if (this.defaultResources && this.defaultResources[`${this.collectionName?.toUpperCase()}_REMOVE`]) {
			segurancaApi.validarAcessoRecursos(_context.user, [`${this.collectionName?.toUpperCase()}_REMOVE`]);
		}

		const task = this.getCollectionInstance().findOne({_id: id}) || {};

		if(_context.user._id !== task.createdby) throw new Meteor.Error('Somente o usuário que criou a tarefa pode deletá-la', 'Usuário não autorizado');

		return true;
	}

	setSituation = (taskId: string, _context: IContext) => {
		check(taskId, String);

		const task = this.getCollectionInstance().findOne({_id: taskId}) || {};

		const {concluded, ...doc} = task;

		if(_context.user._id !== task.createdby) throw new Meteor.Error('Somente o usuário que criou a tarefa pode deletá-la', 'Usuário não autorizado');

		return this.serverUpdate({ _id:taskId, concluded: !concluded , ...doc }, _context);
	}

}

export const toDosServerApi = new ToDosServerApi();
