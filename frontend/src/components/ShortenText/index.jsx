import React from 'react';

import PropTypes from 'prop-types';

export default function ShortenText({text}) {
  const MAX_LENGTH = 25;
  return (
    <div>
      {text.length > MAX_LENGTH ? (
        <div>{`${text.substring(0, MAX_LENGTH)}...`}</div>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
}

ShortenText.propTypes = {
  text: PropTypes.string,
};

ShortenText.defaultProps = {
  text: '',
};
