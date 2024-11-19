// src/controllers/v1/calendarController.ts
import { Request, Response, NextFunction } from "express";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import { config } from "../../config";
import calendar_config from "../../models/calendar_config";
import { google } from "googleapis";
import moment from "moment";
const OAuth2 = google.auth.OAuth2;

const ConfigCalanderDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid: any = user_detail?.uid;
    let cid: any = user_detail?.cid;

    const { client_id, client_secret, redirect_uri } = req.body;

    const requiredFields = {
      client_id: "Client Id",
      client_secret: "Client Secret",
      redirect_uri: "Redirect URI",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} is mandatory.`,
        });
      }
    }

    let check_user_calendar_config: any =
      await calendar_config.findOneAndUpdate(
        {
          uid: uid,
          cid: cid,
        },
        {
          uid,
          cid,
          client_id,
          client_secret,
          redirect_uri,
        },
        {
          new: true,
          upsert: true,
        }
      );

    return res.status(200).send({
      success: 1,
      message: "Calender Config Updated Successfully",
      CalendarConfigDetail: check_user_calendar_config,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const GetUserRefrestTokenCalander = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid: any = user_detail?.uid;
    let cid: any = user_detail?.cid;

    const { client_id, client_secret, redirect_uri,name ,description,auto_refresh} = req.body;
    

    const requiredFields = {
      client_id: "Client Id",
      client_secret: "Client Secret",
      redirect_uri: "Redirect URI",
      name:"Name"
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
          success: 0,
          message: `${name} is mandatory.`,
        });
      }
    }

    const userConfig =  await calendar_config.findOneAndUpdate(
      {
        uid: uid,
        cid: cid,
      },
      {
        uid,
        cid,
        name,
        description:description ? description : "", 
        auto_refresh:auto_refresh ? auto_refresh : 0,
        client_id,
        client_secret,
        redirect_uri,
      },
      {
        new: true,
        upsert: true,
      }
    );
    if (!userConfig) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "User Detail Not Found",
      });
    }

    const oauth2Client = new OAuth2(client_id, client_secret, redirect_uri);

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
    });

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Please Verify Your Email",
      authUrl,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const UpdateRefrestTokenCalander = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid: any = user_detail?.uid;
    let cid: any = user_detail?.cid;

    const { refresh_token } = req.body;

    const requiredFields = {
      refresh_token: "Refresh Token",
    };

    for (const [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
          success: 0,
          message: `${name} is mandatory.`,
        });
      }
    }

    const userConfig = await calendar_config.findOne({ uid, cid });
    if (!userConfig) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "User Detail Not Found",
      });
    }

    let reditectredirect_uri_tmp: any = userConfig.redirect_uri;

    const oauth2Client = new OAuth2(
      userConfig.client_id,
      userConfig.client_secret,
      reditectredirect_uri_tmp
    );

    oauth2Client.getToken(refresh_token, async (err: any, tokens: any) => {
      if (err) return console.error("Error retrieving tokens:", err);

      oauth2Client.setCredentials(tokens);

      await calendar_config.findOneAndUpdate(
        {
          uid: uid,
          cid: cid,
        },
        {
          refresh_token: tokens.refresh_token,
          access_token: tokens.access_token,
          expires_at: tokens.expiry_date,
        },
        {
          new: true,
        }
      );
    });

    return res.status(200).send({
      success: 1,
      message: "Calendar Detail Updated Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const GetAllEventCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid: any = user_detail?.uid;
    let cid: any = user_detail?.cid;
    let start_date: any = req.query.start_date;
    let end_date: any = req.query.end_date;

    if (start_date == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Start Date Is Mandatory.`,
      });
    }

    if (end_date == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `End Date Is Mandatory.`,
      });
    }

    if (
      start_date == "" ||
      !moment(start_date, "YYYY-MM-DDTHH:mm:ss.sssZ", true).isValid()
    ) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `Start Date Is Invalid.`,
      });
    }

    if (
      end_date == "" ||
      !moment(end_date, "YYYY-MM-DDTHH:mm:ss.sssZ", true).isValid()
    ) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: `End Date Is Invalid.`,
      });
    }


    let userConfig = await calendar_config.findOne({ uid, cid });

    if (!userConfig) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "User Detail Not Found",
      });
    }

    let reditectredirect_uri_tmp: any = userConfig.redirect_uri;

    const oauth2Client = new OAuth2(
      userConfig.client_id,
      userConfig.client_secret,
      reditectredirect_uri_tmp
    );

    if (new Date() >= userConfig.expires_at) {
      let refres_token_tmp: any = userConfig.refresh_token;
     oauth2Client.setCredentials({
        refresh_token: refres_token_tmp,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();

      await calendar_config.findOneAndUpdate(
        {
          uid: uid,
          cid: cid,
        },
        {
          access_token: credentials.access_token,
          expires_at: credentials.expiry_date,
        },
        {
          new: true,
        }
      );

      userConfig = await calendar_config.findOne({ uid, cid });
    }

    let tmp_acectoken: any = userConfig?.access_token;
    
    oauth2Client.setCredentials({
      access_token: tmp_acectoken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin:start_date,
      timeMax:end_date,
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Calander Events List",
      CalanderEventList: events.data.items,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const GetCalendarConfigDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let uid: any = user_detail?.uid;
    let cid: any = user_detail?.cid;

    let userConfig = await calendar_config.findOne({ uid, cid });

    if (!userConfig) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).json({
        success: 0,
        message: "User Detail Not Found",
      });
    }

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Calander Config Detail",
      CalanderDetail:userConfig,
    });

  } catch (error) {
    console.log("error", error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default {
  ConfigCalanderDetail,
  GetAllEventCalendar,
  GetUserRefrestTokenCalander,
  UpdateRefrestTokenCalander,
  GetCalendarConfigDetail
};
