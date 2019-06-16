import redis from 'redis';
import jsonify from 'redis-jsonify';
import config from '../../config/config.json';

class RedisWrapper {
  constructor (params) {
    this.instance = jsonify(redis.createClient(config.redis));
    this.expirePeriod = params.expire || 86400;
    jsonify.blacklist.push('expire');

    this.connected = '';
    this.instance.on('error', (error) => {
      this.connected = false;
      console.error('Redis connection error', error.message);
    }).on('ready', () => {
      console.log('Redis connected');
      this.connected = true;
    });
  }

  set (key, value, expireTime) {
    this.instance.set(key, value);
    this.instance.expire(key, expireTime || this.expirePeriod);
  }

  setExpireTime (cacheKey, seconds) {
    this.instance.expire(cacheKey, seconds);
  }

  get (cacheKey) {
    return new Promise((resolve, reject) => {
      if (this.isConnected()) {
        return this.instance.get(cacheKey, function(err, reply) {
          return resolve(reply || null);
        });
      } else {
        console.error('Redis disconnected...');
        return resolve(null);
      }
    })
  }

  isConnected () {
    return this.connected;
  }

  removeBy (key) {
    this.instance.del(key);
  }
}

module.exports = RedisWrapper;
