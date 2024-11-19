import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

const sendMailSendGrid = async (emailData:any,isauth:any,sendgrid_token:any) =>{
  try {
    sgMail.setApiKey(sendgrid_token)
    console.log("sendgrid send push dunction called",emailData.to,emailData.from,emailData.subject)
      const msg = {
        to: emailData.to,
        from:emailData.from,
        subject: emailData.subject,
        text: 'This is a test email using SendGrid.',
        html: emailData.html,
      };
    
      try {
        const response = await sgMail.send(msg);
        console.log('Email sent successfully:', response[0].statusCode);
      } catch (error:any) {
        console.error('Error sending email:', error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    
  } catch (error) {
    console.log("error",error)
  }
}
export default sendMailSendGrid
