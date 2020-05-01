/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Toolbar from '@material-ui/core/Toolbar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import {IconButton, Icon, List} from '@material-ui/core';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import {makeStyles} from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Image from 'material-ui-image';
import CustomListItem from 'components/CustomListItem';
import LocationSearchInput from '../../../components/LocationSearchInput';
import Alarm from '../../../components/Alarm';

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
  list: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: '20vh',
  },
  side: {
    // height: '40vh',
    paddingTop: theme.spacing(2),
  },
}));

function Alert(props) {
  return <MuiAlert /* elevation={6} */ variant="filled" {...props} />;
}

function CustomAlert(severity, text) {
  return <Alert severity={severity}>{text}</Alert>;
}

export default function CameraDetails(props) {
  const classes = useStyles();
  const [processing, setProcessing] = React.useState(false);
  const [camera, setCamera] = React.useState(null);
  const [cameraName, setCameraName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');

  const [sound, setSound] = useState(false);
  const [logs, setLogs] = React.useState([]);
  // eslint-disable-next-line react/prop-types
  const {cameraId} = props.match.params;
  const [imageState, setImageState] = useState({
    count: 0,
    show: true,
  });
  const [cameraSettings, setCameraSettings] = React.useState({
    variant: '',
    message: '',
  });

  const hideAlert = (delaySeconds, setAlert) => {
    setTimeout(() => {
      setAlert({
        variant: '',
        message: '',
      });
    }, delaySeconds * 1000);
  };

  useEffect(() => {
    axios.get(`/logs/camera/${cameraId}`).then(({data}) => {
      setLogs(data);
    });
    axios.get('/users/settings').then(({data}) => {
      setSound(data.sound);
    });
    axios.get(`/cameras/assigned/${cameraId}`).then(({data}) => {
      setCamera(data);
      setProcessing(data.UserCamera.detect);
      setImage(data.UserCamera.detect, data);
      setCameraName(data.name);
      setUsername(data.username);
      setPassword(data.password);
      setUrl(data.url);
      setLocation(data.location);
    });
  }, []);

  const turn = processingP => {
    setProcessing(processingP);
    setImage(processingP, camera);
    axios
      .put(`/cameras/assigned/detect/${camera.id}`, {
        detect: processingP,
      })
      .then(res => {
        // console.log(res);
      });
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
      .then(res => {
        if (res.status === 202) {
          setCameraSettings({
            variant: 'success',
            message: res.statusText,
          });
        } else {
          setCameraSettings({
            variant: 'error',
            message: res.statusText,
          });
        }
        hideAlert(2, setCameraSettings);
      });
  };

  const handleProcessingChange = name => event => {
    setProcessing(event.target.checked);
    axios
      .put(`/cameras/assigned/detect/${camera.id}`, {
        detect: event.target.checked,
      })
      .then(res => {});
    setImage(event.target.checked, camera);
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

  const setImage = (processingP, cameraC) => {
    if (processingP) {
      setImageUrl(`http://localhost:5000/processed/${cameraC.id}`);
    } else if (cameraC.url.includes('rtsp')) {
      setImageUrl(`http://localhost:5000/unprocessed/${cameraC.id}`);
    } else {
      setImageUrl(cameraC.url);
    }
    reload();
  };

  const reload = () => {
    setImageState({show: false});
    setTimeout(
      () => setImageState(state => ({count: state.count + 1, show: true})),
      500
    );
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {camera ? (
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Box>
                <Image
                  src={imageState.show ? imageUrl : ''}
                  aspectRatio={16 / 9}
                />
              </Box>
            </Paper>
            <Alarm
              turn={turn}
              sound={sound}
              processing={processing}
              id={camera.id}
            />
          </Grid>
        ) : (
          'Loading...'
        )}

        {camera ? (
          <Grid item xs={4}>
            <Grid container>
              <Grid item xs={12}>
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
                {cameraSettings.statusText !== ''
                  ? CustomAlert(cameraSettings.variant, cameraSettings.message)
                  : null}
              </Grid>
              <Grid className={classes.side} item xs={12}>
                <Paper className={classes.paper}>
                  {/* <Box className={classes.grow}>recent activity</Box> */}
                  <List className={classes.list}>
                    {logs.map((log, key) => {
                      return (
                        <CustomListItem key={key} camera={camera} log={log} />
                      );
                    })}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          'Loading...'
        )}
      </Grid>
    </div>
  );
}

CameraDetails.propTypes = {
  cameraId: PropTypes.number,
};

CameraDetails.defaultProps = {
  cameraId: 0,
};
