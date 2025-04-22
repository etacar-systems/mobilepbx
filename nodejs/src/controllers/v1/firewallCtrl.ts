import { NextFunction, Request, Response } from "express";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import company from "../../models/company";
import firewall from "../../models/firewall";
import get_token from "../../helper/userHeader";
import User_token from "../../helper/helper";
import { config } from "../../config";
import axios from "axios";

const addFirewallData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);

    const {
      access_control_name,
      access_control_default,
      access_control_description,
      access_control_nodes,
      cid,
      add_assign_zone,
    } = req.body;

    const requiredFields = {
      // access_control_name: "Access Control Name",
      access_control_default: "Access Control Default",
      access_control_description: "Access Control Description",
      add_assign_zone: "Add Assign Zone",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} is mandatory.`,
        });
      }
    }

    if (access_control_nodes && !Array.isArray(access_control_nodes)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "Access Control Nodes must be an array.",
      });
    }

    if (access_control_nodes) {
      for (const node of access_control_nodes) {
        if (!node.node_type || !node.node_cidr || !node.node_description) {
          return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
            success: 0,
            message:
              "Each node must include node_type, node_cidr, and node_description.",
          });
        }
      }
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

    const firewallObj: any = {
      access_control_name: companyDetail?.company_name,
      access_control_default,
      access_control_description,
      access_control_nodes,
      last_updated_user: user_detail?.uid,
      cid,
      add_assign_zone,
    };

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.FIREWALL.ADD,
      auth: config.PBX_API.AUTH,
      data: {
        access_control_name: companyDetail?.company_name,
        access_control_default,
        access_control_description,
        access_control_nodes,
      },
    };
    //   console.log(api_config);

    try {
      const data: any = await axios.request(api_config);
      //     console.log(data);

      if (data?.data?.id) {
        firewallObj.firewall_uuid = data?.data?.id;
        const dataAdd = await firewall.create(firewallObj);

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: data?.data?.message,
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.message || "Failed To Create Firewall Data",
        });
      }
    } catch (error) {
      console.log(error);

      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Create Firewall Data",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const editFirewallData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);

    const {
      access_control_name,
      access_control_default,
      access_control_description,
      access_control_nodes,
      firewall_id,
      cid,
      add_assign_zone,
    } = req.body;

    const requiredFields = {
      // access_control_name: "Access Control Name",
      access_control_default: "Access Control Default",
      access_control_description: "Access Control Description",
      add_assign_zone: "Add Assign Zone",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} is mandatory.`,
        });
      }
    }

    if (access_control_nodes && !Array.isArray(access_control_nodes)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "Access Control Nodes must be an array.",
      });
    }

    if (access_control_nodes) {
      for (const node of access_control_nodes) {
        if (!node.node_type || !node.node_cidr || !node.node_description) {
          return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
            success: 0,
            message:
              "Each node must include node_type, node_cidr, and node_description.",
          });
        }
      }
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

    if (!mongoose.Types.ObjectId.isValid(firewall_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Firewall ID is Invalid.",
      });
    }

    const firewallDetail = await firewall.findOne({
      _id: firewall_id,
      is_deleted: 0,
    });

    if (!firewallDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
        success: 0,
        message: `Firewall Id Not Found.`,
      });
    }

    const firewallObj: any = {
      access_control_name: companyDetail?.company_name,
      access_control_default,
      access_control_description,
      access_control_nodes,
      last_updated_user: user_detail?.uid,
      cid,
      add_assign_zone,
    };

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.FIREWALL.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        access_control_name: companyDetail?.company_name,
        access_control_default,
        access_control_description,
        access_control_nodes,
        access_control_id: firewallDetail?.firewall_uuid,
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data) {
        const dataAdd = await firewall.findByIdAndUpdate(
          {
            _id: firewall_id,
          },
          firewallObj,
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Firewall Data Update Successfully",
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.message || "Failed To Update Firewall Data",
        });
      }
    } catch (error) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Update Firewall Data",
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const getFirewallRecord = async (
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
    let company_query: { [key: string]: any } = {};
    if (search) {
      find_query = {
        is_deleted: 0,
        $or: [
          {
            access_control_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            access_control_default: {
              $regex: search,
              $options: "i",
            },
          },
          {
            access_control_description: {
              $regex: search,
              $options: "i",
            },
          },
          {
            add_assign_zone: {
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

    const firewall_list: any = await firewall
      .find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total_msg_count: any = await firewall
      .find(find_query)
      .countDocuments();

    const total_pages: any = Math.ceil(total_msg_count / size);

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Firewall list get successfully",
      firewallsData: firewall_list,
      total_page_count: total_pages,
      firewall_total_counts: total_msg_count,
    });
  } catch (error) {
    console.log(error);

    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

const deleteFirewallData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let data: any = req.body;
    let firewall_id: any = data.firewall_id;

    if (Object.keys(data).length == 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(firewall_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Firewall Id Is Invalid.",
      });
    }

    let getFirewallId = await firewall.findById({
      _id: firewall_id,
    });

    if (getFirewallId == null) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Firewall Not Exists.",
      });
    }

    let api_config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${config.PBX_API.FIREWALL.REMOVE}${getFirewallId?.firewall_uuid}`,
      auth: config.PBX_API.AUTH,
    };

    try {
      const data: any = await axios.request(api_config);

      if (data) {
        await firewall.deleteOne({
          _id: firewall_id,
        });

        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "Firewall Deleted  Delete Successfully",
        });
      }
    } catch (error: any) {
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

const getFirewallDataById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let firewall_id: any = data.firewall_id;

    if (Object.keys(data).length == 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(firewall_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Firewall Id Is Invalid.",
      });
    }

    let getFirewallId = await firewall.findById({
      _id: firewall_id,
    });

    if (getFirewallId == null) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Firewall Not Exists.",
      });
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Firewall Detail successfully",
      firewallDetail: getFirewallId,
    });
  } catch (error) {
    console.log(error);

    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

export default {
  addFirewallData,
  getFirewallRecord,
  deleteFirewallData,
  getFirewallDataById,
  editFirewallData,
};
