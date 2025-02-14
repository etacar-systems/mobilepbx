import { NextFunction, Request, Response } from "express";
import IVR from "../../models/IVR";
import axios from "axios";
import { config } from "../../config";
import mongoose from "mongoose";
import get_token from "../../helper/userHeader";
import User_token from "../../helper/helper";
import company from "../../models/company";
import pstn_number from "../../models/pstn_number";

const createIVR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      extension,
      greet_long,
      greet_short,
      description,
      ivr_enabled,
      ivr_menu_parent_id,
      ivr_menu_timeout,
      ivr_menu_exit_app,
      ivr_menu_exit_data,
      ivr_menu_direct_dial,
      ivr_menu_ringback,
      ivr_menu_cid_prefix,
      ivr_menu_invalid_sound,
      ivr_menu_exit_sound,
      ivr_menu_pin_number,
      ivr_menu_confirm_macro,
      ivr_menu_confirm_key,
      ivr_menu_tts_engine,
      ivr_menu_tts_voice,
      ivr_menu_confirm_attempts,
      ivr_menu_inter_digit_timeout,
      ivr_menu_max_failures,
      ivr_menu_max_timeouts,
      ivr_menu_digit_len,
      ivr_menu_option,
    } = req.body;

    const token = await get_token(req);
    const user_detail: any = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let cid: any = user_detail?.cid;

    let company_details: any = await company.findOne({ _id: cid, is_deleted: 0 });
    if (!company_details) {
      return res.status(404).send({
        status: 0,
        message: "Company dose not exist",
      });
    }

    let ivrCount = await IVR.find({cid:cid, is_deleted: 0 }).countDocuments()
    
    if(company_details?.ivr_count === ivrCount){
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: `You can't create more than ${company_details?.ivr_count} IVRs`,
      });
    }

    // Validation
    if (name === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Name is mandatory.",
      });
    }

    if (extension === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Extension is mandatory.",
      });
    }

    if (description === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid Description is mandatory.",
      });
    }

    if (ivr_enabled === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Enabled is mandatory.",
      });
    }

    if (ivr_menu_timeout === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Timeout is mandatory.",
      });
    }

    if (ivr_menu_exit_app === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Exit App is mandatory.",
      });
    }

    if (ivr_menu_exit_data === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Exit Data is mandatory.",
      });
    }

    if (ivr_menu_direct_dial === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Menu Direct Dial is mandatory.",
      });
    }

    if (ivr_menu_ringback === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Ringback is mandatory.",
      });
    }

    if (ivr_menu_cid_prefix === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu CID Prefix is mandatory.",
      });
    }

    if (ivr_menu_invalid_sound === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Invalid Sound is mandatory.",
      });
    }

    if (ivr_menu_exit_sound === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Exit Sound is mandatory.",
      });
    }

    if (ivr_menu_pin_number === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Menu PIN Number is mandatory.",
      });
    }

    if (ivr_menu_confirm_macro === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Menu Confirm Macro is mandatory.",
      });
    }

    if (ivr_menu_confirm_key === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Menu Confirm Key is mandatory.",
      });
    }

    if (ivr_menu_tts_engine === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu TTS Engine is mandatory.",
      });
    }

    if (ivr_menu_tts_voice === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu TTS Voice is mandatory.",
      });
    }

    if (ivr_menu_confirm_attempts === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Confirm Attempts is mandatory.",
      });
    }

    if (ivr_menu_inter_digit_timeout === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Inter Digit Timeout is mandatory.",
      });
    }

    if (ivr_menu_max_failures === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Max Failures is mandatory.",
      });
    }

    if (ivr_menu_max_timeouts === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Max Timeouts is mandatory.",
      });
    }

    if (ivr_menu_digit_len === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Digit Length is mandatory.",
      });
    }

    if (greet_short === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid Greet Short is mandatory.",
      });
    }

    if (!Array.isArray(ivr_menu_option) || ivr_menu_option.length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Options are mandatory.",
      });
    }

    

    ivr_menu_option.forEach((option, index) => {
      if (
        option.menu_digit === undefined ||
        option.menu_option === undefined ||
        option.menu_param === undefined ||
        option.menu_order === undefined ||
        option.select_type === undefined ||
        option.ivr_menu_option_enabled === undefined
      ) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: `IVR Menu Option at index ${index} is invalid.`,
        });
      }
    });

    const ivrData = {
      name,
      extension,
      greet_long,
      greet_short,
      ivr_menu_parent_id: "",
      domain_id: company_details.domain_uuid,
      context: company_details.domain_name,
      description,
      ivr_enabled,
      ivr_menu_timeout,
      ivr_menu_exit_app,
      ivr_menu_exit_data,
      ivr_menu_direct_dial,
      ivr_menu_ringback,
      ivr_menu_cid_prefix,
      ivr_menu_invalid_sound,
      ivr_menu_exit_sound,
      ivr_menu_pin_number,
      ivr_menu_confirm_macro,
      ivr_menu_confirm_key,
      ivr_menu_tts_engine,
      ivr_menu_tts_voice,
      ivr_menu_confirm_attempts,
      ivr_menu_inter_digit_timeout,
      ivr_menu_max_failures,
      ivr_menu_max_timeouts,
      ivr_menu_digit_len,
      ivr_menu_option,
      last_updated_user: user_detail?.uid,
    };
    //console.log(ivr_menu_option);

    const api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.IVR.ADD,
      auth: config.PBX_API.AUTH,
      data: ivrData,
    };

    try {
      const response = await axios.request(api_config);
      const ivr_uuid = response.data?.id;
      if (ivr_uuid) {
        const newIVR = await IVR.create({
          ...ivrData,
          cid,
          ivr_uuid,
        });
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "IVR created successfully.",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: response.data?.message || "Failed to create IVR",
        });
      }
    } catch (error) {
      //console.log(error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.error("Error creating IVR:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const updateIVR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      ivr_id,
      ivr_uuid,
      name,
      extension,
      greet_long,
      greet_short,
      domain_id,
      context,
      description,
      ivr_enabled,
      ivr_menu_timeout,
      ivr_menu_exit_app,
      ivr_menu_exit_data,
      ivr_menu_direct_dial,
      ivr_menu_ringback,
      ivr_menu_cid_prefix,
      ivr_menu_invalid_sound,
      ivr_menu_exit_sound,
      ivr_menu_pin_number,
      ivr_menu_confirm_macro,
      ivr_menu_confirm_key,
      ivr_menu_tts_engine,
      ivr_menu_tts_voice,
      ivr_menu_confirm_attempts,
      ivr_menu_inter_digit_timeout,
      ivr_menu_max_failures,
      ivr_menu_max_timeouts,
      ivr_menu_digit_len,
      ivr_menu_option,
    } = req.body;

    if (ivr_id === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "ivr_id is mandatory.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(ivr_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Invalid ivr_id.",
      });
    }

    if (name === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Name is mandatory.",
      });
    }

    if (extension === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Extension is mandatory.",
      });
    }

    if (domain_id === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid Domain ID is mandatory.",
      });
    }

    if (context === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid Context is mandatory.",
      });
    }

    if (description === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid Description is mandatory.",
      });
    }

    if (ivr_enabled === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Enabled is mandatory.",
      });
    }

    if (ivr_menu_timeout === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Timeout is mandatory.",
      });
    }

    if (ivr_menu_exit_app === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Exit App is mandatory.",
      });
    }

    if (ivr_menu_exit_data === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Exit Data is mandatory.",
      });
    }

    if (ivr_menu_direct_dial === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Menu Direct Dial is mandatory.",
      });
    }

    if (ivr_menu_ringback === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Ringback is mandatory.",
      });
    }

    if (ivr_menu_cid_prefix === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu CID Prefix is mandatory.",
      });
    }

    if (ivr_menu_invalid_sound === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Invalid Sound is mandatory.",
      });
    }

    if (ivr_menu_exit_sound === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Exit Sound is mandatory.",
      });
    }

    if (ivr_menu_pin_number === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Menu PIN Number is mandatory.",
      });
    }

    if (ivr_menu_confirm_macro === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Menu Confirm Macro is mandatory.",
      });
    }

    if (ivr_menu_confirm_key === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR Menu Confirm Key is mandatory.",
      });
    }

    if (ivr_menu_tts_engine === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu TTS Engine is mandatory.",
      });
    }

    if (ivr_menu_tts_voice === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu TTS Voice is mandatory.",
      });
    }

    if (ivr_menu_confirm_attempts === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Confirm Attempts is mandatory.",
      });
    }

    if (ivr_menu_inter_digit_timeout === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Inter Digit Timeout is mandatory.",
      });
    }

    if (ivr_menu_max_failures === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Max Failures is mandatory.",
      });
    }

    if (ivr_menu_max_timeouts === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Max Timeouts is mandatory.",
      });
    }

    if (ivr_menu_digit_len === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Digit Length is mandatory.",
      });
    }

    if (greet_short === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid Greet Short is mandatory.",
      });
    }

    if (!Array.isArray(ivr_menu_option) || ivr_menu_option.length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Valid IVR Menu Options are mandatory.",
      });
    }

    ivr_menu_option.forEach((option, index) => {
      if (
        option.menu_digit === undefined ||
        option.menu_option === undefined ||
        option.menu_param === undefined ||
        option.menu_order === undefined ||
        option.select_type === undefined ||
        option.ivr_menu_option_enabled === undefined
      ) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: `IVR Menu Option at index ${index} is invalid.`,
        });
      }
    });
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let cid: any = user_detail?.cid;

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    const ivrData = {
      cid,
      name,
      extension,
      greet_long,
      greet_short,
      ivr_menu_parent_id: "",
      domain_id,
      context,
      description,
      ivr_enabled,
      ivr_menu_timeout,
      ivr_menu_exit_app,
      ivr_menu_exit_data,
      ivr_menu_direct_dial,
      ivr_menu_ringback,
      ivr_menu_cid_prefix,
      ivr_menu_invalid_sound,
      ivr_menu_exit_sound,
      ivr_menu_pin_number,
      ivr_menu_confirm_macro,
      ivr_menu_confirm_key,
      ivr_menu_tts_engine,
      ivr_menu_tts_voice,
      ivr_menu_confirm_attempts,
      ivr_menu_inter_digit_timeout,
      ivr_menu_max_failures,
      ivr_menu_max_timeouts,
      ivr_menu_digit_len,
      ivr_menu_option,
      ivr_id: ivr_uuid,
      last_updated_user: user_detail?.uid,
    };

    const api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.IVR.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        name,
        extension,
        greet_long,
        greet_short,
        ivr_menu_parent_id: "",
        domain_id,
        context,
        description,
        ivr_enabled,
        ivr_menu_timeout,
        ivr_menu_exit_app,
        ivr_menu_exit_data,
        ivr_menu_direct_dial,
        ivr_menu_ringback,
        ivr_menu_cid_prefix,
        ivr_menu_invalid_sound,
        ivr_menu_exit_sound,
        ivr_menu_pin_number,
        ivr_menu_confirm_macro,
        ivr_menu_confirm_key,
        ivr_menu_tts_engine,
        ivr_menu_tts_voice,
        ivr_menu_confirm_attempts,
        ivr_menu_inter_digit_timeout,
        ivr_menu_max_failures,
        ivr_menu_max_timeouts,
        ivr_menu_digit_len,
        ivr_menu_option,
        ivr_id: ivr_uuid,
      },
    };
    try {
      const response = await axios.request(api_config);
      const message = response.data?.msg;
      if (message !== "IVR Updated Successfully !!") {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message:
            response.data?.message || config.RESPONSE.MESSAGE.INTERNAL_SERVER,
        });
      }
      const newIVR = await IVR.findByIdAndUpdate(ivr_id, {
        ...ivrData,
        ivr_uuid,
      });

      return res.status(200).send({
        success: 1,
        message: "IVR update successfully.",
      });
    } catch (error) {
      console.error("Error Up IVR:", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.error("Error updating IVR:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const deleteIVR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Invalid MongoDB ID.",
      });
    }

    const ivr = await IVR.findById(id);
    if (!ivr) {
      return res.status(404).send({
        success: 0,
        message: "IVR not found.",
      });
    }

    const { ivr_uuid } = ivr;

    const api_config = {
      method: "delete",
      url: `${config.PBX_API.IVR.REMOVE}${ivr_uuid}`,
      auth: config.PBX_API.AUTH,
    };

    try {
      const response = await axios.request(api_config);

      if (response.data?.message !== "IVR Deleted Successfully !!") {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
        });
      }

      await IVR.findByIdAndUpdate(
        id,
        { is_deleted: 1, last_updated_user: user_detail?.uid },
        { runValidators: true }
      );

      await pstn_number.updateOne(
        {
          select_type_uuid: ivr_uuid,
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
        message: "IVR deleted successfully.",
      });
    } catch (error) {
      console.error("API call error:", error);
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

const getIVR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;

    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let cid: any = user_detail?.cid;

    let page: any = data?.page;
    let size: any = data?.size;
    let search: any = data?.search?.toString();

    if (!page) return (page = 1);
    if (!size) return (size = 20);

    let limit: any = parseInt(size);
    let skip: any = (page - 1) * size;

    let find_query: { [key: string]: any } = {};

    if (search) {
      find_query = {
        is_deleted: 0,
        cid: cid,
        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            extension: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
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

    const conferenceDetail = await IVR.find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const countDocuments = await IVR.find(find_query).countDocuments();

    const total_page_count = Math.ceil(countDocuments / size);

    return res.status(200).send({
      success: 1,
      message: "IVR list get successfully",
      data: {
        IVR: conferenceDetail,
        total_page_count: total_page_count,
        conference_total: countDocuments,
      },
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getIVRById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.body;
    const token = await get_token(req);
    const user_detail = await User_token(token);

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    const GetData = await IVR.findOne({ _id: id, is_deleted: 0 });

    return res.status(200).send({
      success: 1,
      message: "IVR list get successfully",
      data: GetData,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

export default { createIVR, updateIVR, deleteIVR, getIVR, getIVRById };
