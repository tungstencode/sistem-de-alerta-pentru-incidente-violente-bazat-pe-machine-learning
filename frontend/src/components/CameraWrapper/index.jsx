import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function CameraWrapper({id, name, ...rest}) {
  const classes = useStyles();
  return (
    <div>
      <Box>
        <Paper className={classes.paper}>
          <img
            width="500"
            alt={name}
            src={`http://localhost:5000/cameras/${id}`}
          />
        </Paper>
      </Box>
    </div>
  );
}

CameraWrapper.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
};

CameraWrapper.defaultProps = {
  id: 0,
  name: '',
};

export default CameraWrapper;
