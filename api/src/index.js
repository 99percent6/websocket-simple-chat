#!/usr/bin/env node
import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import api from './api';
import config from '../config/config.json';
import Redis from './lib/redis';

const redisClient = new Redis({ expire: 3600 });

const app = express();
const expressWs = require('express-ws')(app);
const port = 8080;

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

app.get('/', (request, response) => {
  response.send('Hello!');
});

app.use('/api', api({ config, redisClient }));

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});