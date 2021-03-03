const nodemailer = require('nodemailer');
const config = require('./config/config');


function sendEmail(data) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.emailUN,
            pass: config.emailPW
        }
    });

    var mailOptions = {
        from: 'loanfyService@gmail.com',
        to: data.email,
        subject: 'Your Amazon item price',
        html: `
        <h2>The price is changed!</h2>
            <p>The price now is ${data.currentPrice}!</p>
            <p>Your expected price was ${data.price}</p>
            <div><a href="${data.link}">${data.link}</a></div>
        <div><h1><a href="http://localhost:3001/unsubscribe">Unsubscribe</a></h1></div>
        `
    };


    if (data !== 'unsubscribe') {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                transporter.close();
            }
            else console.log('Email sent: ' + info.response);
        });
    }
    else{
        transporter.close();
        console.log('nodemailr connection closed');
    }
}

module.exports = {
    sendEmail
}