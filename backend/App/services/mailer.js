const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();


async function sendEmail(from, to, subject, text, html) {

    try {
        
        let transport = nodemailer.createTransport({
            sendMail: true,
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD,
            }
        });

        let emailMessage = {
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        await transport.sendMail(emailMessage);
        console.log('Email has been sent successfully please check your email');

    } catch (error) {
        console.log('We are sorry the mail has not been sent');
        console.log('Something went wrong : ' + error);
    }
}

module.exports.sendEmail = sendEmail;