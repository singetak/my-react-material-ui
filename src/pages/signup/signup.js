import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { authenticationService } from '../../services/authentication.service';
import { withStyles } from "@material-ui/core";
import { styles } from "../../css-common";
import { withSnackbar } from 'material-ui-snackbar-provider';


class SignUp extends Component {

    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/home');
        }
        if(localStorage.getItem('registeredUser')){
          this.props.history.push('/alreadyregistered');
        }
        this.handleUserInput = this.handleUserInput.bind(this);
        this.preventDefault = this.preventDefault.bind(this);
        this.registerUser = this.registerUser.bind(this);

        this.state = {
            currentRegisteredUser: {
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                image: null
            },
            message: ""
        };
    }
    handleUserInput(e) {
      const name = e.target.name;
      const value = e.target.value;
      this.setState((prevState) => {
        return {
            currentRegisteredUser: {
                ...prevState.currentRegisteredUser,
                [name]: value
            }
        };
      });
    }
    validate(){
      let currentRegisteredUserKeys = Object.keys(this.state.currentRegisteredUser);
      for(let fieldName of currentRegisteredUserKeys){
        let value = this.state.currentRegisteredUser[fieldName];
        if(fieldName === 'name'){
          let nameValid = value.length >= 6;
          if(!nameValid){
            this.props.snackbar.showMessage('Name Not Valid!', 'Dismiss', ()=>{});
            return false;
          }
        }else if (fieldName === 'email'){
          let emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
          if(!emailValid){
            this.props.snackbar.showMessage('Email Not Valid!', 'Dismiss', ()=>{});
            return false;
          }
        }else if (fieldName === 'password'){
          let passwordValid = value.length >= 6;
          if(!passwordValid){
            this.props.snackbar.showMessage('Password Not Valid!', 'Dismiss', ()=>{});
            return false;
          }
        }else if (fieldName === 'password_confirmation'){
          let passwordcValid = value.length >= 6;
          if(!passwordcValid){
            this.props.snackbar.showMessage('Password Confirmation Not Valid!', 'Dismiss', ()=>{});
            return false;
          }
        }
      }
      return true;
    }
    registerUser() {
        if(!this.validate()){
          return;
        }
        authenticationService.register(this.state.currentRegisteredUser)
          .then(response => {
            const { from } = this.props.location.state || { from: { pathname: "/alreadyregistered" } };
            this.props.history.push(from);
            this.props.snackbar.showMessage('Successfully Registered!', 'Dismiss', ()=>{});
          })
          .catch(e => {
              this.props.snackbar.showMessage(e, 'Dismiss', ()=>{});
          });
    }
    preventDefault(event) {
      event.preventDefault();
    }
    render() {
      const { classes } = this.props;
      const { currentRegisteredUser } = this.state;
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="name"
                    name="name"
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    value={currentRegisteredUser.name}
                    onChange={this.handleUserInput}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={currentRegisteredUser.email}
                    onChange={this.handleUserInput}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={currentRegisteredUser.password}
                    onChange={this.handleUserInput}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    id="password_confirmation"
                    autoComplete="confirm-password"
                    value={currentRegisteredUser.password_confirmation}
                    onChange={this.handleUserInput}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="submitBtn"
                onClick={() => this.registerUser()}
              >
                Sign Up
              </Button>
            </form>
          </div>
        </Container>
      );
    }
}

// <Grid item xs={12}>
//   <FormControlLabel
//     control={<Checkbox value="allowExtraEmails" color="primary" />}
//     label="I want to receive inspiration and updates via email."
//   />
// </Grid>
export default withSnackbar()(withStyles(styles)(SignUp))
