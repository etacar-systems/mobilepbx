import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import trunks from "../../models/trunks";
import company from "../../models/company";
import axios from "axios";

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
      gateway_name,
      cid,
      username,
      password,
      realm,
      from_user,
      proxy,
      expire_seconds,
      retry_seconds,
      register,
      gateway_enabled,
      description,
      transport,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      gateway_name: "Gateway Name",
      //  cid: "CID",
      username: "Username",
      password: "Password",
      realm: "Realm",
      //  from_user: "From User",
      proxy: "Proxy",
      expire_seconds: "Expire Seconds",
      retry_seconds: "Retry Seconds",
      register: "Register",
      gateway_enabled: "Gateway Enabled",
      description: "Description",
      transport: "Transport",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    if (!REGEXP.trunks.expire_seconds.test(expire_seconds)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "expire_seconds is Invalid",
      });
    }
    if (!REGEXP.trunks.expire_seconds.test(retry_seconds)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "retry_seconds is Invalid",
      });
    }
    if (!REGEXP.trunks.proxy.test(proxy)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "proxy is Invalid",
      });
    }
    if (!REGEXP.trunks.proxy.test(realm)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "realm is Invalid",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Copmany Id Invalid.`,
      });
    }

    const companyDetail = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Copmany Not Found.`,
      });
    }

    const create_trunk_obj: any = {
      gateway_name,
      cid,
      username,
      password,
      realm,
      from_user,
      proxy,
      expire_seconds,
      retry_seconds,
      register,
      profile: "external",
      context: companyDetail?.domain_name,
      gateway_enabled,
      description,
      last_updated_user: uid,
      transport,
    };

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.TRUNKS.ADD,
      auth: config.PBX_API.AUTH,
      data: {
        gateway_name,
        domain_id: companyDetail?.domain_uuid,
        username,
        password,
        realm,
        from_user,
        proxy,
        expire_seconds,
        retry_seconds,
        register: register == true ? "true" : "false",
        profile: "external",
        context: companyDetail?.domain_name,
        gateway_enabled: gateway_enabled == true ? "true" : "false",
        description,
        transport,
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data?.data?.id) {
        create_trunk_obj.trunks_uuid = data?.data?.id;
        await trunks.create(create_trunk_obj);

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: data?.data?.message,
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.message || "Failed To Create Trunks",
        });
      }
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Create Trunks",
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
      gateway_name,
      cid,
      username,
      password,
      realm,
      from_user,
      proxy,
      expire_seconds,
      retry_seconds,
      register,
      gateway_enabled,
      description,
      trunk_id,
      transport,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    const requiredFields = {
      gateway_name: "Gateway Name",
      cid: "CID",
      username: "Username",
      password: "Password",
      realm: "Realm",
      from_user: "From User",
      proxy: "Proxy",
      expire_seconds: "Expire Seconds",
      retry_seconds: "Retry Seconds",
      register: "Register",
      gateway_enabled: "Gateway Enabled",
      description: "Description",
      trunk_id: "Trunks Id",
      transport: "Transport",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} Is Mandatory.`,
        });
      }
    }

    if (!REGEXP.trunks.expire_seconds.test(expire_seconds)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "expire_seconds is Invalid",
      });
    }
    if (!REGEXP.trunks.expire_seconds.test(retry_seconds)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "retry_seconds is Invalid",
      });
    }
    if (!REGEXP.trunks.proxy.test(proxy)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "proxy is Invalid",
      });
    }
    if (!REGEXP.trunks.proxy.test(realm)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "realm is Invalid",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(trunk_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Trunk Id Is Invalid.",
      });
    }

    let get_trunk: any = await trunks.findOne({
      _id: trunk_id,
      is_deleted: 0,
    });

    if (get_trunk == null) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Trunk Not Exists.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Copmany Id Invalid.`,
      });
    }

    const companyDetail = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Copmany Not Found.`,
      });
    }

    const update_trunk_obj: any = {
      gateway_name,
      cid,
      username,
      password,
      realm,
      from_user,
      proxy,
      expire_seconds,
      retry_seconds,
      register,
      profile: "external",
      context: companyDetail?.domain_name,
      gateway_enabled,
      description,
      last_updated_user: uid,
      transport,
    };

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.TRUNKS.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        gateway_name,
        domain_id: companyDetail?.domain_uuid,
        username,
        password,
        realm,
        from_user,
        proxy,
        expire_seconds,
        retry_seconds,
        register: register == true ? "true" : "false",
        profile: "external",
        context: companyDetail?.domain_name,
        gateway_enabled: gateway_enabled == true ? "true" : "false",
        description,
        gateway_id: get_trunk?.trunks_uuid,
        transport,
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data) {
        const post = await trunks.findByIdAndUpdate(
          {
            _id: trunk_id,
          },
          update_trunk_obj,
          {
            runValidators: true,
          }
        );

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: data?.data?.message,
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.message || "Failed To Update Trunks",
        });
      }
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Update Trunks",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const DeleteRocrd = async (req: Request, res: Response, next: NextFunction) => {
  const token = await get_token(req);
  const user_detail = await User_token(token);
  let uid = user_detail?.uid;

  let data: any = req.body;
  let trunk_id: any = data.trunk_id;

  if (Object.keys(data).length === 0) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Request Body Params Is Empty",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(trunk_id)) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "Trunk Id Is Invalid.",
    });
  }

  let get_trunk: any = await trunks.findById({
    _id: trunk_id,
  });

  if (get_trunk == null) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: "Trunk Not Exists.",
    });
  }

  let api_config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `${config.PBX_API.TRUNKS.REMOVE}${get_trunk?.trunks_uuid}`,
    auth: config.PBX_API.AUTH,
  };

  try {
    const data: any = await axios.request(api_config);

    if (data) {
      await trunks.deleteOne({
        _id: trunk_id,
      });

      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: data?.data?.message,
      });
    }
  } catch (error: any) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const gettrunkslist = async (
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
            gateway_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            proxy: {
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
            username: {
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

    const trunk_list: any = await trunks
      .find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const trunk_total_counts: any = await trunks
      .find(find_query)
      .countDocuments();

    let total_page_count: any = Math.ceil(trunk_total_counts / size);

    res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Trunk List",
      data: trunk_list,
      total_page_count: total_page_count,
      company_total_counts: trunk_total_counts,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getTrunkdetailByid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let trunk_id: any = data.trunk_id;
    if (Object.keys(data).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(trunk_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "trunk_id Id Is Invalid.",
      });
    }
    const trunk_data: any = await trunks.findById({
      _id: trunk_id,
    });

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Trunk Detail",
      TrunkDetail: trunk_data,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getTrunkNameList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trunk_data: any[] = await trunks
      .find({
        is_deleted: 0,
      })
      .select("gateway_name");

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Gateway found Successfully.",
      data: trunk_data,
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
  DeleteRocrd,
  gettrunkslist,
  getTrunkdetailByid,
  getTrunkNameList,
};
