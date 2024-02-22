import React from 'react';

import Container from '@mui/material/Container';
import * as appStyle from '/imports/materialui/styles';
import {Box, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from '@mui/material';
import { BaseButton } from '../../components/SimpleFormFields/Button/baseButton';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { toDosApi } from '/imports/modules/toDos/api/toDosApi';
import { IToDos } from '/imports/modules/toDos/api/toDosSch';
import { Task } from '@mui/icons-material';

interface IToDosToList extends IToDos{
    nomeUsuario: string;
    situation: string;
}

interface IToDoProp {
    todos: IToDosToList[];
}

const Home = () => {

    const { toDos, isLoading } = useTracker(() => {
        const subHandle = toDosApi.subscribe('homeToDosList', {}, {});

        if (!subHandle?.ready()) return { toDos: [], isLoading: true };

        const toDos = toDosApi.find({},{}).fetch() || []; 
        return { toDos, isLoading: false };
    });
    

    return(
        <>
            <Container>
                <Box sx={{padding: '20px 10%'}} >
                    <Typography variant='titleLarge' color={'text.primary'} >
                        {'Atividades recentes'}
                    </Typography>

                    {!isLoading && <ToDosList todos={toDos} />}
                </Box>
            </Container>
        </>
    );
}

const ToDosList = (props: IToDoProp) => {
    const { todos } = props;


    return (
        <Box >
            <List >
                {
                    todos.map((task) => (
                        <ListItem key={task._id}>
                            <ListItemIcon >
                                <Task color="primary"/>
                            </ListItemIcon>
                            <ListItemText primary={
                                <Typography variant={'titleSmall' ?? 'h6'} color={'text.primary'} >
                                    {task.title}
                                </Typography>
                            } secondary={
                                <Typography variant={'labelSmall' ?? 'p'} color={'text.secondary'}  >
                                    {`Situação: ${task.situation}`} <br/> {`Criada por: ${task.nomeUsuario}`}
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
