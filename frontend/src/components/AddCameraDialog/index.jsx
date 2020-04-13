/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {makeStyles} from '@material-ui/core/styles';
import LocationSearchInput from '../LocationSearchInput';

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
  const handleClose = props.onClose;
  const handleAddParent = props.onAdd;
  const [cameraId, setCameraId] = React.useState(0);
  const [unassignedCameras, setUnassignedCameras] = useState([]);
  const [url, setUrl] = React.useState('');
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [detect, setDetect] = React.useState(false);

  useEffect(() => {
    axios.get('/cameras/unassigned').then(({data}) => {
      setUnassignedCameras(data);
    });
  }, []);

  const updateList = () => {
    axios.get('/cameras/unassigned').then(({data}) => {
      setUnassignedCameras(data);
    });
  };

  const handleAdd = () => {
    if (cameraId) {
      axios.put('/cameras/assigned', {id: cameraId}).then(({data}) => {
        handleAddParent();
        handleClose();
        axios.get('/cameras/unassigned').then(({dataUn}) => {
          setUnassignedCameras(dataUn);
        });
      });
    } else {
      const newCamera = {url, name, username, password, location, detect};
      axios.post('/cameras/assigned', newCamera).then(({data}) => {
        handleAddParent();
        handleClose();
        axios.get('/cameras/unassigned').then(({dataUn}) => {
          setUnassignedCameras(dataUn);
        });
      });
    }
  };

  const handleCameraChange = event => {
    setCameraId(Number(event.target.value) || '');
  };

  const handleIpChange = event => {
    setUrl(event.target.value || '');
  };

  const handleUsernameChange = event => {
    setUsername(event.target.value || '');
  };
  const handlePasswordChange = event => {
    setPassword(event.target.value || '');
  };

  const handleNameChange = event => {
    setName(event.target.value || '');
  };
  const handleLocationChange = address => {
    setLocation(address || '');
  };
  const handleDetectChange = det => event => {
    setDetect(event.target.checked);
  };

  return (
    <Dialog
      open={props.open}
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
              onFocus={updateList}
              onChange={handleCameraChange}
              input={<Input />}>
              <MenuItem value={0}>Other</MenuItem>
              {unassignedCameras
                ? unassignedCameras.map((camera, i) => (
                    <MenuItem key={camera.id} value={camera.id}>
                      {camera.name}
                    </MenuItem>
                  ))
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
            <LocationSearchInput onChange={handleLocationChange} />
            <TextField
              onChange={handleUsernameChange}
              margin="dense"
              id="usernameCamera"
              label="Username"
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
            <FormControlLabel
              control={
                <Switch
                  checked={detect}
                  color="primary"
                  onChange={handleDetectChange('detect')}
                  value="detect"
                  inputProps={{'aria-label': 'primary checkbox'}}
                />
              }
              label="Detect Now"
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

AddCameraDialog.propTypes = {
  onClose: PropTypes.func,
  onAdd: PropTypes.func,
  open: PropTypes.bool,
};

AddCameraDialog.defaultProps = {
  onClose: () => {},
  onAdd: () => {},
  open: false,
};
