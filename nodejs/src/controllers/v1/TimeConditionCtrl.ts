import { NextFunction, Request, Response } from "express";
import TimeCondition from "../../models/time_condition";
import axios from "axios";
import { config } from "../../config";
import mongoose from "mongoose";
import get_token from "../../helper/userHeader";
import User_token from "../../helper/helper";
import company from "../../models/company";
import user from "../../models/user";
import pstn_number from "../../models/pstn_number";

const getTimeConditionList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    let type: Number = data?.type
    console.log("dataadas", type);

    if (!page) return (page = 1);
    if (!size) return (size = 20);

    let limit: any = parseInt(size);
    let skip: any = (page - 1) * size;

    let find_query: { [key: string]: any } = {};

    if (search) {
      find_query = {
        is_deleted: 0,
        cid: cid,
        type: type,
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
        type: type
      };
    }
    const ListData = await TimeCondition.find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const countDocuments = await TimeCondition.find(
      find_query
    ).countDocuments();

    const total_page_count = Math.ceil(countDocuments / size);

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "TimeCondition list get successfully",
      data: {
        TimeCondition: ListData,
        total_page_count: total_page_count,
        conference_total: countDocuments,
      },
    });
  } catch (error) {
    console.error("Error creating TimeCondition:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const addTimeCondition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      type,
      name,
      extension,
      order,
      timecondition_enabled,
      description,
      dialplan_action,
      dialplan_anti_action,
      timecondition_data,
    } = req.body;
    console.log("role from frontend", type);


    const requiredFields = {
      name: "Name",
      extension: "Extension",
      order: "Order",
      timecondition_enabled: "Time Condition Enabled",
      dialplan_action: "Dial Plan Action",
      dialplan_anti_action: "Dial Plan Anti Action",
      timecondition_data: "Time Condition Data",
      description: "Description",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({
          success: 0,
          message: `${name} Is Mandatory.`,
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

    let cid: any = user_detail?.cid;

    const company_details = await company.findById(cid);
    if (!company_details) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "company dose not exist",
      });
    }

    const createObj = {
      type,
      cid,
      name,
      extension,
      order,
      domain_id: company_details?.domain_uuid,
      context: company_details?.domain_name,
      timecondition_enabled,
      description,
      dialplan_action,
      dialplan_anti_action,
      timecondition_data,
      last_updated_user: user_detail?.uid,
    };
    console.log("create OBj", createObj);

    try {
      let api_config = {
        method: "put",
        maxBodyLength: Infinity,
        url: config.PBX_API.TIME_CONDITION.ADD,
        auth: config.PBX_API.AUTH,
        data: createObj,
      };
      const responseData = await axios.request(api_config);
      if (responseData?.data?.id) {
        const result = await TimeCondition.create({
          ...createObj,
          time_condition_uuid: responseData?.data?.id,
        });
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Time Condition created Successfully",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message:
            responseData?.data?.message || "Failed To Create TimeCondition",
        });
      }
    } catch (error) {
      console.error("Error creating Time Condition:", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.error("Error creating Time Condition:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const editTimeCondition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      time_condition_id,
      name,
      extension,
      order,
      timecondition_enabled,
      description,
      dialplan_action,
      dialplan_anti_action,
      timecondition_data,
      type
    } = req.body;

    const requiredFields = {
      time_condition_id: "Time Condition Id",
      name: "Name",
      extension: "Extension",
      order: "Order",
      timecondition_enabled: "Time Condition Enabled",
      dialplan_action: "Dial Plan Action",
      dialplan_anti_action: "Dial Plan Anti Action",
      timecondition_data: "Time Condition Data",
      description: "Description",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(time_condition_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "time_condition_id is invalid",
      });
    }
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
    const createObj = {
      type,
      name,
      extension,
      order,
      domain_id: company_details?.domain_uuid,
      context: company_details?.domain_name,
      timecondition_enabled,
      description,
      dialplan_action,
      dialplan_anti_action,
      timecondition_data,
      last_updated_user: user_detail?.uid,
    };

    const oldData = await TimeCondition.findById(time_condition_id);

    if (!oldData) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "time_condition dose not exist",
      });
    }

    try {
      let api_config = {
        method: "put",
        maxBodyLength: Infinity,
        url: config.PBX_API.TIME_CONDITION.UPDATE,
        auth: config.PBX_API.AUTH,
        data: {
          type,
          name,
          extension,
          order,
          domain_id: company_details?.domain_uuid,
          context: company_details?.domain_name,
          timecondition_enabled,
          timecondition_id: oldData?.time_condition_uuid,
          description,
          dialplan_action,
          dialplan_anti_action,
          timecondition_data,
        },
      };
      const responseData = await axios.request(api_config);
      if (
        responseData?.data?.msg === "Time Condition Updated Successfully"
      ) {
        const result = await TimeCondition.findByIdAndUpdate(
          time_condition_id,
          {
            ...createObj,
            time_condition_uuid: responseData?.data?.id,
          }
        );
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Time Condition Updated Successfully",
        });
      } else {
        console.error(responseData);
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
        });
      }
    } catch (error) {
      console.error("Error creating Time Condition:", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.error("Error editing IVR:", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const deleteTimeCondition = async (
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

    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Invalid MongoDB ID.",
      });
    }

    const resultObj = await TimeCondition.findById(id);
    if (!resultObj) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "TimeCondition not found.",
      });
    }

    const { time_condition_uuid } = resultObj;

    const api_config = {
      method: "delete",
      url: `${config.PBX_API.TIME_CONDITION.DELETE}${time_condition_uuid}`,
      auth: config.PBX_API.AUTH,
    };

    try {
      const response = await axios.request(api_config);

      if (response.data?.message !== "Deleted Successfully !!") {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
        });
      }

      await TimeCondition.findByIdAndUpdate(
        id,
        { is_deleted: 1, last_updated_user: user_detail?.uid },
        { runValidators: true }
      );

      await pstn_number.updateOne(
        {
          select_type_uuid: time_condition_uuid,
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
        message: "Time Condition deleted successfully.",
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

const getTimeConditionById = async (
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
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Invalid MongoDB ID.",
      });
    }

    const resultObj = await TimeCondition.findOne({ _id: id, is_deleted: 0 });
    // if (!resultObj) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "TimeCondition not found.",
    //   });
    // }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Time Condition fetch successfully.",
      data: resultObj,
    });
  } catch (error) { }
};

// NEW

const getTimeConditionOption = async (
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
    // const { cid, domain_uuid } = req.body;
    const { cid, domain_uuid, user_extension, type } = req.body;

    const resultObj = await TimeCondition.findOne({
      cid: cid,
      domain_id: domain_uuid,
      extension: user_extension,
      type: type,
      is_deleted: 0
    })

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Invalid MongoDB ID.",
    //   });
    // }

    // const resultObj = await TimeCondition.findOne({ _id: id, is_deleted: 0 });
    // if (!resultObj) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "TimeCondition not found.",
    //   });
    // }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Time Condition fetch successfully.",
      data: resultObj,
    });
  } catch (error) { }
};

export default {
  getTimeConditionList,
  addTimeCondition,
  editTimeCondition,
  deleteTimeCondition,
  getTimeConditionById,
  getTimeConditionOption,
};
