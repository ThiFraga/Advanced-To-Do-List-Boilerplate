import React, { useState } from "react";
import { IToDos } from "../../api/toDosSch";
import { Box, Checkbox, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Theme, Typography } from "@mui/material";
import { Delete, Edit, ExpandLess, ExpandMore, Minimize } from "@mui/icons-material";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { toDosApi } from "../../api/toDosApi";

interface IToDosToList extends IToDos{
    nomeUsuario: string;
}

interface ITodoListComponentProps {
    toDos: IToDosToList[];
    callEdit?: Function;
    callView?: Function;
    callRemove?: Function;
    withoutAction?: boolean;
    handleSituation: Function;
    label: string;
    theme: Theme;
}

export const TodoListComponent = (props: ITodoListComponentProps) => {
    const userId = useTracker(() => Meteor.userId());
    const { toDos, callEdit, callRemove, withoutAction, handleSituation, label, callView,theme} = props;
    const [open,setOpen] = useState(true);

    const createdByLoggedUser = (taskAuthor: string | null | undefined) => {
        if (!taskAuthor) return false;
        if (taskAuthor === userId) return true;
        return false;
    }

    const handleCollapse = () => {
        if (toDos.length === 0) return;
        setOpen(!open);

    }


    return (
        <Box >
            <List >
                <ListItemButton onClick={handleCollapse}>
                    <ListItemText primary={
                        <Typography  variant="titleMedium"  color={'text.primary'}>{label}</Typography>
                    } />
                    {toDos.length === 0 ? <Minimize sx={{color: "text.primary"} } /> : open ? <ExpandLess sx={{color: "text.primary"}} /> : <ExpandMore sx={{color: "text.primary"}} />}
                </ListItemButton>
                <Collapse in={open} timeout={"auto"} unmountOnExit >
                    <List >
                        {   
                            toDos.map((task) => (
                                <ListItem key={task._id} sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexGrow: 1,
                                    borderBottom: '2px solid',
                                    borderColor: 'divider',
                                    [theme.breakpoints.down('sm')] : {
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }
                                }} >
                                        <Box sx={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            alignItems: 'center', 
                                            alignSelf: 'center', 
                                            [':hover']: {
                                                cursor: 'pointer'
                                            }, 
                                            [theme.breakpoints.down('sm')]: {
                                                alignSelf: 'flex-start',
                                            } 
                                            }}
                                        >
                                            <ListItemIcon sx={{minWidth: '0px'}}>
                                                <Checkbox 
                                                    checked={task.concluded}
                                                    onClick={() => handleSituation(task._id)}
                                                    disabled={!createdByLoggedUser(task.createdby)}
                                                    inputProps={{
                                                        'aria-label': `Checkbox: tarefa ${task.concluded ? 'Concluída' : 'Não Concluída'}`,
                                                        title: `Marcar como ${task.concluded ? 'não concluída' : 'concluída'}`,
                                                        }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={
                                                <Typography variant={'titleSmall' ?? 'h6'} color={'text.primary'} sx={task.concluded ? {textDecoration: "solid line through"} : {}} >
                                                    {task.description}
                                                </Typography>
                                            } secondary={
                                                <Typography variant={'labelSmall' ?? 'p'} color={'text.secondary'}  >
                                                    {`Criado por: ${task.nomeUsuario}`}
                                                </Typography>
                                            }
                                            onClick={(e) => callView && callView(e,task._id)}
                                            />
                                        </Box>
                                    
                                    {
                                    (createdByLoggedUser(task?.createdby) && !withoutAction) &&
                                        <Box sx={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            justifySelf: 'flex-end', 
                                            gap: '10px',
                                            [theme.breakpoints.down('sm')]: {
                                                marginLeft: '42px',
                                            } 
                                            }}>
                                            <ListItemButton onClick={
                                                (e) => callEdit && callEdit(e, task._id)} title="Editar" sx={{padding: "0 5px"}}>
                                                <ListItemIcon sx={{minWidth: '0px'}} >
                                                    <Edit sx={{color: "text.primary"}}/>
                                                </ListItemIcon>
                                            </ListItemButton>
                                            <ListItemButton  onClick={() => callRemove && callRemove(task)} title="Remover" sx={{padding: "0 5px"}}>
                                                <ListItemIcon sx={{minWidth: '0px'}} >
                                                    <Delete sx={{color: "text.primary"}}/>
                                                </ListItemIcon>
                                            </ListItemButton>
                                        </Box>
                                        
                                    }
                                    
                                </ListItem>
                            ))
                        }
                    </List>
                </Collapse>
            </List>

            {/* <List >
                {
                    todos.map((task) => (
                        <ListItem key={task._id}>
                                <ListItemIcon sx={{minWidth: '0px'}}>
                                    <Checkbox 
                                        checked={task.concluded}
                                        onClick={() => handleSituation(task._id)}
                                        disabled={!createdByLoggedUser(task.createdby)}
                                        inputProps={{
                                            'aria-label': `Checkbox: tarefa ${task.concluded ? 'Concluída' : 'Não Concluída'}`,
                                            title: `Marcar como ${task.concluded ? 'não concluída' : 'concluída'}`,
                                            }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={
                                    <Typography variant={'titleSmall' ?? 'h6'} color={'text.primary'} >
                                        {task.description}
                                    </Typography>
                                } secondary={
                                    <Typography variant={'labelSmall' ?? 'p'} color={'text.secondary'}  >
                                        {task.nomeUsuario}
                                    </Typography>
                                }/>
                            
                            {
                            (createdByLoggedUser(task?.createdby) && !withoutAction) &&
                                <Box sx={{display: 'flex', flexDirection: 'row', alignSelf: 'flex-end'}}>
                                    <ListItemButton onClick={(e) => callEdit && callEdit(e, task._id)} title="Editar">
                                        <ListItemIcon sx={{minWidth: '0px'}} >
                                            <Edit sx={{color: "text.primary"}}/>
                                        </ListItemIcon>
                                    </ListItemButton>
                                    <ListItemButton  onClick={() => callRemove && callRemove(task)} title="Remover">
                                        <ListItemIcon sx={{minWidth: '0px'}} >
                                            <Delete sx={{color: "text.primary"}}/>
                                        </ListItemIcon>
                                    </ListItemButton>
                                </Box>
                                
                            }
                            
                        </ListItem>
                    ))
                }
            </List> */}

        </Box>
    );
}