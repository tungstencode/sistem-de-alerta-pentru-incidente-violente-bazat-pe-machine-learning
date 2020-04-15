import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

export default function LocationSearchInput(props) {
  const [address, setAddress] = useState('');
  const {onChange, location} = props;

  const handleChange = newAddress => {
    setAddress(newAddress);
    onChange(newAddress);
  };

  useEffect(() => {
    if (location) {
      setAddress(location);
    }
  });

  const handleSelect = newAddress => {
    setAddress(newAddress);
    geocodeByAddress(newAddress)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        handleChange(`${latLng.lat},${latLng.lng}`);
      })
      .catch(error => console.error('Error', error));
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}>
      {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
        <div>
          <TextField
            onChange={onChange}
            margin="dense"
            id="location"
            label="Location*"
            type="text"
            fullWidth
            {...getInputProps({
              className: 'location-search-input',
            })}
          />

          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map(suggestion => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? {
                    backgroundColor: '#1b2b33',
                    cursor: 'pointer',
                    boxShadow: '1px 3px 1px #1b2b33',
                  }
                : {backgroundColor: '#253b46', cursor: 'pointer'};
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}>
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}

LocationSearchInput.propTypes = {
  onChange: PropTypes.func,
  location: PropTypes.string,
};

LocationSearchInput.defaultProps = {
  onChange: () => {},
  location: '',
};
