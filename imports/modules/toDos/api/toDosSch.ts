import { IDoc } from '/imports/typings/IDoc';

export const toDosSch = {
    title: {
        type: String,
        label: 'Título',
        defaultValue: '',
        optional: false,
    },
    description: {
        type: String,
        label: 'Descrição',
        defaultValue: '',
        optional: false,
    },
    concluded: {
        type: Boolean,
        label: 'Concluida',
        defaultValue: false,
        optional: false,
    },
    personal: {
        type: Boolean,
        label: 'É pessoal?',
        defaultValue: false,
        optional: false,
    },
    date: {
        type: Date,
        label: 'Data',
        defaultValue: '',
        optional: true,
    },
    
};

export interface IToDos extends IDoc {
    title: string;
    description?: string;
    date?: Date;
    concluded: boolean;
}
