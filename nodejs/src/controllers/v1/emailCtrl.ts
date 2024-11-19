import { Request, Response } from "express";
import email from "../../models/email";
import mongoose from "mongoose";
import { config } from "../../config";

const validateEmail = (email:string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const emailList = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const enterprise_id = req.query.enterprise_id as string | undefined;

    const filter: any = { is_deleted: 0 };
    if (enterprise_id) {
      filter.enterprise_id = enterprise_id;
    }
    if (search) {
      filter.from = { $regex: new RegExp(`.*${search}.*`, "i") };
    }

    const data = await email.find(filter, { is_deleted: 0 });

    res
      .status(config.RESPONSE.STATUS_CODE.SUCCESS)
      .send({ success: 1, message: "Successfully fetched email list.", emaillist: data });
  } catch (err) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getEmail = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({ success: 0, message: "Invalid ObjectId" });
    }

    const data = await email.findOne({ _id: req.params.id, is_deleted: 0 }, { is_deleted: 0 });

    if (!data) {
      return res
        .status(config.RESPONSE.STATUS_CODE.INVALID_FIELD)
        .send({ success: 0, message: `Email not found` });
    }
    res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({ success: 0, message: "Successfully fetched email", emaildata: data });
  } catch (err) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
 const updateEmail = async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({ success: 0, message: "Invalid ObjectId" });
  }
  const {
    sender_name,
    from,
    replay_to,
    subject,
    message,
    action_url
  } = req.body;


  if (Object.keys(req.body).length === 0) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Request Body Params Is Empty",
    });
  }

  const requiredFields = {
    sender_name:"Sender Name",
    from:"From",
    replay_to:"Replay To",
    subject:"Subject",
    message:"Message"
  };


  for (const [field, name] of Object.entries(requiredFields)) {
    if (req.body[field] === undefined || req.body[field] === null) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `${name} Is Mandatory.`,
      });
    }
  }

  if (!validateEmail(from)) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({ success: 0, message: "Invalid email address" });
  }
  const data = await email.findOne({ _id: req.params.id, is_deleted: 0 }, { is_deleted: 0 });
  if (!data) {
    return res
      .status(config.RESPONSE.STATUS_CODE.INVALID_FIELD)
      .send({ success: 0, message: `document with id ${req.params.id} not found` });
  }
  const newEmail = {
    sender_name,
    from,
    replay_to,
    subject,
    message,
    action_url
  };
  try {
    const email_tmp = await email.findByIdAndUpdate(req.params.id, newEmail, {
      new: true,
      select: { is_deleted: 0 },
    });
    res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({ success: 0, message: "Successfully Updated email", emaildata: email_tmp });
  } catch (err) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

export default {
    emailList,
    getEmail,
    updateEmail
}
