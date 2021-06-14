const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'doorim97@gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'doorim97@gmail.com',
        pass: 'a@8856018',
    },
});

module.exports = {transporter};