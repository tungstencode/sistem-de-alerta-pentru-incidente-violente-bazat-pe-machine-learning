import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function CameraWrapper({camera, processingP, ...rest}) {
  const classes = useStyles();
  const [processing, setProcessing] = React.useState(false);

  useEffect(() => {
    setProcessing(processingP);
  }, []);

  const handleChange = name => event => {
    setProcessing(event.target.checked);
    console.log(event.target.checked);
  };

  return (
    <div>
      <Box>
        <Paper className={classes.paper}>
          <Switch
            checked={processing}
            color="primary"
            onChange={handleChange('processing')}
            value="processing"
            inputProps={{'aria-label': 'primary checkbox'}}
          />
          <Box>
            {processing || camera.url.includes('rtsp') ? (
              <img
                width="500"
                alt={camera.name}
                src={`http://localhost:5000/cameras/${camera.id}`}
              />
            ) : (
              <img width="500" alt={camera.name} src={camera.url} />
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
  processingP: PropTypes.bool,
};

CameraWrapper.defaultProps = {
  camera: {},
  processingP: false,
};

export default CameraWrapper;
