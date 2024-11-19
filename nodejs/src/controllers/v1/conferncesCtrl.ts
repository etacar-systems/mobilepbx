import { NextFunction, Request, Response } from "express";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import company from "../../models/company";
import axios from "axios";
import conferncers from "../../models/conferncers";
import { sampleSize } from "lodash";
import get_token from "../../helper/userHeader";
import User_token from "../../helper/helper";
import { config } from "../../config";
import pstn_number from "../../models/pstn_number";

const toBoolean = (value:any) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const createConferference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let cid: any = user_detail?.cid;

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let company_details: any = await company.findOne({ _id: cid, is_deleted: 0 });
    if (!company_details) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Please Select Domain.",
      });
    }
  
    let conferenceCount = await conferncers.find({cid:cid, is_deleted: 0 }).countDocuments()
    
    if(company_details?.conference_count === conferenceCount){
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: `You can't create more than ${company_details?.conference_count} conferences`,
      });
    }

    let conference_name: any = data?.conference_name;
    let conference_description: any = data?.conference_description;
    let conference_pin: any = data?.conference_pin;
    let conference_record: any = data?.conference_record;
    let extension_number: any = data?.extension_number;
    let conference_profile: any = data?.conference_profile;
    let conference_flags: any = data?.conference_flags;
    let conference_record_parse:any = toBoolean(conference_record)
    let conference_flags_parse:any = toBoolean(conference_flags)

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }
    if (conference_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_name is Mandatory",
      });
    }
    if (!REGEXP.conference.conference_name.test(conference_name)) {
      return res.status(400).send({
        success: 0,
        message: "conference_name is Invalid",
      });
    }
    if (conference_description == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_description is Mandatory",
      });
    }
    if (
      !REGEXP.conference.conference_description.test(conference_description)
    ) {
      return res.status(400).send({
        success: 0,
        message: "conference_description is Invalid",
      });
    }

    if (conference_pin == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_pin is Mandatory",
      });
    }
    if (extension_number == undefined) {
      return res.status(400).send({
        success: 0,
        message: "extension_number is Mandatory",
      });
    }

    if (!REGEXP.conference.extension_number.test(extension_number)) {
      return res.status(400).send({
        success: 0,
        message: "extension_number is Invalid",
      });
    }
    if (conference_flags == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_flags is Mandatory",
      });
    }
    if (conference_profile == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_profile is Mandatory",
      });
    }

    if (conference_record == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_record is Mandatory",
      });
    }

    if (conference_record_parse == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_record is Invalid",
      });
    }
    
    if (conference_flags_parse == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_flags is Invalid",
      });
    }

    const companyDetail = await company.findOne({ _id: cid, is_deleted: 0 });

    if (!companyDetail?.domain_uuid) {
      return res.status(400).send({
        success: 0,
        message: "company not found",
      });
    }

    const conferenceData = await conferncers.findOne({
      extension_number: extension_number,
      cid: companyDetail?._id,
      is_deleted: 0,
    });

    if (conferenceData) {
      return res.status(400).send({
        success: 0,
        message: "Extension Number Already Exist",
      });
    }

    let conferenceObj: any = {
      conference_name: conference_name,
      conference_description: conference_description,
      conference_pin: conference_pin,
      conference_record: conference_record,
      extension_number: extension_number,
      cid: cid,
      conference_profile: "default",
      conference_flags: conference_flags,
      conference_account_code: companyDetail?.domain_name,
      conference_context: companyDetail?.domain_name,
      last_updated_user: user_detail?.uid,
    };

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.CONFERENCE.ADD,
      auth: config.PBX_API.AUTH,
      data: {
        name: conference_name,
        extension: extension_number,
        domain: companyDetail?.domain_uuid,
        pin_number: conference_pin,
        description: conference_description,
        conference_enabled:"true",
        conference_profile: "default",
        conference_flags: conference_flags,
        conference_account_code: companyDetail?.domain_name,
        conference_context: companyDetail?.domain_name,
        record:conference_record,
        wait_mod:conference_flags
      },
    };
   
    try {
      const data: any = await axios.request(api_config);
      console.log("data",data)

      if (data?.data?.id) {
        conferenceObj.conference_uuid = data?.data?.id;
        await conferncers.create(conferenceObj);

        return res.status(200).send({
          success: 1,
          message: "Conference Created Successfully",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.message || "Failed to create conference",
        });
      }
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to create conference",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: "Internal server error",
    });
  }
};

const editConferference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let cid: any = user_detail?.cid;

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let conference_id = data?.conference_id;
    let conference_name: any = data?.conference_name;
    let conference_description: any = data?.conference_description;
    let conference_pin: any = data?.conference_pin;
    let conference_record: any = data?.conference_record;
    let extension_number: any = data?.extension_number;
    let conference_profile: any = data?.conference_profile;
    let conference_flags: any = data?.conference_flags;
    let conference_record_parse:any = toBoolean(conference_record)
    let conference_flags_parse:any = toBoolean(conference_flags)


    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(conference_id)) {
      return res.status(400).send({
        success: 0,
        message: "conference id invalid",
      });
    }
    if (conference_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_name is Mandatory",
      });
    }
    if (!REGEXP.conference.conference_name.test(conference_name)) {
      return res.status(400).send({
        success: 0,
        message: "conference_name is Invalid",
      });
    }
    if (conference_description == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_description is Mandatory",
      });
    }
    if (
      !REGEXP.conference.conference_description.test(conference_description)
    ) {
      return res.status(400).send({
        success: 0,
        message: "conference_description is Invalid",
      });
    }
    if (conference_pin == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_pin is Mandatory",
      });
    }
    if (extension_number == undefined) {
      return res.status(400).send({
        success: 0,
        message: "extension_number is Mandatory",
      });
    }
    if (!REGEXP.conference.extension_number.test(extension_number)) {
      return res.status(400).send({
        success: 0,
        message: "extension_number is Invalid",
      });
    }

    if (conference_flags == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_flags is Mandatory",
      });
    }
    if (conference_profile == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_profile is Mandatory",
      });
    }
    if (conference_record == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_record is Mandatory",
      });
    }

    if (conference_record_parse == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_record is Invalid",
      });
    }
    
    if (conference_flags_parse == undefined) {
      return res.status(400).send({
        success: 0,
        message: "conference_flags is Invalid",
      });
    }


    const conferenceDetail = await conferncers.findOne({
      _id: conference_id,
      is_deleted: 0,
    });

    if (!conferenceDetail) {
      return res.status(400).send({
        success: 0,
        message: "conference not found",
      });
    }

    const companyDetail = await company.findOne({ _id: cid, is_deleted: 0 });

    if (!companyDetail?.domain_uuid) {
      return res.status(400).send({
        success: 0,
        message: "company not found",
      });
    }

    const conferenceData = await conferncers.findOne({
      _id: { $ne: conference_id },
      extension_number: extension_number,
      cid: companyDetail?._id,
      is_deleted: 0,
    });

    if (conferenceData) {
      return res.status(400).send({
        success: 0,
        message: "Extension Number Already Exist",
      });
    }

    let conferenceObj: any = {
      conference_name: conference_name,
      conference_description: conference_description,
      conference_pin: conference_pin,
      conference_record: conference_record,
      extension_number: extension_number,
      cid: cid,
      conference_profile: conference_profile,
      conference_flags: conference_flags,
      conference_account_code: companyDetail?.domain_name,
      conference_context: companyDetail?.domain_name,
      last_updated_user: user_detail?.uid
    };

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.CONFERENCE.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        name: conference_name,
        extension: extension_number,
        domain: companyDetail?.domain_uuid,
        pin_number: conference_pin,
        description: conference_description,
        conference_enabled:"true",
        conference_id: conferenceDetail?.conference_uuid,
        conference_profile: conference_profile,
        conference_flags: conference_flags,
        conference_account_code: companyDetail?.domain_name,
        conference_context: companyDetail?.domain_name,
        record:conference_record,
        wait_mod:conference_flags
      },
    };
    console.log("api_config",api_config)
    try {
      const data: any = await axios.request(api_config);

      if (data) {
        await conferncers.findByIdAndUpdate(
          {
            _id: conference_id,
          },
          conferenceObj,
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(200).send({
          success: 1,
          message: "Conference updated Successfully",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.msg || "Failed To Update Conference",
        });
      }
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to update conference",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: "Internal server error",
    });
  }
};

const deleteConference = async (
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
    let conference_id: any = data?.conference_id;

    if (!mongoose.Types.ObjectId.isValid(conference_id)) {
      return res.status(400).send({
        success: 0,
        message: "conference id invalid",
      });
    }

    const conferenceDetail = await conferncers.findOne({ _id: conference_id });

    if (!conferenceDetail) {
      return res.status(400).send({
        success: 0,
        message: "conference not found",
      });
    }

    let api_config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${config.PBX_API.CONFERENCE.REMOVE}${conferenceDetail?.conference_uuid}`,
      auth: config.PBX_API.AUTH,
    };

    try {
      const data: any = await axios.request(api_config);

      if (data) {
        const updated_data: any = await conferncers.findByIdAndUpdate(
          {
            _id: conference_id,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        await pstn_number.updateOne(
          {
            select_type_uuid: conferenceDetail?.conference_uuid,
          },
          {
            isassigned: 0,
            destination_action: [],
            select_type_data: {},
            select_type: "",
            select_type_uuid: "",
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );

        return res.status(200).send({
          success: 1,
          message: "Conference Deleted successfully",
        });
      }
    } catch (error: any) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to delete company",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: "Internal server error",
    });
  }
};

const conferenceGetById = async (
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

    let conference_id: any = data?.conference_id;

    if (!mongoose.Types.ObjectId.isValid(conference_id)) {
      return res.status(400).send({
        success: 0,
        message: "conference id invalid",
      });
    }

    const conferenceDetail = await conferncers.findOne({
      _id: conference_id,
      is_deleted: 0,
    });

    if (!conferenceDetail) {
      return res.status(400).send({
        success: 0,
        message: "conference not found",
      });
    }

    return res.status(200).send({
      success: 1,
      message: "Conference get successfully",
      conferenceDetail: conferenceDetail,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: "Internal server error",
    });
  }
};

const conferenceList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;

    const token = await get_token(req);
    const user_detail = await User_token(token);
    let cid: any = user_detail?.cid;

    let page: any = data?.page;
    let size: any = data?.size;
    let search: any = data?.search?.toString();

    if (!page) return (page = 1);
    if (!size) return (size = 20);

    let limit: any = parseInt(size);
    let skip: any = (page - 1) * size;

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }
    let find_query: { [key: string]: any } = {};

    if (search) {
      find_query = {
        is_deleted: 0,
        cid: cid,
        $or: [
          {
            conference_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            conference_description: {
              $regex: search,
              $options: "i",
            },
          },
          {
            extension_number: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    } else {
      find_query = {
        is_deleted: 0,
        cid: cid,
      };
    }

    const conferenceDetail = await conferncers
      .find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const countDocuments = await conferncers.find(find_query).countDocuments();

    const total_page_count = Math.ceil(countDocuments / size);

    return res.status(200).send({
      success: 1,
      message: "Conference list get successfully",
      userData: conferenceDetail,
      total_page_count: total_page_count,
      conference_total: countDocuments,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: "Internal server error",
    });
  }
};

const getConferenceProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.CONFERENCE.PROFILE,
      auth: config.PBX_API.AUTH,
    };
    try {
      const data: any = await axios.request(api_config);
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        data: data?.data,
      });
    } catch (error: any) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed to get conference profile",
      });
    }
  } catch (error: any) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default {
  createConferference,
  editConferference,
  deleteConference,
  conferenceGetById,
  conferenceList,
  getConferenceProfile,
};
