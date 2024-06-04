const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "shadiyana.info@gmail.com",
        pass: "vxew ltjt iawu hvwi"
    }
});

module.exports = transporter;