import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import {Videocam, NewReleases} from '@material-ui/icons';
import {Typography, Box} from '@material-ui/core';
import CoordTranslator from 'components/CoordTranslator';
// import VideocamIcon from '@material-ui/icons/Videocam';

const markerStyling = {
  clear: 'both',
  display: 'inline-block',
  backgroundColor: '#00921A',
  fontWeight: '500',
  color: '#FFFFFF',
  boxShadow: '0 6px 8px 0 rgba(63,63,63,0.11)',
  borderRadius: '23px',
  padding: '8px 16px',
  whiteSpace: 'nowrap',
  width: '160px',
  textAlign: 'center',
};

function CameraMap(props) {
  const currentYear = new Date().getFullYear();
  const [coords, setCoords] = useState();
  const [cameras, setCameras] = useState([]);
  const [openArr, setOpenArr] = useState([]);
  const [numberOfAccidentsArr, setNumberOfAccidentsArr] = useState([]);

  const iconMarker = new window.google.maps.MarkerImage(
    '/cctv.png',
    null /* size is determined at runtime */,
    null /* origin is 0,0 */,
    null /* anchor is bottom center of the scaled image */,
    new window.google.maps.Size(40, 40)
  );

  const translateCoords = locationString => {
    if (locationString) {
      const coordArray = locationString.split(',');
      return {
        lat: parseFloat(coordArray[0], 10),
        lng: parseFloat(coordArray[1], 10),
      };
    }
    return {
      lat: 0,
      lng: 0,
    };
  };

  useEffect(() => {
    axios.get('/cameras/assigned').then(({data}) => {
      setCameras(data);
      const newNumberOfAccidentsArr = [...numberOfAccidentsArr];

      data.map(async camera => {
        const response = await axios.get(
          `/logs/camera/${currentYear}/${camera.id}`
        );
        let numberOfAccidents = 0;
        response.data.map(month => {
          numberOfAccidents += month[camera.name];
        });
        newNumberOfAccidentsArr[camera.id] = numberOfAccidents;
      });
      console.log(newNumberOfAccidentsArr);

      setNumberOfAccidentsArr(newNumberOfAccidentsArr);
    });
    axios.get(`/users/get_own/`).then(({data}) => {
      setCoords(translateCoords(data.location));
    });
  }, []);

  const toggleInfoWindow = id => {
    const newOpenArr = [...openArr];
    newOpenArr[id] = !newOpenArr[id];
    setOpenArr(newOpenArr);
  };

  return (
    <div>
      {coords ? (
        <GoogleMap
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          defaultZoom={8}
          defaultCenter={coords}>
          {cameras
            ? cameras.map(camera => {
                return (
                  <Marker
                    defaultIcon={iconMarker}
                    position={translateCoords(camera.location)}
                    onClick={() => toggleInfoWindow(camera.id)}>
                    {openArr[camera.id] ? (
                      <InfoWindow
                        onCloseClick={() => toggleInfoWindow(camera.id)}>
                        <Box>
                          <Typography color="primary">{camera.name}</Typography>
                          <Typography color="primary">
                            <CoordTranslator location={camera.location} />
                          </Typography>
                          <Typography color="primary">
                            Number of accidents:{' '}
                            {numberOfAccidentsArr[camera.id]}
                          </Typography>
                        </Box>
                      </InfoWindow>
                    ) : null}
                  </Marker>
                );
              })
            : null}
        </GoogleMap>
      ) : null}
    </div>
  );
}

export default withGoogleMap(CameraMap);
