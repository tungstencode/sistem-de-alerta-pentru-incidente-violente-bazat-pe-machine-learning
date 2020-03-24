import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {IconButton, Icon} from '@material-ui/core';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
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
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function CustomAlert(severity, text) {
  return <Alert severity={severity}>{text}</Alert>;
}

export default function Settings(props) {
  const classes = useStyles();
  // const [checked, setChecked] = React.useState(['sound']);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [alert, setAlert] = React.useState({
    variant: '',
    message: '',
  });

  useEffect(() => {
    axios.get('/users/get_own').then(({data}) => {
      console.log(data);
      setFullName(data.name);
      setEmail(data.email);
      setLocation(data.location);
    });
  }, []);

  const handleSave = () => {
    if (password === confirmPassword) {
      console.log('egale');
      if (password === '') {
        console.log('cu nimic');
        axios
          .put('/users/put_own', {name: fullName, email, location})
          .then(({data, status, statusText}) => {
            console.log(data);
            if (status === 202) {
              setAlert({
                variant: 'success',
                message: statusText,
              });
            } else {
              setAlert({
                variant: 'error',
                message: statusText,
              });
            }
          });
      } else {
        axios
          .put('/users/put_own', {name: fullName, email, password, location})
          .then(({data, status, statusText}) => {
            console.log(data);
            if (status === 202) {
              setAlert({
                variant: 'success',
                message: statusText,
              });
            } else {
              setAlert({
                variant: 'error',
                message: statusText,
              });
            }
          });
      }
    } else {
      console.log('nu-s egale');
      setAlert({
        variant: 'error',
        message: 'Passwords should be the same',
      });
    }
  };
  // const handleToggle = value => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };

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
              type="test"
              value={location}
              fullWidth
            />
            <Box className={classes.grow}>
              <Toolbar>
                <div className={classes.grow} />
                <IconButton
                  onClick={handleSave}
                  edge="end"
                  className={classes.saveButton}>
                  <SaveRoundedIcon />
                </IconButton>
              </Toolbar>
            </Box>
          </Paper>
          {alert.statusText ? CustomAlert(alert.variant, alert.message) : true}
        </Grid>

        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography>Alert settings</Typography>
            <Divider />

            <List
              // subheader={<ListSubheader>Settings</ListSubheader>}
              className={classes.root}>
              <ListItem>
                <ListItemIcon>
                  <VolumeUpRounded />
                </ListItemIcon>
                <ListItemText id="switch-list-label-sound" primary="Sound" />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    // onChange={handleToggle('sound')}
                    // checked={checked.indexOf('sound') !== -1}
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
                    // onChange={handleToggle('sms')}
                    // checked={checked.indexOf('sms') !== -1}
                    inputProps={{
                      'aria-labelledby': 'switch-list-label-sms',
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Divider />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
