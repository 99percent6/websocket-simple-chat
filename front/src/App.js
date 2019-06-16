import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import Home from './pages/Home';
import Chat from './pages/Chat';
import './App.css';
import { getCookie, setCookie } from './core/lib/cookies';
import * as actions from './core/actions';
import { webSocket } from './core/lib/ws';

const mapStateToProps = (state) => {
  const props = {};
  return props;
};

const actionCreators = {
  updNickname: actions.updNickname,
  updUserNickname: actions.updUserNickname,
  updUserToken: actions.updUserToken,
  login: actions.login,
  updUserList: actions.updUserList,
  deleteUserFromList: actions.deleteUserFromList,
  updMessageList: actions.updMessageList,
};

class App extends Component {
  constructor(props) {
    super(props);
    const token = getCookie('token');
    const {
      login,
      updUserToken,
      updUserList,
      updMessageList,
      updNickname,
      updUserNickname,
      deleteUserFromList,
    } = props;
    if (token) {
      updUserToken({ token });
      login(token);
    }

    webSocket.onopen = () => {
      if (token) {
        const data = {
          type: 'login',
          data: token,
        };
        webSocket.send(JSON.stringify(data));
      }
    };

    webSocket.onmessage = (event) => {
      try {
        let data = JSON.parse(event.data);

        if (data.type === 'registration') {
          updNickname({ nickname: '' });
          updUserNickname({ nickname: data.data.nickname });
          updUserToken({ token: data.data.token });

          const expire = 1000 * 60 * 60 * 24;
          setCookie('token', data.data.token, { expires: new Date(Date.now() + expire) });
        } else if (data.type === 'newUser') {
          updUserList({ list: data.data.userNames });
          updMessageList({ messages: data.data.messageHistory });
        } else if (data.type === 'userLeft') {
          deleteUserFromList({ user: data.data.nickname });
          updMessageList({ messages: data.data.messageHistory });
        } else if (data.type === 'newMessage') {
          updMessageList({ messages: data.data.messageHistory });
        }
      } catch (error) {
        console.error(error);
      }
    };

    webSocket.onclose = function(event) {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };
  }

  render() {
    return (
      <div className="app-container">
        <Router>
          <Route path="/" exact component={Home}/>
          <Route path="/chat" component={Chat}/>
        </Router>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(App);
