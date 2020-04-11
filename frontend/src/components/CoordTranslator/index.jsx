/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import Geocode from 'react-geocode';

export default function LocationSearchInput(props) {
  const [locationAddress, setLocationAddress] = useState('');
  const {location} = props;
  Geocode.setApiKey('AIzaSyBBjaE2jVrWOKEITV8SiewKLNQBFKX0RRk');

  useEffect(() => {
    const coords = location.split(',');
    console.log(coords);
    Geocode.fromLatLng(coords[0], coords[1]).then(
      response => {
        const address = response.results[0].formatted_address;
        console.log(address);
        setLocationAddress(address);
      },
      error => {
        console.error(error);
      }
    );
  }, []);

  return locationAddress;
}
