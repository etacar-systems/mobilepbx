import express, { NextFunction, Request, Response } from "express";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import path from 'path'
import fs from 'fs'
import company from "../../models/company";
import Whatsapp from "../../models/Whatsapp";


const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

const accessToken = 'EAAaKy9XEVsMBOwGLLFDHnZB1QFpzRy0UPhiAchoP0ZCZBK1NuDT9MZA1J780k5g8gaAPp0ZCAlBIOwktD4IT37jouoefUVWc6KZBdZA028rErnwFN4rXL06yf671cE5JEY1YazauGOjKy4phPLcTuyKelyZAbZCrs9ZAo3GoYu49zZABpBb2tqzHvJZAhP1lO8lU8DBoJHDMkEujicoRKtwr3gWmSlePJCU5GBn8Y20ZD'; // Replace with your actual access token
const apiUrl = 'https://graph.facebook.com/v19.0/378441851999607/messages';


const SERVER_URL = `ws://70.34.195.221:8081/?uid=664dce76c2ac7807e7c6ea50&cid=6641fb77e965afdc1ee27c87&device_id=Samsung`;
const options = {
  transports: ["websocket", "polling"],
  rejectUnauthorized: false,
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  upgrade: true,
  secure: true
};

// Initialize the socket connection
const socket: Socket = io(SERVER_URL, options);
// console.log(socket, "socket121212")

socket.on("connect", () => {
  console.log("Connected to server");
});


const sendMessage = async (req: Request, res: Response, next: NextFunction) => {

  try {
    console.log(req.body, "testingbody")
    var data: any = req.body
    const rresponse: any = await axios.post(apiUrl, {
      messaging_product: 'whatsapp',
      to: data.to,
      type: 'template',
      template: data.template
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(rresponse, "rresponse1212")
    if (rresponse.data == "" || rresponse.data.length == 0) {
      return res.status(400).send({
        success: 1,
        message: "api not working ",
      });
    }

    return res.status(200).send({
      success: 1,
      message: "New message added successfully",
      respoinse: rresponse.data,
    });
    // return res.rresponse;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message, "errorcheck")
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
const receiveMessage = async (req: Request, res: Response, next: NextFunction) => {

  try {
    console.log(WEBHOOK_VERIFY_TOKEN)
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    const status = req.body.entry?.[0]?.changes[0]?.value?.statuses?.[0];
    const userName = req.body.entry?.[0]?.changes[0]?.value?.contacts?.[0].profile?.name

    if (message) {
      const receiver_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.display_phone_number;
      console.log(message?.type);
      let mediaType = 0;
      let mediaBasedMsg: any;
      let filePath: string | null = null;

      // Helper function to download media
      const downloadMedia = async (mediaId: string, mimeType: string): Promise<string | null> => {
        try {
          const mediaUrlResponse = await axios.get(`https://graph.facebook.com/v20.0/${mediaId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const mediaUrl = mediaUrlResponse.data.url;
          const mimeTypeParts = mimeType.split('/');
          const fileType = mimeTypeParts[0];
          const fileFormat = mimeTypeParts[1];

          const dir = path.join('..', 'uploads', fileType);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          const filePath = path.join(dir, `${mediaId}.${fileFormat}`);
          const mediaResponse = await axios.get(mediaUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            responseType: 'stream'
          });

          const writer = fs.createWriteStream(filePath);
          mediaResponse.data.pipe(writer);

          return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', (error) => reject(error));
          });
        } catch (error) {
          console.error('Error downloading media:', error);
          return null;
        }
      };

      switch (message?.type) {
        case 'text':
          mediaType = 0;
          mediaBasedMsg = message?.text?.body;
          console.log(message?.type);
          break;
        case 'image':
          mediaType = 1;
          filePath = await downloadMedia(message?.image?.id, message?.image?.mime_type);
          break;
        case 'video':
          mediaType = 2;
          filePath = await downloadMedia(message?.video?.id, message?.video?.mime_type);
          break;
        case 'audio':
          mediaType = 3;
          let newPath = message?.audio?.mime_type.split(";")
          filePath = await downloadMedia(message?.audio?.id, newPath[0]);
          break;
        case 'document':
          mediaType = 4;
          filePath = await downloadMedia(message?.document?.id, message?.document?.mime_type);
          break;
        case 'location':
          mediaType = 5;
          break;
        case 'contacts':
          mediaType = 6;
          break;
        default:
          mediaType = 0; // Default for unknown types
          break;
      }
      if (filePath) {
        mediaBasedMsg = filePath?.replace("../uploads", "uploads");
      }

      const cid = await company.findOne({ company_phone_number: receiver_id }).select("_id")
      console.log(cid);

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
        sent_time: new Date(parseInt(message.timestamp, 10) * 1000).toISOString(),
        deliverd_time: null,
        read_time: null,
      };
      const existingMessage = await Whatsapp.findOne({ message_id: message.id });
      if (existingMessage) {
        return res.status(400).send({
          success: 1,
          message: "message alredy exists",
        })
      }
      socket.emit("send_message", newMessage)
      // const newMessageObj = await Whatsapp.create(newMessage);
      console.log(newMessage);

    }


    return res.status(200).send({
      success: 1,
      message: "receive message",
    })
  } catch (error) {
    res.status(500).send({
      success: 0,
      message: "internal server error"
    })
  }
}

const webhookVerified = async (req: Request, res: Response, next: NextFunction) => {

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
}


export default { receiveMessage, webhookVerified, sendMessage }
