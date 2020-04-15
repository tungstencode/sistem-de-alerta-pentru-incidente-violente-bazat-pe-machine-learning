import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';

export default function CoordTranslator(props) {
  const [locationAddress, setLocationAddress] = useState('');
  const {location} = props;
  Geocode.setApiKey('AIzaSyBBjaE2jVrWOKEITV8SiewKLNQBFKX0RRk');

  useEffect(() => {
    const coords = location.split(',');
    Geocode.fromLatLng(coords[0], coords[1]).then(
      response => {
        const address = response.results[0].formatted_address;
        setLocationAddress(address);
      },
      error => {}
    );
  }, []);

  return locationAddress;
}

CoordTranslator.propTypes = {
  location: PropTypes.string,
};

CoordTranslator.defaultProps = {
  location: '',
};
