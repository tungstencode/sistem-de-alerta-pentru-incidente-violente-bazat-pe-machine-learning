import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {IconButton} from '@material-ui/core';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import VolumeUpRounded from '@material-ui/icons/VolumeUpRounded';
import SmsRounded from '@material-ui/icons/SmsRounded';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

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

function Alert(props) {
  return <MuiAlert /* elevation={6} */ variant="filled" {...props} />;
}

function CustomAlert(severity, text) {
  return <Alert severity={severity}>{text}</Alert>;
}

export default function Settings(props) {
  const classes = useStyles();
  // const [settings, setSettings] = useState({sound: false, sms: false});
  const [sound, setSound] = useState(false);
  const [sms, setSms] = useState(false);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [alertProfile, setAlertProfile] = React.useState({
    variant: '',
    message: '',
  });
  const [alertSettings, setAlertSettings] = React.useState({
    variant: '',
    message: '',
  });

  useEffect(() => {
    axios.get('/users/settings').then(({data}) => {
      setSound(data.sound);
      setSms(data.sms);
    });
    axios.get('/users/get_own').then(({data}) => {
      setFullName(data.name);
      setEmail(data.email);
      setLocation(data.location);
    });
  }, []);

  const hideAlert = (delaySeconds, setAlert) => {
    setTimeout(() => {
      setAlert({
        variant: '',
        message: '',
      });
    }, delaySeconds * 1000);
  };

  const handleSaveSettings = () => {
    axios
      .put('/users/settings', {sound, sms})
      .then(({data, status, statusText}) => {
        if (status === 202) {
          setAlertSettings({
            variant: 'success',
            message: statusText,
          });
        } else {
          setAlertSettings({
            variant: 'error',
            message: statusText,
          });
        }
        hideAlert(2, setAlertSettings);
      });
  };

  const handleSoundToggle = name => event => {
    setSound(event.target.checked);
  };
  const handleSMSToggle = name => event => {
    setSms(event.target.checked);
  };

  const handleSaveProfile = () => {
    if (password === confirmPassword) {
      if (password === '') {
        axios
          .put('/users/put_own', {name: fullName, email, location})
          .then(({data, status, statusText}) => {
            if (status === 202) {
              setAlertProfile({
                variant: 'success',
                message: statusText,
              });
            } else {
              setAlertProfile({
                variant: 'error',
                message: statusText,
              });
            }
            hideAlert(2, setAlertProfile);
          });
      } else {
        axios
          .put('/users/put_own', {name: fullName, email, password, location})
          .then(({data, status, statusText}) => {
            if (status === 202) {
              setAlertProfile({
                variant: 'success',
                message: statusText,
              });
            } else {
              setAlertProfile({
                variant: 'error',
                message: statusText,
              });
            }
            hideAlert(2, setAlertProfile);
          });
      }
    } else {
      setAlertProfile({
        variant: 'error',
        message: 'Passwords should be the same',
      });
      hideAlert(2, setAlertProfile);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography>Profile</Typography>
            <TextField
              autoFocus
              onChange={event => setFullName(event.target.value || '')}
              margin="dense"
              id="fullName"
              label="Full Name*"
              type="text"
              value={fullName}
              fullWidth
            />
            <TextField
              onChange={event => setEmail(event.target.value || '')}
              margin="dense"
              id="email"
              label="Email*"
              type="text"
              value={email}
              fullWidth
            />
            <TextField
              onChange={event => setPassword(event.target.value || '')}
              margin="dense"
              id="newPassword"
              label="Password"
              type="password"
              value={password}
              fullWidth
            />
            <TextField
              onChange={event => setConfirmPassword(event.target.value || '')}
              margin="dense"
              id="newConfirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              fullWidth
            />
            <TextField
              onChange={event => setLocation(event.target.value || '')}
              margin="dense"
              id="location"
              label="Location*"
              type="text"
              value={location}
              fullWidth
            />
            <Box className={classes.grow}>
              <Toolbar>
                <div className={classes.grow} />
                <IconButton
                  onClick={handleSaveProfile}
                  edge="end"
                  className={classes.saveButton}>
                  <SaveRoundedIcon />
                </IconButton>
              </Toolbar>
            </Box>
          </Paper>
          {alertProfile.statusText !== ''
            ? CustomAlert(alertProfile.variant, alertProfile.message)
            : null}
        </Grid>

        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography>Alert settings</Typography>

            <List className={classes.root}>
              <ListItem>
                <ListItemIcon>
                  <VolumeUpRounded />
                </ListItemIcon>
                <ListItemText id="switch-list-label-sound" primary="Sound" />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    onChange={handleSoundToggle('sound')}
                    checked={sound}
                    value="sound"
                    inputProps={{'aria-labelledby': 'switch-list-label-sound'}}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SmsRounded />
                </ListItemIcon>
                <ListItemText id="switch-list-label-sms" primary="SMS" />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    onChange={handleSMSToggle('sms')}
                    checked={sms}
                    value="sms"
                    inputProps={{
                      'aria-labelledby': 'switch-list-label-sms',
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Divider />
            <Box className={classes.grow}>
              <Toolbar>
                <div className={classes.grow} />
                <IconButton
                  onClick={handleSaveSettings}
                  edge="end"
                  className={classes.saveButton}>
                  <SaveRoundedIcon />
                </IconButton>
              </Toolbar>
            </Box>
          </Paper>
          {alertSettings.statusText !== ''
            ? CustomAlert(alertSettings.variant, alertSettings.message)
            : null}
        </Grid>
      </Grid>
    </div>
  );
}
