import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import {Button} from '@material-ui/core';

function CustomAlert(severity, text, turn) {
  return (
    <MuiAlert
      /* elevation={6} */ severity={severity}
      variant="filled"
      action={
        severity ? <Button onClick={() => turn(false)}>Turn off</Button> : null
      }>
      {text}
    </MuiAlert>
  );
}

export default function Alarm(props) {
  const {processing, id, sound, turn} = props;
  let source;
  const [playStatus, setPlayStatus] = React.useState(Sound.status.STOPPED);
  const [alertNotification, setAlertNotification] = React.useState({
    variant: '',
    message: '',
  });

  function onDetection(event) {
    if (event.data === `b'True'`) {
      axios.post(`/logs/${id}`);
      if (sound) {
        setPlayStatus(Sound.status.PLAYING);
      }
      setAlertNotification({
        variant: 'error',
        message: 'Violence detected!',
      });
    }
  }

  const notificationOn = () => {
    source.onmessage = onDetection;
  };

  const notificationOff = () => {
    source.onmessage = null;
    axios.get(`http://localhost:5000/unsub/${id}`);
    setPlayStatus(Sound.status.STOPPED);
    // hideAlert(15, setAlertNotification);
    setAlertNotification({
      variant: '',
      message: '',
    });
  };

  React.useEffect(() => {
    source = new EventSource(`http://localhost:5000/detect/${id}`);
    processing ? notificationOn() : notificationOff();
    console.log(source);
    return function cleanup() {
      source.close();
    };
  }, [processing]);

  return (
    <div>
      <Sound url="/fight-alarm.ogg" playStatus={playStatus} loop volume={20} />
      {alertNotification.statusText !== ''
        ? CustomAlert(
            alertNotification.variant,
            alertNotification.message,
            turn
          )
        : null}
    </div>
  );
}

Alarm.propTypes = {
  processing: PropTypes.bool,
  id: PropTypes.number,
  sound: PropTypes.bool,
  turn: PropTypes.func,
};

Alarm.defaultProps = {
  processing: false,
  id: 0,
  sound: true,
  turn: () => {},
};
