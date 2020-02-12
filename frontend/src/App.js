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
      light: '#54a75c',
      main: '#2a9134',
      dark: '#1d6524',
    },
    secondary: {
      light: '#3b533e',
      main: '#0b280e',
      dark: '#071c09',
    },
    background: {
      default: '#f7fdf8',
    },
    text: {
      primary: '#061407',
      light: '#f3fcf4',
    },
    typography: {
      color: '#f3fcf4',
    },
  },
});
const isAuthenticated = true;

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
