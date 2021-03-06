/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Register from './Register';
import Login from './Login';

export default class Auth extends Component {
  handleLoginSubmit = async () => {
    const {history, onSucces} = this.props;

    await onSucces();
    history.replace('/dashboard');
  };

  handleRegisterSubmit = async () => {
    const {history} = this.props;

    history.replace('/login');
  };

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/login">
            <Login handleLoginSubmit={this.handleLoginSubmit} />
          </Route>
          <Route exact path="/register">
            <Register handleRegisterSubmit={this.handleRegisterSubmit} />
          </Route>
        </Switch>
      </div>
    );
  }
}
