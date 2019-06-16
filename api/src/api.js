import { Router } from 'express';
import user from './api/user';
import TokenGenerator from 'uuid-token-generator';

const tokgen = new TokenGenerator(256, TokenGenerator.BASE58);

export default ({ config, redisClient }) => {
  const api = Router();

  let clients = [];
  let userNames = [];
  let messageHistory = [];

  const setCurrentTime = () => {
    const currentTime = new Date();
    return `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
  };

  const sendDataUsers = (message) => {
    addMessageToList({
      message: message.data.message,
      createdAt: setCurrentTime(),
    });
    Object.assign(message.data, { messageHistory });
    for (let client of clients) {
      client.send(JSON.stringify(message));
    }
  };

  const addMessageToList = (message) => {
    messageHistory.push(message);
  };

  api.use('/user', user({ config, redisClient }));

  api.ws('/', function(ws, req) {

    const index = clients.push(ws) - 1;
    let userName = '';

    ws.on('message', async function(data) {
      try {
        const message = JSON.parse(data);
        if (message.type === 'registration') {
          const token = tokgen.generate();
          userName = message.data;
          userNames.push(userName);

          const userData = {
            token,
            nickname: message.data
          };
          const dataToSend = {
            type: message.type,
            data: userData
          }

          ws.send(JSON.stringify(dataToSend));
          
          const expire = 1000 * 60 * 60 * 24;
          redisClient.set(token, userData, expire);

          const messageForClients = {
            type: 'newUser',
            data: {
              userNames,
              message: `В чат присоединился ${message.data}`,
              nickname: message.data
            }
          };
          sendDataUsers(messageForClients);
        } else if (message.type === 'login') {
          const token = message.data;
          if (token) {
            const user = await redisClient.get(token);
            if (user) {
              userNames.push(user.nickname);
              const messageForClients = {
                type: 'newUser',
                data: {
                  userNames,
                  message: `В чат присоединился ${user.nickname}`,
                  nickname: user.nickname
                }
              };
              sendDataUsers(messageForClients);
            } else {
              const dataToSend = {
                type: 'login',
                data: false
              };
              ws.send(JSON.stringify(dataToSend));
            }
          }
        } else if (message.type === 'message') {
          const userMessage = message.data;
          const messageForClients = {
            type: 'newMessage',
            data: {
              message: `${userMessage.author}: ${userMessage.message}`,
            },
          };

          sendDataUsers(messageForClients);
        } else {
          console.error('Unknown type message');
        }
      } catch (error) {
        console.error(error);
      }
    });

    ws.on('close', function() {
      clients.splice(index, 1);
      userNames = userNames.filter(name => name !== userName);
      const messageForClients = {
        type: 'userLeft',
        data: {
          message: `Чат покинул ${userName}`,
          nickname: userName
        }
      };
      sendDataUsers(messageForClients);
    });
  });

  return api;
};