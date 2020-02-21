import React from 'react';
import {Switch, Route} from 'react-router-dom';
import CamerasDashboard from './Dashboard';
// import AddCamera from './AddCamera';
// import ProjectDetails from "./Details";

export default function ProjectsPage(props) {
  // eslint-disable-next-line react/prop-types
  const {history = {}, path = ''} = props;

  return (
    <Switch>
      <Route
        exact
        path={path}
        render={routerProps => (
          <CamerasDashboard {...routerProps} history={history} />
        )}
      />
      {/* <Route
        path={`${path}/add`}
        render={routerProps => <AddCamera {...routerProps} />}
      /> */}
      {/* <Route
        path={`${path}/:camera_id`}
        render={routerProps => (
          <CameraDetails {...routerProps} history={history} />
        )}
      /> */}
    </Switch>
  );
}
