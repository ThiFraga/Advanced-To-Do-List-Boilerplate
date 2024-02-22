import React from 'react';

import Container from '@mui/material/Container';
import * as appStyle from '/imports/materialui/styles';
import { BaseButton } from '../../components/SimpleFormFields/Button/baseButton';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { toDosApi } from '/imports/modules/toDos/api/toDosApi';
import { IToDos } from '/imports/modules/toDos/api/toDosSch';
import { Task } from '@mui/icons-material';
import { IUserProfile } from '/imports/userprofile/api/UserProfileSch';
import { homeStyles } from './HomeStyle';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { IThemeOptionsBoilerplate } from '/imports/materialui/theme';
import { Theme } from '@mui/material';

interface IHomeProp {
    user: IUserProfile;
    theme: IThemeOptionsBoilerplate;
}

const Home = (props: IHomeProp) => {
    const { user, theme } = props;

    const { toDos, isLoading } = useTracker(() => {
        const subHandle = toDosApi.subscribe('homeToDosList', {}, {});

        if (!subHandle?.ready()) return { toDos: [], isLoading: true };

        const toDos = toDosApi.find({},{}).fetch() || []; 
        return { toDos, isLoading: false };
    });
    

    return(
        <>
            <Container style={homeStyles.containerHome}>
                <Box>
                    <Typography variant='displaySmall' color={'text.primary'}>
                        {`Olá, ${user ? user.username : ''}`}
                    </Typography>
                </Box>
                <Box sx={{padding: '20px 10%'}} >
                    <Typography variant='titleLarge' color={'text.primary'} >
                        {'Atividades recentes'}
                    </Typography>

                    {!isLoading && <ToDosList todos={toDos} theme={theme} />}
                </Box>
            </Container>
        </>
    );
}

interface IToDosToList extends IToDos{
    nomeUsuario: string;
    situation: string;
}

interface IToDoProp {
    todos: IToDosToList[];
    theme: Theme;
}

const ToDosList = (props: IToDoProp) => {
    const { todos, theme } = props;


    return (
        <Box >
            <List >
                {
                    todos.map((task) => (
                        <ListItem key={task._id} sx={homeStyles.listItem}>
                            <ListItemIcon >
                                <Task color="primary"/>
                            </ListItemIcon>
                            <ListItemText primary={
                                <Typography variant={'titleSmall' ?? 'h6'} color={'text.primary'} >
                                    {task.title}
                                </Typography>
                            } secondary={
                                <Typography variant={'labelSmall' ?? 'p'} color={'text.secondary'}  >
                                     {` Criada por: ${task.nomeUsuario}  `}
                                    <br /> 
                                    {`Situação: ${task.situation} `}
                                </Typography>
                            }/>
                        </ListItem>
                    ))
                }
            </List>
        </Box>
    );
}

export default Home;
