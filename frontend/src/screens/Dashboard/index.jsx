import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  card: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();

  return <div>dash</div>;
}

Dashboard.propTypes = {
  data: PropTypes.shape({
    completedCount: PropTypes.number,
    toBeGradedCount: PropTypes.number,
    projects: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};