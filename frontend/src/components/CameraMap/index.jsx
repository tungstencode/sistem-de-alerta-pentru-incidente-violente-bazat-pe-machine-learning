import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';

function CameraMap(props) {
  const [isMarkerShown, setIsMarkerShown] = useState(true);
  const [coords, setCoords] = useState();

  useEffect(() => {
    axios.get(`/users/get_own/`).then(({data}) => {
      if (data.location) {
        const coordArray = data.location.split(',');
        setCoords({
          lat: parseFloat(coordArray[0], 10),
          lng: parseFloat(coordArray[1], 10),
        });
      } else {
        setCoords({
          lat: 0,
          lng: 0,
        });
      }

      console.log(data.location);
    });
  }, []);

  return (
    <div>
      {coords ? (
        <GoogleMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          defaultZoom={8}
          defaultCenter={coords}>
          {isMarkerShown && <Marker position={coords} />}
        </GoogleMap>
      ) : null}
    </div>
  );
}

// const MyMapComponent = (
//   withProps({
//     /**
//      * Note: create and replace your own key in the Google console.
//      * https://console.developers.google.com/apis/dashboard
//      * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
//      */
//     googleMapURL:
//       'https://maps.googleapis.com/maps/api/js?key=AIzaSyBBjaE2jVrWOKEITV8SiewKLNQBFKX0RRk&v=3.exp&libraries=geometry,drawing,places',
//     loadingElement: <div style={{height: `100%`}} />,
//     containerElement: <div style={{height: `400px`}} />,
//     mapElement: <div style={{height: `100%`}} />,
//   }),
//   withScriptjs,
//   withGoogleMap
// )(props => (

// ));

export default withGoogleMap(CameraMap);
