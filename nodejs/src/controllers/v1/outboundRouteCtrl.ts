import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import outbound_route from "../../models/outbound_route";
import axios from "axios";
import company from "../../models/company";
import trunks from "../../models/trunks";

const addNewRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const {
      prefix,
      cid,
      gateway_id,
      gateway_2,
      gateway_3,
      expression_detail,
      description,
      dialplanoutbound_enabled,
      order,
      outbound_name,
    } = req.body;

    const requiredFields = {
      prefix: "Prefix",
      cid: "CID",
      gateway_id: "Gateway ID",
      gateway_2: "Gateway 2",
      gateway_3: "Gateway 3",
      expression_detail: "Expression Detail",
      dialplanoutbound_enabled: "Dialplan Outbound Enabled",
      order: "Order",
      outbound_name: "Outbound Name",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} is mandatory.`,
        });
      }
    }

    // Validate ObjectId fields
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "CID is Invalid.",
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
        message: `Gateway Id Not Found.`,
      });
    }

    let gatewayIdDetail_2: any = null;
    let gatewayIdDetail_3: any = null;

    if (gateway_2) {
      gatewayIdDetail_2 = await trunks.findOne({
        _id: gateway_2,
        is_deleted: 0,
      });

      if (!gatewayIdDetail_2) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Gateway Id 2 Not Found.`,
        });
      }
    }

    if (gateway_3) {
      gatewayIdDetail_3 = await trunks.findOne({
        _id: gateway_3,
        is_deleted: 0,
      });

      if (!gatewayIdDetail_3) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Gateway Id 3 Not Found.`,
        });
      }
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

    const create_outbound_route_obj: any = {
      prefix,
      cid,
      gateway_id,
      gateway_2,
      gateway_3,
      expression_detail,
      context: companyDetail?.domain_name,
      description,
      dialplanoutbound_enabled,
      order,
      outbound_name,
      last_updated_user: uid,
    };

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.OUTBOUND_ROUTE.ADD,
      auth: config.PBX_API.AUTH,
      data: {
        dialplanoutbound_prefix: prefix,
        domain_id: companyDetail?.domain_uuid,
        gateway_id: `${gatewayIdDetail?.trunks_uuid}:${gatewayIdDetail?.gateway_name}`,
        gateway_2: gatewayIdDetail_2
          ? `${gatewayIdDetail_2?.trunks_uuid}:${gatewayIdDetail_2?.gateway_name}`
          : null,
        gateway_3: gatewayIdDetail_3
          ? `${gatewayIdDetail_3?.trunks_uuid}:${gatewayIdDetail_3?.gateway_name}`
          : null,
        expression_detail,
        context: companyDetail?.domain_name,
        description,
        dialplanoutbound_enabled:
          dialplanoutbound_enabled == true ? "true" : "false",
        order,
        name: outbound_name,
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data?.data?.id) {
        create_outbound_route_obj.outbound_route_uuid = data?.data?.id;
        const post = await outbound_route.create(create_outbound_route_obj);

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: data?.data?.msg,
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.msg || "Failed To Create Outbound Route",
        });
      }
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Create Outbound Route",
      });
    }
  } catch (error) {
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
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    const {
      prefix,
      cid,
      gateway_id,
      gateway_2,
      gateway_3,
      expression_detail,
      description,
      dialplanoutbound_enabled,
      order,
      outbound_id,
      outbound_name,
    } = req.body;

    const requiredFields = {
      prefix: "Prefix",
      cid: "CID",
      gateway_id: "Gateway ID",
      gateway_2: "Gateway 2",
      gateway_3: "Gateway 3",
      expression_detail: "Expression Detail",
      dialplanoutbound_enabled: "Dialplan Outbound Enabled",
      order: "Order",
      outbound_name: "Outbound Name",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} is mandatory.`,
        });
      }
    }

    // Validate ObjectId fields

    if (!mongoose.Types.ObjectId.isValid(outbound_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Outbound Id  Is Invalid.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "CID is Invalid.",
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
        message: `Gateway Id Not Found.`,
      });
    }

    let gatewayIdDetail_2: any = null;
    let gatewayIdDetail_3: any = null;

    if (gateway_2) {
      gatewayIdDetail_2 = await trunks.findOne({
        _id: gateway_2,
        is_deleted: 0,
      });

      if (!gatewayIdDetail_2) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Gateway Id 2 Not Found.`,
        });
      }
    }

    if (gateway_3) {
      gatewayIdDetail_3 = await trunks.findOne({
        _id: gateway_3,
        is_deleted: 0,
      });

      if (!gatewayIdDetail_3) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Gateway Id 3 Not Found.`,
        });
      }
    }

    let get_outbound: any = await outbound_route.findOne({
      _id: outbound_id,
      is_deleted: 0,
    });

    if (!get_outbound) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Outbound Not Found.`,
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

    const create_outbound_route_obj: any = {
      prefix,
      cid,
      gateway_id,
      gateway_2,
      gateway_3,
      expression_detail,
      context: companyDetail?.domain_name,
      description,
      dialplanoutbound_enabled,
      order,
      outbound_name,
      last_updated_user: uid,
    };

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.OUTBOUND_ROUTE.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        dialplan_outbound_id: get_outbound?.outbound_route_uuid,
        dialplanoutbound_prefix: prefix,
        domain_id: companyDetail?.domain_uuid,
        gateway_id: `${gatewayIdDetail?.trunks_uuid}:${gatewayIdDetail?.gateway_name}`,
        gateway_2: gatewayIdDetail_2
          ? `${gatewayIdDetail_2?.trunks_uuid}:${gatewayIdDetail_2?.gateway_name}`
          : null,
        gateway_3: gatewayIdDetail_3
          ? `${gatewayIdDetail_3?.trunks_uuid}:${gatewayIdDetail_3?.gateway_name}`
          : null,
        expression_detail,
        context: companyDetail?.domain_name,
        description,
        dialplanoutbound_enabled:
          dialplanoutbound_enabled == true ? "true" : "false",
        order,
        name: outbound_name,
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data?.data?.msg) {
        create_outbound_route_obj.outbound_route_uuid = data?.data?.id;
        const post = await outbound_route.findByIdAndUpdate(
          {
            _id: outbound_id,
          },
          create_outbound_route_obj,
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Dialplan Outbound Updated Successfully !!",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.msg || "Failed To update Outbound Route",
        });
      }
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To update Outbound Route",
      });
    }
  } catch (error) {
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
  const token = await get_token(req);
  const user_detail = await User_token(token);
  let uid = user_detail?.uid;

  let data: any = req.body;
  let outbound_id: any = data.outbound_id;

  if (Object.keys(data).length === 0) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Request Body Params Is Empty",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(outbound_id)) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Outbound Routes Id Is Invalid.",
    });
  }

  let get_outbound: any = await outbound_route.findOne({
    _id: outbound_id,
    is_deleted: 0,
  });

  if (get_outbound == null) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: "Outbound Routes Not Exists.",
    });
  }

  let api_config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `${config.PBX_API.TRUNKS.REMOVE}${get_outbound?.outbound_route_uuid}`,
    auth: config.PBX_API.AUTH,
  };

  try {
    const data: any = await axios.request(api_config);

    if (data) {
      await outbound_route.deleteOne({
        _id: outbound_id,
      });

      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "Outbound Routes Delete Successfully",
      });
    }
  } catch (error: any) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getOutboundlist = async (
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

    let find_query: { [key: string]: any } = {};
    if (search) {
      find_query = {
        is_deleted: 0,
        $or: [
          {
            prefix: {
              $regex: search,
              $options: "i",
            },
          },
          {
            context: {
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
          {
            outbound_name: {
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

    const outbound_routes_list: any = await outbound_route.aggregate([
      { $match: find_query },
      {
        $lookup: {
          from: "trunks",
          localField: "gateway_id",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                is_deleted: 0,
              },
            },
          ],
          as: "trunk_detail",
        },
      },
      {
        $unwind: "$trunk_detail",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $addFields: {
          trunk_name: "$trunk_detail.gateway_name",
        },
      },
      {
        $project: {
          prefix: 1,
          cid: 1,
          gateway_id: 1,
          gateway_2: 1,
          gateway_3: 1,
          expression_detail: 1,
          description: 1,
          dialplanoutbound_enabled: 1,
          order: 1,
          outbound_name: 1,
          trunk_name: 1,
          context: 1,
        },
      },
    ]);

    const outbound_rout_total_counts: any = await outbound_route.aggregate([
      { $match: find_query },
      {
        $lookup: {
          from: "trunks",
          localField: "gateway_id",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                is_deleted: 0,
              },
            },
          ],
          as: "trunk_detail",
        },
      },
      {
        $unwind: "$trunk_detail",
      },
      {
        $count: "totalDocuments",
      },
    ]);
    let total_count = outbound_rout_total_counts[0]?.totalDocuments || 0;
    let total_page_count: any = Math.ceil(total_count / size);

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Outbound Route List",
      data: outbound_routes_list,
      total_page_count: total_page_count,
      outbound_route_total_counts: total_count,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getOutboundByid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let outbound_id: any = data.outbound_id;

    if (Object.keys(data).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(outbound_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Outbound Id Is Invalid.",
      });
    }

    const outbound_route_data: any = await outbound_route.findById({
      _id: outbound_id,
    });

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Outbound Route Detail",
      OutboundRouteDetail: outbound_route_data,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getMatchPattern = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url: config.PBX_API.OUTBOUND_ROUTE.DIALPLAN,
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
        message: "Failed to get dialplan_expression",
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
  addNewRecord,
  EditNewRecord,
  DeleteRecord,
  getOutboundlist,
  getOutboundByid,
  getMatchPattern,
};
