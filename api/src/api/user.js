import { Router } from 'express';

export default ({ config, redisClient }) => {
  const api = Router();

  api.get('/login', async function(req, res) {
    const { token } = req.query;
    if (!token) {
      return res.send({result: 'Missing required field', code: 500}).status(500);
    }
    const user = await redisClient.get(token);
    if (user) {
      return res.send({result: user, code: 200}).status(200);
    } else {
      return res.send({result: 'User not authorized', code: 401}).status(401);
    }
  });

  return api;
};