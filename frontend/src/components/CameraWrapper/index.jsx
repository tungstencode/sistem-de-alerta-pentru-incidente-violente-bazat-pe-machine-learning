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

function CameraWrapper({
  id,
  title,
  Icon,
  exact = false,
  bottom = false,
  ...rest
}) {
  const classes = useStyles();
  return (
    <div>
      <Box>
        <Paper className={classes.paper}>
          <img
            width="500"
            alt={title}
            src={`http://localhost:5000/cameras/${id}`}
          />
        </Paper>
      </Box>
    </div>
  );
}

CameraWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  exact: PropTypes.bool,

  // eslint-disable-next-line react/require-default-props
  bottom: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  Icon: PropTypes.node,
};

export default CameraWrapper;
