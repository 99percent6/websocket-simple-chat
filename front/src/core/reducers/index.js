import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';
import { omit } from 'lodash';

const login = handleActions({
  [actions.updNickname](state, { payload: { nickname } }) {
    return {
      ...state,
      nickname,
    };
  }
}, { nickname: '' });

const user = handleActions({
  [actions.updUserToken](state, { payload: { token } }) {
    return {
      ...state,
      token,
    };
  },
  [actions.updUserNickname](state, { payload: { nickname } }) {
    return {
      ...state,
      nickname,
    };
  },
  [actions.updUserList](state, { payload: { list } }) {
    let userList = {}
    list.forEach(name => {
      userList = { [name]: name, ...userList };
    });
    return {
      ...state,
      list: userList,
    };
  },
  [actions.addUserToList](state, { payload: { user } }) {
    let userList = {[user]: user, ...state.list};
    return {
      ...state,
      list: userList,
    };
  },
  [actions.deleteUserFromList](state, { payload: { user } }) {
    return {
      ...state,
      list: omit(state.list, [user]),
    };
  },
}, { token: null, nickname: '', list: {} });

const messages = handleActions({
  [actions.updMessageList](state, { payload: { messages } }) {
    return {
      ...state,
      list: messages,
    };
  },
  [actions.addMessageToList](state, { payload: { message } }) {
    return {
      ...state,
      list: [message, ...state.list],
    };
  },
  [actions.updMessageText](state, { payload: { text } }) {
    return {
      ...state,
      text,
    };
  },
}, { list: [], text: '' });

export default combineReducers({
  login,
  user,
  messages,
});