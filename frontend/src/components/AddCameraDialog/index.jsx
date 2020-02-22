/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

import {makeStyles} from '@material-ui/core/styles';

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

export default function AddCameraDialog(props) {
  const classes = useStyles();
  // eslint-disable-next-line prefer-const
  // eslint-disable-next-line fp/no-mutation
  // eslint-disable-next-line react/prop-types
  // open = props.open;

  const handleClose = props.onClose;
  const [cameraId, setCameraId] = React.useState('');
  const [allCameras, setAllCameras] = useState();
  const [url, setUrl] = React.useState('');
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    axios.get('/cameras').then(({data}) => {
      setAllCameras(data);
    });
  }, []);

  const handleAdd = () => {
    handleClose();
    if (cameraId) {
      console.log(cameraId);
    } else {
      console.log('new camera');
      axios
        .post('/cameras/assigned', {url, name, username, password})
        .then(({data}) => {
          // setAllCameras(data);
          console.log(data);
        });
    }
  };

  const handleCameraChange = event => {
    console.log(event.target.value);
    setCameraId(Number(event.target.value) || '');
  };

  const handleIpChange = event => {
    console.log(event.target.value);
    setUrl(event.target.value || '');
  };

  const handleUsernameChange = event => {
    console.log(event.target.value);
    setUsername(event.target.value || '');
  };
  const handlePasswordChange = event => {
    console.log(event.target.value);
    setPassword(event.target.value || '');
  };

  const handleNameChange = event => {
    console.log(event.target.value);
    setName(event.target.value || '');
  };

  return (
    <Dialog
      // eslint-disable-next-line react/prop-types
      open={props.open}
      // eslint-disable-next-line react/prop-types
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Camera</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select a camera from the list or add a new one
        </DialogContentText>

        <form className={classes.container}>
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel id="add-camera">Camera List</InputLabel>
            <Select
              labelId="add-camera"
              id="select-camera"
              value={cameraId}
              onChange={handleCameraChange}
              input={<Input />}>
              <MenuItem value={0}>New</MenuItem>
              {allCameras
                ? allCameras.map((camera, i) => {
                    return <MenuItem value={camera.id}>{camera.name}</MenuItem>;
                  })
                : true}
            </Select>
          </FormControl>
        </form>

        {cameraId ? (
          true
        ) : (
          <div>
            <TextField
              autoFocus
              onChange={handleIpChange}
              margin="dense"
              id="ipCamera"
              label="IP*"
              type="text"
              fullWidth
            />
            <TextField
              onChange={handleNameChange}
              margin="dense"
              id="nameCamera"
              label="Name*"
              type="text"
              fullWidth
            />
            <TextField
              onChange={handleUsernameChange}
              margin="dense"
              id="usernameCamera"
              label="Usename"
              type="text"
              fullWidth
            />
            <TextField
              onChange={handlePasswordChange}
              margin="dense"
              id="passwordCamera"
              label="Password"
              type="password"
              fullWidth
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
