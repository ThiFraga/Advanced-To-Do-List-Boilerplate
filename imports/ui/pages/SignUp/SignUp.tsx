// signup component similar to login page (except loginWithPassword)
// instead createUser to insert a new user account document

// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react';
import { Link, NavigateFunction } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '../../components/SimpleFormFields/TextField/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { userprofileApi } from '../../../userprofile/api/UserProfileApi';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';

import { signUpStyle } from './SignUpStyle';
import { Box } from '@mui/system';
import { IUserProfile } from '/imports/userprofile/api/UserProfileSch';

interface ISignUp {
	showNotification: (options?: Object) => void;
	navigate: NavigateFunction;
	user: IUserProfile;
}

export const SignUp = (props: ISignUp) => {
	const { showNotification } = props;

	const handleSubmit = (doc: { email: string; password: string }) => {
		const { email, password } = doc;

		userprofileApi.insertNewUser({ email, username: email, password }, (err, r) => {
			if (err) {
				console.log('Login err', err);
				showNotification &&
					showNotification({
						type: 'warning',
						title: 'Problema na criação do usuário!',
						description: 'Erro ao fazer registro em nossa base de dados!'
					});
			} else {
				showNotification &&
					showNotification({
						type: 'sucess',
						title: 'Cadastrado com sucesso!',
						description: 'Registro de usuário realizado em nossa base de dados!'
					});
			}
		});
	};

	return (
		<Container style={signUpStyle.containerSignUp}>
			<Box sx={signUpStyle.boxSignUpToSystem}>
				<Typography variant='displayMedium' color={'primary'} >{'To-do List'}</Typography>
				<Typography variant='titleLarge' color={'onSurface'} >{'Cadastrar no Sistema'}</Typography>
			</Box>
			<SimpleForm
				schema={{
					email: {
						type: String,
						label: 'Email',
						optional: false
					},
					password: {
						type: String,
						label: 'Senha',
						optional: false
					}
				}}
				onSubmit={handleSubmit}
				styles={{
					display: 'flex',
					flexDirection: 'column',
					gap: '10px',

				}}
				>
				<TextField id="Email" label="Email" fullWidth name="email" type="email" placeholder="Digite um email" />
				<TextField id="Senha" label="Senha" fullWidth name="password" placeholder="Digite uma senha" type="password" />
				<Box sx={signUpStyle.containerButtonOptions}>
					<Button color={'primary'} variant={'outlined'} id="submit">
						Cadastrar
					</Button>
				</Box>
			</SimpleForm>
			<Box >
				<Typography variant='bodyMedium' color={'onSurface'}>Já tem uma conta? Faça login clicando{' '}</Typography>
				
				<Link to="/signin" color={'primary'}>
				<Typography variant='bodyMedium' color={'primary'}>aqui!{' '}</Typography>
				</Link>
			</Box>
		</Container>
	);
};
