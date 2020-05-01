/* eslint-disable react/no-unused-state */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {Formik, Form} from 'formik';
import {
  withStyles,
  Select,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import {NavLink} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from 'axios';

import MuiAlert from '@material-ui/lab/Alert';
import {Face, Fingerprint} from '@material-ui/icons';
import LocationSearchInput from '../../../components/LocationSearchInput';
// const styles = theme => ({
//   margin: {
//     margin: theme.spacing.unit * 2,
//   },
//   paper: {
//     padding: theme.spacing.unit,
//     color: theme.palette.text.light,
//   },
// });

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

let location;

class Register extends React.Component {
  handleLocationChange = address => {
    // eslint-disable-next-line fp/no-mutation
    location = address || '';
  };

  handleSubmit = async user => {
    const {cnp, name, email, password} = user;
    console.log(user);

    try {
      const response = await axios.post('/signup', {
        cnp,
        name,
        email,
        password,
        location,
      });
      if (response.status === 201) {
        this.setState({
          variant: 'success',
          message: `${response.status} ${response.statusText}`,
          open: true,
        });
        const {handleRegisterSubmit} = this.props;
        handleRegisterSubmit();
      }
    } catch (error) {
      this.setState({
        variant: 'error',
        message: `${error.response.status} ${error.response.statusText}`,
        open: true,
      });
    }
  };

  render() {
    const {classes} = this.props;
    let isSubmitting;

    return (
      <Formik
        initialValues={{
          cnp: '',
          name: '',
          email: '',
          password: '',
        }}
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
        onSubmit={async (user, {setSubmitting}) => {
          await this.handleSubmit(user);
          setSubmitting(false);
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
                <Container component="main" maxWidth="xs">
                  <div className={classes.paper}>
                    {/* <Avatar className={classes.avatar}>
                      <LockOutlinedIcon />
                    </Avatar> */}
                    <Grid container>
                      {/* <Grid item xs={12} className={classes.item}>
                        <Typography component="h1" variant="h5">
                          Register
                        </Typography>
                      </Grid> */}
                      <Grid item xs={12} className={classes.item}>
                        <TextField
                          margin="normal"
                          label="CNP"
                          name="cnp"
                          autoComplete="CNP"
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.item}>
                        <TextField
                          margin="normal"
                          label="Full Name"
                          name="name"
                          autoComplete="Full Name"
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.item}>
                        <TextField
                          margin="normal"
                          label="Email"
                          name="email"
                          autoComplete="email"
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.item}>
                        <TextField
                          margin="normal"
                          label="Password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.item}>
                        <LocationSearchInput
                          location={location}
                          onChange={this.handleLocationChange}
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.item}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.submit}>
                          Register
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item>
                        <NavLink href="#" to="/login">
                          <Button
                            disableFocusRipple
                            disableRipple
                            style={{textTransform: 'none'}}
                            variant="text"
                            color="primary">
                            Already have an account?
                          </Button>
                        </NavLink>
                      </Grid>
                    </Grid>
                  </div>
                </Container>
              </Paper>
            </Grid>
            {this.state
              ? CustomAlert(this.state.variant, this.state.message)
              : true}
          </Grid>
        )}
      </Formik>
      //   <Formik
      //     initialValues={{
      //       username: '',
      //       email: '',
      //       password: '',
      //       type: '',
      //     }}
      //     onSubmit={async (user, {setSubmitting}) => {
      //       await this.handleSubmit(user);
      //       setSubmitting(false);
      //     }}>
      //     <Form>
      //       <Container component="main" maxWidth="xs">
      //         <div className={classes.paper}>
      //           <Avatar className={classes.avatar}>
      //             <LockOutlinedIcon />
      //           </Avatar>
      //           <Grid container>
      //             <Grid item xs={12} className={classes.item}>
      //               <Typography component="h1" variant="h5">
      //                 Register
      //               </Typography>
      //             </Grid>
      //             <Grid item xs={12} className={classes.item}>
      //               <TextField
      //                 margin="normal"
      //                 label="Username"
      //                 name="username"
      //                 autoComplete="username"
      //               />
      //             </Grid>
      //             <Grid item xs={12} className={classes.item}>
      //               <TextField
      //                 margin="normal"
      //                 label="Email"
      //                 name="email"
      //                 autoComplete="email"
      //               />
      //             </Grid>
      //             <Grid item xs={12} className={classes.item}>
      //               <TextField
      //                 margin="normal"
      //                 label="Password"
      //                 name="password"
      //                 type="password"
      //                 autoComplete="current-password"
      //               />
      //             </Grid>
      //             {/* <Grid item xs={12} className={classes.item}>

      //             </Grid> */}
      //             <Grid item xs={12} className={classes.item}>
      //               <Button
      //                 type="submit"
      //                 fullWidth
      //                 variant="contained"
      //                 color="primary"
      //                 className={classes.submit}>
      //                 Register
      //               </Button>
      //             </Grid>
      //           </Grid>
      //           <Grid container>
      //             {/* <Grid item xs>
      //               <Link href="#" variant="body2">
      //                 {t('Auth.Forgot')}
      //               </Link>
      //             </Grid> */}
      //             <Grid item>
      //               <NavLink href="#" to="/login" variant="body2">
      //                 Already have an account?
      //               </NavLink>
      //             </Grid>
      //           </Grid>
      //         </div>
      //         <Box mt={8} />
      //       </Container>
      //     </Form>
      //   </Formik>
    );
  }
}

export default withStyles(styles)(Register);
