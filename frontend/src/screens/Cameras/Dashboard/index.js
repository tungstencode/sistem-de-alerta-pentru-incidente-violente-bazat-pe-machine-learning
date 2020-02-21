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

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
  const [cameras, setCameras] = useState();
  const [allCameras, setAllCameras] = useState(0);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [cameraName, setCameraName] = React.useState('');

  const handleChange = event => {
    setCameraName(Number(event.target.value) || '');
  };

  const handleClickOpen = () => {
    axios.get('/cameras').then(({data}) => {
      setAllCameras(data);
      setOpen(true);
    });
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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Camera</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a camera from the list or add a new one
          </DialogContentText>

          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel id="add-camera">Camera List</InputLabel>
              <Select
                labelId="add-camera"
                id="select-camera"
                value={cameraName}
                onChange={handleChange}
                input={<Input />}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {allCameras
                  ? allCameras.map((camera, i) => {
                      return <MenuItem value={i}>{camera.name}</MenuItem>;
                    })
                  : true}
                {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem> */}
              </Select>
            </FormControl>
          </form>

          <TextField
            autoFocus
            margin="dense"
            id="ip"
            label="IP"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Fab
        className={classes.fab}
        color="primary"
        onClick={handleClickOpen}
        aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  );
}
