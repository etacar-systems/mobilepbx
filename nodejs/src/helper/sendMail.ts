import nodemailer from "nodemailer";

const sendMail = async (emailData:any,isauth:any) =>{
  try {
    if(isauth == 1){
      const transporter = nodemailer.createTransport({
        host: emailData.host,
        port: emailData.port,
        secure: true,
        requireTLS: true,
        logger: true,
        auth: {
          user: emailData.username,
          pass: emailData.password,
        },
        tls: {
          rejectUnauthorized: false,
        }
      }); 
  
      const info = await transporter.sendMail({
        from:emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        headers: { 'x-myheader': emailData.title }
      });
      console.log("send email info",info)
    }else{
      const transporter = nodemailer.createTransport({
        host: emailData.host,
        port: emailData.port,
        secure: false,
        logger: true,
        tls: {
          rejectUnauthorized: false,
        }
      }); 
  
      const info = await transporter.sendMail({
        from:emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        headers: { 'x-myheader': emailData.title }
      });
      console.log("send email info",info)
    } 
  } catch (error) {
    console.log("error",error)
  }
}
export default sendMail
