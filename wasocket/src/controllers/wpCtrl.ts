// import express, { NextFunction, Request, Response } from "express";
// import axios from "axios";
// import Whatsapp from "../models/Whatsapp";
// import stream from "stream"
// import path from 'path'
// import fs from 'fs'
// import company from "../models/company";

// const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

// const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         console.log(req.body, "testingbody");
//         const token = ""
//         // await get_token(req);
//         const user_detail = ""
//         // await User_token(token);
//         var cid: any = user_detail?.cid;
//         var agent_id: any = user_detail?.uid;

//         const data: any = req.body;
//         let mediaType = 0;
//         var filePath: any | null;
//         let mediaBasedMsg: any;

//         let messagePayload: any = {
//             "messaging_product": "whatsapp",
//             "recipient_type": "individual",
//             "to": data.to
//         };

//         const downloadMedia = async (mediaId: string): Promise<string | null> => {
//             try {
//                 console.log(mediaId, "mediaUrlResponse");
//                 const mediaUrlResponse = await axios.get(`https://graph.facebook.com/v20.0/${mediaId}`, {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`
//                     }
//                 });

//                 const mediaUrl = mediaUrlResponse.data.url;
//                 console.log(mediaUrl, "mediaurl");

//                 const mimeTypeParts = mediaUrlResponse?.data?.mime_type.split('/');
//                 const fileType = mimeTypeParts[0];
//                 const fileFormat = mimeTypeParts[1];

//                 const dir = path.join('..', 'uploads', fileType);

//                 if (!fs.existsSync(dir)) {
//                     fs.mkdirSync(dir, { recursive: true });
//                 }

//                 const filePath = path.join(dir, `${mediaId}.${fileFormat}`);
//                 const mediaResponse = await axios.get(mediaUrl, {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`
//                     },
//                     responseType: 'stream'
//                 });
//                 console.log(mediaResponse.data), "mediaResponse";

//                 const writer = fs.createWriteStream(filePath);
//                 mediaResponse.data.pipe(writer);

//                 return new Promise((resolve, reject) => {
//                     writer.on('finish', () => resolve(filePath));
//                     writer.on('error', (error) => reject(error));
//                 });
//             } catch (error) {
//                 console.error('Error downloading media:', error);
//                 return null;
//             }
//         };

//         if (data.image) {
//             messagePayload.type = "image";
//             filePath = await downloadMedia(data.image.id);
//             messagePayload.type = "image";
//             messagePayload.image = { id: data.image.id };
//             mediaType = 1
//         } else if (data.video) {
//             messagePayload.type = "video";
//             filePath = await downloadMedia(data.video.id);
//             messagePayload.video = { id: data.video.id };
//             mediaType = 2
//         } else if (data.audio) {
//             messagePayload.type = "audio";
//             filePath = await downloadMedia(data.audio.id);
//             mediaType = 3
//         } else if (data.document) {
//             messagePayload.type = "document";
//             filePath = await downloadMedia(data.document.id);
//             mediaType = 4
//         } else if (data.text) {
//             messagePayload.type = "text";
//             mediaBasedMsg = data.text.body
//             messagePayload.text = { body: data.text.body };
//             mediaType = 0
//         }

//         console.log(messagePayload, "messagePayload");

//         const rresponse: any = await axios.post(apiUrl, messagePayload, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         if (filePath) {
//             mediaBasedMsg = filePath?.replace("../uploads", "uploads");
//         }

//         console.log(rresponse.data.messages[0].id, "rresponse1212");
//         const newMessage = {
//             cid: cid,
//             agent_id: agent_id,
//             sender_id: data.from,
//             receiver_id: data.to,
//             user_name: data.user_name,
//             message_id: rresponse.data.messages[0].id,
//             message: mediaBasedMsg,
//             message_type: 1,
//             media_type: mediaType,
//             delivery_type: 1,
//             reply_message_id: null,
//             block_message_users: [],
//             delete_message_users: [],
//             is_deleted: 0,
//             is_edited: 0,
//             sent_time: new Date().toISOString(),
//             deliverd_time: null,
//             read_time: null,
//         };

//         const newMessageObj = await Whatsapp.create(newMessage);
//         // console.log(newMessageObj);
//         if (!rresponse.data || Object.keys(rresponse.data).length === 0) {
//             return res.status(400).send({
//                 success: 0,
//                 message: "API not working"
//             });
//         }

//         return res.status(200).send({
//             success: 1,
//             message: "New message added successfully",
//             response: rresponse.data
//         });
//     } catch (error) {
//         if (error instanceof Error) {
//             console.log(error.message, "errorcheck");
//         } else {
//             res.status(500).json({ error: 'An unknown error occurred' });
//         }
//     }
// }

// const receiveMessage = async (req: Request, res: Response, next: NextFunction) => {

//     try {
//         console.log(WEBHOOK_VERIFY_TOKEN)
//         console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

//         const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
//         const status = req.body.entry?.[0]?.changes[0]?.value?.statuses?.[0];
//         const userName = req.body.entry?.[0]?.changes[0]?.value?.contacts?.[0].profile?.name

//         if (message) {
//             const receiver_id =
//                 req.body.entry?.[0].changes?.[0].value?.metadata?.display_phone_number;
//             console.log(message?.type);
//             let mediaType = 0;
//             let mediaBasedMsg: any;
//             let filePath: string | null = null;

//             // Helper function to download media
//             const downloadMedia = async (mediaId: string, mimeType: string): Promise<string | null> => {
//                 try {
//                     const mediaUrlResponse = await axios.get(`https://graph.facebook.com/v20.0/${mediaId}`, {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`
//                         }
//                     });

//                     const mediaUrl = mediaUrlResponse.data.url;
//                     const mimeTypeParts = mimeType.split('/');
//                     const fileType = mimeTypeParts[0];
//                     const fileFormat = mimeTypeParts[1];

//                     const dir = path.join('..', 'uploads', fileType);

//                     if (!fs.existsSync(dir)) {
//                         fs.mkdirSync(dir, { recursive: true });
//                     }

//                     const filePath = path.join(dir, `${mediaId}.${fileFormat}`);
//                     const mediaResponse = await axios.get(mediaUrl, {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`
//                         },
//                         responseType: 'stream'
//                     });

//                     const writer = fs.createWriteStream(filePath);
//                     mediaResponse.data.pipe(writer);

//                     return new Promise((resolve, reject) => {
//                         writer.on('finish', () => resolve(filePath));
//                         writer.on('error', (error) => reject(error));
//                     });
//                 } catch (error) {
//                     console.error('Error downloading media:', error);
//                     return null;
//                 }
//             };

//             switch (message?.type) {
//                 case 'text':
//                     mediaType = 0;
//                     mediaBasedMsg = message?.text?.body;
//                     console.log(message?.type);
//                     break;
//                 case 'image':
//                     mediaType = 1;
//                     filePath = await downloadMedia(message?.image?.id, message?.image?.mime_type);
//                     break;
//                 case 'video':
//                     mediaType = 2;
//                     filePath = await downloadMedia(message?.video?.id, message?.video?.mime_type);
//                     break;
//                 case 'audio':
//                     mediaType = 3;
//                     let newPath = message?.audio?.mime_type.split(";")
//                     filePath = await downloadMedia(message?.audio?.id, newPath[0]);
//                     break;
//                 case 'document':
//                     mediaType = 4;
//                     filePath = await downloadMedia(message?.document?.id, message?.document?.mime_type);
//                     break;
//                 case 'location':
//                     mediaType = 5;
//                     break;
//                 case 'contacts':
//                     mediaType = 6;
//                     break;
//                 default:
//                     mediaType = 0; // Default for unknown types
//                     break;
//             }
//             if (filePath) {
//                 mediaBasedMsg = filePath?.replace("../uploads", "uploads");
//             }

//             const cid = await company.findOne({ company_mobile_no: receiver_id }).select("_id")
//             console.log(cid);

//             const newMessage = {
//                 cid: cid,
//                 agent_id: null,
//                 sender_id: message.from,
//                 receiver_id: receiver_id,
//                 user_name: userName,
//                 message_id: message.id,
//                 message: mediaBasedMsg,
//                 message_type: message?.context?.id ? 1 : 0,
//                 media_type: mediaType,
//                 delivery_type: 1,
//                 reply_message_id: message?.context?.id || null,
//                 block_message_users: [],
//                 delete_message_users: [],
//                 is_deleted: 0,
//                 is_edited: 0,
//                 sent_time: new Date(parseInt(message.timestamp, 10) * 1000).toISOString(),
//                 deliverd_time: null,
//                 read_time: null,
//             };

//             const newMessageObj = await Whatsapp.create(newMessage);
//             console.log(newMessageObj);

//             const existingMessage = await Whatsapp.findOne({ message_id: message.id });
//             if (!existingMessage) {
//                 return res.status(400).send({
//                     success: 1,
//                     message: "message alredy exists",
//                 })
//             }
//             console.log(existingMessage);
//         }


//         return res.status(200).send({
//             success: 1,
//             message: "receive message",
//         })
//     } catch (error) {
//         res.status(500).send({
//             success: 0,
//             message: "internal server error"
//         })
//     }
// }

// export default { receiveMessage, webhookVerified, sendMessage, getPhoneNumberList }
