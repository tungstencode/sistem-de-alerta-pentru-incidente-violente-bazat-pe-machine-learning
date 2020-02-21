import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  icon: {
    color: 'black',
    marginLeft: theme.spacing(1),
  },
  link: {
    margin: theme.spacing(1, 0),
  },
  bottomLink: {
    margin: theme.spacing(1, 0),
    position: 'absolute',
    bottom: 0,
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
      <img width="500" alt={title} src={`http://localhost:5000/camera/${id}`} />
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
