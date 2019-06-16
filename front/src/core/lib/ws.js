import config from '../../config/config.json';

export const webSocket = (function () {
  return new WebSocket(config.api.socket);
})();