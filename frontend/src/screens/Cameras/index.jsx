import React from 'react';
import {Switch, Route} from 'react-router-dom';
import CameraDashboard from './Dashboard';
import CameraDetails from './CameraDetails';

export default function CamerasPage(props) {
  // eslint-disable-next-line react/prop-types
  const {history = {}, path = ''} = props;
  // console.log(history);

  return (
    <Switch>
      <Route
        exact
        path={path}
        render={routerProps => (
          <CameraDashboard {...routerProps} history={history} />
        )}
      />
      {/* <Route
        path={`${path}/add`}
        render={routerProps => <AddCamera {...routerProps} />}
      /> */}
      <Route
        path={`${path}/:cameraId`}
        render={routerProps => (
          <CameraDetails {...routerProps} history={history} />
        )}
      />
    </Switch>
  );
}
