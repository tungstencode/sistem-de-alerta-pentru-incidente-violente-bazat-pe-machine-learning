import React from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import CameraDashboard from './Dashboard';
import CameraDetails from './CameraDetails';

export default function CamerasPage(props) {
  const {history, path} = props;

  return (
    <Switch>
      <Route
        exact
        path={path}
        render={routerProps => (
          <CameraDashboard {...routerProps} history={history} />
        )}
      />
      <Route
        path={`${path}/:cameraId`}
        render={routerProps => (
          <CameraDetails {...routerProps} history={history} />
        )}
      />
    </Switch>
  );
}

CamerasPage.propTypes = {
  history: PropTypes.shape({}),
  path: PropTypes.string,
};

CamerasPage.defaultProps = {
  history: {},
  path: PropTypes.string,
};
