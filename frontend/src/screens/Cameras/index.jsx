import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import {makeStyles} from '@material-ui/core/styles';
import CameraWrapper from '../../components/CameraWrapper';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Cameras(props) {
  const [cameras, setCameras] = useState();
  const classes = useStyles();

  useEffect(() => {
    axios.get('/camera/assigned').then(({data}) => {
      setCameras(data);
      console.log(cameras);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="space-around">
        {cameras ? (
          cameras.map(camera => (
            <Box>
              <Paper className={classes.paper}>
                <CameraWrapper id={camera.id} name={camera.name} />
              </Paper>
            </Box>
          ))
        ) : (
          <Box>
            <Paper className={classes.paper}>
              <Typography>Nothing here</Typography>
            </Paper>
          </Box>
        )}
      </Grid>

      <Fab className={classes.fab} color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  );
}
