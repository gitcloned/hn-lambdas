const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'xxxxx@gmail.com',
        pass: 'xxxxxxxxxx',
    },
});

function sendEmail(to, subject, message) {
    const mailOptions = {
        from: 'xxxxx@gmail.com',
        to: 'xxxxxxxx@gmail.com',
        subject: 'Test Mail',
        html: message,
    };
    transport.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
        }
    });
};

sendEmail('', '', 'Hello');