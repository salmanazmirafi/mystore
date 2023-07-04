const nodemailer = require("nodemailer");


const sendEmail  =async (email, subject, message)=>{

    const transporter =  nodemailer.createTransport({
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from:process.env.EMAIL_USER,
        to:email,
        subject:subject,
        text:message
    }
    // send mail
   const response  =  await  transporter.sendMail(mailOptions);
   
    return response;

}
// export 
module.exports = sendEmail;