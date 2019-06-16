import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../core/actions';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { webSocket } from '../core/lib/ws';

const mapStateToProps = (state) => {
  const { login, user } = state;
  const props = {
    nickname: login.nickname,
    token: user.token,
  };
  return props;
};

const actionCreators = {
  updNickname: actions.updNickname,
  updUserNickname: actions.updUserNickname,
  updUserToken: actions.updUserToken,
};

const styles = theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(2),
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50px',
  },
  inputWrapper: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    const { history, token } = props;

    if (token) {
      history.replace({ pathname: '/chat' });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { history, token } = this.props;
    if (nextProps.token && token !== nextProps.token) {
      history.replace({ pathname: '/chat' });
      return false;
    }
    return true;
  }

  handleChange = (event) => {
    const { target } = event;
    const { updNickname } = this.props;
    updNickname({ nickname: target.value });
  }

  handleKeyPress = (e) => {
    const event = e;
    if (event.key === 'Enter') {
      this.registrationUser();
    }
  }

  handleClick = (event) => {
    event.preventDefault();
    this.registrationUser();
  }

  registrationUser = () => {
    const { nickname } = this.props;
    if (!nickname) return;
    const data = {
      type: 'registration',
      data: nickname
    };
    webSocket.send(JSON.stringify(data));
  }

  render() {
    const { classes, nickname } = this.props;

    return (
      <div className={classes.inputContainer}>
        <div className={classes.inputWrapper}>
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item>
                <TextField
                  value={nickname}
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
                  id="input-with-icon-grid"
                  label="Your nickname"
                />
              </Grid>
            </Grid>
          </div>
          <Button variant="contained" color="secondary" onClick={this.handleClick} className={classes.button}>
            Войти
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Home));