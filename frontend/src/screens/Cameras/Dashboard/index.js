/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
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

export default function Cameras(props) {
  const classes = useStyles();
  const [cameras, setCameras] = useState([]);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleAdd = () => {
    axios.get('/cameras/assigned').then(({data}) => {
      setCameras(data);
    });
    setOpen(false);
  };

  const handleDelete = () => {
    axios.get('/cameras/assigned').then(({data}) => {
      setCameras(data);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCameraClick = id => {
    // eslint-disable-next-line react/prop-types
    const {history = {}} = props;
    const {location} = history;
    const {pathname = ''} = location;

    history.push(`${pathname}/${id}`);
  };

  useEffect(() => {
    axios.get('/cameras/assigned').then(({data}) => {
      console.log(data);
      setCameras(data);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="space-between">
        {cameras ? (
          cameras.map(camera => (
            <CameraWrapper
              key={camera.id}
              camera={camera}
              processingP={camera.UserCamera.detect}
              onDelete={handleDelete}
              onCameraClick={handleCameraClick}
            />
          ))
        ) : (
          <Box>
            <Paper className={classes.paper}>
              <Typography>Nothing here</Typography>
            </Paper>
          </Box>
        )}
      </Grid>

      <AddCameraDialog open={open} onAdd={handleAdd} onClose={handleClose} />

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
