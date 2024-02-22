import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Modules from '../../modules';
import { isMobile } from '/imports/libs/deviceVerify';
import { appNavBarStyle } from './AppNavBarStyle';
import AppBar from '@mui/material/AppBar';
import { fixedMenuLayoutStyle } from './FixedMenuLayoutStyle';
import Toolbar from '@mui/material/Toolbar';
import * as appStyle from '/imports/materialui/styles';
import Container from '@mui/material/Container';
import { IAppMenu } from '/imports/modules/modulesTypings';
import Switch from '@mui/material/Switch';
import { ILayoutProps } from '/imports/typings/BoilerplateDefaultTypings';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import { Menu as MenuIcon } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material';

const HomeIconButton = ({ navigate }: any) => {
	return (
		<Box onClick={() => navigate('/')} sx={fixedMenuLayoutStyle.containerHomeIconButton}>
			<Typography variant='displaySmall' color={'primary'} >{'To-do List'}</Typography>
		</Box>
	);
};

interface IAppNavBar extends ILayoutProps {}

export const AppNavBar = (props: IAppNavBar) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [anchorEl, setAnchorEl] = useState<Object | null>(null);
	const open = Boolean(anchorEl);

	const { user, theme, themeOptions, showDialog } = props;

	const handleMenu = (event: React.SyntheticEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const pathIndex = (Modules.getAppMenuItemList() || [])
		.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
		.findIndex(
			(menuData) =>
				(menuData?.path === '/' && location.pathname === '/') ||
				(menuData?.path !== '/' && location && location.pathname.indexOf(menuData?.path as string) === 0)
		);
	if (isMobile) {
		return (
			<Box
				sx={{
					minHeight: 55,
					width: '100%',
					backgroundColor: theme.palette.primary.main
				}}>
				<FormControlLabel
					control={
						<Switch
							color={'secondary'}
							value={themeOptions?.isDarkThemeMode}
							onChange={(evt) => themeOptions?.setDarkThemeMode(evt.target.checked)}
						/>
					}
					label="DarkMode"
				/>
				<Box sx={{ width: '100%' }}>
					{(Modules.getAppMenuItemList() || [])
						.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
						.map((menuData, menuIndex) => (
							<Button key={menuData?.path} onClick={() => navigate(menuData?.path as string)}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: isMobile ? 'column' : 'row',
										alignItems: 'center',
										justifyContent: 'center',
										paddingTop: 10
									}}>
									{menuData?.icon ? menuData?.icon : null}
								</Box>
							</Button>
						))}
				</Box>
				<IconButton onClick={viewProfileMobile} style={{ position: 'absolute', right: 10, bottom: 13 }}>
					<AccountCircle style={appNavBarStyle.accountCircle} />
				</IconButton>
			</Box>
		);
	}

	return (
		<AppBar position="static" enableColorOnDark>
			<Container sx={fixedMenuLayoutStyle.containerFixedMenu}>
				<HomeIconButton navigate={navigate} />
				<Toolbar sx={fixedMenuLayoutStyle.toolbarFixedMenu}>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'flex-end',
							[theme.breakpoints.down('sm')] : {
								display: 'none',
							}
						}}>
						{(Modules.getAppMenuItemList() || [])
							.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
							.map((menuData, ind) => (
								<Button
									variant={pathIndex !== ind ? 'outlined' : 'contained'}
									sx={{
										...appNavBarStyle.buttonMenuItem,
										color: pathIndex !== ind ? appStyle.secondaryColor : '#FFF'
									}}
									key={menuData?.path}
									onClick={() => navigate(menuData?.path as string)}>
									{menuData?.name}
								</Button>
							))}
					</Box>
					<IconButton 
						size='large'
						sx={{
							[theme.breakpoints.up('sm')] : {
								display: 'none',
							}
						}}
						onClick={handleMenu}>
						<MenuIcon fontSize='large'/>
					</IconButton>
						<Menu
							anchorEl={anchorEl as Element}
							anchorOrigin={{
								vertical: 'center',
								horizontal: 'right'
							}}
							keepMounted
							transformOrigin={{
								vertical: 'center',
								horizontal: 'right'
							}}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '5px'
							}}
							open={open}
							onClose={handleClose}>
								{(Modules.getAppMenuItemList() || [])
									.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
									.map((menuData, ind) => (
										<MenuItem 
											key={menuData?.path}
											onClick={() => navigate(menuData?.path as string)}
											sx={{
												color: 'primary.main',
												border: 'none',
												width: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												textAlign: 'center',
												justifyContent: 'center',
												[':hover']: {
													color: 'surface',
													border: 'none',
												}
											}}
											>
											{menuData?.name}
										</MenuItem>
										
									))}
						</Menu>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
