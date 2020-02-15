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
  padding: {
    padding: theme.spacing.unit,
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
        // this dissapears immediately, I think we need to use content-flash with passport to display it on the page we redirect to after login
        // whatever page that may be
        // this.setState({
        //   variant: 'success',
        //   message: `${response.status} ${response.statusText}`,
        //   open: true,
        // });
        const {handleLoginSubmit} = this.props;

        handleLoginSubmit();
      }
    } catch (error) {
      // this.setState({
      //   variant: 'error',
      //   message: `${error.response.status} ${error.response.statusText}`,
      //   open: true,
      // });
    }
  };

  render() {
    const {classes} = this.props;

    return (
      <Formik
        initialValues={{email: '', password: ''}}
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
        onSubmit={(values, {setSubmitting}) => {
          this.handleSubmit(values);
        }}>
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '100vh'}}>
            <Grid item xs={3}>
              <Paper className={classes.padding}>
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
            {errors.email ? CustomAlert('warning', errors.email) : true}
          </Grid>
        )}
      </Formik>
    );
  }
}

export default withStyles(styles)(Login);
