import React, {useEffect, useState} from 'react';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import ListIcon from '@material-ui/icons/List';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import axios from 'axios';
// import {Folder, Delete} from '@material-ui/icons';
import CustomListItem from 'components/CustomListItem';
import CameraMap from '../../components/CameraMap';

const useStyles = makeStyles(theme => ({
  card: {
    padding: '24px',
    height: '20vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.text.primary,
    background: theme.palette.primary.light,
  },
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // width: '100%',
  },
  side: {
    height: '40vh',
    paddingTop: theme.spacing(2),
  },
  icon: {
    fontSize: 30,
  },
  list: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: '40vh',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(true);
  const [logs, setLogs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [accurate, setAccurate] = useState(0);
  const [inaccurate, setInaccurate] = useState(0);
  const [total, setTotal] = useState(0);
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    axios.get(`/logs/limit/${limit}`).then(({data}) => {
      setLogs(data);
    });
    axios.get(`/logs/limit`).then(({data}) => {
      let acc = 0;
      let inac = 0;
      let tot = 0;
      data.map(log => {
        if (log.accurate === true) {
          acc += 1;
        }
        if (log.accurate === false) {
          inac += 1;
        }
        tot += 1;
      });
      setAccurate(acc);
      setInaccurate(inac);
      setTotal(tot);
    });
  }, []);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            <Box>
              <CameraMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{height: `100%`}} />}
                containerElement={<div style={{height: `80vh`}} />}
                mapElement={<div style={{height: `100%`}} />}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Paper className={classes.card}>
                      <Box>
                        <ListIcon className={classes.icon} />
                        <Typography color="textSecondary">Total</Typography>
                        <Divider />
                        <Typography variant="h5" color="textPrimary">
                          {total}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Paper className={classes.card}>
                      <Box>
                        <PlaylistAddCheckIcon className={classes.icon} />
                        <Typography color="textSecondary">Accurate</Typography>
                        <Divider />
                        <Typography variant="h5" color="textPrimary">
                          {accurate}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Paper className={classes.card}>
                      <Box>
                        <CancelIcon className={classes.icon} />
                        <Typography color="textSecondary">
                          Inaccurate
                        </Typography>
                        <Divider />
                        <Typography variant="h5" color="textPrimary">
                          {inaccurate}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid className={classes.side} item xs={12}>
              <Paper className={classes.paper}>
                {/* <Box className={classes.grow}>recent activity</Box> */}

                <List className={classes.list}>
                  {logs.map((log, key) => {
                    return <CustomListItem key={key} log={log} />;
                  })}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
