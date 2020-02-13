import React from 'react';
import axios from 'axios';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Button} from '@material-ui/core';
import DrawerWrapper from './layout/DrawerWrapper';
import Dashboard from './screens/Dashboard';
import Cameras from './screens/Cameras';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7274e4',
      main: '#6164e1',
      dark: '#4749dc',
      inactive: '#273e4a',
    },
    secondary: {
      light: '#3b533e',
      main: '#0b280e',
      dark: '#071c09',
    },
    background: {
      default: '#1b2b33',
    },
    text: {
      primary: '#070722',
      light: '#f2f2fd',
    },
    typography: {
      color: '#f2f2fd',
    },
  },
});
// const isAuthenticated = true;

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <DrawerWrapper>
        <Switch>
          <Route
            exact
            path="/"
            render={routerProps => (
              <Redirect {...routerProps} to="/dashboard" />
            )}
          />
          <Route
            path="/dashboard"
            render={routerProps => <Dashboard {...routerProps} />}
          />
          <Route
            path="/cameras"
            render={routerProps => <Cameras {...routerProps} path="/cameras" />}
          />
          {/* <Route path="*" exact component={The404} /> */}
        </Switch>
      </DrawerWrapper>
    </Router>
  </ThemeProvider>
);

export default App;
