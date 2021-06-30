const express = require('./config/express');
const {logger} = require('./config/winston');
let port;

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development"){
    port = 3000;
}else {
    port = 9000;
}

express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);