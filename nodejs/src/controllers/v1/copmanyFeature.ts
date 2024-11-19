import { Request, Response, NextFunction } from "express";
import company from "../../models/company";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import mongoose from "mongoose";
import { CompanyFeaturesModel } from "../../models/company_feature";
import { config } from "../../config";

const addCompanyFeatue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const {
      cid,
      hex_code,
      pbx,
      extension,
      ring_group,
      conference,
      video_call,
      ivr,
      speech_to_text,
      phone_in_browser,
      voicemail,
      callback,
      record_calls,
      reportage,
      monitoring,
      caller_id,
      time_controls,
      whatsapp,
      calendar_integration,
      text_to_speech,
      virtual_assistant,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (cid === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company id Is Mandatory.",
      });
    }

    if (hex_code == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Hex Code Is Mandatory.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company Id Is Invalid.",
      });
    }

    let create_feature_obj: any = {
      cid,
      hex_code,
      pbx,
      extension,
      ring_group,
      conference,
      video_call,
      ivr,
      speech_to_text,
      phone_in_browser,
      voicemail,
      callback,
      record_calls,
      reportage,
      monitoring,
      caller_id,
      time_controls,
      whatsapp,
      calendar_integration,
      text_to_speech,
      virtual_assistant,
      last_updated_user: uid,
    };

    await CompanyFeaturesModel.create(create_feature_obj);

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Company Feature Added Successfully",
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const updateCompanyFeatue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const {
      cid,
      hex_code,
      pbx,
      extension,
      ring_group,
      conference,
      video_call,
      ivr,
      speech_to_text,
      phone_in_browser,
      voicemail,
      callback,
      record_calls,
      reportage,
      monitoring,
      caller_id,
      time_controls,
      whatsapp,
      calendar_integration,
      text_to_speech,
      virtual_assistant,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (cid === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company id Is Mandatory.",
      });
    }

    if (hex_code == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Hex Code Is Mandatory.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company Id Is Invalid.",
      });
    }

    const feature_detail = await CompanyFeaturesModel.findOne({
      cid,
      is_deleted: 0,
    });

    if (!feature_detail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Company Not Found.",
      });
    }

    let create_feature_obj: any = {
      cid,
      hex_code,
      pbx,
      extension,
      ring_group,
      conference,
      video_call,
      ivr,
      speech_to_text,
      phone_in_browser,
      voicemail,
      callback,
      record_calls,
      reportage,
      monitoring,
      caller_id,
      time_controls,
      whatsapp,
      calendar_integration,
      text_to_speech,
      virtual_assistant,
      last_updated_user: uid,
    };

    await CompanyFeaturesModel.findOneAndUpdate(
      { cid: cid },
      create_feature_obj,
      { new: true, runValidators: true }
    );

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Company Feature Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getFeatureDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let cid: any = data.cid;

    if (Object.keys(data).length == 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company Id Is Invalid.",
      });
    }

    let features_data = await CompanyFeaturesModel.findOne({
      cid: cid,
      is_deleted: 0,
    });

    if (features_data == null) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company Not Exists.",
      });
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Company Features Detail successfully",
      data: features_data,
    });
  } catch (error) {
    console.log(error);

    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default { addCompanyFeatue, updateCompanyFeatue, getFeatureDetail };
