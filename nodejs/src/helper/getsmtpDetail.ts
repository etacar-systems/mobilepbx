import mongoose from "mongoose";
import smtp from "../models/smtp";


interface smtpData{
    mail_host:string;
    port:String;
    auth_user:String;
    auth_password:any;
    is_auth:any;
    auth_method:any;
    sendgrid_auth:any;
    sendgrid_token:any;
  }

const getsmtpDetail = async ()=>{
    const get_smtp_detail = await smtp.findOne({
    })

    if(get_smtp_detail !== null){

        let get_mailhost:any = get_smtp_detail?.smtp_server.split(":");
        let mailhsot:any = get_mailhost[0];
        let mail_port:any = get_mailhost[1];
        const smtp_Data:smtpData={
            mail_host:mailhsot,
            port:mail_port,
            auth_user:get_smtp_detail?.user_name,
            auth_password:get_smtp_detail?.password,
            is_auth:get_smtp_detail?.is_auth,
            auth_method:get_smtp_detail?.auth_method,
            sendgrid_auth:get_smtp_detail?.sendgrid_auth,
            sendgrid_token:get_smtp_detail?.sendgrid_token
        }
        return smtp_Data 
    }
} 

export default getsmtpDetail;