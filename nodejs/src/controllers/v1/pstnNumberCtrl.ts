import { Request, Response, NextFunction, json } from "express";
import company from "../../models/company";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import pstn_number from "../../models/pstn_number";
import trunks from "../../models/trunks";
import extension from "../../models/extension";
import axios from "axios";
import ring_group from "../../models/ring_group";
import IVR from "../../models/IVR";
import user from "../../models/user";
import conferncers from "../../models/conferncers";
import time_condition from "../../models/time_condition";
import system_recording from "../../models/system_recording";
import role from "../../models/role";
import { v4 as uuidv4 } from "uuid";

const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const {
      type,
      user,
      destination,
      caller_id_name,
      caller_id_number,
      destination_condition,
      copy_action_to_all,
      create_range,
      cid,
      description,
      destination_enabled,
      gateway_id,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      type: "Type",
      user: "User",
      destination: "Destination",
      caller_id_name: "Caller ID Name",
      caller_id_number: "Caller ID Number",
      destination_condition: "Destination Condition",
      description: "Description",
      destination_enabled: "Destination Enabled",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    if (create_range > 100) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "destination number range must be less than 100 requried.",
      });
    }
    // Validate the destination_action array
    // if (!Array.isArray(destination_action)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
    //     success: 0,
    //     message: "destination_action must be an array.",
    //   });
    // }

    // for (const action of destination_action) {
    //   if (
    //     action.destination_app == undefined ||
    //     action.destination_data == undefined
    //   ) {
    //     return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
    //       success: 0,
    //       message:
    //         "Each item in destination_action must have valid destination_app and destination_data.",
    //     });
    //   }
    // }

    if (!mongoose.Types.ObjectId.isValid(gateway_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Gateway ID is Invalid.",
      });
    }

    const gatewayIdDetail = await trunks.findOne({
      _id: gateway_id,
      is_deleted: 0,
    });

    if (!gatewayIdDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Gateway Id Not Found.`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Company ID Invalid.`,
      });
    }

    const companyDetail = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Company Not Found.`,
      });
    }

    // const createPstnObj: any = {
    //   type,
    //   user,
    //   destination,
    //   caller_id_name,
    //   caller_id_number,
    //   destination_condition,
    //   destination_action:[],
    //   cid,
    //   description,
    //   destination_enabled,
    //   last_updated_user: uid,
    // };

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.PSTN.BULK_ADD,
      auth: config.PBX_API.AUTH,
      data: {
        domain: companyDetail?.domain_uuid,
        type,
        user,
        create_range,
        destination,
        caller_id_name,
        caller_id_number,
        destination_condition,
        destination_action: [],
        description,
        destination_enabled: destination_enabled == true ? "true" : "false",
        trunk_id: gatewayIdDetail?.trunks_uuid,
        copy_action_to_all: "NO",
      },
    };
    console.log(api_config);

    try {
      const data: any = await axios.request(api_config);
      console.log(data?.data, "12333");

      const formattedArray = Object.keys(data?.data)
        .filter((key) => !isNaN(Number(key)))
        .map((key) => data?.data[key]);
      console.log(data?.data, "pbx response");

      if (data) {
        let newCreateObj: any = [];
        const pstn_range_uuid = uuidv4();

        formattedArray?.map((i: any) => {
          newCreateObj.push({
            pstn_uuid: i?.id,
            type,
            user,
            destination: i.destination_number,
            caller_id_name,
            caller_id_number,
            destination_condition,
            description,
            destination_enabled,
            last_updated_user: uid,
            cid,
            gateway_id,
            pstn_range_uuid,
          });
        });

        // createPstnObj.pstn_uuid = data?.data?.id;
        const post = await pstn_number.insertMany(newCreateObj);

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: {
            duplicate_numbers: data?.data?.duplicate_numbers,
            created_number: formattedArray,
          },
        });
      } else {
        console.log("1233");

        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.message || "Failed To Create pstn number",
        });
      }
    } catch (error) {
      console.log(error, "error");

      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Create pstn number",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const UpdateRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const {
      pstn_id,
      pstn_uuid,
      type,
      user,
      destination,
      caller_id_name,
      caller_id_number,
      destination_condition,
      destination_action,
      cid,
      description,
      destination_enabled,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      pstn_id: "PSTN id",
      pstn_uuid: "PSTN uuid",
      type: "Type",
      user: "User",
      destination: "Destination",
      caller_id_name: "Caller ID Name",
      caller_id_number: "Caller ID Number",
      destination_condition: "Destination Condition",
      description: "Description",
      destination_enabled: "Destination Enabled",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    // Validate the destination_action array
    if (!Array.isArray(destination_action)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "destination_action must be an array.",
      });
    }

    for (const action of destination_action) {
      if (action.destination_app == undefined || action.destination_data == undefined) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message:
            "Each item in destination_action must have valid destination_app and destination_data.",
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Company ID Invalid.`,
      });
    }

    const companyDetail = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Company Not Found.`,
      });
    }

    const updateObj: any = {
      type,
      user,
      destination,
      caller_id_name,
      caller_id_number,
      destination_condition,
      destination_action,
      cid,
      description,
      destination_enabled,
      last_updated_user: uid,
    };

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.PSTN.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        domain: companyDetail?.domain_uuid,
        type,
        user,
        destination,
        caller_id_name,
        caller_id_number,
        destination_condition,
        destination_action,
        description,
        destination_enabled: destination_enabled == true ? "true" : "false",
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data?.data?.id) {
        const post = await pstn_number.findByIdAndUpdate(pstn_id, updateObj, {
          new: true,
          runValidators: true,
        });

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: data?.data?.msg,
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.message || "Failed To Create pstn number",
        });
      }
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Create pstn number",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getpstnNumberList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    let page: any = data.page;
    let size: any = data.size;
    let search: any = data.search?.toString();
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    let find_query: { [key: string]: any } = {};
    if (search) {
      find_query = {
        is_deleted: 0,
        $or: [
          {
            type: {
              $regex: search,
              $options: "i",
            },
          },
          {
            destination: {
              $regex: search,
              $options: "i",
            },
          },

          {
            trunk_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            company_name: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    } else {
      find_query = {
        is_deleted: 0,
      };
    }

    const pstn_list = await pstn_number.aggregate([
      {
        $lookup: {
          from: "trunks",
          localField: "gateway_id",
          foreignField: "_id",
          pipeline: [{ $match: { is_deleted: 0 } }],
          as: "trunk_detail",
        },
      },
      { $unwind: "$trunk_detail" },
      {
        $lookup: {
          from: "companies",
          localField: "cid",
          foreignField: "_id",
          pipeline: [{ $match: { is_deleted: 0 } }],
          as: "cid_detail",
        },
      },
      { $unwind: "$cid_detail" },
      {
        $addFields: {
          trunk_name: "$trunk_detail.gateway_name",
          company_name: "$cid_detail.company_name",
        },
      },
      { $match: find_query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          destination: 1,
          cid: 1,
          gateway_id: 1,
          trunk_name: 1,
          company_name: 1,
          type: 1,
        },
      },
    ]);

    const totalCountResult = await pstn_number.aggregate([
      {
        $lookup: {
          from: "trunks",
          localField: "gateway_id",
          foreignField: "_id",
          pipeline: [{ $match: { is_deleted: 0 } }],
          as: "trunk_detail",
        },
      },
      { $unwind: "$trunk_detail" },
      {
        $lookup: {
          from: "companies",
          localField: "cid",
          foreignField: "_id",
          pipeline: [{ $match: { is_deleted: 0 } }],
          as: "cid_detail",
        },
      },
      { $unwind: "$cid_detail" },
      {
        $addFields: {
          trunk_name: "$trunk_detail.gateway_name",
          company_name: "$cid_detail.company_name",
        },
      },
      { $match: find_query },
      {
        $count: "totalDocuments",
      },
    ]);

    const pstn_total_counts = totalCountResult[0]?.totalDocuments || 0;

    let total_page_count: any = Math.ceil(pstn_total_counts / size);

    res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "PSTN List",
      data: pstn_list,
      total_page_count: total_page_count,
      pstn_total_counts: pstn_total_counts,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const removepstnOLD = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    let pstn_id: any = data.pstn_id;

    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    if (Object.keys(data).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    let get_company_pstn: any = await pstn_number.findOne({
      _id: pstn_id,
    });

    if (get_company_pstn?.isassigned === 1) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Pstn Number already assigned to Extension  pls Unassign First.",
      });
    }

    let api_config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${config.PBX_API.PSTN.REMOVE}${get_company_pstn?.pstn_uuid}`,
      auth: config.PBX_API.AUTH,
    };

    try {
      const data: any = await axios.request(api_config);

      if (data) {
        await pstn_number.findByIdAndUpdate(
          {
            _id: pstn_id,
          },
          {
            is_deleted: 1,
            last_updated_user: uid,
          },
          {
            new: true,
          }
        );
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "PSTN Number Delete Successfully",
        });
      }
    } catch (error: any) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const removepstn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: { pstn_range_uuid: string } = req.body;
    let pstn_range_uuid: string = data.pstn_range_uuid;

    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    if (Object.keys(data).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    let get_companies_pstn: any = await pstn_number.find({ pstn_range_uuid: pstn_range_uuid });

    const grouped_companies_pstn = get_companies_pstn.reduce((acc: any, item: any) => {
      const key: number = item.isassigned;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    // remove unassigned pstn number
    grouped_companies_pstn[0].forEach(async (item: any) => {
      let api_config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${config.PBX_API.PSTN.REMOVE}${item.pstn_uuid}`,
        auth: config.PBX_API.AUTH,
      };

      try {
        const data: any = await axios.request(api_config);
        if (data) {
          await pstn_number.findByIdAndUpdate(
            {
              _id: item._id,
            },
            {
              is_deleted: 1,
              last_updated_user: uid,
            },
            {
              new: true,
            }
          );

          const assined_destinations =
            grouped_companies_pstn[1] &&
            grouped_companies_pstn[1].map((item: any) => item.destination);

          return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
            success: 1,
            message: assined_destinations
              ? `PSTN Number Delete Successfully. Pstn Number already assigned to Extension ${assined_destinations.join(
                  ", "
                )} won't be deleted. Please Unassign First`
              : "PSTN Number Delete Successfully",
          });
        }
      } catch (error) {
        if (!res.headersSent) {
          return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
            success: 0,
            message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
          });
        }
      }
    });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  }
};
const getAnAssignedPstnNumberList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //  let get_anassigned_pstn:any []= await pstn_number.find({
    //   isassigned:0,
    //   is_deleted:0
    //  }).select("pstn_number")

    const token = await get_token(req);
    const user_detail: any = await User_token(token);

    let get_anassigned_pstn: any[] = await pstn_number.aggregate([
      {
        $match: {
          isassigned: 0,
          is_deleted: 0,
          cid: user_detail?.cid,
        },
      },
      {
        $project: {
          destination: 1,
          caller_id_name: 1,
          caller_id_number: 1,
        },
      },
    ]);

    return res.status(200).send({
      success: 1,
      message: "Pstn List Successfully.",
      PstnList: get_anassigned_pstn,
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

const CompanyWisePstnList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail: any = await User_token(token);

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let data: any = req.body;
    let page: any = data.page;
    let size: any = data.size;
    let isassigned: any = data.isassigned;
    let search: any = data.search?.toString();
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    let find_query: { [key: string]: any } = {
      is_deleted: 0,
      cid: user_detail?.cid,
    };
    if (search) {
      find_query.$or = [
        { type: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
        { caller_id_name: { $regex: search, $options: "i" } },
        { caller_id_number: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "select_type_data.select_name": { $regex: search, $options: "i" } },
        {
          "select_type_data.select_extension": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (isassigned !== undefined) {
      if (isassigned === 3) {
      } else if (isassigned === 0 || isassigned === 1) {
        find_query.isassigned = isassigned;
      } else {
        return res.status(400).send({
          success: 0,
          message: "Invalid value for isassigned.",
        });
      }
    }

    let get_anassigned_pstn1 = await pstn_number
      .find(find_query)
      // .populate({
      //   path: "assigend_extensionId",
      //   model: "user",
      //   select: "first_name last_name user_extension country",
      // })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip);

    // const pstn_list: any = await pstn_number
    //   .find(find_query)
    //   .sort({ createdAt: -1 })
    //   .limit(limit)
    //   .skip(skip);

    const pstn_total_counts: any = await pstn_number.find(find_query).countDocuments();

    let total_page_count: any = Math.ceil(pstn_total_counts / size);

    res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Pstn List Successfully.",
      data: get_anassigned_pstn1,
      total_page_count: total_page_count,
      pstn_total_counts: pstn_total_counts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

const assignPSTNInNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const data = req.body;
    let pstn_id: any = data?.pstn_id;
    let destination_action: any = data?.destination_action;
    let select_type: any = data?.select_type;
    let select_type_uuid: any = data?.select_type_uuid;
    var select_type_data: any = {
      select_name: "",
      select_extension: "",
      select_id: "",
    };

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      pstn_id: "PSTN Number",
      select_type: "select_type",
      select_type_uuid: "select type uuid",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    // Validate the destination_action array
    if (!Array.isArray(destination_action)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "destination_action must be an array.",
      });
    }

    for (const action of destination_action) {
      if (action.destination_app == undefined || action.destination_data == undefined) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message:
            "Each item in destination_action must have valid destination_app and destination_data.",
        });
      }
    }

    if (select_type == config.SELECT_NAME.IVR) {
      let get_ivr: any = await IVR.findOne({
        ivr_uuid: select_type_uuid,
        is_deleted: 0,
      });
      if (!get_ivr) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `IVR Not Found.`,
        });
      }
      select_type_data.select_name = get_ivr?.name;
      select_type_data.select_extension = get_ivr?.extension;
      select_type_data.select_id = get_ivr?._id;
    }
    if (select_type == config.SELECT_NAME.RINGGROUP) {
      let get_ring_group: any = await ring_group.findOne({
        ring_group_uuid: select_type_uuid,
        is_deleted: 0,
      });
      if (!get_ring_group) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Ring group Not Found.`,
        });
      }
      select_type_data.select_name = get_ring_group?.name;
      select_type_data.select_extension = get_ring_group?.extension;
      select_type_data.select_id = get_ring_group?._id;
    }
    if (select_type == config.SELECT_NAME.EXTENSION) {
      let get_extension: any = await user.findOne({
        extension_uuid: select_type_uuid,
        is_deleted: 0,
      });

      if (!get_extension) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Extension Not Found.`,
        });
      }

      select_type_data.select_name = get_extension?.first_name + " " + get_extension?.last_name;
      select_type_data.select_extension = get_extension?.user_extension;
      select_type_data.select_id = get_extension?._id;
    }
    if (select_type == config.SELECT_NAME.RECORDING) {
      let api_config = {
        method: "get",
        maxBodyLength: Infinity,
        url: ` ${config.PBX_API.RECORDING.GET_uuid}${select_type_uuid}`,
        auth: config.PBX_API.AUTH,
      };

      try {
        const data: any = await axios.request(api_config);
        select_type_data.select_name = data?.data[0]?.recording_name;
        select_type_data.select_extension = data?.data[0]?.recording_filename;
        select_type_data.select_id = data?.data[0]?.recording_uuid;
      } catch (error: any) {
        console.log(error);

        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: "Recording Not Found.",
        });
      }
    }
    if (select_type == config.SELECT_NAME.CONFERENCE) {
      let get_cpnference: any = await conferncers.findOne({
        conference_uuid: select_type_uuid,
        is_deleted: 0,
      });
      if (!get_cpnference) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Conference Not Found.`,
        });
      }
      select_type_data.select_name = get_cpnference?.conference_name;
      select_type_data.select_extension = get_cpnference?.extension_number;
      select_type_data.select_id = get_cpnference?._id;
    }
    if (select_type == config.SELECT_NAME.TIMECONDTION) {
      let get_time_condition: any = await time_condition.findOne({
        time_condition_uuid: select_type_uuid,
        is_deleted: 0,
      });
      if (!get_time_condition) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `time_condition Not Found.`,
        });
      }
      select_type_data.select_name = get_time_condition?.name;
      select_type_data.select_extension = get_time_condition?.extension;
      select_type_data.select_id = get_time_condition?._id;
    }

    let get_company_pstn: any = await pstn_number.findOne({
      _id: pstn_id,
      is_deleted: 0,
    });

    const companyDetail = await company.findOne({
      _id: get_company_pstn?.cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Company Not Found.`,
      });
    }

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.PSTN.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        domain: companyDetail?.domain_uuid,
        type: get_company_pstn?.type,
        user: get_company_pstn?.user,
        destination: get_company_pstn?.destination,
        caller_id_name: get_company_pstn?.caller_id_name,
        caller_id_number: get_company_pstn?.caller_id_number,
        destination_condition: get_company_pstn?.destination_condition,
        destination_action,
        description: get_company_pstn?.description,
        destination_enabled: get_company_pstn?.destination_enabled == true ? "true" : "false",
        destination_id: get_company_pstn?.pstn_uuid,
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data) {
        const post: any = await pstn_number.findByIdAndUpdate(
          pstn_id,
          {
            isassigned: 1,
            last_updated_user: user_detail?.uid,
            destination_action,
            select_type_data,
            select_type,
            select_type_uuid,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        switch (select_type) {
          case config.SELECT_NAME.IVR:
            await IVR.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                assign_pstn_number: get_company_pstn?.destination,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.RINGGROUP:
            await ring_group.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                assign_pstn_number: get_company_pstn?.destination,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.EXTENSION:
            await user.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                pstn_number: pstn_id,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.CONFERENCE:
            await conferncers.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                assign_pstn_number: get_company_pstn?.destination,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.TIMECONDTION:
            await time_condition.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                assign_pstn_number: get_company_pstn?.destination,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.RECORDING:
            break;
          default:
            return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
              success: 0,
              message: "Fetch Error in Assign Module Data ||",
            });
        }

        if (select_type == config.SELECT_NAME.EXTENSION) {
          let get_extension_detail: any = await user.findOne({
            extension_uuid: select_type_uuid,
            is_deleted: 0,
          });

          let cid_detail: any = await company.findOne({
            _id: get_extension_detail?.cid,
            is_deleted: 0,
          });

          let api_config = {
            method: "put",
            maxBodyLength: Infinity,
            url: config.PBX_API.EXTENSION.UPDATE,
            auth: config.PBX_API.AUTH,
            data: {
              extension_id: select_type_uuid,
              extension: get_extension_detail.user_extension,
              user: get_extension_detail.user_extension,
              extension_password: get_extension_detail.password,
              outbound_caller_id_name:
                get_extension_detail.first_name + " " + get_extension_detail.last_name,
              outbound_caller_id_number: get_company_pstn?.destination,
              effective_caller_id_name:
                get_extension_detail.first_name + " " + get_extension_detail.last_name,
              effective_caller_id_number: get_company_pstn?.destination,
              max_registrations: "5",
              limit_max: "5",
              user_record: get_extension_detail.user_record ? "true" : "false",
              account_code: cid_detail.domain_name,
              domain: cid_detail?.domain_uuid,
              context: cid_detail.domain_name,
              extension_enabled: "true",
              description: "",
            },
          };
          console.log("api_config", api_config);

          try {
            const data: any = await axios.request(api_config);
            console.log("data", data.data);
            if (!data) {
              return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
                success: 0,
                message: "Failed To add Extension number",
              });
            }
          } catch (error: any) {
            return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
              success: 0,
              message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
            });
          }
        }

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Number assigned successfully",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: "Failed To add pstn number",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Update pstn number",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const updateAssignPSTN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const data = req.body;
    let number_id: any = data?.number_id;
    let pstn_id: any = data?.pstn_id;
    let destination_action: any = data?.destination_action;
    let select_type: any = data?.select_type;
    let select_type_uuid: any = data?.select_type_uuid;
    let select_type_name: any;
    var select_type_data: any = {
      select_name: "",
      select_extension: "",
      select_id: "",
    };

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      pstn_id: "PSTN Number",
      select_type: "select_type",
      select_type_uuid: "select type uuid",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    // Validate the destination_action array
    if (!Array.isArray(destination_action)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "destination_action must be an array.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(number_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "PSTN id invalid",
      });
    }

    for (const action of destination_action) {
      if (action.destination_app == undefined || action.destination_data == undefined) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message:
            "Each item in destination_action must have valid destination_app and destination_data.",
        });
      }
    }

    let currentPSTNRecord = await pstn_number.findById(number_id);

    if (!currentPSTNRecord) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Number id invalid",
      });
    }

    const select_type_id: any = await pstn_number.findOne({
      _id: number_id,
      is_deleted: 0,
    });

    if (!select_type_id) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `PSTN Data Not Found.`,
      });
    }
    console.log(select_type);
    console.log(select_type_id);

    if (pstn_id && number_id != pstn_id) {
      await user.updateMany(
        {
          pstn_number: number_id,
        },
        {
          pstn_number: null,
        }
      );
      await pstn_number.findByIdAndUpdate(
        number_id,
        {
          isassigned: 0,
          destination_action: [],
          select_type_data: {},
          select_type: "",
          select_type_uuid: "",
          last_updated_user: uid,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await handleSelectType(
        select_type_id?.select_type_data?.select_id,
        select_type_id?.select_type
      );
    } else if (number_id == pstn_id && select_type != select_type_id?.select_type) {
      await user.updateMany(
        {
          pstn_number: number_id,
        },
        {
          pstn_number: null,
        }
      );
      await handleSelectType(
        select_type_id?.select_type_data?.select_id,
        select_type_id?.select_type
      );
    }

    if (select_type != select_type_id?.select_type) {
      await handleSelectType(
        select_type_id?.select_type_data?.select_id,
        select_type_id?.select_type
      );
    }

    if (select_type == select_type_id?.select_type && number_id != pstn_id) {
      await user.updateMany(
        {
          pstn_number: number_id,
        },
        {
          pstn_number: null,
        }
      );
      await handleSelectType(
        select_type_id?.select_type_data?.select_id,
        select_type_id?.select_type
      );
    }

    if (select_type == select_type_id?.select_type && number_id == pstn_id) {
      await user.updateMany(
        {
          pstn_number: number_id,
        },
        {
          pstn_number: null,
        }
      );
      await handleSelectType(
        select_type_id?.select_type_data?.select_id,
        select_type_id?.select_type
      );
    }

    async function handleSelectType(select_id: string, select_type: Number) {
      console.log(select_id, select_type);

      switch (select_type) {
        case config.SELECT_NAME.IVR:
          await IVR.findByIdAndUpdate(
            { _id: select_id },
            {
              assign_pstn_number: "",
              last_updated_user: uid,
            },
            {
              new: true,
              runValidators: true,
            }
          );
          break;
        case config.SELECT_NAME.RINGGROUP:
          await ring_group.findByIdAndUpdate(
            { _id: select_id },
            {
              assign_pstn_number: "",
              last_updated_user: uid,
            },
            {
              new: true,
              runValidators: true,
            }
          );
          break;
        case config.SELECT_NAME.EXTENSION:
          await user.findByIdAndUpdate(
            { _id: select_id },
            {
              pstn_number: null,
              last_updated_user: uid,
            },
            {
              new: true,
              runValidators: true,
            }
          );
          break;
        case config.SELECT_NAME.CONFERENCE:
          await conferncers.findByIdAndUpdate(
            { _id: select_id },
            {
              assign_pstn_number: "",
              last_updated_user: uid,
            },
            {
              new: true,
              runValidators: true,
            }
          );
          break;
        case config.SELECT_NAME.TIMECONDTION:
          await time_condition.findByIdAndUpdate(
            { _id: select_id },
            {
              assign_pstn_number: "",
              last_updated_user: uid,
            },
            {
              new: true,
              runValidators: true,
            }
          );
          break;
        case config.SELECT_NAME.RECORDING:
          break;
        default:
          return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
            success: 0,
            message: "Fetch Error in Assign Module Data ||",
          });
      }
    }

    // if (pstn_id && number_id != pstn_id) {
    //   const post: any = await pstn_number.findOne({
    //     _id: number_id,
    //     is_deleted: 0,
    //   });

    //   await pstn_number.findByIdAndUpdate(
    //     number_id,
    //     {
    //       isassigned: 0,
    //       destination_action: [],
    //       select_type_data: {},
    //       select_type: "",
    //       select_type_uuid: "",
    //       last_updated_user: uid,
    //     },
    //     {
    //       new: true,
    //       runValidators: true,
    //     }
    //   );
    //   switch (select_type) {
    //     case config.SELECT_NAME.IVR:
    //       await IVR.findByIdAndUpdate(
    //         { _id: post?.select_type_data?.select_id },
    //         {
    //           assign_pstn_number: "",
    //           last_updated_user: user_detail?.uid,
    //         },
    //         {
    //           new: true,
    //           runValidators: true,
    //         }
    //       );
    //       break;
    //     case config.SELECT_NAME.RINGGROUP:
    //       await ring_group.findByIdAndUpdate(
    //         { _id: post?.select_type_data?.select_id },
    //         {
    //           assign_pstn_number: "",
    //           last_updated_user: user_detail?.uid,
    //         },
    //         {
    //           new: true,
    //           runValidators: true,
    //         }
    //       );
    //       break;
    //     case config.SELECT_NAME.EXTENSION:
    //       await extension.findByIdAndUpdate(
    //         { _id: post?.select_type_data?.select_id },
    //         {
    //           assign_pstn_number: "",
    //           last_updated_user: user_detail?.uid,
    //         },
    //         {
    //           new: true,
    //           runValidators: true,
    //         }
    //       );
    //       break;
    //     case config.SELECT_NAME.CONFERENCE:
    //       await conferncers.findByIdAndUpdate(
    //         { _id: post?.select_type_data?.select_id },
    //         {
    //           assign_pstn_number: "",
    //           last_updated_user: user_detail?.uid,
    //         },
    //         {
    //           new: true,
    //           runValidators: true,
    //         }
    //       );
    //       break;
    //     case config.SELECT_NAME.TIMECONDTION:
    //       await time_condition.findByIdAndUpdate(
    //         { _id: post?.select_type_data?.select_id },
    //         {
    //           assign_pstn_number: "",
    //           last_updated_user: user_detail?.uid,
    //         },
    //         {
    //           new: true,
    //           runValidators: true,
    //         }
    //       );
    //       break;
    //     default:
    //       return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
    //         success: 0,
    //         message: "Fetch Error in Assign Module Data ||",
    //       });
    //   }
    // }

    if (select_type == config.SELECT_NAME.IVR) {
      let get_ivr: any = await IVR.findOne({
        ivr_uuid: select_type_uuid,
        is_deleted: 0,
      });
      if (!get_ivr) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `IVR Not Found.`,
        });
      }
      select_type_data.select_name = get_ivr?.name;
      select_type_data.select_extension = get_ivr?.extension;
      select_type_data.select_id = get_ivr?._id;
    }
    if (select_type == config.SELECT_NAME.RINGGROUP) {
      let get_ring_group: any = await ring_group.findOne({
        ring_group_uuid: select_type_uuid,
        is_deleted: 0,
      });
      if (!get_ring_group) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Ring group Not Found.`,
        });
      }
      select_type_data.select_name = get_ring_group?.name;
      select_type_data.select_extension = get_ring_group?.extension;
      select_type_data.select_id = get_ring_group?._id;
    }
    if (select_type == config.SELECT_NAME.EXTENSION) {
      let get_extension: any = await user.findOne({
        extension_uuid: select_type_uuid,
        is_deleted: 0,
      });

      if (!get_extension) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Extension Not Found.`,
        });
      }
      select_type_data.select_name = get_extension?.first_name + " " + get_extension?.last_name;
      select_type_data.select_extension = get_extension?.user_extension;
      select_type_data.select_id = get_extension?._id;
    }
    if (select_type == config.SELECT_NAME.RECORDING) {
      let api_config = {
        method: "get",
        maxBodyLength: Infinity,
        url: ` ${config.PBX_API.RECORDING.GET_uuid}${select_type_uuid}`,
        auth: config.PBX_API.AUTH,
      };

      try {
        const data: any = await axios.request(api_config);
        select_type_data.select_name = data?.data[0]?.recording_name;
        select_type_data.select_extension = data?.data[0]?.recording_filename;
        select_type_data.select_id = data?.data[0]?.recording_uuid;
      } catch (error: any) {
        console.log(error);

        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: "Recording Not Found.",
        });
      }
    }
    if (select_type == config.SELECT_NAME.CONFERENCE) {
      let get_cpnference: any = await conferncers.findOne({
        conference_uuid: select_type_uuid,
        is_deleted: 0,
      });
      if (!get_cpnference) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Conference Not Found.`,
        });
      }
      select_type_data.select_name = get_cpnference?.conference_name;
      select_type_data.select_extension = get_cpnference?.extension_number;
      select_type_data.select_id = get_cpnference?._id;
    }
    if (select_type == config.SELECT_NAME.TIMECONDTION) {
      let get_time_condition: any = await time_condition.findOne({
        time_condition_uuid: select_type_uuid,
        is_deleted: 0,
      });
      if (!get_time_condition) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `time_condition Not Found.`,
        });
      }
      select_type_data.select_name = get_time_condition?.name;
      select_type_data.select_extension = get_time_condition?.extension;
      select_type_data.select_id = get_time_condition?._id;
    }

    let get_company_pstn: any = await pstn_number.findOne({
      _id: pstn_id,
      is_deleted: 0,
    });

    if (!get_company_pstn) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `PSTN Data Not Found.`,
      });
    }

    const companyDetail = await company.findOne({
      _id: get_company_pstn?.cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Company Not Found.`,
      });
    }

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.PSTN.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        domain: companyDetail?.domain_uuid,
        type: get_company_pstn?.type,
        user: get_company_pstn?.user,
        destination: get_company_pstn?.destination,
        caller_id_name: get_company_pstn?.caller_id_name,
        caller_id_number: get_company_pstn?.caller_id_number,
        destination_condition: get_company_pstn?.destination_condition,
        destination_action,
        description: get_company_pstn?.description,
        destination_enabled: get_company_pstn?.destination_enabled == true ? "true" : "false",
        destination_id: get_company_pstn?.pstn_uuid,
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data) {
        const post: any = await pstn_number.findByIdAndUpdate(
          pstn_id,
          {
            isassigned: 1,
            last_updated_user: user_detail?.uid,
            destination_action,
            select_type_data,
            select_type,
            select_type_uuid,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        switch (select_type) {
          case config.SELECT_NAME.IVR:
            await IVR.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                assign_pstn_number: get_company_pstn?.destination,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.RINGGROUP:
            await ring_group.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                assign_pstn_number: get_company_pstn?.destination,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.EXTENSION:
            await user.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                pstn_number: pstn_id,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.CONFERENCE:
            await conferncers.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                assign_pstn_number: get_company_pstn?.destination,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.TIMECONDTION:
            await time_condition.findByIdAndUpdate(
              { _id: post?.select_type_data?.select_id },
              {
                assign_pstn_number: get_company_pstn?.destination,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.RECORDING:
            break;
          default:
            return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
              success: 0,
              message: "Fetch Error in Assign Module Data ||",
            });
        }

        if (select_type == config.SELECT_NAME.EXTENSION) {
          let get_extension_detail: any = await user.findOne({
            extension_uuid: select_type_uuid,
            is_deleted: 0,
          });

          let cid_detail: any = await company.findOne({
            _id: get_extension_detail?.cid,
            is_deleted: 0,
          });

          let api_config = {
            method: "put",
            maxBodyLength: Infinity,
            url: config.PBX_API.EXTENSION.UPDATE,
            auth: config.PBX_API.AUTH,
            data: {
              extension_id: select_type_uuid,
              extension: get_extension_detail.user_extension,
              user: get_extension_detail.user_extension,
              extension_password: get_extension_detail.password,
              outbound_caller_id_name:
                get_extension_detail.first_name + " " + get_extension_detail.last_name,
              outbound_caller_id_number: get_company_pstn?.destination,
              effective_caller_id_name:
                get_extension_detail.first_name + " " + get_extension_detail.last_name,
              effective_caller_id_number: get_company_pstn?.destination,
              max_registrations: "5",
              limit_max: "5",
              user_record: get_extension_detail.user_record ? "true" : "false",
              account_code: cid_detail.domain_name,
              domain: cid_detail?.domain_uuid,
              context: cid_detail.domain_name,
              extension_enabled: "true",
              description: "mob",
            },
          };
          console.log("api_config", api_config);

          try {
            const data: any = await axios.request(api_config);
            console.log("data", data.data);
            if (!data) {
              return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
                success: 0,
                message: "Failed To add Extension number",
              });
            }
          } catch (error: any) {
            return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
              success: 0,
              message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
            });
          }
        }

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Number Updated Successfully",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: "Failed To Update number",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Update pstn number",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const removeAssignpstn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    let pstn_id: any = data.pstn_id;

    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    if (Object.keys(data).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(pstn_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "PSTN id invalid",
      });
    }

    let get_company_pstn: any = await pstn_number.findOne({
      _id: pstn_id,
      is_deleted: 0,
    });

    if (!get_company_pstn) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Pstn Number Not Found.`,
      });
    }

    const companyDetail = await company.findOne({
      _id: get_company_pstn?.cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Company Not Found.`,
      });
    }

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.PSTN.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        domain: companyDetail?.domain_uuid,
        type: get_company_pstn?.type,
        user: get_company_pstn?.user,
        destination: get_company_pstn?.destination,
        caller_id_name: get_company_pstn?.caller_id_name,
        caller_id_number: get_company_pstn?.caller_id_number,
        destination_condition: get_company_pstn?.destination_condition,
        description: get_company_pstn?.description,
        destination_enabled: get_company_pstn?.destination_enabled == true ? "true" : "false",
        destination_id: get_company_pstn?.pstn_uuid,
        destination_action: [],
      },
    };
    try {
      const data: any = await axios.request(api_config);

      if (data) {
        await pstn_number.findByIdAndUpdate(
          {
            _id: pstn_id,
          },
          {
            isassigned: 0,
            destination_action: [],
            select_type_data: {},
            select_type: "",
            select_type_uuid: "",
            last_updated_user: uid,
          },
          {
            new: true,
          }
        );

        switch (get_company_pstn?.select_type) {
          case config.SELECT_NAME.IVR:
            await IVR.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                assign_pstn_number: "",
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.RINGGROUP:
            await ring_group.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                assign_pstn_number: "",
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.EXTENSION:
            await user.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                pstn_number: null,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.CONFERENCE:
            await conferncers.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                assign_pstn_number: "",
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.TIMECONDTION:
            await time_condition.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                assign_pstn_number: "",
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.RECORDING:
            break;
          default:
            return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
              success: 0,
              message: "Fetch Error in Assign Module Data ||",
            });
        }
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "PSTN Number Delete Successfully",
        });
      }
    } catch (error: any) {
      console.log("deleted pstn error", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }
  } catch (error) {
    console.log("delete pstn error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getNumberdetailByid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    let number_id: any = data.number_id;

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

    if (!mongoose.Types.ObjectId.isValid(number_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "number_id Id Is Invalid.",
      });
    }
    const number_data: any = await pstn_number.findOne({
      _id: number_id,
      is_deleted: 0,
    });

    if (!number_data) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Number Data Not Found",
      });
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Number Detail",
      data: number_data,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const dropdownData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let create_cid = new mongoose.Types.ObjectId(user_detail?.cid);

    let selectType: any = data?.select_type;

    if (!selectType) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Select Type Is Requried",
      });
    }
    let unAssignRecord: any;
    if (selectType == 1) {
      unAssignRecord = await IVR.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
          },
        },
        {
          $lookup: {
            from: "pstn_numbers",
            let: { ivrId: "$_id", parentCid: "$cid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$select_type_data.select_id", "$$ivrId"] },
                      { $eq: ["$select_type", 1] },
                      { $eq: ["$cid", "$$parentCid"] },
                    ],
                  },
                },
              },
            ],
            as: "ivr_data",
          },
        },
        {
          $match: {
            ivr_data: { $eq: [] },
          },
        },
        {
          $addFields: {
            extension: "$extension",
            uuid: "$ivr_uuid",
            name: "$name",
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }
    if (selectType == 4) {
      unAssignRecord = await conferncers.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
          },
        },
        {
          $lookup: {
            from: "pstn_numbers",
            let: { ivrId: "$_id", parentCid: "$cid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$select_type_data.select_id", "$$ivrId"] },
                      { $eq: ["$select_type", 4] },
                      { $eq: ["$cid", "$$parentCid"] },
                    ],
                  },
                },
              },
            ],
            as: "ivr_data",
          },
        },
        {
          $match: {
            ivr_data: { $eq: [] },
          },
        },
        {
          $addFields: {
            extension: "$extension_number",
            uuid: "$conference_uuid",
            name: "$conference_name",
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }
    if (selectType == 2) {
      unAssignRecord = await ring_group.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
          },
        },
        {
          $lookup: {
            from: "pstn_numbers",
            let: { ivrId: "$_id", parentCid: "$cid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$select_type_data.select_id", "$$ivrId"] },
                      { $eq: ["$select_type", 2] },
                      { $eq: ["$cid", "$$parentCid"] },
                    ],
                  },
                },
              },
            ],
            as: "ivr_data",
          },
        },
        {
          $match: {
            ivr_data: { $eq: [] },
          },
        },
        {
          $addFields: {
            extension: "$extension",
            uuid: "$ring_group_uuid",
            name: "$name",
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }
    if (selectType == 6) {
      unAssignRecord = await time_condition.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
          },
        },
        {
          $lookup: {
            from: "pstn_numbers",
            let: { ivrId: "$_id", parentCid: "$cid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$select_type_data.select_id", "$$ivrId"] },
                      { $eq: ["$select_type", 6] },
                      { $eq: ["$cid", "$$parentCid"] },
                    ],
                  },
                },
              },
            ],
            as: "ivr_data",
          },
        },
        {
          $match: {
            ivr_data: { $eq: [] },
          },
        },
        {
          $addFields: {
            extension: "$extension",
            uuid: "$time_condition_uuid",
            name: "$name",
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }

    if (selectType == 5) {
      const recordCheck = await pstn_number.find({
        isassigned: 1,
        select_type: 5,
        cid: user_detail?.cid,
      });

      const company_details: any = await company.findById(user_detail?.cid);
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
        const selectTypeUUIDs = recordCheck?.map((item: any) => item.select_type_uuid);

        unAssignRecord = data?.data?.recordings?.filter(
          (item: any) => !selectTypeUUIDs.includes(item.uuid)
        );
      } catch (error: any) {
        console.log(error, "11");
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
        });
      }
    }

    if (selectType == 3) {
      console.log("cid", create_cid);
      unAssignRecord = await user.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
            pstn_number: { $eq: null },
          },
        },
        {
          $lookup: {
            from: "pstn_numbers",
            let: { ivrId: "$_id", parentCid: "$cid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$select_type_data.select_id", "$$ivrId"] },
                      { $eq: ["$select_type", 3] },
                      { $eq: ["$cid", "$$parentCid"] },
                    ],
                  },
                },
              },
            ],
            as: "ivr_data",
          },
        },
        {
          $match: {
            ivr_data: { $eq: [] },
            user_extension: { $ne: "" },
          },
        },
        {
          $addFields: {
            extension: "$user_extension",
            uuid: "$extension_uuid",
            name: {
              $concat: ["$first_name", " ", "$last_name"],
            },
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      data: unAssignRecord,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const updatePstnNumber = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body, "-------req----------");
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let create_cid = new mongoose.Types.ObjectId(user_detail?.cid);
    let uid: any = user_detail?.uid;

    const {
      type,
      destination,
      caller_id_name,
      caller_id_number,
      destination_condition,
      cid,
      description,
      destination_enabled,
      gateway_id,
      pstn_id,
      pstn_range_uuid,
    } = req.body;

    let user_body: any = req.body.user;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      type: "Type",
      // destination: "Destination",
      caller_id_name: "Caller ID Name",
      caller_id_number: "Caller ID Number",
      destination_condition: "Destination Condition",
      description: "Description",
      destination_enabled: "Destination Enabled",
      pstn_range_uuid: "PSTN range uuid",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    if (user_body == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "User Is Mandatory.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(gateway_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Gateway ID is Invalid.",
      });
    }

    const gatewayIdDetail = await trunks.findOne({
      _id: gateway_id,
      is_deleted: 0,
    });

    if (!gatewayIdDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: "Gateway Id Not Found.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "Company ID Invalid.",
      });
    }

    const companyDetail = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: "Company Not Found.",
      });
    }

    if (!pstn_id) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Pstn Number Id Is Required",
      });
    }

    let get_company_pstn: any = await pstn_number.findById({
      _id: pstn_id,
    });

    if (!get_company_pstn) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Pstn Number Not Found",
      });
    }

    // let check_pstn_number_already_exists: any = await pstn_number.findOne({
    //   destination: destination,
    //   is_deleted: 0,
    //   _id: { $ne: pstn_id },
    // });

    // if (check_pstn_number_already_exists) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Pstn Number Already Exists",
    //   });
    // }
    // console.log("get_company_pstn", get_company_pstn);
    // let api_config = {
    //   method: "delete",
    //   maxBodyLength: Infinity,
    //   url: `${config.PBX_API.PSTN.REMOVE}${get_company_pstn?.pstn_uuid}`,
    //   auth: config.PBX_API.AUTH,
    // };

    try {
      // const data: any = await axios.request(api_config);

      if (true) {
        await pstn_number.findByIdAndUpdate(
          {
            _id: pstn_id,
          },
          {
            isassigned: 0,
            destination_action: [],
            select_type_data: {},
            select_type: "",
            select_type_uuid: "",
            last_updated_user: uid,
          },
          {
            new: true,
          }
        );

        switch (get_company_pstn?.select_type) {
          case config.SELECT_NAME.IVR:
            await IVR.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                assign_pstn_number: "",
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.RINGGROUP:
            await ring_group.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                assign_pstn_number: "",
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.EXTENSION:
            await user.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                pstn_number: null,
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.CONFERENCE:
            await conferncers.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                assign_pstn_number: "",
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.TIMECONDTION:
            await time_condition.findByIdAndUpdate(
              { _id: get_company_pstn?.select_type_data?.select_id },
              {
                assign_pstn_number: "",
                last_updated_user: user_detail?.uid,
              },
              {
                new: true,
                runValidators: true,
              }
            );
            break;
          case config.SELECT_NAME.RECORDING:
            break;
          default:
        }
      }
    } catch (error: any) {
      console.log("error", error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }

    let api_config_update = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.PSTN.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        domain: companyDetail?.domain_uuid,
        type,
        user_body,
        destination,
        caller_id_name,
        caller_id_number,
        destination_condition,
        destination_action: [], 
        description,
        destination_enabled: destination_enabled == true ? "true" : "false",
        destination_id: get_company_pstn?.pstn_uuid,
        gateway_id: gateway_id,
      },
    };

    try {
      const data_updated_pstn: any = await axios.request(api_config_update);

      if (data_updated_pstn) {
        const post: any = await pstn_number.updateMany(
          { pstn_range_uuid: pstn_range_uuid },
          {
            type,
            user_body,
            // destination,
            caller_id_name,
            caller_id_number,
            destination_condition,
            destination_action: [],
            cid,
            description,
            destination_enabled,
            last_updated_user: uid,
            gateway_id,
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
    } catch (error) {
      console.log(error);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Update pstn number",
      });
    }
    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Pstn Number Updated Successfully.",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

type DataItem = {
  _id: string;
  type: string;
  destination: string;
  trunk_name: string;
  company_name: string;
  pstn_range_uuid: string;
};

type GroupedItem = {
  _id: string;
  type: string;
  destination: string;
  trunk_name: string;
  company_name: string;
  pstn_range_uuid: string;
};

function groupByDestinationRange(data: DataItem[]): GroupedItem[] {
  // Sort the data by destination
  const sortedData = data.sort((a, b) => parseInt(a.destination) - parseInt(b.destination));

  const result: GroupedItem[] = [];
  let currentGroup: DataItem[] = [];

  for (let i = 0; i < sortedData.length; i++) {
    const current = sortedData[i];
    const prev = currentGroup[currentGroup.length - 1];

    if (
      currentGroup.length === 0 ||
      (current.pstn_range_uuid === prev.pstn_range_uuid &&
        parseInt(current.destination) === parseInt(prev.destination) + 1)
    ) {
      currentGroup.push(current);
    } else {
      // Finalize the current group
      const range: GroupedItem = {
        ...currentGroup[0],
        destination: `${currentGroup[0].destination}-${
          currentGroup[currentGroup.length - 1].destination
        }`,
      };
      result.push(range);
      currentGroup = [current];
    }
  }

  // Finalize the last group
  if (currentGroup.length > 0) {
    const range: GroupedItem = {
      ...currentGroup[0],
      destination: `${currentGroup[0].destination}-${
        currentGroup[currentGroup.length - 1].destination
      }`,
    };
    result.push(range);
  }

  return result;
}

const CompanyWisePstnListByQueryParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let page: any = req.query.page;
    let size: any = req.query.size;
    let cid: any = req.query.cid;
    let search: any = req.query.search;
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    let find_query: { [key: string]: any } = {
      is_deleted: 0,
    };
    if (search) {
      find_query.$or = [
        {
          type: {
            $regex: search,
            $options: "i",
          },
        },
        {
          destination: {
            $regex: search,
            $options: "i",
          },
        },

        {
          trunk_name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company_name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (cid) {
      let create_cid: any = new mongoose.Types.ObjectId(cid);
      find_query.cid = create_cid;
    }

    const pstn_list = await pstn_number.aggregate([
      {
        $lookup: {
          from: "trunks",
          localField: "gateway_id",
          foreignField: "_id",
          pipeline: [{ $match: { is_deleted: 0 } }],
          as: "trunk_detail",
        },
      },
      { $unwind: "$trunk_detail" },
      {
        $lookup: {
          from: "companies",
          localField: "cid",
          foreignField: "_id",
          pipeline: [{ $match: { is_deleted: 0 } }],
          as: "cid_detail",
        },
      },
      { $unwind: "$cid_detail" },
      {
        $addFields: {
          trunk_name: "$trunk_detail.gateway_name",
          company_name: "$cid_detail.company_name",
        },
      },
      { $match: find_query },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          destination: 1,
          cid: 1,
          gateway_id: 1,
          trunk_name: 1,
          company_name: 1,
          type: 1,
          pstn_range_uuid: 1,
        },
      },
    ]);

    const grouped_pstn_list = groupByDestinationRange(pstn_list);
    const endIndex: number = skip + limit;
    const paginated_pstn_data = grouped_pstn_list.slice(skip, endIndex);
    const pstn_total_counts: number = grouped_pstn_list.length;
    const total_page_count: number = Math.ceil(grouped_pstn_list.length / limit);

    res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "PSTN List",
      data: paginated_pstn_data,
      total_page_count: total_page_count,
      pstn_total_counts: pstn_total_counts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const getPstnNumberdetailByidOLD = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let pstn_number_id: any = req.query.pstn_number_id;

    if (!pstn_number_id) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "pstn_number_id is Mandatory",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(pstn_number_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "pstn_number_id Id Is Invalid.",
      });
    }
    const getPstnNumberDetail: any = await pstn_number.findOne({
      _id: pstn_number_id,
      is_deleted: 0,
    });

    if (!getPstnNumberDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "PSTN Number Data Not Found",
      });
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "PSTN Number Detail",
      PstnNumberDetail: getPstnNumberDetail,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getPstnNumberdetailByid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let pstn_range_uuid: any = req.query.pstn_range_uuid ?? "";

    if (!pstn_range_uuid) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "pstn_range_uuid is Mandatory",
      });
    }
    // if (!mongoose.Types.ObjectId.isValid(pstn_number_id)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "pstn_number_id Id Is Invalid.",
    //   });
    // }
    // Champ
    const getPstnNumberDetail: any = await pstn_number
      .find({
        pstn_range_uuid: pstn_range_uuid,
        is_deleted: 0,
      })
      .lean();

    if (!getPstnNumberDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "PSTN Number Data Not Found",
      });
    }

    let PstnNumberDetail = [];
    if (getPstnNumberDetail.length > 0) {
      PstnNumberDetail = {
        ...getPstnNumberDetail[0],
        destination: `${getPstnNumberDetail[0].destination} - ${
          getPstnNumberDetail[getPstnNumberDetail.length - 1].destination
        }`,
      };
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "PSTN Number Detail",
      PstnNumberDetail,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const CallReportsdropdownData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let create_cid = new mongoose.Types.ObjectId(user_detail?.cid);

    let selectType: any = data?.select_type;

    if (!selectType) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Select Type Is Requried",
      });
    }
    let unAssignRecord: any;
    if (selectType == config.SELECT_NAME.IVR) {
      unAssignRecord = await IVR.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
          },
        },
        {
          $addFields: {
            extension: "$extension",
            uuid: "$ivr_uuid",
            name: "$name",
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }
    if (selectType == config.SELECT_NAME.CONFERENCE) {
      unAssignRecord = await conferncers.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
          },
        },
        {
          $addFields: {
            extension: "$extension_number",
            uuid: "$conference_uuid",
            name: "$conference_name",
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }
    if (selectType == config.SELECT_NAME.RINGGROUP) {
      unAssignRecord = await ring_group.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
          },
        },
        {
          $addFields: {
            extension: "$extension",
            uuid: "$ring_group_uuid",
            name: "$name",
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }
    if (selectType == config.SELECT_NAME.TIMECONDTION) {
      unAssignRecord = await time_condition.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
          },
        },
        {
          $addFields: {
            extension: "$extension",
            uuid: "$time_condition_uuid",
            name: "$name",
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }
    let roleId = await role.findOne({ type: 1 });

    if (selectType == config.SELECT_NAME.EXTENSION) {
      console.log("cid", create_cid);
      unAssignRecord = await user.aggregate([
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
            role: { $eq: roleId?._id },
          },
        },
        {
          $addFields: {
            extension: "$user_extension",
            uuid: "$extension_uuid",
            name: {
              $concat: ["$first_name", " ", "$last_name"],
            },
          },
        },
        {
          $project: {
            uuid: 1,
            name: 1,
            extension: 1,
          },
        },
      ]);
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      data: unAssignRecord,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

export default {
  addNewRecord,
  UpdateRecord,
  getpstnNumberList,
  removepstn,
  getAnAssignedPstnNumberList,
  CompanyWisePstnList,
  assignPSTNInNumber,
  updateAssignPSTN,
  removeAssignpstn,
  getNumberdetailByid,
  dropdownData,
  CompanyWisePstnListByQueryParams,
  updatePstnNumber,
  getPstnNumberdetailByid,
  CallReportsdropdownData,
};
