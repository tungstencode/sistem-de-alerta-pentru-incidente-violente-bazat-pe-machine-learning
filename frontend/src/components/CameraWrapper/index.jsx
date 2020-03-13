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
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
// import Divider from '@material-ui/core/Divider';
import ConfirmDialog from '../ConfirmDialog';
import ShortenText from '../ShortenText';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  info: {
    padding: theme.spacing(0, 1),
    fontSize: 18,
  },
  grow: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  img: {
    borderRadius: 4,
  },
  deleteButton: {
    // marginRight: theme.spacing(2),
  },
  processingTogge: {
    // marginLeft: theme.spacing(2),
  },
}));

function CameraWrapper({camera, onDelete, ...rest}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  // const [detectionEvent, setDetectionEvent] = React.useState();
  let source;

  const onDetection = detection => {
    console.log(detection);
  };

  const handleDeleteClick = event => {
    setOpen(true);
  };

  const handleYes = () => {
    axios.delete(`/cameras/assigned/${camera.id}`).then(response => {
      onDelete();
      setOpen(false);
    });
  };

  const handleNo = () => {
    setOpen(false);
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
          <Box borderRadius={4} className={classes.grow}>
            <Toolbar>
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
              <Typography class={classes.info}>
                <ShortenText text={camera.name} />
              </Typography>
              <Typography class={classes.info}>
                <ShortenText text={camera.location} />
              </Typography>
              <div className={classes.grow} />
              <IconButton
                onClick={handleDeleteClick}
                edge="end"
                className={classes.deleteButton}>
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
                    className={classes.img}
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
      <ConfirmDialog open={open} handleYes={handleYes} handleNo={handleNo} />
    </div>
  );
}

CameraWrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  camera: PropTypes.object,
  onDelete: PropTypes.func,
};

CameraWrapper.defaultProps = {
  camera: {},
  onDelete: () => {},
};

export default CameraWrapper;
