import React, { Component } from 'react';
import { withStyles } from "@material-ui/core";
import { styles } from "../../css-common";
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

class AlreadyRegistered extends Component {

    constructor(props) {
        super(props);
        if(!localStorage.getItem('registeredUser')){
          this.props.history.push('/signup');
        }
    }
    clearAlreadyRegistered(e) {
      localStorage.removeItem('registeredUser');
      this.props.history.push('/signup');
    }
    render() {
      const { classes } = this.props;
      return (
        <React.Fragment>
          <div className="main-container-msg">
            <div className="container-msg">
              <div className="title1">
                Thank you
              </div>
              <div className="title2">
                You are registered
              </div>
              <Link to={"/signup"} onClick={(e) => this.clearAlreadyRegistered(e)} className={classes.link} style={{cursor: 'pointer'}}>
                <Typography className={classes.name} variant="h6" >
                  Register Again
                </Typography>
              </Link>
            </div>
          </div>
        </React.Fragment>
      );
    }
}
export default withStyles(styles)(AlreadyRegistered)
