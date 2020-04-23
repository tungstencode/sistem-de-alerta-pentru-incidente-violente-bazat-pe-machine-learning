import React from 'react';
import Sound from 'react-sound';
import PropTypes from 'prop-types';
import axios from 'axios';

const useEventListener = (target, type, listener, ...options) => {
  React.useEffect(() => {
    target.addEventListener(type, listener, ...options);
    return () => {
      target.removeEventListener(type, listener, ...options);
    };
  }, [target, type, listener, options]);
};

export default function Alarm(props) {
  const {processing, id} = props;
  const source = new EventSource(`http://localhost:5000/detect/${id}`);
  const [playStatus, setPlayStatus] = React.useState(Sound.status.STOPPED);
  // soundManager.setup({debugMode: false});

  const onDetection = React.useCallback(
    event => {
      if (event.data === `b'True'`) {
        console.log(event.data);
        setPlayStatus(Sound.status.PLAYING);

        // eslint-disable-next-line no-var
        // axios.post(`/logs/${id}`).then(({data}) => {});
      }
    },
    [] // Tells React to memoize regardless of arguments.
  );

  // const onDetection = event => {
  //   // console.warn(event.data);
  //   if (event.data === `b'True'`) {
  //     console.log(event.data);
  //     // eslint-disable-next-line no-var
  //     // axios.post(`/logs/${id}`).then(({data}) => {});
  //     setPlayStatus(Sound.status.PLAYING);
  //   }
  // };

  const notificationOn = () => {
    source.addEventListener('message', onDetection);
    // source.onmessage = onDetection;
    console.log('on');
  };

  const notificationOff = () => {
    source.removeEventListener('message', onDetection);
    source.close();
    axios.get(`http://localhost:5000/unsub/${id}`);
    setPlayStatus(Sound.status.STOPPED);
    console.log('off');
  };

  React.useEffect(() => {
    processing ? notificationOn() : notificationOff();
  }, [processing]);

  return (
    <div>
      {/* {processing ? ( */}
      <Sound url="fight-alarm.ogg" playStatus={playStatus} loop volume={20} />
      {/* ) : null} */}
    </div>
  );
}

Alarm.propTypes = {
  processing: PropTypes.bool,
  id: PropTypes.number,
};

Alarm.defaultProps = {
  processing: false,
  id: 0,
};
