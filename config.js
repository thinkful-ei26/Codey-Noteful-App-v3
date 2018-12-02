'use strict';
//'mongodb://localhost:27017/noteful' for local env
const keys = require('./keys');

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || keys.MONGO_DB,
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://admin:password1@ds031792.mlab.com:31792/noteful-dev'
};