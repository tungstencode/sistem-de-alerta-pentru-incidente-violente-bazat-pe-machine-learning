/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import AddIcon from '@material-ui/icons/Add';

import {makeStyles} from '@material-ui/core/styles';
import CameraWrapper from '../../../components/CameraWrapper';
import AddCameraDialog from '../../../components/AddCameraDialog';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
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

export default function Cameras() {
  const classes = useStyles();
  const [cameras, setCameras] = useState();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios.get('/cameras/assigned').then(({data}) => {
      setCameras(data);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="space-around">
        {cameras ? (
          cameras.map(camera => (
            <CameraWrapper id={camera.id} name={camera.name} />
          ))
        ) : (
          <Box>
            <Paper className={classes.paper}>
              <Typography>Nothing here</Typography>
            </Paper>
          </Box>
        )}
      </Grid>

      <AddCameraDialog open={open} onClose={handleClose} />

      <Fab
        className={classes.fab}
        color="primary"
        onClick={handleOpen}
        aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  );
}
