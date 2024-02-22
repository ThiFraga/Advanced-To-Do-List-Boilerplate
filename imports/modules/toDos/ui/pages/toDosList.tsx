import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import { userprofileApi } from '../../../../userprofile/api/UserProfileApi';
import { SimpleTable } from '/imports/ui/components/SimpleTable/SimpleTable';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import TablePagination from '@mui/material/TablePagination';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '/imports/libs/searchUtils';
import * as appStyle from '/imports/materialui/styles';
import { nanoid } from 'nanoid';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import SearchDocField from '/imports/ui/components/SimpleFormFields/SearchDocField/SearchDocField';
import { IDefaultContainerProps, IDefaultListProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { IToDos } from '../../api/toDosSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { Recurso } from '../../config/Recursos';
import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import ToggleField from '/imports/ui/components/SimpleFormFields/ToggleField/ToggleField';
import { PageLayout } from '/imports/ui/layouts/PageLayout';
import { TodoListComponent } from '../ToDoListComponent';
import { ArrowLeft, ArrowRight, CheckBox, Edit, Padding } from '@mui/icons-material';
import { Box, Checkbox, FormControlLabel, Icon, Typography, Switch, IconButton, Pagination } from '@mui/material';
import { access } from 'fs';
import { ToDosDetailContainer } from './toDosDetail';
import { showNotification } from '/imports/ui/GeneralComponents/ShowNotification';
import { toDosListStyle } from './style/toDosListStyle';
import SwitchField from '/imports/ui/components/SimpleFormFields/SwitchField copy/SwitchField';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { number } from 'prop-types';

interface IToDosToList extends IToDos{
    nomeUsuario: string;
}

interface IToDosList extends IDefaultListProps {
	remove: (doc: IToDos) => void;
	viewComplexTable: boolean;
	setViewComplexTable: (_enable: boolean) => void;
	toDossConcluded: IToDosToList[];
	toDossNotConcluded: IToDosToList[];
	setFilter: (newFilter: Object) => void;
	clearFilter: () => void;
	onlyUsersTasks: boolean;
	setOnlyUsersTasks: Function;
	totalConcluded: number;
	totalNotConcluded: number;
}

const modalStyle = {
	position: 'absolute' as 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				maxWidth: { xs: '100vw', sm: '800px', lg: '1000px' },
				bgcolor: 'background.paper',
				background: 'white',
				boxShadow: 24,
				p: 0,
				overflowX: 'none',
				overflowY: 'auto',
				maxHeight: { xs: '100vh', sm: 'calc(100vh - 2rem)' },
				width: '100%',

}

const ToDosList = (props: IToDosList) => {
	const {
		toDossConcluded,
		toDossNotConcluded,
		navigate,
		remove,
		showDeleteDialog,
		showModal,
		onSearch,
		total,
		loading,
		setFilter,
		clearFilter,
		setPage,
		setPageSize,
		searchBy,
		pageProperties,
		isMobile,
		onlyUsersTasks,
		setOnlyUsersTasks,
		totalConcluded,
		totalNotConcluded,
		theme,
	} = props;

    const idToDos = nanoid();

	const callEdit = (_event: React.SyntheticEvent, id: string) => {
		showModal && showModal({
			url: `/toDos/edit/${id}`,
			modalOnClose: true,
			style: modalStyle,
			hiddenTitleBar: true,
			isModal: true,
		});
	};

	const callView = (_event: React.SyntheticEvent, id: string) => {
		showModal && showModal({
			url: `/toDos/view/${id}`,
			modalOnClose: true,
			style: modalStyle,
			hiddenTitleBar: true,
			isPrintView: true,
			isModal: true,
		});
	};

	const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, value: number) => {
		setPage(value);
	};


	const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>, fieldData: { name?: string } = {}) => {
		
		setOnlyUsersTasks(e.target.value);		
	}

	const [text, setText] = React.useState(searchBy || '');

	const change = (e: React.ChangeEvent<HTMLInputElement>) => {
		clearFilter();
		if (text.length !== 0 && e.target.value.length === 0) {
			onSearch();
		}
		setText(e.target.value);
	};
	const keyPress = (_e: React.SyntheticEvent) => {
		// if (e.key === 'Enter') {
		if (text && text.trim().length > 0) {
			onSearch(text.trim());
		} else {
			onSearch();
		}
		// }
	};

	const click = (_e: React.SyntheticEvent) => {
		if (text && text.trim().length > 0) {
			onSearch(text.trim());
		} else {
			onSearch();
		}
	};

	const callRemove = (doc: IToDos) => {
		const title = 'Remover exemplo';
		const message = `Deseja remover o exemplo "${doc.title}"?`;
		showDeleteDialog && showDeleteDialog(title, message, doc, remove);
	};

	const handleSituation = (id: string) => {
		toDosApi.setSituation(id, (e: IMeteorError) => {
			if (!e) {
				showNotification &&
					showNotification({
						type: 'success',
						title: 'Operação realizada!',
						description: `A situação da tarefa foi alterada!`
					});
			} else {
				console.log('Error:', e);
				showNotification &&
					showNotification({
						type: 'warning',
						title: 'Operação não realizada!',
						description: `Ocorreu um erro: ${e.reason}`
					});
			}
		});
	}

	const { title, description, nomeUsuario } = toDosApi.getSchema();
	const schemaReduzido = { title, description, nomeUsuario: { type: String, label: 'Criado por' } };
	return (
		<PageLayout title={'Lista de Tarefas'} actions={[]}>
			<>
				<TextField
					name={'pesquisar'}
					label={'Pesquisar'}
					value={text}
					onChange={change}
					onKeyPress={keyPress}
					placeholder="Digite aqui o que deseja pesquisa..."
					action={{ icon: 'search', onClick: click }}
				/>

				<Box sx={toDosListStyle.switchesContainer}>
						<SwitchField name='onlyUsersTasks' label={'Apenas minhas tarefas'} value={onlyUsersTasks} onChange={handleSwitch}/>
				</Box>

				<TodoListComponent theme={theme} callView={callView} toDos={toDossNotConcluded} label='Tarefas não completadas' callRemove={callRemove} callEdit={callEdit} handleSituation={handleSituation}/>

			</>

			<>

				<TodoListComponent theme={theme} callView={callView} toDos={toDossConcluded} label='Tarefas completadas' callRemove={callRemove} callEdit={callEdit} handleSituation={handleSituation}/>

			</>

			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center'
				}}>
				<Pagination 
					count={Math.ceil(Math.max(totalConcluded,totalNotConcluded) / pageProperties.pageSize)}
					page={pageProperties.currentPage}
					onChange={handleChangePage}
				/>
			</div>

			<RenderComPermissao recursos={[Recurso.TODOS_CREATE]}>
				<div
					style={{
						position: 'fixed',
						bottom: isMobile ? 80 : 30,
						right: 30
					}}>
					<Fab id={'add'} onClick={() => navigate(`/toDos/create/${idToDos}`)} color={'primary'}>
						<Add />
					</Fab>
				</div>
			</RenderComPermissao>
		</PageLayout>
	);
};

export const subscribeConfig = new ReactiveVar<IConfigList & { viewComplexTable: boolean }>({
	pageProperties: {
		currentPage: 1,
		pageSize: 4
	},
	sortProperties: { field: 'createdat', sortAscending: true },
	filter: {},
	searchBy: null,
	viewComplexTable: false
});

const toDosSearch = initSearch(
	toDosApi, // API
	subscribeConfig, // ReactiveVar subscribe configurations
	['description'] // list of fields
);

let onSearchToDosTyping: NodeJS.Timeout;

const viewComplexTable = new ReactiveVar(false);
const onlyUsersTasks = new ReactiveVar(false);

export const ToDosListContainer = withTracker((props: IDefaultContainerProps) => {
	const { showNotification,user } = props;
	

	//Reactive Search/Filter
	const config = subscribeConfig.get();
	const sort = {
		[config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1
	};
	toDosSearch.setActualConfig(config);


	//Subscribe parameters
	const filter = { 
		...config.filter,

		...(onlyUsersTasks.get() ?
			{ createdby: user?._id } :
			{}),
	
	};


	const limit = config.pageProperties.pageSize;
	const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;
	

	//Collection Subscribe
	const concludedSubHandle = toDosApi.subscribe('concludedToDosList', filter, {
		limit,
		skip,
		sort,
	});


	const toDossConcluded = concludedSubHandle?.ready() ? toDosApi.find({
		...filter,
		concluded: true,
	}).fetch() : [];


	const notConcludedSubHandle = toDosApi.subscribe('notConcludedToDosList', filter, {
		limit,
		skip,
		sort,
	});

	
	const toDossNotConcluded = notConcludedSubHandle?.ready() ? toDosApi.find({
		...filter,
		concluded: false,
	}).fetch() : [];
	

	return {
		toDossConcluded,
		toDossNotConcluded,
		loading: !!concludedSubHandle && !!notConcludedSubHandle && !concludedSubHandle.ready() && !notConcludedSubHandle.ready() ,
		remove: (doc: IToDos) => {
			toDosApi.remove(doc, (e: IMeteorError) => {
				if (!e) {
					showNotification &&
						showNotification({
							type: 'success',
							title: 'Operação realizada!',
							description: `A tarefa foi removida com sucesso!`
						});
				} else {
					console.log('Error:', e);
					showNotification &&
						showNotification({
							type: 'warning',
							title: 'Operação não realizada!',
							description: `Erro ao realizar a operação: ${e.reason}`
						});
				}
			});
		},
		viewComplexTable: viewComplexTable.get(),
		setViewComplexTable: (enableComplexTable: boolean) => viewComplexTable.set(enableComplexTable),
		searchBy: config.searchBy,
		onSearch: (...params: any) => {
			onSearchToDosTyping && clearTimeout(onSearchToDosTyping);
			onSearchToDosTyping = setTimeout(() => {
				config.pageProperties.currentPage = 1;
				subscribeConfig.set(config);
				toDosSearch.onSearch(...params);
			}, 1000);
		},
		total : (concludedSubHandle && notConcludedSubHandle) ? concludedSubHandle.total+notConcludedSubHandle.total : toDosApi.find(filter).fetch().length,
		totalConcluded: concludedSubHandle ? concludedSubHandle.total : toDosApi.find(filter).fetch().length,
		totalNotConcluded: notConcludedSubHandle ? notConcludedSubHandle.total : toDosApi.find(filter).fetch().length,
		pageProperties: config.pageProperties,
		filter,
		sort,
		setPage: (page = 1) => {
			config.pageProperties.currentPage = page;
			subscribeConfig.set(config);
		},
		setFilter: (newFilter = {}) => {
			config.filter = { ...filter, ...newFilter };
			Object.keys(config.filter).forEach((key) => {
				if (config.filter[key] === null || config.filter[key] === undefined) {
					delete config.filter[key];
				}
			});
			subscribeConfig.set(config);
		},
		clearFilter: () => {
			config.filter = {};
			subscribeConfig.set(config);
		},
		setSort: (sort = { field: 'createdat', sortAscending: true }) => {
			config.sortProperties = sort;
			subscribeConfig.set(config);
		},
		setPageSize: (size = 25) => {
			config.pageProperties.pageSize = size;
			subscribeConfig.set(config);
		},
		onlyUsersTasks: onlyUsersTasks.get(),
		setOnlyUsersTasks: (enableOnlyUsersTask: boolean) => onlyUsersTasks.set(enableOnlyUsersTask),
	};
})(showLoading(ToDosList));
