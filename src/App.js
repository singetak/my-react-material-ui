import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";
import { styles } from "./css-common"

import SignIn from "./pages/signin/signin";
import SignUp from "./pages/signup/signup";
import Home from "./pages/home/home";
import AlreadyRegistered from "./pages/alreadyregistered/alreadyregistered";
import { authenticationService } from './services/authentication.service';
import { history } from './services/helpers';
import { SnackbarProvider } from 'material-ui-snackbar-provider'

import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a color="inherit" href="https://amerghalayini.com/">
        amerghalayini
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


class App extends Component {
  constructor(props) {
     super(props);
     this.state = {
         currentUser: null
     };
  }
  componentDidMount() {
      authenticationService.currentUser.subscribe(x => {
        this.setState({ currentUser: x })
      });
  }
  componentWillUnmount() {
    this.unlisten();
  }
  logout() {
      authenticationService.logout();
      history.push('/login');
  }
  render() {
    const { classes } = this.props
    const { currentUser } = this.state;

    return (
      <div className="mainContainer">
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            {(currentUser === null ?
               (
                 <Link to={"/"} className={classes.link}>
                   <Typography className={classes.name} variant="h6">
                     CustomerApp
                   </Typography>
                 </Link>
               )
               : (
                 <Link to={"/home"} className={classes.link}>
                   <Typography className={classes.name} variant="h6">
                     AdminPanel
                   </Typography>
                 </Link>
             )
            )}
            {(currentUser !== null ?
               (
                 <div style={{ width: '100%' }}>
                   <Link to={"/login"} onClick={this.logout} style={{ float: 'right' }} className={classes.link}>
                     <Typography variant="body2">
                       Logout
                     </Typography>
                   </Link>
                   <span style={{float: 'right'}}>Hi {currentUser.name}!</span>
                 </div>
               )
               : (
                 <div style={{ width: '100%' }}>
                   <Link to={"/login"} style={{ float: 'right' }} className={classes.link}>
                   <Typography variant="body2">
                     Admin
                   </Typography>
                 </Link>
               </div>
             )
            )}

          </Toolbar>
        </AppBar>
        <SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
          <div className="content-container">
            <Switch>
              <Route exact path={["/", "/signup"]} component={SignUp} />
              <Route exact path={["/home"]} component={Home} />
              <Route exact path={["/alreadyregistered"]} component={AlreadyRegistered} />
              <Route exact path={["/login"]} component={SignIn} />
            </Switch>
          </div>
        </SnackbarProvider>
        <div className="footer">
          <Copyright />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
