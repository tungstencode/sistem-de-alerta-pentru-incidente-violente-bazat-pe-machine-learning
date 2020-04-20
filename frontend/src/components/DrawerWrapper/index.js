import React from 'react';
import Axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, Container} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import VideocamOutlined from '@material-ui/icons/VideocamOutlined';
import DashboardOutlined from '@material-ui/icons/DashboardOutlined';
import Timeline from '@material-ui/icons/Timeline';
import Settings from '@material-ui/icons/Settings';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {NavLink, Link} from 'react-router-dom';
import NavItem from '../NavItem/NavItem';

const drawerWidth = 110;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    color: theme.palette.text.light,
  },
  toolbar: theme.mixins.toolbar,
  container: {
    padding: theme.spacing(3, 2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  menuItem: {
    color: theme.palette.text.light,
  },
}));

// eslint-disable-next-line react/prop-types
export default function DrawerWrapper({children}) {
  const classes = useStyles();

  // const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // const handleChange = event => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    handleClose();
    Axios.get('/logout').then(res => {
      window.location.reload(false);
    });
  };

  const handleProfile = () => {
    Axios.get('/user_data').then(res => {
      handleClose();
    });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Grid container justify="space-between">
          <Grid item xs={6}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                SISTEM DE ALERTĂ PENTRU INCIDENTE VIOLENTE BAZAT PE MACHINE
                LEARNING
              </Typography>
            </Toolbar>
          </Grid>

          <Toolbar>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit">
              <AccountCircle />
            </IconButton>
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
              onClose={handleClose}>
              <MenuItem
                component={Link}
                to="/settings"
                className={classes.menuItem}
                onClick={handleProfile}>
                Profile
              </MenuItem>
              <MenuItem className={classes.menuItem} onClick={handleLogOut}>
                Log out
              </MenuItem>
            </Menu>
          </Toolbar>
        </Grid>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.toolbar} />

        <Container className={classes.container} disableGutters>
          <NavItem
            exact
            path="/cameras"
            title="Cameras"
            Icon={VideocamOutlined}
          />
          <NavItem
            exact
            path="/dashboard"
            title="Dashboard"
            Icon={DashboardOutlined}
          />
          <NavItem exact path="/graph" title="Graph" Icon={Timeline} />
          <NavItem
            bottom
            exact
            path="/settings"
            title="Settings"
            Icon={Settings}
          />
        </Container>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}
