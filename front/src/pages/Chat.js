import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../core/actions';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { webSocket } from '../core/lib/ws';

const mapStateToProps = (state) => {
  const { user, messages } = state;
  const props = {
    nickname: user.nickname,
    token: user.token,
    userList: user.list,
    messageList: messages.list,
    messageText: messages.text,
  };
  return props;
};

const actionCreators = {
  updMessageText: actions.updMessageText,
};

const styles = theme => ({
  chatContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexWrap: 'wrap',
  },
  chat: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexBasis: '79%',
    height: '80vh',
    borderRight: '1px solid',
    borderBottom: '1px solid',
  },
  users: {
    flexBasis: '20%',
    height: '80vh',
    borderBottom: '1px solid',
  },
  input: {
    flexBasis: '100%',
    height: '20vh',
  },
  textField: {
    width: '100%',
  },
});

class Chat extends Component {
  constructor(props) {
    super(props);
    const { token, history } = props;
    if (!token) {
      history.replace({ pathname: '/' });
    }
  }

  renderUserList = () => {
    const { userList } = this.props;
    const users = Object.values(userList);
    return (
      <ul>
        {
          users.map(user => {
            return (
              <li key={user}>{user}</li>
            );
          })
        }
      </ul>
    );
  }

  renderMessageList = () => {
    const { messageList } = this.props;
    return messageList.map((message, index) => {
      return (
        <div key={index}>
          <span>{message.createdAt} </span>
          <span> {message.message}</span>
        </div>
      );
    })
  }

  handleChange = (event) => {
    const { target } = event;
    const { updMessageText } = this.props;
    updMessageText({ text: target.value });
  }

  handleKeyPress = (e) => {
    const event = e;
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage = () => {
    const { messageText, nickname, updMessageText } = this.props;
    const messageToSend = {
      type: 'message',
      data: {
        author: nickname,
        message: messageText,
      },
    };
    updMessageText({ text: '' });
    webSocket.send(JSON.stringify(messageToSend));
  }

  render() {
    const { classes, messageText } = this.props;

    return (
      <div className={classes.chatContainer}>
        <div className={classes.chat}>
          {this.renderMessageList()}
        </div>
        <div className={classes.users}>
          {this.renderUserList()}
        </div>
        <div className={classes.input}>
          <TextField
            value={messageText}
            id="filled-name"
            label="Ваше сообщение"
            placeholder="Начните вводить текст..."
            className={classes.textField}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            margin="normal"
            variant="filled"
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Chat));