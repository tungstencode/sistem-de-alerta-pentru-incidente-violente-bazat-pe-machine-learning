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
import DrawerWrapper from './layout/DrawerWrapper';
import Dashboard from './screens/Dashboard';
import Cameras from './screens/Cameras';
import Welcome from './screens/Welcome';
import Auth from './screens/Auth';

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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAuthenticated: false,
    };

    // if for any reason a user becomes logged out redirect him to the Home route: "/"
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const {status, data} = error.response;

          switch (status) {
            case 401:
              this.setState({isAuthenticated: false});
              break;
            case 403:
              if (data.message === 'no access') {
                this.setState({isAuthenticated: false});
              }
              break;
            default:
              break;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async componentDidMount() {
    // this.load();
  }

  load = async () => {
    try {
      this.setState({
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      this.setState({isLoading: false});

      console.error(error);
    }
  };

  render() {
    const {isAuthenticated = false, isLoading = true} = this.state;
    console.log(isAuthenticated);
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {isAuthenticated ? (
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
                  render={routerProps => (
                    <Cameras {...routerProps} path="/cameras" />
                  )}
                />
                {/* <Route path="*" exact component={The404} /> */}
              </Switch>
            </DrawerWrapper>
          ) : (
            <Switch>
              <Route
                path="/register"
                render={routerProps => <Auth {...routerProps} />}
              />
              <Route
                path="/login"
                render={routerProps => (
                  <Auth {...routerProps} onSucces={this.load} />
                )}
              />
              <Route
                path="/"
                render={routerProps => (
                  <>
                    <Redirect to="/" />
                    <Welcome {...routerProps} />
                  </>
                )}
              />
            </Switch>
          )}
        </Router>
      </ThemeProvider>
    );
  }
}
