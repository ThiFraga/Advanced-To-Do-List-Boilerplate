import React from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Modules from '../../modules';
import {isMobile} from '/imports/libs/deviceVerify';
import Tabs from '@material-ui/core/Tabs';
import {appNavBarStyle} from './AppNavBarStyle';
import AppBar from '@material-ui/core/AppBar';
import {appLayoutMenuStyle} from '/imports/ui/layouts/AppLayoutFixedMenuStyle';
import Toolbar from '@material-ui/core/Toolbar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import * as appStyle from '/imports/materialui/styles';
import Container from '@material-ui/core/Container';

const HomeIconButton = withRouter((props)=>{
    return <NavLink to={'/'}><div style={appLayoutMenuStyle.containerHomeIconButton}>
        <img style={appLayoutMenuStyle.homeIconButton} src='/images/wireframe/logo.png' />
    </div></NavLink>
})


const AppNavBar = ({user, history, showDrawer, showWindow, theme, location}) => {
    if (location.pathname.indexOf('/full') !== -1 || location.pathname.indexOf('/print') !== -1) {
        return null;
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openPage = url => () => {
        handleClose();
        history.push(url);
    };

    const viewProfile = () => {
        handleClose();
        showDrawer({title: 'Usuário', url: `/userprofile/view/${user._id}`});
    };

    const viewProfileMobile = () => {
        handleClose();
        showWindow({title: 'Usuário', url: `/userprofile/view/${user._id}`});
    };

    const pathIndex = (Modules.getAppMenuItemList() || []).filter(item => !item.isProtected || user && user.roles.indexOf('Publico') === -1).findIndex(menuData => menuData.path === '/' && history.location.pathname === '/'
        || menuData.path !== '/' && history.location.pathname.indexOf(menuData.path) === 0);
    if (isMobile) {
        return (
            <div style={{minHeight: 55, width: '100%', backgroundColor: theme.palette.primary.main}}>
                <Tabs
                    value={pathIndex}
                    indicatorColor="secondary"
                    aria-label="icon label tabs example"
                    centered
                >
                    {
                        (Modules.getAppMenuItemList() || []).filter(item => !item.isProtected || user && user.roles.indexOf('Publico') === -1).map((menuData, menuIndex) => (
                            <Button key={menuData.path} onClick={() => history.push(menuData.path)}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: isMobile ? 'column' : 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingTop: 10,
                                    }}
                                >
                                    {menuData.icon ? menuData.icon : null}
                                </div>

                            </Button>
                        ))
                    }
                </Tabs>
                <IconButton
                    onClick={viewProfileMobile}
                    style={{position: 'absolute', right: 10, bottom: 13}}
                >
                    <AccountCircle style={appNavBarStyle.accountCircle}/>
                </IconButton>
            </div>

        );
    }

    return (
        <AppBar position="static">
            <Container style={appLayoutMenuStyle.containerFixedMenu}>
                <HomeIconButton/>
                <Toolbar style={appLayoutMenuStyle.toolbarFixedMenu}>
                    <div style={appNavBarStyle.containerNavBar}>
                        <div style={appNavBarStyle.subContainerNavBar}>
                            <Tabs
                                aria-label="icon label tabs example"
                            >
                                {
                                    (Modules.getAppMenuItemList() || []).filter(item => !item.isProtected || user && user.roles.indexOf('Publico') === -1).map((menuData, ind) => (
                                        <Button
                                            style={{
                                                ...appNavBarStyle.buttonMenuItem,
                                                color: pathIndex === ind ? appStyle.secondaryColor : undefined,
                                            }} key={menuData.path} onClick={() => history.push(menuData.path)}
                                        >
                                            {menuData.name}
                                        </Button>
                                    ))
                                }
                            </Tabs>
                        </div>
                        <Button
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            id="Perfil"
                            label="Perfil"
                            style={appNavBarStyle.containerAccountCircle}
                        >
                            <AccountCircle id="Perfil" name="Perfil" style={appNavBarStyle.accountCircle}/>
                            <ArrowDropDownIcon style={appNavBarStyle.dropDown}/>
                        </Button>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            {!user || !user._id ? (
                                [<MenuItem key={'signin'} as={NavLink} onClick={openPage('/signin')}>Entrar</MenuItem>]
                            ) : (
                                [<MenuItem
                                    key={'userprofile'} as={NavLink}
                                    onClick={viewProfile}
                                >{user.username||'Editar'}</MenuItem>,
                                    <MenuItem key={'signout'} as={NavLink} onClick={openPage('/signout')}><ExitToAppIcon
                                        fontSize="small"
                                    /> Sair</MenuItem>]
                            )}
                        </Menu>
                    </div>
                </Toolbar>
            </Container>
        </AppBar>


    );
};


export default withRouter(AppNavBar);
