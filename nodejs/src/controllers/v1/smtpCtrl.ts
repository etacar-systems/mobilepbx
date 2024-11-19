import { NextFunction, Request, Response } from "express";
import { config } from "../../config";
import mongoose from "mongoose";
import user from "../../models/user";
import constant from "../../constant";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import smtp from "../../models/smtp";

const UpdateSmtpDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { provider, smtp_server, user_name, password, smtp_port,sendgrid_auth,sendgrid_token } = req.body;

    const checkFiled = {
      provider: "Provider",
      smtp_server: "SMTP Server",
      user_name: "User Name",
      password: "Password",
      smtp_port: "SMTP Port",
      sendgrid_auth:"Sendgrid Auth"
    };

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    for (const [field, name] of Object.entries(checkFiled)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    if (!REGEXP.COMMON.EMAIL.test(user_name)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Name Is Invalid !!",
      });
    }

    if (!REGEXP.COMMON.PORT.test(smtp_port)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "SMTP Port Is Invalid !!",
      });
    }
    if (!REGEXP.COMMON.BOOLEAN.test(sendgrid_auth)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Sendgrid Auth Is Invalid !!",
      });
    }

    if(sendgrid_auth && sendgrid_token == ""){
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Sendgrid Token Is Invalid !!",
      });
    }
    
    let sendgrid_token_tmp:any = "";
    if(sendgrid_auth && sendgrid_token !== ""){
      sendgrid_token_tmp = sendgrid_token
    }
    let check_smtp_already_exists:any = await smtp.find()
    let update_obj:any = 
      {
        provider,
        smtp_server,
        user_name,
        password,
        smtp_port,
        sendgrid_auth,
        sendgrid_token:sendgrid_token_tmp
      }
    
    if(check_smtp_already_exists.length > 0){
        let smtp_detail:any = check_smtp_already_exists[0]

        let update_smtp_detail: any = await smtp.findByIdAndUpdate(
          { _id: smtp_detail._id },
          update_obj,
          {new: true }
        );
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "SMTP Detail Updated Successfully",
          SMTPDetail: update_smtp_detail,
        });
    }else{
      let update_smtp_detail: any = await smtp.create(update_obj)

      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "SMTP Detail Updated Successfully",
        SMTPDetail: update_smtp_detail,
      });
    }
   
  } catch (error) {
    console.log("error",error)
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const GetSmtpDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let smtp_detail:any = await smtp.findOne()
    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "SMTP Detail",
      SMTPDetail: smtp_detail,
    });
  } catch (error) {
    console.log("error",error)
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

export default {
  UpdateSmtpDetail,
  GetSmtpDetail
};
