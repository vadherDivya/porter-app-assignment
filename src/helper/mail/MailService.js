const nodemailer = require('nodemailer');
require('dotenv').config();

class MailService {
    static async sendMail(subject, html, to, cc, bcc) {
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            cc: cc,
            bcc: bcc,
            subject: subject,
            html: html,
        };

        try {
            let info = await mailTransporter.sendMail(mailOptions);
            return info;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = MailService;
