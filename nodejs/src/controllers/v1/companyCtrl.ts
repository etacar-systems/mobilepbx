import { Request, Response, NextFunction } from "express";
import company from "../../models/company";
import user from "../../models/user";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import userCtrl from "./userCtrl";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import axios from "axios";
import { pbxLogin } from "./voipLoginCtrl";
import authUser from "../../middleware/authUser";
import role from "../../models/role";
import CONSTANT from "../../constant";
import { uniqueId } from "lodash";
import conferncers from "../../models/conferncers";
import ring_group from "../../models/ring_group";
import IVR from "../../models/IVR";
import time_condition from "../../models/time_condition";
import system_recording from "../../models/system_recording";
import outbound_route from "../../models/outbound_route";
import pstn_number from "../../models/pstn_number";
import trunks from "../../models/trunks";
import { socket } from "../../socket";
import firewall from "../../models/firewall";
import { CompanyFeaturesModel } from "../../models/company_feature";
import uploadFile from "../../upload";
import { MESSAGE } from "../../constant_message";
import path from "path";
import getsmtpDetail from "../../helper/getsmtpDetail";
import email from "../../models/email";
import sendMail from "../../helper/sendMail";
import sendMailSendGrid from "../../helper/sendMail_sendGrid";

const toBoolean = (value: any) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;
    let {
      hex_code,
      pbx,
      extension,
      ring_group,
      conference,
      video_call,
      ivr,
      speech_to_text,
      phone_in_browser,
      voicemail,
      callback,
      record_calls,
      reportage,
      monitoring,
      caller_id,
      time_controls,
      whatsapp,
      calendar_integration,
      text_to_speech,
      virtual_assistant,
      company_name,
      company_street_address,
      company_zipcode,
      company_city,
      company_country,
      company_vat,
      company_contact_person,
      company_password,
      company_email,
      company_phone_number,
      domain_name,
      small_logo,
      logo_text,
      dark_small_logo,
      dark_logo_text,
      pbx_count,
      extension_count,
      ring_group_count,
      conference_count,
      video_call_count,
      ivr_count,
      speech_to_text_count,
      phone_in_browser_count,
      voicemail_count,
      callback_count,
      record_calls_count,
      reportage_count,
      monitoring_count,
      caller_id_count,
      time_controls_count,
      whatsapp_count,
      calendar_integration_count,
      text_to_speech_count,
      virtual_assistant_count,
    } = req.body;

    let parsedPbx = toBoolean(pbx);
    let parsedExtension = toBoolean(extension);
    let parsedRingGroup = toBoolean(ring_group);
    let parsedConference = toBoolean(conference);
    let parsedVideoCall = toBoolean(video_call);
    let parsedIvr = toBoolean(ivr);
    let parsedSpeechToText = toBoolean(speech_to_text);
    let parsedPhoneInBrowser = toBoolean(phone_in_browser);
    let parsedVoicemail = toBoolean(voicemail);
    let parsedCallback = toBoolean(callback);
    let parsedRecordCalls = toBoolean(record_calls);
    let parsedReportage = toBoolean(reportage);
    let parsedMonitoring = toBoolean(monitoring);
    let parsedCallerId = toBoolean(caller_id);
    let parsedTimeControls = toBoolean(time_controls);
    let parsedWhatsapp = toBoolean(whatsapp);
    let parsedCalendarIntegration = toBoolean(calendar_integration);
    let parsedTextToSpeech = toBoolean(text_to_speech);
    let parsedVirtualAssistant = toBoolean(virtual_assistant);

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (company_password == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Password Is Mandatory.",
      });
    }
    if (!REGEXP.company.company_password.test(company_password)) {
      return res.status(400).send({
        success: 0,
        message: "Company Password Is Invalid.",
      });
    }

    if (company_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Name Is Mandatory.",
      });
    }
    if (!REGEXP.company.company_name.test(company_name)) {
      return res.status(400).send({
        success: 0,
        message: "Company Name Is Invalid.",
      });
    }

    if (company_email == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Email Is Mandatory.",
      });
    }
    if (!REGEXP.company.company_email.test(company_email)) {
      return res.status(400).send({
        success: 0,
        message: "Company Email Is Invalid.",
      });
    }

    if (hex_code == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Hex Code Is Mandatory.",
      });
    }

    if (parsedPbx === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Pbx is invalid.",
      });
    }

    if (parsedExtension === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Extension is invalid.",
      });
    }

    if (parsedRingGroup === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group is invalid.",
      });
    }

    if (parsedConference === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Conference is invalid.",
      });
    }

    if (parsedVideoCall === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Video Call is invalid.",
      });
    }

    if (parsedIvr === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR is invalid.",
      });
    }

    if (parsedSpeechToText === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Speech-to-Text is invalid.",
      });
    }

    if (parsedPhoneInBrowser === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Phone in Browser is invalid.",
      });
    }

    if (parsedVoicemail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Voicemail is invalid.",
      });
    }

    if (parsedCallback === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Callback is invalid.",
      });
    }

    if (parsedRecordCalls === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Record Calls are invalid.",
      });
    }

    if (parsedReportage === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Reportage is invalid.",
      });
    }

    if (parsedMonitoring === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Monitoring is invalid.",
      });
    }

    if (parsedCallerId === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Caller ID is invalid.",
      });
    }

    if (parsedTimeControls === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Time Controls are invalid.",
      });
    }

    if (parsedWhatsapp === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "WhatsApp is invalid.",
      });
    }

    if (parsedCalendarIntegration === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Calendar Integration is invalid.",
      });
    }

    if (parsedTextToSpeech === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Text to Speech is invalid.",
      });
    }

    if (parsedVirtualAssistant === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Virtual Assistant is invalid.",
      });
    }

    const params = {
      pbx_count: "PBX Count",
      extension_count: "Extension Count",
      ring_group_count: "Ring Group Count",
      conference_count: "Conference Count",
      video_call_count: "Video Call Count",
      ivr_count: "IVR Count",
      speech_to_text_count: "Speech to Text Count",
      phone_in_browser_count: "Phone in Browser Count",
      voicemail_count: "Voicemail Count",
      callback_count: "Callback Count",
      record_calls_count: "Record Calls Count",
      reportage_count: "Reportage Count",
      monitoring_count: "Monitoring Count",
      caller_id_count: "Caller ID Count",
      time_controls_count: "Time Controls Count",
      whatsapp_count: "WhatsApp Count",
      calendar_integration_count: "Calendar Integration Count",
      text_to_speech_count: "Text to Speech Count",
      virtual_assistant_count: "Virtual Assistant Count",
    };

    for (const [key, label] of Object.entries(params)) {
      const value = req.body[key];

      if (value === undefined) {
        return res.status(400).send({
          success: 0,
          message: `${label} is mandatory.`,
        });
      }

      if (value !== undefined && !REGEXP.COMMON.INTEGER.test(String(value))) {
        return res.status(400).send({
          success: 0,
          message: `${label} is invalid.`,
        });
      }
    }

    const emailCheck: any = await user.findOne({
      user_email: company_email,
      is_deleted: 0,
    });

    if (emailCheck) {
      return res.status(400).send({
        success: 0,
        message: "Company Email Is Already Exist.",
      });
    }

    if (domain_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Domain Name Is Mandatory.",
      });
    }

    const domain_name_check: any = await company.findOne({
      domain_name,
      is_deleted: 0,
    });

    if (domain_name_check) {
      return res.status(400).send({
        success: 0,
        message: "Company Doamin Name Is Already Exist.",
      });
    }

    let upload_file_detail = await uploadFile(req, res);
    if (upload_file_detail.small_logo) {
      var myUrl = upload_file_detail.small_logo.file_path;
      let get_file_name: any = upload_file_detail.small_logo.file_path.split("/");
      //console.log("get_file_name",get_file_name)
      let name: any = get_file_name[3];
      //console.log("name",name)
      let name_split: any = name.split(".");
      let final_name: any = name_split[0];
      let folder_nm: any = get_file_name[2];

      let thumbnail_nm: any = path.join(
        "..",
        "..",
        "..",
        "uploads",
        folder_nm,
        "thumbnails__" + final_name + ".png"
      );

      small_logo = myUrl.replace("../uploads", "uploads");
    } else {
      small_logo = "";
    }

    if (upload_file_detail.logo_text) {
      var myUrl = upload_file_detail.logo_text.file_path;
      let get_file_name: any = upload_file_detail.logo_text.file_path.split("/");
      //console.log("get_file_name",get_file_name)
      let name: any = get_file_name[3];
      //console.log("name",name)
      let name_split: any = name.split(".");
      let final_name: any = name_split[0];
      let folder_nm: any = get_file_name[2];

      let thumbnail_nm: any = path.join(
        "..",
        "..",
        "..",
        "uploads",
        folder_nm,
        "thumbnails__" + final_name + ".png"
      );

      logo_text = myUrl.replace("../uploads", "uploads");
    } else {
      logo_text = "";
    }

    if (upload_file_detail.dark_small_logo) {
      var myUrl = upload_file_detail.dark_small_logo.file_path;
      let get_file_name: any = upload_file_detail.dark_small_logo.file_path.split("/");
      //console.log("get_file_name",get_file_name)
      let name: any = get_file_name[3];
      //console.log("name",name)
      let name_split: any = name.split(".");
      let final_name: any = name_split[0];
      let folder_nm: any = get_file_name[2];

      let thumbnail_nm: any = path.join(
        "..",
        "..",
        "..",
        "uploads",
        folder_nm,
        "thumbnails__" + final_name + ".png"
      );

      dark_small_logo = myUrl.replace("../uploads", "uploads");
    } else {
      dark_small_logo = "";
    }

    if (upload_file_detail.dark_logo_text) {
      var myUrl = upload_file_detail.dark_logo_text.file_path;
      let get_file_name: any = upload_file_detail.dark_logo_text.file_path.split("/");
      //console.log("get_file_name",get_file_name)
      let name: any = get_file_name[3];
      //console.log("name",name)
      let name_split: any = name.split(".");
      let final_name: any = name_split[0];
      let folder_nm: any = get_file_name[2];

      let thumbnail_nm: any = path.join(
        "..",
        "..",
        "..",
        "uploads",
        folder_nm,
        "thumbnails__" + final_name + ".png"
      );

      dark_logo_text = myUrl.replace("../uploads", "uploads");
    } else {
      dark_logo_text = "";
    }

    let create_company_obj: any = {
      company_name: company_name,
      company_street_address: company_street_address !== undefined ? company_street_address : "",
      company_zipcode: company_zipcode !== undefined ? company_zipcode : "",
      company_city: company_city !== undefined ? company_city : "",
      company_country: company_country !== undefined ? company_country : "",
      company_vat: company_vat !== undefined ? company_vat : "",
      company_contact_person: company_contact_person !== undefined ? company_contact_person : "",
      company_password: company_password,
      company_email: company_email,
      company_phone_number: company_phone_number !== undefined ? company_phone_number : "",
      domain_name: domain_name,
      hex_code,
      pbx,
      extension,
      ring_group,
      conference,
      video_call,
      ivr,
      speech_to_text,
      phone_in_browser,
      voicemail,
      callback,
      record_calls,
      reportage,
      monitoring,
      caller_id,
      time_controls,
      whatsapp,
      calendar_integration,
      text_to_speech,
      virtual_assistant,
      pbx_count,
      extension_count,
      ring_group_count,
      conference_count,
      video_call_count,
      ivr_count,
      speech_to_text_count,
      phone_in_browser_count,
      voicemail_count,
      callback_count,
      record_calls_count,
      reportage_count,
      monitoring_count,
      caller_id_count,
      time_controls_count,
      whatsapp_count,
      calendar_integration_count,
      text_to_speech_count,
      virtual_assistant_count,
      small_logo,
      logo_text,
      dark_small_logo,
      dark_logo_text,
      last_updated_user: uid,
    };

    let api_config = {
      method: "post",
      maxBodyLength: Infinity,
      url: config.PBX_API.COMPANY.ADD,
      auth: config.PBX_API.AUTH,
      data: {
        domain_name: domain_name,
        domain_enabled: "true",
        domain_description: company_name,
      },
    };

    try {
      const AdminRole = await role.findOne({ type: CONSTANT.ROLE.ADMIN });

      if (!AdminRole) {
        return res.status(500).send({
          success: 0,
          message: "Failed to create company",
        });
      }
      const data: any = await axios.request(api_config);

      if (data?.data?.id) {
        create_company_obj.domain_uuid = data?.data?.id;

        const NewCompany = await company.create(create_company_obj);

        const userObj = {
          cid: NewCompany._id,
          user_email: company_email,
          password: company_password,
          role: AdminRole._id,
          first_name: company_contact_person,
          mobile: company_phone_number,
          country: company_country,
        };

        await user.create(userObj);

        try {
          let get_emptdetail_tmp: any = await getsmtpDetail();
          let get_email_content: any = await email.findOne({
            email_type: 2,
          });

          if (get_email_content !== null && Object.keys(get_emptdetail_tmp).length > 0) {
            let customer_email_tmp: any = userObj.user_email;
            let customer_password_tmp: any = userObj.password;
            let user_name_tmp: any = company_name;
            let replace_name: any = get_email_content.message.replace(
              "{{CustomerName}}",
              user_name_tmp
            );
            replace_name = replace_name.replace("{{CustomerEmail}}", customer_email_tmp);
            replace_name = replace_name.replace("{{CustomerPass}}", customer_password_tmp);

            let notification_obj: any = {
              host: get_emptdetail_tmp.mail_host,
              port: get_emptdetail_tmp.port,
              username: get_emptdetail_tmp.auth_user,
              password: get_emptdetail_tmp.auth_password,
              from: get_email_content.from,
              to: customer_email_tmp,
              subject: get_email_content.subject,
              html: replace_name,
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

        return res.status(200).send({
          success: 1,
          message: "New company added successfully",
          company_id: NewCompany?._id,
        });
      }

      if (data?.data?.message) {
        return res.status(500).send({
          success: 0,
          message: data?.data?.message,
        });
      }
    } catch (error: any) {
      return res.status(500).send({
        success: 0,
        message: "Failed to create company",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const getCompnayUsersById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var uid = user_detail?.uid;
    var cid = user_detail?.cid;
    if (cid) {
      const AgentRole = await role.findOne({ type: CONSTANT.ROLE.AGENT });

      if (!AgentRole) {
        return res.status(500).send({
          success: 0,
          message: "Failed to fetch user List",
        });
      }
      const usersData = await user
        .aggregate([
          {
            $match: {
              cid: cid,
              role: AgentRole._id,
              is_deleted: 0,
              _id: { $ne: uid },
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
                    block_by: uid,
                    cid: cid,
                  },
                },
              ],
              as: "block_data",
            },
          },
          {
            $lookup: {
              from: "user_blocks",
              localField: "_id",
              foreignField: "block_by",
              pipeline: [
                {
                  $match: {
                    block_id: uid,
                  },
                },
              ],
              as: "isblocked_by_reciver",
            },
          },
          {
            $addFields: {
              isBlocked: { $size: "$block_data" },
              isblocked_by_reciver: {
                $size: "$isblocked_by_reciver",
              },
            },
          },
          {
            $project: {
              _id: 1,
              cid: 1,
              first_name: 1,
              last_name: 1,
              password: 1,
              user_image: 1,
              is_deleted: 1,
              user_custome_msg: 1,
              is_online: 1,
              last_seen: "$updatedAt",
              user_devices: 1,
              user_extension: 1,
              user_email: 1,
              sip_username: 1,
              sip_password: 1,
              conversation_deleted_users: 1,
              role: 1,
              createdAt: 1,
              updatedAt: 1,
              isBlocked: 1,
              isblocked_by_reciver: 1,
            },
          },
        ])
        .sort({
          first_name: 1,
        });

      res.send({
        success: 1,
        message: "Company UsersData",
        usersData: usersData,
      });
    } else {
      res.send({
        success: 0,
        message: "some params is missing",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const getCompnanylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
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
            company_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            domain_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            company_phone_number: {
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

    const company_list: any = await company
      .find(find_query)
      .select(
        "company_name company_phone_number company_country company_city  company_street_address company_zipcode createdAt domain_uuid domain_name"
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const company_total_counts: any = await company.find(find_query).countDocuments();

    let total_page_count: any = Math.ceil(company_total_counts / size);

    res.send({
      success: 1,
      message: "Company UsersData",
      usersData: company_list,
      total_page_count: total_page_count,
      company_total_counts: company_total_counts,
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const editCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;
    let {
      cid,
      hex_code,
      pbx,
      extension,
      ring_group,
      conference,
      video_call,
      ivr,
      speech_to_text,
      phone_in_browser,
      voicemail,
      callback,
      record_calls,
      reportage,
      monitoring,
      caller_id,
      time_controls,
      whatsapp,
      calendar_integration,
      text_to_speech,
      virtual_assistant,
      company_name,
      company_street_address,
      company_zipcode,
      company_city,
      company_country,
      company_vat,
      company_contact_person,
      company_password,
      company_email,
      company_phone_number,
      domain_name,
      small_logo,
      logo_text,
      dark_small_logo,
      dark_logo_text,
      pbx_count,
      extension_count,
      ring_group_count,
      conference_count,
      video_call_count,
      ivr_count,
      speech_to_text_count,
      phone_in_browser_count,
      voicemail_count,
      callback_count,
      record_calls_count,
      reportage_count,
      monitoring_count,
      caller_id_count,
      time_controls_count,
      whatsapp_count,
      calendar_integration_count,
      text_to_speech_count,
      virtual_assistant_count,
    } = req.body;

    let parsedPbx = toBoolean(pbx);
    let parsedExtension = toBoolean(extension);
    let parsedRingGroup = toBoolean(ring_group);
    let parsedConference = toBoolean(conference);
    let parsedVideoCall = toBoolean(video_call);
    let parsedIvr = toBoolean(ivr);
    let parsedSpeechToText = toBoolean(speech_to_text);
    let parsedPhoneInBrowser = toBoolean(phone_in_browser);
    let parsedVoicemail = toBoolean(voicemail);
    let parsedCallback = toBoolean(callback);
    let parsedRecordCalls = toBoolean(record_calls);
    let parsedReportage = toBoolean(reportage);
    let parsedMonitoring = toBoolean(monitoring);
    let parsedCallerId = toBoolean(caller_id);
    let parsedTimeControls = toBoolean(time_controls);
    let parsedWhatsapp = toBoolean(whatsapp);
    let parsedCalendarIntegration = toBoolean(calendar_integration);
    let parsedTextToSpeech = toBoolean(text_to_speech);
    let parsedVirtualAssistant = toBoolean(virtual_assistant);

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (cid === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company id Is Mandatory.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({
        success: 0,
        message: "Company Id Is Invalid.",
      });
    }

    if (company_password == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Password Is Mandatory.",
      });
    }
    if (!REGEXP.company.company_password.test(company_password)) {
      return res.status(400).send({
        success: 0,
        message: "Company Password Is Invalid.",
      });
    }

    if (company_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Name Is Mandatory.",
      });
    }
    if (!REGEXP.company.company_name.test(company_name)) {
      return res.status(400).send({
        success: 0,
        message: "Company Name Is Invalid.",
      });
    }

    if (company_email == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Email Is Mandatory.",
      });
    }
    if (!REGEXP.company.company_email.test(company_email)) {
      return res.status(400).send({
        success: 0,
        message: "Company Email Is Invalid.",
      });
    }

    if (hex_code == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Hex Code Is Mandatory.",
      });
    }

    if (parsedPbx === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Pbx is invalid.",
      });
    }

    if (parsedExtension === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Extension is invalid.",
      });
    }

    if (parsedRingGroup === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Ring Group is invalid.",
      });
    }

    if (parsedConference === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Conference is invalid.",
      });
    }

    if (parsedVideoCall === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Video Call is invalid.",
      });
    }

    if (parsedIvr === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "IVR is invalid.",
      });
    }

    if (parsedSpeechToText === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Speech-to-Text is invalid.",
      });
    }

    if (parsedPhoneInBrowser === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Phone in Browser is invalid.",
      });
    }

    if (parsedVoicemail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Voicemail is invalid.",
      });
    }

    if (parsedCallback === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Callback is invalid.",
      });
    }

    if (parsedRecordCalls === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Record Calls are invalid.",
      });
    }

    if (parsedReportage === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Reportage is invalid.",
      });
    }

    if (parsedMonitoring === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Monitoring is invalid.",
      });
    }

    if (parsedCallerId === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Caller ID is invalid.",
      });
    }

    if (parsedTimeControls === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Time Controls are invalid.",
      });
    }

    if (parsedWhatsapp === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "WhatsApp is invalid.",
      });
    }

    if (parsedCalendarIntegration === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Calendar Integration is invalid.",
      });
    }

    if (parsedTextToSpeech === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Text to Speech is invalid.",
      });
    }

    if (parsedVirtualAssistant === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Virtual Assistant is invalid.",
      });
    }

    const params = {
      pbx_count: "PBX Count",
      extension_count: "Extension Count",
      ring_group_count: "Ring Group Count",
      conference_count: "Conference Count",
      video_call_count: "Video Call Count",
      ivr_count: "IVR Count",
      speech_to_text_count: "Speech to Text Count",
      phone_in_browser_count: "Phone in Browser Count",
      voicemail_count: "Voicemail Count",
      callback_count: "Callback Count",
      record_calls_count: "Record Calls Count",
      reportage_count: "Reportage Count",
      monitoring_count: "Monitoring Count",
      caller_id_count: "Caller ID Count",
      time_controls_count: "Time Controls Count",
      whatsapp_count: "WhatsApp Count",
      calendar_integration_count: "Calendar Integration Count",
      text_to_speech_count: "Text to Speech Count",
      virtual_assistant_count: "Virtual Assistant Count",
    };

    for (const [key, label] of Object.entries(params)) {
      const value = req.body[key];

      if (value === undefined) {
        return res.status(400).send({
          success: 0,
          message: `${label} is mandatory.`,
        });
      }

      if (value !== undefined && !REGEXP.COMMON.INTEGER.test(String(value))) {
        return res.status(400).send({
          success: 0,
          message: `${label} is invalid.`,
        });
      }
    }

    if (domain_name == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Company Domain Name Is Mandatory.",
      });
    }

    const domain_name_check: any = await company.findOne({
      _id: { $ne: cid },
      domain_name: domain_name,
      is_deleted: 0,
    });

    if (domain_name_check) {
      return res.status(400).send({
        success: 0,
        message: "Company Doamin Name Is Already Exist.",
      });
    }

    const emailCheck: any = await user.findOne({
      cid: { $ne: new mongoose.Types.ObjectId(cid) },
      user_email: company_email.toLowerCase(),
      is_deleted: 0,
    });

    if (emailCheck) {
      return res.status(400).send({
        success: 0,
        message: "Company Email Is Already Exist.",
      });
    }

    let companyDetail: any = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    let upload_file_detail = await uploadFile(req, res);
    if (upload_file_detail.small_logo) {
      var myUrl = upload_file_detail.small_logo.file_path;
      let get_file_name: any = upload_file_detail.small_logo.file_path.split("/");
      //console.log("get_file_name",get_file_name)
      let name: any = get_file_name[3];
      //console.log("name",name)
      let name_split: any = name.split(".");
      let final_name: any = name_split[0];
      let folder_nm: any = get_file_name[2];

      let thumbnail_nm: any = path.join(
        "..",
        "..",
        "..",
        "uploads",
        folder_nm,
        "thumbnails__" + final_name + ".png"
      );

      small_logo = myUrl.replace("../uploads", "uploads");
    } else {
      small_logo = small_logo;
    }

    if (upload_file_detail.logo_text) {
      var myUrl = upload_file_detail.logo_text.file_path;
      let get_file_name: any = upload_file_detail.logo_text.file_path.split("/");
      //console.log("get_file_name",get_file_name)
      let name: any = get_file_name[3];
      //console.log("name",name)
      let name_split: any = name.split(".");
      let final_name: any = name_split[0];
      let folder_nm: any = get_file_name[2];

      let thumbnail_nm: any = path.join(
        "..",
        "..",
        "..",
        "uploads",
        folder_nm,
        "thumbnails__" + final_name + ".png"
      );

      logo_text = myUrl.replace("../uploads", "uploads");
    } else {
      logo_text = logo_text;
    }

    if (upload_file_detail.dark_small_logo) {
      var myUrl = upload_file_detail.dark_small_logo.file_path;
      let get_file_name: any = upload_file_detail.dark_small_logo.file_path.split("/");
      //console.log("get_file_name",get_file_name)
      let name: any = get_file_name[3];
      //console.log("name",name)
      let name_split: any = name.split(".");
      let final_name: any = name_split[0];
      let folder_nm: any = get_file_name[2];

      let thumbnail_nm: any = path.join(
        "..",
        "..",
        "..",
        "uploads",
        folder_nm,
        "thumbnails__" + final_name + ".png"
      );

      dark_small_logo = myUrl.replace("../uploads", "uploads");
    } else {
      dark_small_logo = dark_small_logo;
    }

    if (upload_file_detail.dark_logo_text) {
      var myUrl = upload_file_detail.dark_logo_text.file_path;
      let get_file_name: any = upload_file_detail.dark_logo_text.file_path.split("/");
      //console.log("get_file_name",get_file_name)
      let name: any = get_file_name[3];
      //console.log("name",name)
      let name_split: any = name.split(".");
      let final_name: any = name_split[0];
      let folder_nm: any = get_file_name[2];

      let thumbnail_nm: any = path.join(
        "..",
        "..",
        "..",
        "uploads",
        folder_nm,
        "thumbnails__" + final_name + ".png"
      );

      dark_logo_text = myUrl.replace("../uploads", "uploads");
    } else {
      dark_logo_text = dark_logo_text;
    }

    let update_company_obj: any = {
      company_name: company_name,
      company_street_address: company_street_address !== undefined ? company_street_address : "",
      company_zipcode: company_zipcode !== undefined ? company_zipcode : "",
      company_city: company_city !== undefined ? company_city : "",
      company_country: company_country !== undefined ? company_country : "",
      company_vat: company_vat !== undefined ? company_vat : "",
      company_contact_person: company_contact_person !== undefined ? company_contact_person : "",
      company_password: company_password,
      company_email: company_email.toLowerCase(),
      company_phone_number: company_phone_number !== undefined ? company_phone_number : "",
      domain_name: domain_name,
      hex_code,
      pbx,
      extension,
      ring_group,
      conference,
      video_call,
      ivr,
      speech_to_text,
      phone_in_browser,
      voicemail,
      callback,
      record_calls,
      reportage,
      monitoring,
      caller_id,
      time_controls,
      whatsapp,
      calendar_integration,
      text_to_speech,
      virtual_assistant,
      pbx_count,
      extension_count,
      ring_group_count,
      conference_count,
      video_call_count,
      ivr_count,
      speech_to_text_count,
      phone_in_browser_count,
      voicemail_count,
      callback_count,
      record_calls_count,
      reportage_count,
      monitoring_count,
      caller_id_count,
      time_controls_count,
      whatsapp_count,
      calendar_integration_count,
      text_to_speech_count,
      virtual_assistant_count,
      small_logo,
      logo_text,
      dark_small_logo,
      dark_logo_text,
      last_updated_user: uid,
    };

    let api_config = {
      method: "put",
      maxBodyLength: Infinity,
      url: config.PBX_API.COMPANY.UPDATE,
      auth: config.PBX_API.AUTH,
      data: {
        domain_name: domain_name,
        domain_enabled: "true",
        domain_description: company_name,
        domain_id: companyDetail?.domain_uuid,
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data?.data?.message) {
        const updated_data: any = await company.findByIdAndUpdate(
          {
            _id: cid,
          },
          update_company_obj,
          {
            new: true,
            runValidators: true,
          }
        );

        const AdminRole = await role.findOne({ type: CONSTANT.ROLE.ADMIN });

        if (!AdminRole) {
          return res.status(500).send({
            success: 0,
            message: "Failed to create company",
          });
        }
        const userObj = {
          cid: updated_data._id,
          user_email: company_email,
          password: company_password,
          role: AdminRole._id,
          first_name: company_contact_person,
          mobile: company_phone_number,
          country: company_country,
        };

        const updated_user: any = await user.findOneAndUpdate(
          {
            role: AdminRole._id,
            cid: updated_data._id,
          },
          userObj,
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(200).send({
          success: 1,
          message: "New company Updated successfully",
          Company_detail: updated_data,
        });
      }
    } catch (error: any) {
      return res.status(500).send({
        success: 0,
        message: "Failed to update company",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const DeleteCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid = user_detail?.uid;

    let data: any = req.body;
    let cid: any = data.cid;
    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({
        success: 0,
        message: "Company Id Is Invalid.",
      });
    }

    let companyDetail: any = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(400).send({
        success: 0,
        message: "Company Not Found.",
      });
    }

    let api_config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${config.PBX_API.COMPANY.REMOVE}${companyDetail?.domain_uuid}`,
      auth: config.PBX_API.AUTH,
    };

    try {
      const data: any = await axios.request(api_config);

      if (data?.data?.message) {
        const updated_data: any = await company.findByIdAndUpdate(
          {
            _id: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: uid,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        const post = await user.updateMany(
          {
            cid: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );

        await conferncers.updateMany(
          {
            cid: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );

        await ring_group.updateMany(
          {
            cid: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );

        await IVR.updateMany(
          {
            cid: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );
        await time_condition.updateMany(
          {
            cid: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );
        // await trunks.updateMany(
        //   {
        //     cid: cid,
        //   },
        //   {
        //     is_deleted: 1,
        //     last_updated_user: user_detail?.uid,
        //   },
        //   {
        //     runValidators: true,
        //   }
        // );
        await outbound_route.updateMany(
          {
            cid: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );
        await pstn_number.updateMany(
          {
            cid: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );
        await CompanyFeaturesModel.findOneAndUpdate(
          {
            cid: cid,
          },
          {
            is_deleted: 1,
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );
        // await firewall.updateMany(
        //   {
        //     cid: cid,
        //   },
        //   {
        //     is_deleted: 1,
        //     last_updated_user: user_detail?.uid,
        //   },
        //   {
        //     runValidators: true,
        //   }
        // );
        const company_detail: any = {
          cid: cid,
        };
        socket.emit("log_out", company_detail);
        return res.status(200).send({
          success: 1,
          message: "Company Deleted successfully",
        });
      }
    } catch (error: any) {
      return res.status(500).send({
        success: 0,
        message: "Failed to delete company",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const getCompanyDetailbyID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let data: any = req.body;
    let cid: any = data.cid;
    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).send({
        success: 0,
        message: "Company Id Is Invalid.",
      });
    }
    let companyDetail: any = await company.findOne({
      _id: cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(400).send({
        success: 0,
        message: "Company Not Found.",
      });
    }

    return res.status(200).send({
      success: 1,
      message: "Company Detail",
      CompanyDatil: companyDetail,
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const getCompanyNameList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comnayName: any[] = await company
      .find({
        is_deleted: 0,
        domain_uuid: { $ne: null },
      })
      .select("company_name domain_uuid domain_name");

    return res.status(200).send({
      success: 1,
      message: "Company Name List Successfully.",
      comnayNameList: comnayName,
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
export default {
  addNewRecord,
  getCompnayUsersById,
  getCompnanylist,
  editCompany,
  DeleteCompany,
  getCompanyDetailbyID,
  getCompanyNameList,
};
