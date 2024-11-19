import express, { NextFunction, Request, Response } from "express";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import path from "path";
import fs from "fs";
import company from "../../models/company";
import Whatsapp from "../../models/Whatsapp";
import get_token from "../../helper/userHeader";
import User_token from "../../helper/helper";
import { socket } from "../../socket";
import { config } from "../../config";
import REGEXP from "../../regexp";

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body, "testingbody");
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var cid: any = user_detail?.cid;
    var agent_id: any = user_detail?.uid;

    let get_company_detail: any = await company.findById({
      _id: cid,
    });

    const accessToken = get_company_detail.whatsapp_accessToken
    const apiUrl = `https://graph.facebook.com/v19.0/${get_company_detail.whatsapp_phone_number_id}/messages`;

    const data: any = req.body;
    let mediaType = 0;
    var filePath: any | null;
    let mediaBasedMsg: any;

    let messagePayload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: data.to,
    };

    const downloadMedia = async (mediaId: string): Promise<string | null> => {
      try {
        console.log(mediaId, "mediaUrlResponse");
        const mediaUrlResponse = await axios.get(
          `https://graph.facebook.com/v20.0/${mediaId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const mediaUrl = mediaUrlResponse.data.url;
        console.log(mediaUrl, "mediaurl");

        const mimeTypeParts = mediaUrlResponse?.data?.mime_type.split("/");
        const fileType = mimeTypeParts[0];
        const fileFormat = mimeTypeParts[1];

        const dir = path.join("..", "uploads", fileType);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, `${mediaId}.${fileFormat}`);
        const mediaResponse = await axios.get(mediaUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "stream",
        });
        console.log(mediaResponse.data), "mediaResponse";

        const writer = fs.createWriteStream(filePath);
        mediaResponse.data.pipe(writer);

        return new Promise((resolve, reject) => {
          writer.on("finish", () => resolve(filePath));
          writer.on("error", (error) => reject(error));
        });
      } catch (error) {
        console.error("Error downloading media:", error);
        return null;
      }
    };

    if (data.image) {
      messagePayload.type = "image";
      filePath = await downloadMedia(data.image.id);
      messagePayload.type = "image";
      messagePayload.image = { id: data.image.id };
      mediaType = 1;
    } else if (data.video) {
      messagePayload.type = "video";
      filePath = await downloadMedia(data.video.id);
      messagePayload.video = { id: data.video.id };
      mediaType = 2;
    } else if (data.audio) {
      messagePayload.type = "audio";
      filePath = await downloadMedia(data.audio.id);
      mediaType = 3;
    } else if (data.document) {
      messagePayload.type = "document";
      filePath = await downloadMedia(data.document.id);
      mediaType = 4;
    } else if (data.text) {
      messagePayload.type = "text";
      mediaBasedMsg = data.text.body;
      messagePayload.text = { body: data.text.body };
      mediaType = 0;
    }

    console.log(messagePayload, "messagePayload");

    const rresponse: any = await axios.post(apiUrl, messagePayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (filePath) {
      mediaBasedMsg = filePath?.replace("../uploads", "uploads");
    }

    console.log(rresponse.data.messages[0].id, "rresponse1212");
    const newMessage = {
      cid: cid,
      agent_id: agent_id,
      sender_id: data.from,
      receiver_id: data.to,
      user_name: data.user_name,
      message_id: rresponse.data.messages[0].id,
      message: mediaBasedMsg,
      message_type: 1,
      media_type: mediaType,
      delivery_type: 1,
      reply_message_id: null,
      block_message_users: [],
      delete_message_users: [],
      is_deleted: 0,
      is_edited: 0,
      sent_time: new Date().toISOString(),
      deliverd_time: null,
      read_time: null,
    };

    const newMessageObj = await Whatsapp.create(newMessage);
    // console.log(newMessageObj);
    if (!rresponse.data || Object.keys(rresponse.data).length === 0) {
      return res.status(400).send({
        success: 0,
        message: "API not working",
      });
    }

    return res.status(200).send({
      success: 1,
      message: "New message added successfully",
      response: rresponse.data,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message, "errorcheck");
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
const receiveMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(WEBHOOK_VERIFY_TOKEN);
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    const status = req.body.entry?.[0]?.changes[0]?.value?.statuses?.[0];
    console.log(
      status,
      req.body.entry?.[0]?.changes[0]?.value?.statuses,
      "testingmessagestore"
    );
    const userName =
      req.body.entry?.[0]?.changes[0]?.value?.contacts?.[0].profile?.name;
    console.log(message, "messagecheckstart");
    if (message) {
      const receiver_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.display_phone_number;
      console.log(message?.type);
      let mediaType = 0;
      let mediaBasedMsg: any;
      let filePath: string | null = null;

      const cid = await company
        .findOne({ whatsapp_number: receiver_id, is_deleted:0 })
        .select("_id");
      console.log(cid, "cidcheck");

      let get_company_detail:any = await company.findById({
        _id:cid?._id
      })
  
      const accessToken = get_company_detail.whatsapp_accessToken
      // Helper function to download media
      const downloadMedia = async (
        mediaId: string,
        mimeType: string
      ): Promise<string | null> => {
        try {
          const mediaUrlResponse = await axios.get(
            `https://graph.facebook.com/v20.0/${mediaId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const mediaUrl = mediaUrlResponse.data.url;
          const mimeTypeParts = mimeType.split("/");
          const fileType = mimeTypeParts[0];
          const fileFormat = mimeTypeParts[1];

          const dir = path.join("..", "uploads", fileType);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          const filePath = path.join(dir, `${mediaId}.${fileFormat}`);
          const mediaResponse = await axios.get(mediaUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "stream",
          });

          const writer = fs.createWriteStream(filePath);
          mediaResponse.data.pipe(writer);

          return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(filePath));
            writer.on("error", (error) => reject(error));
          });
        } catch (error) {
          console.error("Error downloading media:", error);
          return null;
        }
      };
      console.log(message, "messagecheck");
      switch (message?.type) {
        case "text":
          mediaType = 0;
          mediaBasedMsg = message?.text?.body;
          console.log(message?.type);
          break;
        case "image":
          mediaType = 1;
          filePath = await downloadMedia(
            message?.image?.id,
            message?.image?.mime_type
          );
          break;
        case "sticker":
          mediaType = 1;
          filePath = await downloadMedia(
            message?.sticker?.id,
            message?.sticker?.mime_type
          );
          break;
        case "video":
          mediaType = 2;
          filePath = await downloadMedia(
            message?.video?.id,
            message?.video?.mime_type
          );
          break;
        case "audio":
          mediaType = 3;
          let newPath = message?.audio?.mime_type.split(";");
          filePath = await downloadMedia(message?.audio?.id, newPath[0]);
          break;
        case "document":
          mediaType = 4;
          filePath = await downloadMedia(
            message?.document?.id,
            message?.document?.mime_type
          );
          break;
        case "location":
          mediaType = 6;
          mediaBasedMsg = message?.location;
          break;
        case "contacts":
          mediaType = 5;
          break;
        default:
          mediaType = 0; // Default for unknown types
          break;
      }
      if (filePath) {
        mediaBasedMsg = filePath?.replace("../uploads", "uploads");
      }
      let replay_message: any;

      if (message?.context?.id) {
        let get_replay_message: any = await Whatsapp.findOne({
          message_id: message?.context?.id,
        });
        replay_message = get_replay_message;
      } else {
        replay_message = null;
      }

      const newMessage = {
        cid: cid,
        agent_id: null,
        sender_id: message.from,
        receiver_id: receiver_id,
        user_name: userName,
        message_id: message.id,
        message: mediaBasedMsg,
        message_type: message?.context?.id ? 1 : 0,
        media_type: mediaType,
        delivery_type: 1,
        reply_message_id: message?.context?.id || null,
        block_message_users: [],
        delete_message_users: [],
        is_deleted: 0,
        is_edited: 0,
        sent_time: new Date(
          parseInt(message.timestamp, 10) * 1000
        ).toISOString(),
        deliverd_time: null,
        read_time: null,
      };
      const existingMessage = await Whatsapp.findOne({
        message_id: message.id,
      });
      if (existingMessage) {
        return res.status(400).send({
          success: 1,
          message: "message alredy exists",
        });
      }
      console.log(newMessage, "newMessage1212socket");
      const newMessageObj = await Whatsapp.create(newMessage);
      console.log(newMessageObj, socket, "newMessage1212socket");

      const message_detail = {
        cid: cid?._id,
        sender_id: newMessageObj?.sender_id,
        receiver_id: newMessageObj?.receiver_id,
        agent_id: newMessageObj?.agent_id,
        message: newMessageObj?.message,
        message_type: newMessageObj?.message_type,
        media_type: newMessageObj?.media_type,
        message_id: newMessageObj?.message_id,
        reply_message_id: newMessageObj.reply_message_id,
        delivery_type: newMessageObj?.delivery_type,
        user_name: newMessageObj?.user_name,
        createdAt: newMessageObj?.sent_time,
        replay_message: replay_message,
      };
      socket.emit("receive_message", message_detail);
      console.log(message_detail);
    }
    if (
      status?.status == "read" ||
      status?.status == "delivered" ||
      status?.status == "failed"
    ) {
      console.log("deloverd");
      socket.emit("send_deliver_status", req.body);
    }

    return res.status(200).send({
      success: 1,
      message: "receive message",
    });
  } catch (error) {
    socket.emit("wapierror", error);
    res.status(500).send({
      success: 0,
      message: "internal server error",
    });
  }
};
const webhookVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
};
const ConfigWhatssapAToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);

    const {
      whatsapp_accessToken,
      whatsapp_number,
      whatsapp_phone_number_id
    }= req.body;

    if (whatsapp_accessToken == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "AccessToken Is Mandatory.",
      });
    }

    if (whatsapp_accessToken == "") {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "AccessToken Is Invalid.",
      });
    }

    if (whatsapp_number == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Number Is Mandatory.",
      });
    }

    if (whatsapp_number == "" || !REGEXP.COMMON.checkStringISNumber.test(whatsapp_number)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Number Is Invalid.",
      });
    }

    if (whatsapp_phone_number_id == undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Phone Number ID Is Mandatory.",
      });
    }

    if (whatsapp_phone_number_id == "" || !REGEXP.COMMON.checkStringISNumber.test(whatsapp_phone_number_id)) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Phone Number ID Is Invalid.",
      });
    }

    let companyDetail: any = await company.findOne({
      _id: user_detail?.cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company Not Found.",
      });
    }

    let companyDetail_number: any = await company.findOne({
      _id:{$ne:user_detail?.cid},
      is_deleted: 0,
      whatsapp_number:whatsapp_number
    });

    console.log("companyDetail_number",companyDetail_number)

    if (companyDetail_number) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Whatsapp Number Already associated With Other Company",
      });
    }

    let companyDetail_number_id: any = await company.findOne({
      _id:{$ne:user_detail?.cid},
      is_deleted: 0,
      whatsapp_phone_number_id:whatsapp_phone_number_id
    });


    if (companyDetail_number_id) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Whatsapp Phone Number Id Already associated With Other Company",
      });
    }

    await company.findByIdAndUpdate({
      _id:user_detail?.cid,
    },{
      whatsapp_accessToken:whatsapp_accessToken,
      whatsapp_number:whatsapp_number,
      whatsapp_phone_number_id:whatsapp_phone_number_id
    })

    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Whatsaap Token Added Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
const getWhatssapAUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);

    let companyDetail: any = await company.findOne({
      _id: user_detail?.cid,
      is_deleted: 0,
    });

    if (!companyDetail) {
      return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
        success: 0,
        message: "Company Not Found.",
      });
    }

    let companyDetail_whatssapDetail: any = await company.findOne({
      _id: user_detail?.cid,
      is_deleted: 0,
    }).select("whatsapp_accessToken whatsapp_number whatsapp_phone_number_id")


    return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
      success: 1,
      message: "Whatsaap Config Detail",
      WhatsappDetail:companyDetail_whatssapDetail
    });

  } catch (error) {
    console.log(error);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};
export default { receiveMessage, webhookVerified, sendMessage , ConfigWhatssapAToken,getWhatssapAUrl};
