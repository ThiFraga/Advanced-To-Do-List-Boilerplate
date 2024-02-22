import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import TextMaskField from '../../../../ui/components/SimpleFormFields/TextMaskField/TextMaskField';
import RadioButtonField from '../../../../ui/components/SimpleFormFields/RadioButtonField/RadioButtonField';
import SelectField from '../../../../ui/components/SimpleFormFields/SelectField/SelectField';
import UploadFilesCollection from '../../../../ui/components/SimpleFormFields/UploadFiles/uploadFilesCollection';
import ChipInput from '../../../../ui/components/SimpleFormFields/ChipInput/ChipInput';
import SliderField from '/imports/ui/components/SimpleFormFields/SliderField/SliderField';
import AudioRecorder from '/imports/ui/components/SimpleFormFields/AudioRecorderField/AudioRecorder';
import ImageCompactField from '/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField';
import Print from '@mui/icons-material/Print';
import Close from '@mui/icons-material/Close';
import { PageLayout } from '../../../../ui/layouts/PageLayout';
import { IToDos } from '../../api/toDosSch';
import { IDefaultContainerProps, IDefaultDetailProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import { useTheme } from '@mui/material/styles';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import DatePickerField from '/imports/ui/components/SimpleFormFields/DatePickerField/DatePickerField';
import SwitchField from '/imports/ui/components/SimpleFormFields/SwitchField copy/SwitchField';
import { Box, Typography } from '@mui/material';

interface IToDosDetail extends IDefaultDetailProps {
	toDosDoc: IToDos;
	save: (doc: IToDos, _callback?: any) => void;
	hiddenTitleBar?: boolean;
}

const ToDosDetail = (props: IToDosDetail) => {
	const { isPrintView, screenState, loading, toDosDoc, save, navigate, user, hiddenTitleBar, closeComponent } = props;

	const theme = useTheme();

	const createdByLoggedUser = () => {
        if (!toDosDoc || !user) return false;
        if (toDosDoc.createdby === user._id) return true;
        return false;
    }

	const handleSubmit = (doc: IToDos) => {
		save(doc);
	};
	
	return (
		<PageLayout
			key={'ExemplePageLayoutDetailKEY'}
			title={
				screenState === 'view' ? 'Visualizar exemplo' : screenState === 'edit' ? 'Editar Exemplo' : 'Criar exemplo'
			}
			onBack={() => navigate('/toDos')}
			actions={[
				!isPrintView ? (
					<span
						key={'ExempleDetail-spanPrintViewKEY'}
						style={{
							cursor: 'pointer',
							marginRight: 10,
							color: theme.palette.secondary.main
						}}
						onClick={() => {
							navigate(`/toDos/printview/${toDosDoc._id}`);
						}}>
						<Print key={'ExempleDetail-spanPrintKEY'} />
					</span>
				) : (
					<span
						key={'ExempleDetail-spanNotPrintViewKEY'}
						style={{
							cursor: 'pointer',
							marginRight: 10,
							color: theme.palette.secondary.main
						}}
						onClick={() => {
							navigate(`/toDos/view/${toDosDoc._id}`);
						}}>
						<Close key={'ExempleDetail-spanCloseKEY'} />
					</span>
				)
			]}
			hiddenTitleBar={hiddenTitleBar}
			>
			<Typography variant='titleLarge' color={'text.primary'} sx={{marginBottom: '10px'}}>{
				screenState === 'view'? 'Visualização' : 'Editar' 
			}</Typography>
			<SimpleForm
				key={'ExempleDetail-SimpleFormKEY'}
				mode={screenState}
				schema={toDosApi.getSchema()}
				doc={toDosDoc}
				onSubmit={handleSubmit}
				loading={loading}>
					
				<FormGroup key={'fieldsOne'}>
					<TextField key={'f1-tituloKEY'} placeholder="Titulo" name="title" />
					<TextField key={'f1-descricaoKEY'} placeholder="Descrição" name="description" />
				</FormGroup>
				
				<FormGroup  key={'fieldsTwo'}>
					<SwitchField name='personal' />
					<DatePickerField name='date' />
				</FormGroup>
				
				

				<Box
					key={'Buttons'}
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'left',
						paddingTop: '20px',
						paddingBottom: '20px',
						gap: '10px',
						[theme.breakpoints.down('sm')]: {
							flexDirection: 'column',
							alignItems: 'center',
						}
					}}>

					{!isPrintView ?
						<Button
							key={'b1'}
							onClick={
								screenState === 'edit'
									? () => navigate(`/toDos/view/${toDosDoc._id}`)
									: closeComponent
							}
							color={'secondary'}
							variant="contained">
							{screenState === 'view' ? 'Voltar' : 'Cancelar'}
						</Button>
					: null}
					
					{!isPrintView && screenState === 'view' && createdByLoggedUser() ? (
						<Button
							key={'b2'}
							onClick={() => {
								navigate(`/toDos/edit/${toDosDoc._id}`);
							}}
							color={'primary'}
							variant="contained">
							{'Editar'}
							
						</Button>
					) : null}
					{!isPrintView && screenState !== 'view' || (createdByLoggedUser() && screenState === 'edit') ? (
						<Button key={'b3'} color={'primary'} variant="contained" id="submit" >
							{'Salvar'}
						</Button>
					) : null}
				</Box>
			</SimpleForm>
		</PageLayout>
	);
};

interface IToDosDetailContainer extends IDefaultContainerProps {
	hiddenTitleBar?: boolean;
}

export const ToDosDetailContainer = withTracker((props: IToDosDetailContainer) => {
	const { screenState, id, navigate, showNotification, hiddenTitleBar=false, isModal } = props;

	const subHandle = !!id ? toDosApi.subscribe('toDosDetail', { _id: id }) : null;
	const toDosDoc = id && subHandle?.ready() ? toDosApi.findOne({ _id: id }) : {};

	return {
		screenState,
		toDosDoc,
		hiddenTitleBar,
		save: (doc: IToDos, _callback: () => void) => {
			const selectedAction = screenState === 'create' ? 'insert' : 'update';
			toDosApi[selectedAction](doc, (e: IMeteorError, r: string) => {
				if (!e) {
					navigate(`/toDos/view/${doc._id}`);
					showNotification &&
						showNotification({
							type: 'success',
							title: 'Operação realizada!',
							description: `O exemplo foi ${doc._id ? 'atualizado' : 'cadastrado'} com sucesso!`
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
		}
	};
})(showLoading(ToDosDetail));
