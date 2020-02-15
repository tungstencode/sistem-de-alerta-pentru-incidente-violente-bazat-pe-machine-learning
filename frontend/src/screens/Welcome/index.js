import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {NavLink} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';

// const useStyles = makeStyles(() => ({
//   card: {
//     padding: '24px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   icon: {
//     fontSize: 40,
//   },
// }));

export default function Welcome(props) {
//   const classes = useStyles();

  return (
    <div>
      welcome  
      <Button
        variant="contained"
        color="primary"
        component={NavLink}
        to="/login">
        Login
      </Button>
    </div>
  );
}
