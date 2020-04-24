import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert /* elevation={6} */ variant="filled" {...props} />;
}

function CustomAlert(severity, text) {
  return <Alert severity={severity}>{text}</Alert>;
}

export default function Alarm(props) {
  const {processing, id} = props;
  let source;
  const [playStatus, setPlayStatus] = React.useState(Sound.status.STOPPED);
  const [alertNotification, setAlertNotification] = React.useState({
    variant: '',
    message: '',
  });

  const hideAlert = (delaySeconds, setAlert) => {
    setTimeout(() => {
      setAlert({
        variant: '',
        message: '',
      });
    }, delaySeconds * 1000);
  };

  function onDetection(event) {
    if (event.data === `b'True'`) {
      axios.post(`/logs/${id}`).then(({data}) => {});
      setPlayStatus(Sound.status.PLAYING);
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
      <Sound url="fight-alarm.ogg" playStatus={playStatus} loop volume={20} />
      {alertNotification.statusText !== ''
        ? CustomAlert(alertNotification.variant, alertNotification.message)
        : null}
    </div>
  );
}

Alarm.propTypes = {
  processing: PropTypes.bool,
  id: PropTypes.number,
  // source: PropTypes.instanceOf(EventSource),
};

Alarm.defaultProps = {
  processing: false,
  id: 0,
  // source: null,
};
