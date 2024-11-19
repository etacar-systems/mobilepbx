import { Request, Response, NextFunction } from "express";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import axios from "axios";
import { config } from "../../config";
import company from "../../models/company";
import mongoose from "mongoose";

const getDropdown = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }
    let cid: any = user_detail?.cid;

    const company_details = await company.findById(cid);
    if (!company_details) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "company dose not exist",
      });
    }

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.DROPDOWN.GET,
      auth: config.PBX_API.AUTH,
      data: {
        domain_id: company_details?.domain_uuid,
      },
    };

    try {
      const data: any = await axios.request(api_config);
      // console.log(data);
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "Dropdown Data fetched successfully",
        data: data.data,
      });
    } catch (error: any) {
      console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getDropdownByCid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let data: any = req.body;

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }
    let cid: any = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "company dose not exist",
      });
    }
    const company_details: any = await company.findById(cid);
    if (company_details) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.DROPDOWN.GET,
      auth: config.PBX_API.AUTH,
      data: {
        domain_id: company_details?.domain_uuid,
      },
    };

    try {
      const data: any = await axios.request(api_config);
      // console.log(data);
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "Dropdown Data fetched successfully",
        data: data.data,
      });
    } catch (error: any) {
      console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getRingBackDropdown = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let cid: any = user_detail?.cid;

    const company_details = await company.findById(cid);
    if (!company_details) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "company dose not exist",
      });
    }

    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.DROPDOWN.RING_BACK + company_details?.domain_uuid,
      auth: config.PBX_API.AUTH,
    };

    try {
      const data: any = await axios.request(api_config);
      // console.log(data);
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "Dropdown Data fetched successfully",
        data: data.data,
      });
    } catch (error: any) {
      console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getSoundDropdown = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }
    let cid: any = user_detail?.cid;

    const company_details = await company.findById(cid);
    if (!company_details) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "company dose not exist",
      });
    }

    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.DROPDOWN.SOUND + company_details?.domain_uuid,
      auth: config.PBX_API.AUTH,
    };

    try {
      const data: any = await axios.request(api_config);
      // console.log(data);
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "Dropdown Data fetched successfully",
        data: data.data,
      });
    } catch (error: any) {
      console.log(error, "11");
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default {
  getDropdown,
  getDropdownByCid,
  getRingBackDropdown,
  getSoundDropdown,
};
