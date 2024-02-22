// region Imports
import { ProductBase } from '../../../api/productBase';
import { toDosSch, IToDos } from './toDosSch';
import { IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';

class ToDosApi extends ProductBase<IToDos> {
    constructor() {
        super('toDos', toDosSch, {
            enableCallMethodObserver: true,
            enableSubscribeObserver: true,
        });
    }
    setSituation = (id: String, callback = (e: IMeteorError, r: any) => {
        console.log(e, r);
    }) => {
        this.callMethod('setSituation',id,callback);
    }
}

export const toDosApi = new ToDosApi();
