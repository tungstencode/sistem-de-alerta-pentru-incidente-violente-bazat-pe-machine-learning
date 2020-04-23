/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Toolbar from '@material-ui/core/Toolbar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import {IconButton, Icon} from '@material-ui/core';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import {makeStyles} from '@material-ui/core/styles';
import Sound from 'react-sound';
import LocationSearchInput from '../../../components/LocationSearchInput';

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
  grow: {
    flexGrow: 1,
  },
  img: {
    borderRadius: 4,
    width: '100%',
  },
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function CameraDetails(props) {
  const classes = useStyles();
  const [processing, setProcessing] = React.useState(false);
  const [camera, setCamera] = React.useState(null);
  const [cameraName, setCameraName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [url, setUrl] = React.useState('');
  // eslint-disable-next-line react/prop-types
  const {cameraId} = props.match.params;
  const source = new EventSource(`http://localhost:5000/detect/${cameraId}`);
  const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);

  useEffect(() => {
    axios.get(`/cameras/assigned/${cameraId}`).then(({data}) => {
      console.log(data);
      setCamera(data);
      setProcessing(data.UserCamera.detect);
      setCameraName(data.name);
      setUsername(data.username);
      setPassword(data.password);
      setUrl(data.url);
      setLocation(data.location);

      if (data.UserCamera.detect) {
        notificationOn();
      } else {
        notificationOff();
      }

      return () => {
        notificationOff();
        source.close();
      };
    });
  }, []);

  const onDetection = event => {
    console.warn(event.data);
    if (event.data === `b'True'`) {
      axios.post(`/logs/${camera.id}`).then(({data}) => {});
      setPlayStatus(Sound.status.PLAYING);
    }
  };

  const notificationOn = () => {
    source.addEventListener('message', onDetection);
  };

  const notificationOff = () => {
    source.removeEventListener('message', onDetection);
    setPlayStatus(Sound.status.STOPPED);
  };

  const handleSavelick = () => {
    axios
      .put(`/cameras/${cameraId}`, {
        username,
        password,
        location,
        url,
        name: cameraName,
      })
      .then(res => {});
  };

  const handleProcessingChange = name => event => {
    setProcessing(event.target.checked);
    event.target.checked ? notificationOn() : notificationOff();
    axios
      .put(`/cameras/assigned/detect/${camera.id}`, {
        detect: event.target.checked,
      })
      .then(res => {});
    // console.log(event.target.checked);
  };

  const handleIPChange = event => {
    setUrl(event.target.value || '');
  };

  const handleUsernameChange = event => {
    setUsername(event.target.value || '');
  };
  const handlePasswordChange = event => {
    setPassword(event.target.value || '');
  };

  const handleCameraNameChange = event => {
    setCameraName(event.target.value || '');
  };
  const handleLocationChange = address => {
    setLocation(address || '');
    // setLocation(event.target.value || '');
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {camera ? (
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Sound
                url="fight-alarm.ogg"
                playStatus={playStatus}
                loop
                volume={50}
              />

              <Box>
                {processing ? (
                  <img
                    className={classes.img}
                    alt={camera.name}
                    src={`http://localhost:5000/processed/${camera.id}`}
                  />
                ) : (
                  [
                    camera.url.includes('rtsp') ? (
                      <img
                        className={classes.img}
                        alt={camera.name}
                        src={`http://localhost:5000/unprocessed/${camera.id}`}
                      />
                    ) : (
                      <img
                        className={classes.img}
                        alt={camera.name}
                        src={camera.url}
                      />
                    ),
                  ]
                )}
              </Box>
            </Paper>
          </Grid>
        ) : (
          'Loading...'
        )}

        {camera ? (
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <TextField
                autoFocus
                onChange={handleIPChange}
                margin="dense"
                id="ipCamera"
                label="IP*"
                type="text"
                value={url}
                fullWidth
              />
              <TextField
                onChange={handleCameraNameChange}
                margin="dense"
                id="nameCamera"
                label="Name*"
                type="text"
                value={cameraName}
                fullWidth
              />
              <LocationSearchInput
                location={location}
                onChange={handleLocationChange}
              />
              <TextField
                onChange={handleUsernameChange}
                margin="dense"
                id="usernameCamera"
                label="Username"
                type="text"
                value={username}
                fullWidth
              />
              <TextField
                onChange={handlePasswordChange}
                margin="dense"
                id="passwordCamera"
                label="Password"
                type="password"
                value={password}
                fullWidth
              />
              <Box className={classes.grow}>
                <Toolbar>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={processing}
                        color="primary"
                        onChange={handleProcessingChange('processing')}
                        value="processing"
                        inputProps={{'aria-label': 'primary checkbox'}}
                      />
                    }
                    label="Detect"
                  />
                  <div className={classes.grow} />
                  <IconButton
                    onClick={handleSavelick}
                    edge="end"
                    className={classes.saveButton}>
                    <SaveRoundedIcon />
                  </IconButton>
                </Toolbar>
              </Box>
            </Paper>
          </Grid>
        ) : (
          'Loading...'
        )}
      </Grid>
    </div>
  );
}
