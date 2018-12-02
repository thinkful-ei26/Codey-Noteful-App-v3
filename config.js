'use strict';
//'mongodb://localhost:27017/noteful' for local env
//const keys = require('./keys'); **commented out for travisci**

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI /**||  keys.MONGODB*/,
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI /**|| keys.TEST_MONGODB_URI*/
};