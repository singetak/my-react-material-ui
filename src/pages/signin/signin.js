import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { authenticationService } from '../../services/authentication.service';
import { withStyles } from "@material-ui/core";
import { styles } from "../../css-common";
import { withSnackbar } from 'material-ui-snackbar-provider';


class SignIn extends Component {
    email: any = '';
    password: any = '';
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            authenticationService.DBlogout();
            // this.props.history.push('/');
        }

        this.handleUserInput = this.handleUserInput.bind(this);
        this.preventDefault = this.preventDefault.bind(this);
        this.loginUser = this.loginUser.bind(this);

        this.state = {
            currentLoginUser: {
                email: "admin@example.com",
                password: "123456"
            },
            message: ""
        };
    }
    handleUserInput(e) {
      const name = e.target.name;
      const value = e.target.value;
      this.setState((prevState) => {
          return {
              currentLoginUser: {
                  ...prevState.currentLoginUser,
                  [name]: value
              }
          };
      });
    }
    validate(){
      let currentLoginUserKeys = Object.keys(this.state.currentLoginUser);
      for(let fieldName of currentLoginUserKeys){
        let value = this.state.currentLoginUser[fieldName];
        if (fieldName === 'email'){
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
        }
      }
      return true;
    }
    loginUser() {
        if(!this.validate()){
          return;
        }
        authenticationService.login(this.state.currentLoginUser.email, this.state.currentLoginUser.password)
            .then(response => {
              const { from } = this.props.location.state || { from: { pathname: "/home" } };
              this.props.history.push(from);
            })
            .catch(e => {
                this.props.snackbar.showMessage(e, 'Dismiss', ()=>{});
                console.log(e);
            });
    }
    preventDefault(event) {
      event.preventDefault();
    }
    render() {
      const { classes } = this.props;
      const { currentLoginUser } = this.state;
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate onSubmit={(e) => e.preventDefault()}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={currentLoginUser.email}
                onChange={this.handleUserInput}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={currentLoginUser.password}
                onChange={this.handleUserInput}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="submitBtn"
                onClick={() => this.loginUser()}
              >
                Sign In
              </Button>
            </form>
          </div>
        </Container>
      );
    }
}
// <FormControlLabel
//   control={<Checkbox value="remember" color="primary" />}
//   label="Remember me"
// />
export default withSnackbar()(withStyles(styles)(SignIn))
