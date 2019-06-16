import { createAction } from 'redux-actions';
import config from '../../config/config.json';
import { deleteCookie } from '../lib/cookies';

const apiUrl = config.api.host;

export const updNickname = createAction('UPD_NICKNAME');
export const updUserToken = createAction('UPD_USER_TOKEN');
export const updUserNickname = createAction('UPD_USER_NICKNAME');
export const updUserList = createAction('UPD_USER_LIST');
export const addUserToList = createAction('ADD_USER_TO_LIST');
export const deleteUserFromList = createAction('DELETE_USER_FROM_LIST');
export const updMessageList = createAction('UPD_MESSAGE_LIST');
export const addMessageToList = createAction('ADD_MESSAGE_TO_LIST');
export const updMessageText = createAction('UPD_MESSAGE_TEXT');

export const login = (token) => async(dispatch) => {
  if (!token) {
    console.error('Missing token');
    return;
  }
  let data = {
    method: 'GET',
    json: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }
  const jsonResponse = await fetch(`${apiUrl}/user/login?token=${token}`, data);
  const result  = await jsonResponse.json();
  if (result && result.code === 200) {
    dispatch(updUserNickname({ nickname: result.result.nickname }));
    dispatch(updUserToken({ token: result.result.token }));
    return result;
  } else {
    dispatch(updUserNickname({ nickname: '' }));
    dispatch(updUserToken({ token: null }));
    deleteCookie('token');
    return null;
  }
};