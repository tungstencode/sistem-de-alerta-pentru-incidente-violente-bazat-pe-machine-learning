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
import Loader from 'components/Loader';
import DrawerWrapper from './components/DrawerWrapper';
import Dashboard from './screens/Dashboard';
import Cameras from './screens/Cameras';
import Welcome from './screens/Welcome';
import Auth from './screens/Auth';
import Graph from './screens/Graph';
import Settings from './screens/Settings';

const themeDark = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#7274e4',
      main: '#6164e1',
      dark: '#4749dc',
      inactive: '#273e4a',
    },
    secondary: {
      light: '#d5c9f7',
      main: '#1b2b33',
      dark: '#33148f',
    },
    background: {
      default: '#1b2b33',
      paper: '#253b46',
    },
    text: {
      primary: '#f2f2fd',
      dark: '#070722',
    },
    typography: {
      color: '#f2f2fd',
    },
  },
});

const themeLight= createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      light: '#7274e4',
      main: '#6164e1',
      dark: '#4749dc',
      inactive: '#273e4a',
    },
    secondary: {
      light: '#d5c9f7',
      main: '#9bbaca',
      dark: '#568aa4',
    },
    background: {
      default: '#bcd1dc',
      paper: '#ebf1f4',
    },
    text: {
      primary: '#070722',
      dark: '#f2f2fd',
    },
    typography: {
      color: '#070722',
    },
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAuthenticated: false,
    };
    window.soundManager.setup({debugMode: false});

    axios.interceptors.response.use(
      response => {
        console.log(response);
        return response;
      },
      error => {
        if (error.response) {
          const {status, data} = error.response;
          console.log(error.response);

          switch (status) {
            case 401:
              this.setState({isAuthenticated: false});
              break;
            case 403:
              if (data.message === 'no access') {
                console.log('no access');
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
    this.checkLoggedIn();
  }

  checkLoggedIn = async () => {
    try {
      const {data = {}} = await axios.get('/user_data');
      console.log(data);

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
    return (
      <ThemeProvider theme={themeDark}>
        <CssBaseline />
        <Loader isLoading={isLoading}>
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
                    path="/cameras"
                    render={routerProps => (
                      <Cameras {...routerProps} path="/cameras" />
                    )}
                  />
                  <Route
                    path="/dashboard"
                    render={routerProps => <Dashboard {...routerProps} />}
                  />
                  <Route
                    path="/graph"
                    render={routerProps => (
                      <Graph {...routerProps} path="/graph" />
                    )}
                  />
                  <Route
                    path="/settings"
                    render={routerProps => (
                      <Settings {...routerProps} path="/settings" />
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
                    <Auth {...routerProps} onSucces={this.checkLoggedIn} />
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
        </Loader>
      </ThemeProvider>
    );
  }
}
