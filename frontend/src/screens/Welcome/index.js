import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {NavLink} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Typography, Toolbar} from '@material-ui/core';
import Image from 'material-ui-image';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // width: '100%',
  },
  logo: {
    padding: theme.spacing(2),
  },
  button: {
    paddingLeft: theme.spacing(2),
  },
  background: {
    backgroundImage: `url(${'background.jpg'})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.5,
  },
  heading: {
    padding: theme.spacing(1),
  },
}));

export default function Welcome(props) {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed">
        <Grid
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          container
          justify="space-between">
          <Grid item xs={4}>
            <Toolbar>
              <img
                className={classes.logo}
                src="logo_transparent.png"
                alt="logo"
                width={80}
              />
            </Toolbar>
          </Grid>

          <Grid item xs={4}>
            <Toolbar>
              <Typography variant="h6">
                SISTEM DE ALERTĂ PENTRU INCIDENTE VIOLENTE BAZAT PE MACHINE
                LEARNING
              </Typography>
            </Toolbar>
          </Grid>
          <Grid
            container
            xs={4}
            alignItems="flex-start"
            justify="flex-end"
            direction="row">
            <Toolbar>
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                component={NavLink}
                to="/login">
                Login
              </Button>
            </Toolbar>
          </Grid>
        </Grid>
      </AppBar>
      <Grid
        className={classes.background}
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{minHeight: '100vh'}}>
        <div className={classes.backdrop} />
        <Typography
          className={classes.heading}
          color="textSecondary"
          variant="h2">
          When there are not enough people to watch it all.
        </Typography>
        {null}
      </Grid>
    </div>
  );
}
