import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import CameraMap from '../../components/CameraMap';

const useStyles = makeStyles(theme => ({
  card: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // width: '100%',
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();

  useEffect(() => {}, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <Box>
              <CameraMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{height: `100%`}} />}
                containerElement={<div style={{height: `80vh`}} />}
                mapElement={<div style={{height: `100%`}} />}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Box className={classes.grow}>box</Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
