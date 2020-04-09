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
import {Typography, IconButton, Icon, Grid} from '@material-ui/core';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import Image from 'material-ui-image';
// import Divider from '@material-ui/core/Divider';
import debounce from 'debounce';
import ConfirmDialog from '../ConfirmDialog';
import ShortenText from '../ShortenText';
// import MapDialog from '../MapDialog';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // width: '100%',
  },
  info: {
    // padding: theme.spacing(0, 1),
    // fontSize: 18,
    // margin: theme.spacing(0, 0),
  },
  grow: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
  },
  img: {
    borderRadius: 4,
    width: '100%',
  },
  deleteButton: {
    // marginRight: theme.spacing(2),
  },
  processingTogge: {
    // marginLeft: theme.spacing(2),
  },
}));

function CameraWrapper(props) {
  const {camera, onDelete, onCameraClick} = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [imageState, setImageState] = React.useState({
    count: 0,
    show: true,
  });
  const [openMap, setOpenMap] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [source, setSource] = useState();

  // const sourceB = new EventSource(`http://localhost:5000/detect/${camera.id}`);
  // sourceB.onopen = () => console.log('opened');
  // sourceB.onerror = () => console.log('error');
  // sourceB.onmessage = (e) => console.log('mesaj');

  const handleMapOpen = () => {
    setOpenMap(true);
  };

  const handleMapClose = () => {
    setOpenMap(false);
  };

  // const [detectionEvent, setDetectionEvent] = React.useState();

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

  const onDetection = async event => {
    console.log(event.data);
    if (event.data === `b'True'`) {
      console.log('true');
      await axios.post(`/logs/${camera.id}`).then(({data}) => {
        console.log(data);
      });
    }
  };

  const openStream = () => {
    const sourceB = new EventSource(
      `http://localhost:5000/detect/${camera.id}`
    );
    sourceB.onmessage = onDetection

    setSource(sourceB);
  };

  const closeStream = () => {
    source.close();
  };

  useEffect(() => {
    setProcessing(camera.UserCamera.detect);

    if (camera.UserCamera.detect) {
      openStream();
    }

    setImage(camera.UserCamera.detect);
  }, []);

  const handleChange = name => event => {
    event.target.checked ? openStream() : closeStream();
    setProcessing(event.target.checked);
    setImage(event.target.checked);
    axios
      .put(`/cameras/assigned/detect/${camera.id}`, {
        detect: event.target.checked,
      })
      .then(res => {
        console.log(res);
      });
  };

  return (
    <Grid item xs={4}>
      <Paper className={classes.paper}>
        <AppBar color="secondary" position="static">
          <Grid
            container
            direction="row"
            // justify="space-around"
            alignItems="center">
            <Grid item xs={3}>
              <Toolbar>
                <Link color="primary" onClick={() => onCameraClick(camera.id)}>
                  <Typography noWrap>{camera.name}</Typography>
                </Link>
              </Toolbar>
            </Grid>
            <Grid item xs={5}>
              <Toolbar>
                <Typography noWrap>{camera.location}</Typography>
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
                label="Detect"
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
          <Image
            src={imageState.show ? url : ''}
            onClick={() => console.log('onClick')}
            aspectRatio={16 / 9}
            // disableSpinner
          />
        </Box>
      </Paper>
      <ConfirmDialog open={open} handleYes={handleYes} handleNo={handleNo} />
      {/* <MapDialog open={openMap} onClose={handleMapClose} camera={camera} /> */}
    </Grid>
  );
}

CameraWrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  camera: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  onDelete: PropTypes.func,
  onCameraClick: PropTypes.func,
};

CameraWrapper.defaultProps = {
  camera: {},
  onDelete: () => {},
  onCameraClick: () => {},
};

export default CameraWrapper;
