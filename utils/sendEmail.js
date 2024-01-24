const nodeMailer = require("nodemailer");
// options are pass as arg from userController
const sendEmail = async (options) => {

    const testAecount =nodeMailer.createTestAccount()
    const transporter = nodeMailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alfonzo75@ethereal.email',
            pass: 'kpdERmsJAhsnmUYcjn'
        }
    });


    const mailOptions = {
        from: 'pronobroy3601@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message, 
    };

    await transporter.sendMail(mailOptions);

   
}
module.exports = sendEmail;