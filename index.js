const app = require('../server'); // import Express app dari server.js
const serverless = require('serverless-http');

module.exports = serverless(app);