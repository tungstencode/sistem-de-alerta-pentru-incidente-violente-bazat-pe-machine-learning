import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Toolbar from '@material-ui/core/Toolbar';
import {Typography, IconButton, Icon} from '@material-ui/core';
import OfflineBoltRoundedIcon from '@material-ui/icons/OfflineBoltRounded';
import OfflineBoltTwoToneIcon from '@material-ui/icons/OfflineBoltTwoTone';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  grow: {
    flexGrow: 1,
  },
  deleteButton: {
    // marginRight: theme.spacing(2),
  },
  processingTogge: {
    // marginLeft: theme.spacing(2),
  },
}));

function CameraWrapper({camera, ...rest}) {
  const classes = useStyles();
  const [processing, setProcessing] = React.useState(false);
  // const [detectionEvent, setDetectionEvent] = React.useState();
  let source;

  const onDetection = detection => {
    console.log(detection);
  };

  useEffect(() => {
    setProcessing(camera.UserCamera.detect);
    source = new EventSource(`http://localhost:5000/detect/${camera.id}`);
    source.onmessage = e => onDetection(e.data);
    // setDetectionEvent();
  }, []);

  const handleChange = name => event => {
    setProcessing(event.target.checked);
    axios
      .put(`/cameras/assigned/detect/${camera.id}`, {
        detect: event.target.checked,
      })
      .then(res => {
        console.log(res);
      });
    // console.log(event.target.checked);
  };

  return (
    <div>
      <Box>
        <Paper className={classes.paper}>
          <Box className={classes.grow}>
            <Toolbar>
              <IconButton className={classes.processingTogge}>
                <OfflineBoltRoundedIcon />
              </IconButton>
              <Typography>{camera.name}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={processing}
                    color="primary"
                    onChange={handleChange('processing')}
                    value="processing"
                    inputProps={{'aria-label': 'primary checkbox'}}
                  />
                }
                label="Detect"
              />
              <div className={classes.grow} />
              <IconButton edge="end" className={classes.deleteButton}>
                <DeleteRoundedIcon />
              </IconButton>
            </Toolbar>
          </Box>

          <Box>
            {processing ? (
              <img
                width="500"
                alt={camera.name}
                src={`http://localhost:5000/processed/${camera.id}`}
              />
            ) : (
              [
                camera.url.includes('rtsp') ? (
                  <img
                    width="500"
                    alt={camera.name}
                    src={`http://localhost:5000/unprocessed/${camera.id}`}
                  />
                ) : (
                  <img width="500" alt={camera.name} src={camera.url} />
                ),
              ]
            )}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

CameraWrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  camera: PropTypes.object,
};

CameraWrapper.defaultProps = {
  camera: {},
};

export default CameraWrapper;
