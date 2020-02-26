import React, {useEffect} from 'react';
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

  useEffect(() => {
    // const source = new EventSource(`http://localhost:5000/detect/1`);
    // source.onmessage = e => {
    //   console.log(e.data);
    // };
    // source.addEventListener(
    //   'greeting',
    //   event => {
    //     const data = JSON.parse(event.data);
    //     console.log(data);
    //     // do what you want with this data
    //   },
    //   false
    // );
    // eslint-disable-next-line fp/no-mutation
  }, []);

  return <div>dash</div>;
}
