import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import {Typography, IconButton, Grid} from '@material-ui/core';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Image from 'material-ui-image';
import Popover from '@material-ui/core/Popover';
import ConfirmDialog from '../ConfirmDialog';
import CoordTranslator from '../CoordTranslator';
import Alarm from '../Alarm';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // width: '100%',
  },
}));

function CameraWrapper(props) {
  const {camera, onDelete, onCameraClick, sound} = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [url, setUrl] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageState, setImageState] = useState({
    count: 0,
    show: true,
  });

  const handleOpenPopover = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const idPopover = open ? 'simple-popover' : undefined;

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

  const reload = () => {
    setImageState({show: false});
    setTimeout(
      () => setImageState(state => ({count: state.count + 1, show: true})),
      500
    );
  };

  const setImage = processingP => {
    if (processingP) {
      setUrl(`http://localhost:5000/processed/${camera.id}`);
    } else if (camera.url.includes('rtsp')) {
      setUrl(`http://localhost:5000/unprocessed/${camera.id}`);
    } else {
      setUrl(camera.url);
    }
    reload();
  };

  useEffect(() => {
    setProcessing(camera.UserCamera.detect);
    setImage(camera.UserCamera.detect);
  }, []);

  const handleChange = name => event => {
    // event.target.checked ? notificationOn() : notificationOff();
    setProcessing(event.target.checked);
    setImage(event.target.checked);
    axios
      .put(`/cameras/assigned/detect/${camera.id}`, {
        detect: event.target.checked,
      })
      .then(res => {
        // console.log(res);
      });
  };

  const turn = processingP => {
    setProcessing(processingP);
    setImage(processingP);
    axios
      .put(`/cameras/assigned/detect/${camera.id}`, {
        detect: processingP,
      })
      .then(res => {
        // console.log(res);
      });
  };

  return (
    <Grid item xs={4}>
      <Paper className={classes.paper}>
        <AppBar color="secondary" position="static">
          <Grid container direction="row" alignItems="center">
            <Grid item xs={3}>
              <Toolbar>
                <Link color="primary" onClick={() => onCameraClick(camera.id)}>
                  <Typography noWrap>{camera.name}</Typography>
                </Link>
              </Toolbar>
            </Grid>
            <Grid item xs={5}>
              <Toolbar>
                <Typography onClick={handleOpenPopover} noWrap>
                  <CoordTranslator location={camera.location} />
                </Typography>
                <Popover
                  id={idPopover}
                  open={openPopover}
                  anchorEl={anchorEl}
                  onClose={handleClosePopover}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}>
                  <Typography className={classes.typography}>
                    <CoordTranslator location={camera.location} />
                  </Typography>
                </Popover>
              </Toolbar>
            </Grid>

            <Grid item xs={2}>
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
                // label="Detect"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={handleDeleteClick} edge="end">
                <DeleteRoundedIcon />
              </IconButton>
            </Grid>
          </Grid>
        </AppBar>
        <Box onClick={() => onCameraClick(camera.id)}>
          <Image src={imageState.show ? url : ''} aspectRatio={16 / 9} />
        </Box>
      </Paper>
      <Alarm turn={turn} sound={sound} processing={processing} id={camera.id} />
      <ConfirmDialog open={open} handleYes={handleYes} handleNo={handleNo} />
    </Grid>
  );
}

CameraWrapper.propTypes = {
  camera: PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    UserCamera: PropTypes.array,
  }),
  onDelete: PropTypes.func,
  onCameraClick: PropTypes.func,
  sound: PropTypes.bool,
};

CameraWrapper.defaultProps = {
  camera: {
    id: 0,
    url: '',
    name: '',
    location: '',
    UserCamera: [],
  },
  onDelete: () => {},
  onCameraClick: () => {},
  sound: true,
};

export default CameraWrapper;
