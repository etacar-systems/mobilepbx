import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import user from "../../models/user";
import ring_group from "../../models/ring_group";
import axios from "axios";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import { config } from "../../config";
import company from "../../models/company";
import pstn_number from "../../models/pstn_number";
import REGEXP from "../../regexp";
const addNewRecord = async (
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

    let company_details: any = await company.findOne({ _id: cid, is_deleted: 0 });
    if (!company_details) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Please Select Domain.",
      });
    }
  
    let ringgroupCount = await ring_group.find({cid:cid, is_deleted: 0 }).countDocuments()
    
    if(company_details?.ring_group_count === ringgroupCount){
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: `You can't create more than ${company_details?.ring_group_count} ring groups`,
      });
    }

    const {
      name,
      extension,
      ring_group_strategy,
      ring_group_greeting,
      ring_group_call_timeout,
      ring_group_caller_id_name,
      ring_group_caller_id_number,
      ring_group_ringback,
      ring_group_call_forward_enabled,
      ring_group_missed_call_app,
      ring_group_missed_call_data,
      ring_group_forward_enabled,
      ring_group_forward_destination,
      ring_group_forward_toll_allow,
      ring_group_timeout_app,
      ring_group_timeout_data,
      ring_group_enabled,
      ring_group_description,
      destinations,
      ring_group_follow_me_enabled,
      ring_hunt_timeout
    } = req.body;

    // Validation checks
    if (name === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Name Is Mandatory.",
      });
    }
    if (ring_group_description === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Description Is Mandatory.",
      });
    }
    if (ring_group_greeting === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Greeting Is Mandatory.",
      });
    }
    if (ring_group_strategy === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Strategy Is Mandatory.",
      });
    }
    if (ring_group_caller_id_name === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Caller ID Name Is Mandatory.",
      });
    }
    if (ring_group_caller_id_number === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Caller ID Number Is Mandatory.",
      });
    }
    if (ring_group_call_timeout === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Call Timeout Is Mandatory.",
      });
    }
    if (
      destinations === undefined ||
      !Array.isArray(destinations) ||
      destinations.length === 0
    ) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Destinations Are Mandatory.",
      });
    }
    if (ring_group_forward_enabled === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Forward Enabled Is Mandatory.",
      });
    }
    if (ring_group_forward_destination === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Forward Destination Is Mandatory.",
      });
    }
    if (ring_group_forward_toll_allow === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Forward Toll Allow Is Mandatory.",
      });
    }
    if (ring_group_enabled === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Enabled Is Mandatory.",
      });
    }
    ring_group_strategy
    if(ring_group_strategy == "sequence"){
      if (ring_hunt_timeout === undefined) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "Ring Hunt Timeout Is Mandatory.",
        });
      }
  
      if (!REGEXP.COMMON.checkStringISNumber.test(ring_hunt_timeout)) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "Ring Hunt Timeout Is Invalid.",
        });
      }
    }

    // console.log(company_details, "company_details");
    const create_ringgroup_obj = {
      cid: company_details?._id,
      domain_id: company_details?.domain_uuid,
      name,
      extension,
      ring_group_strategy,
      ring_group_greeting,
      ring_group_call_timeout,
      ring_group_caller_id_name,
      ring_group_caller_id_number,
      ring_group_ringback,
      ring_group_call_forward_enabled,
      ring_group_follow_me_enabled,
      ring_group_missed_call_app,
      ring_group_missed_call_data,
      ring_group_forward_enabled,
      ring_group_forward_destination,
      ring_group_forward_toll_allow,
      context: company_details?.domain_name,
      ring_group_timeout_app,
      ring_group_timeout_data,
      ring_group_enabled,
      ring_group_description,
      destinations,
      last_updated_user: user_detail?.uid,
      ring_hunt_timeout:ring_group_strategy == "sequence" ? ring_hunt_timeout : ""
    };
    // console.log(create_ringgroup_obj, "create_ringgroup_obj");

    const extension_data = await user.find({
      _id: { $in: destinations },
      is_deleted: 0,
    });
    // console.log(extension_data, "extension_data");

    if (extension_data.length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Please provide valid extension numbers.",
      });
    }

    const api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.RING_GROUP.ADD,
      auth: config.PBX_API.AUTH,
      data: {
        name,
        extension,
        domain_id: company_details?.domain_uuid,
        context: company_details?.domain_name,
        ring_group_strategy,
        ring_group_enabled,
        ring_group_description,
        ring_group_greeting,
        ring_group_forward_enabled,
        ring_group_forward_destination,
        ring_group_forward_toll_allow,
        ring_group_timeout_app,
        ring_group_timeout_data,
        ring_group_call_forward_enabled,
        ring_group_follow_me_enabled,
        ring_group_missed_call_app,
        ring_group_missed_call_data,
        ring_group_destinations: extension_data.map((ext) => ({
          destination_number: ext.user_extension,
          destination_delay: "10",
          destination_timeout:ring_group_strategy == "sequence" ? ring_hunt_timeout : "30",
          destination_enabled: "true",
          destination_prompt: "NULL",
        })),
      },
    };
    //console.log("api_config",api_config)
    try {
      const response = await axios.request(api_config);
      //console.log("response",response)
      if (response.data?.id) {
        const newData = await ring_group.create({
          ...create_ringgroup_obj,
          ring_group_uuid: response.data?.id,
        });
        //console.log(newData,"newData");
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Ring Group added successfully.",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: response?.data.message || "Failed To Create Ring Group",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const EditNewRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      ring_group_uuid,
      ring_group_id,
      name,
      extension,
      ring_group_description,
      ring_group_greeting,
      ring_group_strategy,
      ring_group_caller_id_name,
      ring_group_caller_id_number,
      ring_group_call_timeout,
      destinations,
      ring_group_ringback,
      ring_group_call_forward_enabled,
      ring_group_missed_call_app,
      ring_group_missed_call_data,
      ring_group_forward_enabled,
      ring_group_forward_destination,
      ring_group_forward_toll_allow,
      context,
      ring_group_timeout_app,
      ring_group_timeout_data,
      ring_group_enabled,
      ring_group_follow_me_enabled,
      ring_hunt_timeout
    } = req.body;

    // Validation checks
    if (ring_group_id === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Id Is Mandatory.",
      });
    }
    if (ring_group_uuid === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group UUID Is Mandatory.",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(ring_group_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Invalid Ring Group Id ObjectId.",
      });
    }

    if (name === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Name Is Mandatory.",
      });
    }
    if (ring_group_description === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Description Is Mandatory.",
      });
    }
    if (ring_group_greeting === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Greeting Is Mandatory.",
      });
    }
    if (ring_group_strategy === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Strategy Is Mandatory.",
      });
    }
    if (ring_group_caller_id_name === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Caller ID Name Is Mandatory.",
      });
    }
    if (ring_group_caller_id_number === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Caller ID Number Is Mandatory.",
      });
    }
    if (ring_group_call_timeout === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Call Timeout Is Mandatory.",
      });
    }
    if (destinations === undefined || !Array.isArray(destinations)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Destinations Are Mandatory.",
      });
    }
    if (ring_group_forward_enabled === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Forward Enabled Is Mandatory.",
      });
    }
    if (ring_group_forward_destination === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Forward Destination Is Mandatory.",
      });
    }
    if (ring_group_forward_toll_allow === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Forward Toll Allow Is Mandatory.",
      });
    }
    if (context === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Context Is Mandatory.",
      });
    }
    if (ring_group_enabled === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Enabled Is Mandatory.",
      });
    }
    if(ring_group_strategy == "sequence"){
      if (!REGEXP.COMMON.checkStringISNumber.test(ring_hunt_timeout)) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "Ring Hunt Timeout Is Invalid.",
        });
      }
      if (!REGEXP.COMMON.checkStringISNumber.test(ring_hunt_timeout)) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "Ring Hunt Timeout Is Invalid.",
        });
      }
    }
   
    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    const company_details = await company.findById(user_detail?.cid);
    // console.log(company_details)
    const updated_ringgroup_obj = {
      name,
      extension,
      ring_group_description,
      ring_group_greeting,
      ring_group_strategy,
      ring_group_caller_id_name,
      ring_group_caller_id_number,
      ring_group_call_timeout,
      destinations,
      ring_group_ringback,
      ring_group_call_forward_enabled,
      ring_group_follow_me_enabled,
      ring_group_missed_call_app,
      ring_group_missed_call_data,
      ring_group_forward_enabled,
      ring_group_forward_destination,
      ring_group_forward_toll_allow,
      context: company_details?.domain_name,
      ring_group_timeout_app,
      ring_group_timeout_data,
      ring_group_enabled,
      domain_id: company_details?.domain_uuid,
      ring_group_uuid,
      last_updated_user: user_detail?.uid,
      ring_hunt_timeout:ring_group_strategy == "sequence" ? ring_hunt_timeout : ""
    };

    const extension_data = await user.find({
      _id: { $in: destinations },
      is_deleted: 0,
    });

    if (extension_data.length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Please provide valid extension numbers.",
      });
    }

    const api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.RING_GROUP.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        name,
        extension,
        ring_group_strategy,
        domain_id: company_details?.domain_uuid,
        ring_group_greeting,
        ring_group_timeout_app,
        ring_group_timeout_data,
        ring_group_call_timeout,
        ring_group_caller_id_name,
        ring_group_caller_id_number: "",
        ring_group_ringback,
        ring_group_call_forward_enabled,
        ring_group_follow_me_enabled,
        ring_group_missed_call_app,
        ring_group_missed_call_data,
        ring_group_forward_enabled,
        ring_group_forward_destination,
        ring_group_forward_toll_allow,
        context,
        ring_group_description,
        ring_group_enabled,
        ring_group_id: ring_group_uuid,
        ring_group_destinations: extension_data.map((ext) => ({
          destination_number: ext.user_extension,
          destination_delay: "10",
          destination_timeout:ring_group_strategy == "sequence" ? ring_hunt_timeout : "30",
          destination_enabled: "true",
          destination_prompt: "NULL",
        })),
      },
    };
    //console.log(api_config,"api_config")
    try {
      const response = await axios.request(api_config);
      if (response.data?.msg === "Ring Group Updated Successfully !!") {
        await ring_group.findByIdAndUpdate(
          ring_group_id,
          updated_ringgroup_obj,
          {
            runValidators: true,
          }
        );

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Ring Group Updated successfully.",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: response?.data.message || "Failed To Update Ring Group",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const DeleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let data: any = req.body;
  let ring_group_id: any = data.ring_group_id;

  const token = await get_token(req);
  const user_detail = await User_token(token);
  if (user_detail === undefined) {
    return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
    });
  }

  if (Object.keys(data).length === 0) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Request Body Params Is Empty",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(ring_group_id)) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Ring Group Id Is Invalid.",
    });
  }

  let get_ring_group: any = await ring_group.findById({
    _id: ring_group_id,
  });

  if (get_ring_group == null) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Ring Group Not Exists.",
    });
  }

  try {
    let api_config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: config.PBX_API.RING_GROUP.REMOVE + get_ring_group.ring_group_uuid,
      auth: config.PBX_API.AUTH,
    };
    const data: any = await axios.request(api_config);

    const post = await ring_group.findByIdAndUpdate(
      {
        _id: ring_group_id,
      },
      {
        is_deleted: 1,
        last_updated_user: user_detail?.uid,
      },
      {
        runValidators: true,
      }
    );

    await pstn_number.updateOne(
      {
        select_type_uuid: get_ring_group?.ring_group_uuid,
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

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Ring Group Deleted successfully",
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getRingGrouplist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let page: any = data.page;
    let size: any = data.size;
    let search: any = data.search?.toString();
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;
    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let cid: any = user_detail?.cid;

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
            ring_group_description: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    } else {
      find_query = {
        cid: cid,
        is_deleted: 0,
      };
    }
    // console.log(find_query);
    const ring_group_list: any = await ring_group
      .find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    // console.log(ring_group_list);

    const ring_group_total_counts: any = await ring_group
      .find(find_query)
      .countDocuments();
    // console.log(ring_group_total_counts);

    let total_page_count: any = Math.ceil(ring_group_total_counts / size);

    res.send({
      success: 1,
      message: "Ring Group List",
      RingGroupList: ring_group_list,
      total_page_count: total_page_count,
      ring_group_total_counts: ring_group_total_counts,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getRingGroupDetailByid = async (
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

    let data: any = req.body;
    let ring_group_id: any = data.ring_group_id;
    if (Object.keys(data).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(ring_group_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group Id Id Is Invalid.",
      });
    }
    const ring_group_data: any = await ring_group.findById({
      _id: ring_group_id,
    });

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Ring Group Detail",
      RingGroupDatil: ring_group_data,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default {
  addNewRecord,
  EditNewRecord,
  DeleteRecord,
  getRingGrouplist,
  getRingGroupDetailByid,
};
