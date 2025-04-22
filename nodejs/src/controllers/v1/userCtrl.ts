import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import user from "../../models/user";
import group from "../../models/group";
import user_tokens from "../../models/user_tokens";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import { config } from "../../config";
import jwt from "jsonwebtoken";
import REGEXP from "../../regexp";
import _ from "lodash";
import role from "../../models/role";
import axios from "axios";
import company from "../../models/company";
import PSTNNumber from "../../models/pstn_number";
import CONSTANT from "../../constant";
import { socket } from "../../socket";
import getsmtpDetail from "../../helper/getsmtpDetail";
import email from "../../models/email";
import sendMail from "../../helper/sendMail";
import sendMailSendGrid from "../../helper/sendMail_sendGrid";

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var data = req.body;
    console.log(data);
    const results = await user.findOne({
      user_email: data.user_email?.toLowerCase(),
      is_deleted: 0,
    });
    console.log(results);

    if (results == null) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "This E-Mail Does not exist",
      });
    }

    const results_user = await user
      .findOne({
        user_email: data.user_email?.toLowerCase(),
        password: data.password,
        is_deleted: 0,
      })
      .populate({
        path: "role",
        model: "role",
        select: "_id type name",
      })
      .select(
        "first_name last_name user_email user_mobile_no  user_address user_extension user_did cid extension_uuid user_image"
      );
    console.log(results_user);

    if (results_user == null) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Password Incorrect",
      });
    }

    if (results_user?.role?.type !== 3) {
      const company_details = await company.findOne({
        _id: results?.cid,
        is_deleted: 0,
      });

      if (!company_details) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).json({
          success: 0,
          message: `Copmany Not Found.`,
        });
      }
    }
    try {
      let userData: any = {};
      if (results_user.role.type === CONSTANT.ROLE.AGENT) {
        let api_config = {
          method: "get",
          maxBodyLength: Infinity,
          url: config.PBX_API.EXTENSION.GET_BY_ID + results_user.extension_uuid,
          auth: config.PBX_API.AUTH,
        };
        const extensionData: any = await axios.request(api_config);
        console.log(extensionData?.data);
        if (extensionData.data?.message !== undefined) {
          return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
            success: 0,
            message: "User does not exist !",
          });
        }
        userData.domain_name = extensionData.data[0]?.domain_name;
        userData.sip_password = extensionData.data[0]?.password;
        userData.sip_username = extensionData.data[0]?.extension;
        // userData.domain_name = "";
        // userData.sip_password = "";
        // userData.sip_username = "";
      }
      let company_details: any;
      if (
        results_user.role.type === CONSTANT.ROLE.AGENT ||
        results_user.role.type === CONSTANT.ROLE.ADMIN ||
        results_user.role.type === CONSTANT.ROLE.SUB_ADMIN
      ) {
        company_details = await company.findOne({
          _id: results_user.cid,
          is_deleted: 0,
        });
        console.log(company_details);

        if (company_details) {
          userData.company_name = company_details.company_name;
          userData.domain_uuid = company_details.domain_uuid;
        }
      }
      const token = jwt.sign(
        {
          uid: results._id,
          cid: results.cid.toString(),
        },
        config.key.secret_key
      );
      const token_post = new user_tokens();
      token_post.uid = results._id as string;
      token_post.token = token;
      token_post.push_token = data.push_token ? data.push_token : "";

      //token_post.push_type = results.push_type ? results.push_type : 0;
      await token_post.save();

      res.send({
        success: 1,
        message: "Your Token and Details",
        Token: token,
        UserDetails: {
          ...results_user.toObject(),
          ...userData,
          company_details: company_details,
        },
      });
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
const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var token = req.header("Authorization");
    //const token = await get_token(req);
    const user_detail = await User_token(token);
    var uid = user_detail?.uid;
    let log = await user_tokens.findOneAndDelete({
      token: token,
      uid: uid,
    });
    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Logout Successfully",
      logoutUser: log,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const addUser = async (req: Request, res: Response, next: NextFunction) => {
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

    let company_details: any = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });
    if (!company_details) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Please Select Domain.",
      });
    }

    let roleId = await role.findOne({ type: 1 });

    let extensionCount = await user
      .find({ cid: cid, is_deleted: 0, role: { $eq: roleId?._id } })
      .countDocuments();

    if (company_details?.extension_count === extensionCount) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: `You can't create more than ${company_details?.extension_count} extensions`,
      });
    }

    let {
      pstn_number,
      first_name,
      last_name,
      password,
      user_image,
      user_custom_msg,
      user_extension,
      user_email,
      mobile,
      country,
      user_record,
      user_type,
    } = req.body;

    if (cid == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Cid Is Mandatory.",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Invalid ObjectId",
      });
    }
    // if (user_extension == undefined) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "User Extentsion Is Mandatory.",
    //   });
    // }
    if (
      user_extension != undefined &&
      !REGEXP.USER.user_extension.test(user_extension)
    ) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Extentsion Is Invalid.",
      });
    }
    if (first_name == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "First Name Is Mandatory.",
      });
    }
    // if (!REGEXP.USER.first_name.test(first_name)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "First Name Is Invalid.",
    //   });
    // }
    if (last_name == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Last Name Is Mandatory.",
      });
    }
    // if (!REGEXP.USER.last_name.test(last_name)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Last Name Is Invalid.",
    //   });
    // }
    if (user_email == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Email Is Mandatory.",
      });
    }
    if (!REGEXP.USER.user_email.test(user_email)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Email Is Invalid.",
      });
    }
    if (password == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Password Is Mandatory.",
      });
    }
    if (!REGEXP.USER.password.test(password)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Password Is Invalid.",
      });
    }

    // if (mobile !== undefined && !REGEXP.extension.mobile.test(mobile)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Mobile Is Invalid.",
    //   });
    // }

    if (user_custom_msg === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "user_custom_msg Is Mandatory.",
      });
    }
    if (user_image === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "user_image Is Mandatory.",
      });
    }

    if (country === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "country Is Mandatory.",
      });
    }
    if (user_type === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "user type Is Mandatory.",
      });
    }

    if (!REGEXP.USER.user_type.test(user_type)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "user type Is Invalid.",
      });
    }

    const emailCheck: any = await user.findOne({
      user_email: user_email.toLowerCase(),
      is_deleted: 0,
    });

    if (emailCheck) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Email Is Already Exist.",
      });
    }

    if (user_extension !== undefined) {
      let check_extension: any = await user.findOne({
        is_deleted: 0,
        user_extension: user_extension,
        cid: company_details._id,
      });

      if (check_extension) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "Extension Number Already Exist.",
        });
      }
    }

    let userRole = await role.findOne({ type: user_type });

    if (!userRole) {
      res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "Role is incorrect",
      });
      return;
    }

    let get_company_pstn: any = null;
    if (pstn_number !== undefined && user_type !== CONSTANT.ROLE.SUB_ADMIN) {
      get_company_pstn = await PSTNNumber.findOne({
        _id: pstn_number,
        is_deleted: 0,
      });

      if (!get_company_pstn) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "PSTN Number Not Found.",
        });
      }
    }

    let check_extension_limit: any = await company.findById({
      _id: cid,
    });

    let get_subadmin_role: any = await role
      .find({
        $or: [{ type: CONSTANT.ROLE.SUB_ADMIN }, { type: CONSTANT.ROLE.ADMIN }],
      })
      .distinct("_id");

    let get_total_extantion: any = await user
      .find({
        cid: cid,
        is_deleted: 0,
        role: { $nin: get_subadmin_role },
      })
      .countDocuments();

    // if(check_extension_limit.extension_count == get_total_extantion || get_total_extantion > check_extension_limit.extension_count){
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Extension Creation Limit is Over",
    //   });
    // }

    let create_add_obj: any = {
      cid,
      pstn_number: pstn_number !== undefined ? pstn_number : null,
      first_name,
      last_name,
      password,
      user_image,
      user_custom_msg,
      user_extension,
      user_email: user_email.toLowerCase(),
      mobile: mobile !== undefined ? mobile : "",
      country,
      role: userRole._id,
      last_updated_user: user_detail?.uid,
      user_record,
    };
    if (user_type !== CONSTANT.ROLE.SUB_ADMIN) {
      try {
        let api_config = {
          method: "put",
          maxBodyLength: Infinity,
          url: config.PBX_API.EXTENSION.ADD,
          auth: config.PBX_API.AUTH,
          data: {
            extension: user_extension,
            user: user_extension,
            extension_password: password,
            outbound_caller_id_name: first_name + " " + last_name,
            outbound_caller_id_number:
              pstn_number !== undefined
                ? get_company_pstn?.destination
                : user_extension,
            effective_caller_id_name: first_name + " " + last_name,
            effective_caller_id_number:
              pstn_number !== undefined
                ? get_company_pstn?.destination
                : user_extension,
            max_registrations: "5",
            limit_max: "5",
            user_record: user_record ? "true" : "false",
            account_code: company_details.domain_name,
            domain: company_details?.domain_uuid,
            context: company_details.domain_name,
            extension_enabled: "true",
            description: "",
          },
        };
        //console.log(api_config)
        const data: any = await axios.request(api_config);
        //console.log(data?.data);
        if (data?.data?.id && data?.data?.msg) {
          create_add_obj.extension_uuid = data?.data?.id;

          const CreatedUser = await user.create(create_add_obj);

          try {
            let get_emptdetail_tmp: any = await getsmtpDetail();
            let get_email_content: any = await email.findOne({
              email_type: 1,
            });

            if (
              get_email_content !== null &&
              Object.keys(get_emptdetail_tmp).length > 0
            ) {
              let user_name_tmp: any = first_name + " " + last_name;
              let email_aadress: any = CreatedUser.user_email;
              let replace_name: any = get_email_content.message.replace(
                "{{Username}}",
                user_name_tmp
              );
              let replace_email = replace_name.replace(
                "{{Email}}",
                email_aadress
              );
              let replace_password = replace_email.replace(
                "{{Password}}",
                password
              );

              //console.log("replace_pass",replace_pass)
              let notification_obj: any = {
                host: get_emptdetail_tmp.mail_host,
                port: get_emptdetail_tmp.port,
                username: get_emptdetail_tmp.auth_user,
                password: get_emptdetail_tmp.auth_password,
                from: get_email_content.from,
                to: CreatedUser.user_email,
                subject: get_email_content.subject,
                html: replace_password,
                title: get_email_content.email_title,
              };
              if (get_emptdetail_tmp.sendgrid_auth) {
                sendMailSendGrid(
                  notification_obj,
                  get_emptdetail_tmp.is_auth,
                  get_emptdetail_tmp.sendgrid_token
                );
              } else {
                sendMail(notification_obj, get_emptdetail_tmp.is_auth);
              }
            }
          } catch (error) {
            //console.log("Error in sending Email for new Enterprise creation :",error);
          }

          let select_type_data: any = {
            select_name: first_name + " " + last_name,
            select_extension: user_extension,
            select_id: CreatedUser?._id,
          };

          let destination_action: any = [
            {
              destination_app: "transfer",
              destination_data: `${user_extension} XML ${company_details?.domain_name}`,
            },
          ];
          if (pstn_number) {
            try {
              let api_config1 = {
                method: "put",
                maxBodyLength: Infinity,
                url: config.PBX_API.PSTN.UPDATE,
                auth: config.PBX_API.AUTH,
                data: {
                  domain: company_details?.domain_uuid,
                  type: get_company_pstn?.type,
                  user: get_company_pstn?.user,
                  destination: get_company_pstn?.destination,
                  caller_id_name: get_company_pstn?.caller_id_name,
                  caller_id_number: get_company_pstn?.caller_id_number,
                  destination_condition:
                    get_company_pstn?.destination_condition,
                  destination_action,
                  description: get_company_pstn?.description,
                  destination_enabled:
                    get_company_pstn?.destination_enabled == true
                      ? "true"
                      : "false",
                  destination_id: get_company_pstn?.pstn_uuid,
                },
              };
              //console.log("pstn_number update",api_config1)
              const data1: any = await axios.request(api_config1);

              if (data1) {
                await PSTNNumber.findByIdAndUpdate(
                  {
                    _id: pstn_number,
                    cid,
                  },
                  {
                    isassigned: 1,
                    assigend_extensionId: CreatedUser._id,
                    last_updated_user: user_detail?.uid,
                    destination_action,
                    select_type_data,
                    select_type: 3,
                    select_type_uuid: data?.data?.id,
                  },
                  {
                    runValidators: true,
                  }
                );
              }
            } catch (error) {
              return res
                .status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER)
                .send({
                  success: 0,
                  message: "Failed To add pstn number",
                });
            }
          }
          return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
            success: 1,
            message: "User created successfully",
            data: CreatedUser,
          });
        }
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: data?.data?.message,
        });
      } catch (error: any) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
        });
      }
    } else {
      create_add_obj.user_extension = "";
      create_add_obj.pstn_number = null;
      const CreatedUser_SubAdmin = await user.create(create_add_obj);

      try {
        let get_emptdetail_tmp: any = await getsmtpDetail();
        let get_email_content: any = await email.findOne({
          email_type: 3,
        });

        if (
          get_email_content !== null &&
          Object.keys(get_emptdetail_tmp).length > 0
        ) {
          let user_name_tmp: any = first_name + " " + last_name;
          let email_aadress: any = CreatedUser_SubAdmin.user_email;
          let replace_name: any = get_email_content.message.replace(
            "{{CustomerName}}",
            user_name_tmp
          );
          let replace_email = replace_name.replace(
            "{{CustomerEmail}}",
            email_aadress
          );
          let replace_password = replace_email.replace(
            "{{CustomerPass}}",
            password
          );

          //console.log("replace_pass",replace_pass)
          let notification_obj: any = {
            host: get_emptdetail_tmp.mail_host,
            port: get_emptdetail_tmp.port,
            username: get_emptdetail_tmp.auth_user,
            password: get_emptdetail_tmp.auth_password,
            from: get_email_content.from,
            to: CreatedUser_SubAdmin.user_email,
            subject: get_email_content.subject,
            html: replace_password,
            title: get_email_content.email_title,
          };
          sendMail(notification_obj, get_emptdetail_tmp.is_auth);
        }
      } catch (error) {
        //console.log("Error in sending Email for new Enterprise creation :",error);
      }
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "User created successfully",
        data: CreatedUser_SubAdmin,
      });
    }
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getForwarduserlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let cid: any = user_detail?.cid;
    let uid: any = user_detail?.uid;

    let create_uid = new mongoose.Types.ObjectId(uid);
    let create_uid_String = uid.toString();
    let create_cid = new mongoose.Types.ObjectId(cid);

    let get_subadmin_role: any = await role
      .find({
        $or: [{ type: CONSTANT.ROLE.SUB_ADMIN }, { type: CONSTANT.ROLE.ADMIN }],
      })
      .distinct("_id");

    let get_detail: any[] = await user
      .aggregate([
        {
          $match: {
            _id: { $ne: create_uid },
            cid: create_cid,
            is_deleted: 0,
            isguest: { $ne: 1 },
            role: { $nin: get_subadmin_role },
          },
        },
        {
          $lookup: {
            from: "conversations",
            localField: "_id",
            foreignField: "sender_id",
            pipeline: [
              {
                $match: {
                  receiver_id: create_uid,
                  is_deleted: 0,
                  delete_message_users: { $ne: create_uid_String },
                  message_type: { $ne: 3 },
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              { $limit: 1 },
            ],
            as: "recived_message",
          },
        },
        {
          $lookup: {
            from: "conversations",
            localField: "_id",
            foreignField: "receiver_id",
            pipeline: [
              {
                $match: {
                  sender_id: create_uid,
                  is_deleted: 0,
                  delete_message_users: { $ne: create_uid_String },
                  message_type: { $ne: 3 },
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              { $limit: 1 },
            ],
            as: "sended_message",
          },
        },
        {
          $addFields: {
            message_data: {
              $concatArrays: ["$recived_message", "$sended_message"],
            },
            name: { $concat: ["$first_name", " ", "$last_name"] },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            cid: 1,
            user_extension: 1,
            image: "$user_image",
            message_data: 1,
            is_online: 1,
          },
        },
        {
          $unwind: {
            path: "$message_data",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { "message_data.createdAt": -1 },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            cid: { $first: "$cid" },
            user_extension: { $first: "$user_extension" },
            image: { $first: "$image" },
            is_online: { $first: "$is_online" },
          },
        },
        {
          $addFields: {
            last_message_time: "$message_data.createdAt",
            last_message: "$message_data.message",
            last_media_type: "$message_data.media_type",
          },
        },
        {
          $lookup: {
            from: "user_blocks",
            localField: "_id",
            foreignField: "block_id",
            pipeline: [
              {
                $match: {
                  block_by: create_uid,
                },
              },
            ],
            as: "blocke_user",
          },
        },
        {
          $lookup: {
            from: "conversations",
            localField: "_id",
            foreignField: "sender_id",
            pipeline: [
              {
                $match: {
                  receiver_id: create_uid,
                  message_type: { $ne: 3 },
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              { $limit: 1 },
            ],
            as: "recived_message_deleted",
          },
        },
        {
          $lookup: {
            from: "conversations",
            localField: "_id",
            foreignField: "receiver_id",
            pipeline: [
              {
                $match: {
                  sender_id: create_uid,
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              { $limit: 1 },
            ],
            as: "sended_message_deleted",
          },
        },
        {
          $addFields: {
            message_data_delete: {
              $concatArrays: [
                "$recived_message_deleted",
                "$sended_message_deleted",
              ],
            },
            isBlocked: {
              $size: "$blocke_user",
            },
            isGroup: 0,
          },
        },
        // {
        //   $unwind: "$message_data_delete",

        // },
        {
          $unwind: {
            path: "$message_data_delete",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { "message_data_delete.createdAt": -1 },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            cid: { $first: "$cid" },
            user_extension: { $first: "$user_extension" },
            image: { $first: "$image" },
            message_data: { $first: "$message_data" },
            message_data_delete: { $first: "$message_data_delete" },
            last_message_time: { $first: "$last_message_time" },
            last_message: { $first: "$last_message" },
            last_media_type: { $first: "$last_media_type" },
            isBlocked: { $first: "$isBlocked" },
            isGroup: { $first: "$isGroup" },
            is_online: { $first: "$is_online" },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            cid: 1,
            user_extension: 1,
            image: 1,
            last_message_time: {
              $ifNull: ["$last_message_time", "$message_data_delete.createdAt"],
            },
            last_message: 1,
            last_media_type: 1,
            isBlocked: 1,
            isGroup: 1,
            is_online: 1,
          },
        },
      ])
      .sort({
        last_message_time: -1,
      });

    let get_group_detail = await group
      .aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $match: {
            cid: create_cid,
            is_deleted: 0,
            group_users: { $in: [create_uid_String] },
          },
        },
        {
          $lookup: {
            from: "group_members",
            localField: "_id",
            foreignField: "group_id",
            pipeline: [
              {
                $match: {
                  member_id: create_uid,
                  // isleaved:1
                },
              },
            ],
            as: "group_member_detail",
          },
        },
        {
          $unwind: {
            path: "$group_member_detail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "group_conversations",
            localField: "_id",
            foreignField: "group_id",
            let: { updatedAt: "$group_member_detail.updatedAt" },
            pipeline: [
              {
                $match: {
                  is_deleted: 0,
                  delete_message_users: { $ne: create_uid_String },
                  message_type: { $ne: 3 },
                  $expr: {
                    $cond: {
                      if: { $gt: ["$$updatedAt", null] },
                      then: { $lte: ["$createdAt", "$$updatedAt"] },
                      else: {},
                    },
                  },
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: 1,
              },
            ],
            as: "group_messages",
          },
        },
        {
          $unwind: {
            path: "$group_messages",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            isGroup: 1,
            isBlocked: 0,
            user_extension: "",
            last_message_time: "$group_messages.createdAt",
            last_message: "$group_messages.message",
            last_media_type: "$group_messages.media_type",
            is_admin: "$group_member_detail.is_admin",
            isleaved: "$group_member_detail.isleaved",
          },
        },
        {
          $match: {
            $and: [
              {
                isleaved: 0,
              },
              {
                $or: [
                  { is_admin_send_message: 0 },
                  { is_admin_send_message: 1, is_admin: 1 },
                ],
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            name: "$group_name",
            cid: 1,
            description: "$description",
            image: "$group_image",
            user_extension: 1,
            isGroup: 1,
            isBlocked: 1,
            is_admin: 1,
            isleaved: 1,
            last_message_time: {
              $ifNull: ["$last_message_time", "$createdAt"],
            },
            last_message: 1,
            last_media_type: 1,
            is_admin_send_message: 1,
          },
        },
      ])
      .sort({
        last_message_time: -1,
      });

    let sidebarData_tmp: any[] = get_detail.concat(get_group_detail);
    let sidebarData: any[] = _(sidebarData_tmp)
      .orderBy("last_message_time", "desc")
      .value();
    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).json({
      success: 1,
      message: "ForwardUser List",
      ForwardList: sidebarData,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const EditUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    let {
      uid,
      pstn_number,
      first_name,
      last_name,
      password,
      user_image,
      user_custom_msg,
      user_extension,
      user_email,
      mobile,
      country,
      user_record,
      user_type,
    } = req.body;

    // if (user_extension == undefined) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Extension Number Is Mandatory.",
    //   });
    // }

    if (
      user_extension !== undefined &&
      !REGEXP.extension.extension_number.test(user_extension)
    ) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Extension Number Is Invalid.",
      });
    }

    if (first_name == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "First Name Is Mandatory.",
      });
    }

    // if (!REGEXP.extension.first_name.test(first_name)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "First Name Is Invalid.",
    //   });
    // }

    if (last_name == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Last Name Is Mandatory.",
      });
    }

    // if (!REGEXP.extension.last_name.test(last_name)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Last Name Is Invalid.",
    //   });
    // }

    if (password == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Password Is Mandatory.",
      });
    }

    if (!REGEXP.extension.password.test(password)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Password Is Invalid.",
      });
    }

    if (user_email == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Email Is Mandatory.",
      });
    }

    if (!REGEXP.extension.email.test(user_email)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Email Is Invalid.",
      });
    }

    // if (mobile !== undefined && !REGEXP.extension.mobile.test(mobile)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Mobile Is Invalid.",
    //   });
    // }

    if (country == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Country Is Mandatory.",
      });
    }

    if (REGEXP.COMMON.blnakString.test(country)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Country Is Invalid.",
      });
    }

    if (user_type === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "user type Is Mandatory.",
      });
    }

    if (!REGEXP.USER.user_type.test(user_type)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "user type Is Invalid.",
      });
    }

    let userRole = await role.findOne({ type: user_type });

    if (!userRole) {
      res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "Role is incorrect",
      });
      return;
    }

    let check_email: any = await user.findOne({
      _id: { $ne: uid },
      is_deleted: 0,
      user_email: user_email.toLowerCase(),
    });

    if (check_email) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Email Already Exist.",
      });
    }

    let cid: any = await company.findOne({
      _id: user_detail?.cid,
      is_deleted: 0,
    });

    if (!cid) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Please Select Domain.",
      });
    }

    if (user_extension !== undefined) {
      let check_extension: any = await user.findOne({
        _id: { $ne: uid },
        is_deleted: 0,
        user_extension: user_extension,
        cid: cid._id,
      });

      if (check_extension) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "Extension Number Already Exist.",
        });
      }
    }

    let old_user_details: any = await user.findById({
      _id: uid,
    });

    let get_company_pstn: any = null;
    if (pstn_number !== undefined && user_type !== CONSTANT.ROLE.SUB_ADMIN) {
      get_company_pstn = await PSTNNumber.findOne({
        _id: pstn_number,
        is_deleted: 0,
      });

      if (!get_company_pstn) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: "PSTN Number Not Found.",
        });
      }
      if (old_user_details.pstn_number !== null) {
        await PSTNNumber.findByIdAndUpdate(
          {
            _id: old_user_details.pstn_number,
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
      }
    }

    let update_extantion_obj: any = {
      pstn_number: pstn_number !== undefined ? pstn_number : null,
      first_name,
      last_name,
      password,
      user_image,
      user_custom_msg,
      user_email: user_email.toLowerCase(),
      mobile: mobile !== undefined ? mobile : "",
      country,
      last_updated_user: user_detail?.uid,
      user_record,
      role: userRole._id,
    };

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.EXTENSION.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        extension_id: old_user_details?.extension_uuid,
        extension: user_extension,
        user: user_extension,
        extension_password: password,
        outbound_caller_id_name: first_name + " " + last_name,
        outbound_caller_id_number:
          pstn_number !== undefined
            ? get_company_pstn?.destination
            : user_extension,
        effective_caller_id_name: first_name + " " + last_name,
        effective_caller_id_number:
          pstn_number !== undefined
            ? get_company_pstn?.destination
            : user_extension,
        max_registrations: "5",
        limit_max: "5",
        user_record: user_record ? "true" : "false",
        account_code: cid.domain_name,
        domain: cid?.domain_uuid,
        context: cid.domain_name,
        extension_enabled: "true",
        description: "",
      },
    };

    let post: any;
    if (user_type !== CONSTANT.ROLE.SUB_ADMIN) {
      try {
        const data: any = await axios.request(api_config);

        if (data) {
          post = await user.findByIdAndUpdate(
            {
              _id: uid,
            },
            update_extantion_obj,
            {
              runValidators: true,
            }
          );
        }
      } catch (error: any) {
        return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
          success: 0,
          message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
        });
      }
      let select_type_data: any = {
        select_name: first_name + " " + last_name,
        select_extension: user_extension,
        select_id: uid,
      };

      let destination_action: any = [
        {
          destination_app: "transfer",
          destination_data: `${user_extension} XML ${cid?.domain_name}`,
        },
      ];

      if (pstn_number !== undefined) {
        try {
          let api_config1 = {
            method: "put",
            maxBodyLength: Infinity,
            url: config.PBX_API.PSTN.UPDATE,
            auth: config.PBX_API.AUTH,
            data: {
              domain: cid?.domain_uuid,
              type: get_company_pstn?.type,
              user: get_company_pstn?.user,
              destination: get_company_pstn?.destination,
              caller_id_name: get_company_pstn?.caller_id_name,
              caller_id_number: get_company_pstn?.caller_id_number,
              destination_condition: get_company_pstn?.destination_condition,
              destination_action,
              description: get_company_pstn?.description,
              destination_enabled:
                get_company_pstn?.destination_enabled == true
                  ? "true"
                  : "false",
              destination_id: get_company_pstn?.pstn_uuid,
            },
          };
          //console.log("pstn_number update",api_config1)
          const data1: any = await axios.request(api_config1);
          if (data1) {
            await PSTNNumber.findByIdAndUpdate(
              {
                _id: pstn_number,
                cid,
              },
              {
                isassigned: 1,
                assigend_extensionId: uid,
                last_updated_user: user_detail?.uid,
                destination_action,
                select_type_data,
                select_type: 3,
                select_type_uuid: old_user_details?.extension_uuid,
              },
              {
                runValidators: true,
              }
            );
          }
        } catch (error) {
          return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
            success: 0,
            message: "Failed To Update pstn number",
          });
        }
      }
    } else {
      update_extantion_obj.pstn_number = null;
      post = await user.findByIdAndUpdate(
        {
          _id: uid,
        },
        update_extantion_obj,
        {
          runValidators: true,
        }
      );
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Extension update successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const DeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  let data: any = req.body;
  let uid: any = data.uid;
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

  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "User Id Is Invalid.",
    });
  }

  let get_user: any = await user.findById({
    _id: uid,
  });

  if (get_user == null) {
    return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
      success: 0,
      message: "User Not Exists.",
    });
  }

  let api_config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: config.PBX_API.EXTENSION.DELETE,
    auth: config.PBX_API.AUTH,
    params: {
      id: get_user?.extension_uuid,
    },
  };

  try {
    const data: any = await axios.request(api_config);

    if (data) {
      const post = await user.findByIdAndDelete({
        _id: uid,
      });

      if (post?.pstn_number !== null) {
        await PSTNNumber.findByIdAndUpdate(
          {
            _id: post?.pstn_number,
          },
          {
            isassigned: 0,
            assigend_extensionId: null,
            destination_action: [],
            select_type_data: {},
            select_type: "",
            select_type_uuid: "",
            last_updated_user: uid,
          },
          {
            runValidators: true,
          }
        );
      }

      let user_detail1: any = {
        cid: post?.cid,
        uid,
      };
      socket.emit("user_log_out", user_detail1);

      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "User delete successfully",
      });
    }
  } catch (error: any) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const GetUserListByCompany = async (
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

    let userRole = await role
      .findOne({ type: { $in: [1, 4] } })
      .distinct("_id");

    let find_query: { [key: string]: any } = {};
    if (search) {
      find_query = {
        cid,
        is_deleted: 0,
        role: { $in: userRole },
        $or: [
          {
            first_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            last_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            user_extension: {
              $regex: search,
              $options: "i",
            },
          },
          {
            mobile: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    } else {
      find_query = {
        cid,
        is_deleted: 0,
        role: { $in: userRole },
      };
    }

    const extension_list: any = await user
      .find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "pstn_number",
        model: "pstn_number",
        select: "destination",
      })
      .populate({
        path: "role",
        model: "role",
        select: "type",
      });

    const extension_total_counts: any = await user
      .find(find_query)
      .countDocuments();

    let total_page_count: any = Math.ceil(extension_total_counts / size);

    res.send({
      success: 1,
      message: "Extension List",
      usersData: extension_list,
      total_page_count: total_page_count,
      company_total_counts: extension_total_counts,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const GetUserDetailsByID = async (
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
    let uid: any = data.uid;
    if (Object.keys(data).length === 0) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Id Is Invalid.",
      });
    }

    let user_data: any = await user.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(uid) },
      },
      {
        $lookup: {
          from: "pstn_numbers",
          localField: "pstn_number",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                destination: 1,
              },
            },
          ],
          as: "pstn_number",
        },
      },
      {
        $unwind: {
          path: "$pstn_number",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                type: 1,
              },
            },
          ],
          as: "role_data",
        },
      },
      {
        $unwind: {
          path: "$role_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          pstn_number: { $ifNull: ["$pstn_number", null] },
          role: { $ifNull: ["$role_data", null] },
        },
      },
      {
        $project: {
          pstn_number: 1,
          _id: 1,
          cid: 1,
          last_updated_user: 1,
          extension_uuid: 1,
          first_name: 1,
          last_name: 1,
          password: 1,
          user_image: 1,
          is_deleted: 1,
          user_custome_msg: 1,
          is_online: 1,
          last_seen: 1,
          user_devices: 1,
          user_extension: 1,
          user_email: 1,
          conversation_deleted_users: 1,
          role: 1,
          mobile: 1,
          country: 1,
          user_record: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ]);

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "User Detail",
      data: user_data[0],
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const GetExtensionListByCompany = async (
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

    const extensionList = await user.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleDetails",
        },
      },
      {
        $match: {
          "roleDetails.type": 1,
          cid: cid,
          is_deleted: 0,
        },
      },
      {
        $project: {
          cid: 1,
          user_extension: 1,
          _id: 1,
        },
      },
    ]);

    res.send({
      success: 1,
      message: "Extension List",
      usersData: extensionList,
    });
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default {
  userLogin,
  userLogout,
  addUser,
  getForwarduserlist,
  EditUser,
  DeleteUser,
  GetUserListByCompany,
  GetUserDetailsByID,
  GetExtensionListByCompany,
};
