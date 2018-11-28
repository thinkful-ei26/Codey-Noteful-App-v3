'use strict';
//'mongodb://localhost:27017/noteful'
module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://admin:password1@ds119394.mlab.com:19394/notes',
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://admin:password1@ds119394.mlab.com:19394/notes'
};