const express = require('./config/express');
const {logger} = require('./config/winston');
let port;

// prod server pm2 start command: NODE_ENV=production pm2 start index.js
// dev server pm2 start command: NODE_ENV=development pm2 start index.js
if (process.env.NODE_ENV === "development"){
    port = 3000;
}else {
    port = 9000;
}

express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);