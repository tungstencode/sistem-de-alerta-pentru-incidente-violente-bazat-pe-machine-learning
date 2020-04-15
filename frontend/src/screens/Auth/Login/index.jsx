/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Paper,
  withStyles,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {Face, Fingerprint} from '@material-ui/icons';
import axios from 'axios';
import {Formik} from 'formik';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit,
    color: theme.palette.text.light,
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function CustomAlert(severity, text) {
  return <Alert severity={severity}>{text}</Alert>;
}

class Login extends React.Component {
  handleSubmit = async user => {
    const {email, password, remember} = user;
    try {
      const response = await axios.post('/login', {email, password, remember});
      console.warn(response);
      if (response.status === 202) {
        this.setState({
          variant: 'success',
          message: `${response.statusText}`,
        });
        const {handleLoginSubmit} = this.props;

        handleLoginSubmit();
      }
    } catch (error) {
      this.setState({
        variant: 'error',
        message: `${error.response.statusText}`,
      });
    }
  };

  render() {
    const {classes} = this.props;
    let isSubmitting;

    return (
      <Formik
        initialValues={{email: '', password: '', remember: false}}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'No email';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }
          return errors;
        }}
        onSubmit={async (values, {setSubmitting}) => {
          await this.handleSubmit(values);
          isSubmitting = false;
        }}>
        {({values, errors, handleChange, handleBlur, handleSubmit}) => (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '100vh'}}>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <div className={classes.margin}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item>
                        <Face />
                      </Grid>
                      <Grid item md sm xs>
                        <TextField
                          name="email"
                          label="Email"
                          type="email"
                          fullWidth
                          autoFocus
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item>
                        <Fingerprint />
                      </Grid>
                      <Grid item md sm xs>
                        <TextField
                          type="password"
                          name="password"
                          label="Password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          fullWidth
                          required
                        />
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                      <Grid item>
                        <FormControlLabel
                          name="remember"
                          onChange={handleChange}
                          control={<Checkbox color="primary" />}
                          label="Remember me"
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          disableFocusRipple
                          disableRipple
                          style={{textTransform: 'none'}}
                          variant="text"
                          color="primary">
                          Forgot password ?
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justify="center"
                      style={{marginTop: '10px'}}>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        variant="outlined"
                        color="primary"
                        style={{textTransform: 'none'}}>
                        Login
                      </Button>
                    </Grid>
                  </form>
                </div>
              </Paper>
            </Grid>
            {this.state
              ? CustomAlert(this.state.variant, this.state.message)
              : true}
          </Grid>
        )}
      </Formik>
    );
  }
}

export default withStyles(styles)(Login);
