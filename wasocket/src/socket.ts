import mongoose from "mongoose";
import { Server } from "socket.io";
import company from "./models/company";
import { Request, Response } from "express";
import axios from "axios";
import Whatsapp from "./models/Whatsapp";
import user from "./models/user";
import { MESSAGE } from "./constant";
import fs from "fs";
import path from "path";
import user_assigned from "./models/user_assigned";

let io: any;
let socket_users: any[] = [];

export const connect = async (server: any) => {
  io = new Server(server, {
    allowEIO3: true,
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", async (socket: any) => {
    const { cid, uid, isAgent_connect } = socket.handshake.query;
    console.log(cid, uid, isAgent_connect, socket.id, "testingsocketconnect");

    if (isAgent_connect == 0) {
      console.log(isAgent_connect, "isAgent_connect");

      console.log(cid, "cid123");
      const socket_obj = {
        isAgent_connect: isAgent_connect,
        socket_id: socket.id,
      };
      // socket_users.push(socket_obj);
      console.log("socket connected");
    } else if (isAgent_connect == 1) {
      if (
        cid &&
        cid !== "undefined" &&
        cid !== null &&
        uid &&
        uid !== "undefined" &&
        uid !== null
      ) {
        const socket_obj = {
          cid,
          uid,
          socket_id: socket.id,
        };
        socket_users.push(socket_obj);
        console.log("socket connected");
      } else {
        console.log(
          "Invalid connection parameters. cid or uid is null or undefined."
        );
        socket.emit("error", {
          message:
            "Invalid connection parameters. Please provide valid cid and uid.",
        });
      }
    } else {
      console.log("Invalid connection parameters. isAgent_connect is invalid.");
      socket.emit("error", {
        message:
          "Invalid connection parameters. Please provide a valid isAgent_connect value.",
      });
      socket.disconnect();
    }

    socket.on("receive_message", async (data: any) => {
      console.log(data, "data121212");
      try {
        // const newMessageObj = await Whatsapp.create(data);
        // console.log(newMessageObj);
        const sendrSocketIds: any[] = [];

        await Promise.all(
          socket_users.map(async (item) => {
            console.log(item, "checkitem");
            if (item.cid.toString() === data?.cid?.toString()) {
              sendrSocketIds.push(item.socket_id);
            }
          })
        );
        console.log(sendrSocketIds, "sendrSocketIds");
        if (sendrSocketIds.length > 0) {
          io.to(sendrSocketIds).emit("ack_receive_message", {
            message_detail: data,
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    });

    socket.on("send_message", async (data: any) => {
      try {
        console.log(data, "data123");
        if (
          data.cid === undefined ||
          data.cid == null ||
          data.agent_id == undefined ||
          data.agent_id == null ||
          data.sender_id == undefined ||
          data.sender_id == null ||
          data.receiver_id == undefined ||
          data.receiver_id == null
        ) {
          return console.log("Data missing");
        }
        console.log(data, "data123");
        let messagePayload: any = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: data.receiver_id,
        };
        var filePath: any | null;
        let mediaBasedMsg: any;
        let mediaType = 0;
        let CompanyDetail: any = await company.findById(data.cid);
        const downloadMedia = async (
          mediaId: string
        ): Promise<string | null> => {
          try {
            console.log(mediaId, "mediaUrlResponse");
            const mediaUrlResponse = await axios.get(
              `https://graph.facebook.com/v20.0/${mediaId}`,
              {
                headers: {
                  Authorization: `Bearer ${CompanyDetail.whatsapp_accessToken}`,
                },
              }
            );
            console.log(mediaUrlResponse, "mediaurl");
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
                Authorization: `Bearer ${CompanyDetail.whatsapp_accessToken}`,
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
        if (data.media_type == 1) {
          messagePayload.type = "image";
          filePath = await downloadMedia(data.message);
          messagePayload.image = { id: data.message };
          mediaType = 1;
        } else if (data.media_type == 2) {
          messagePayload.type = "video";
          filePath = await downloadMedia(data.message);
          messagePayload.video = { id: data.message };
          mediaType = 2;
        } else if (data.media_type == 3) {
          messagePayload.type = "audio";
          filePath = await downloadMedia(data.message);
          messagePayload.audio = { id: data.message };
          mediaType = 3;
        } else if (data.media_type == 4) {
          messagePayload.type = "document";
          filePath = await downloadMedia(data.message);
          messagePayload.document = { id: data.message };
          mediaType = 4;
        } else if (data.media_type == 6) {
          messagePayload.type = "location";
          messagePayload.location = data.message;
          mediaType = 6;
        } else if (data.message) {
          messagePayload.type = "text";
          let text: { body: any } = { body: data.message };
          console.log(text, "textcheck");
          messagePayload.text = { body: text.body };
          mediaType = 0;
        }

        if (data?.message_type == 1 && data?.reply_message_id != null) {
          messagePayload.context = { message_id: data?.reply_message_id };
        }
        console.log(messagePayload, "messagePayload121");
        let apiUrl = `https://graph.facebook.com/v19.0/${CompanyDetail.whatsapp_phone_number_id}/messages`;
        const rresponse: any = await axios.post(apiUrl, messagePayload, {
          headers: {
            Authorization: `Bearer ${CompanyDetail.whatsapp_accessToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log(rresponse, "rresponse1212");
        if (!rresponse.data || Object.keys(rresponse.data).length === 0) {
          return console.log("Api not working");
        }

        console.log(rresponse, "data12121212");
        let cid: any = data.cid; //user
        let agent_id: any = data.agent_id; //user
        let sender_id: any = data.sender_id; //user
        let receiver_id: any = data.receiver_id; //user
        let user_name: any = data.user_name; //user if chat avaiable than pass otherwise blank
        let message_id: any = await rresponse.data.messages[0].id; // user
        let message: any = data.message; //user
        let message_type: any = data.message_type; //user
        let media_type: any = data.media_type; //user
        let delivery_type: any = data.delivery_type; //user
        let reply_message_id: any = data.reply_message_id; //user if not than blank
        let block_message_users: any[] = data.block_message_users;
        let delete_message_users: any[] = data.delete_message_users;
        let is_deleted: any = data.is_deleted;
        let is_edited: any = data.is_edited;
        let sent_time: any = new Date().toISOString();
        let deliverd_time: any = data.deliverd_time;
        let read_time: any = null;
        let fail_message: any = "";
        let post: any;

        let get_user_detail: any = user.findById({
          id: agent_id,
          is_deleted: 0,
        });

        const aggent_details = await user
          .findOne({
            _id: agent_id,
            is_deleted: 0,
          })
          .select("first_name last_name");
        console.log(aggent_details);

        // let originalName_tmp: any = "";
        // if (get_user_detail) {
        //   originalName_tmp = get_user_detail.first_name + " " + get_user_detail.last_name;
        //   user_name = {
        //     name: get_user_detail.first_name + " " + get_user_detail.last_name,
        //     image: get_user_detail.user_image
        //   }
        // }
        if (filePath) {
          mediaBasedMsg = filePath?.replace("../uploads", "uploads");
        }

        post = new Whatsapp();
        post.cid = cid;
        post.sender_id = sender_id;
        post.receiver_id = receiver_id;
        post.agent_id = agent_id;
        // post.originalName = originalName_tmp ? originalName_tmp : "";
        post.message = mediaBasedMsg ? mediaBasedMsg : message;
        post.message_type = message_type;
        post.media_type = media_type;
        post.message_id = message_id;
        post.reply_message_id = data.reply_message_id;
        post.delivery_type = MESSAGE.MESSAGE_DELIVERY_STATUS.SENDED;
        post.user_name = data.user_name;

        await post.save();

        post = post.toObject();

        let replay_message: any;

        if (data?.message_type == 1) {
          let get_replay_message: any = await Whatsapp.findOne({
            message_id: data?.reply_message_id,
          });
          replay_message = get_replay_message;
        } else {
          replay_message = {};
        }

        const message_detail = {
          cid: cid,
          sender_id: sender_id,
          receiver_id: receiver_id,
          agent_id: agent_id,
          message: mediaBasedMsg ? mediaBasedMsg : message,
          message_type: message_type,
          media_type: media_type,
          message_id: message_id,
          reply_message_id: data.reply_message_id,
          delivery_type: MESSAGE.MESSAGE_DELIVERY_STATUS.SENDED,
          user_name: data.user_name,
          sender_detail: aggent_details,
          createdAt: sent_time,
          replay_message: replay_message,
          fail_message: "",
        };
        const sendrSocketIds: any[] = [];

        await Promise.all(
          socket_users.map(async (item) => {
            console.log(item, "checkitem");
            if (item.cid.toString() === cid.toString()) {
              sendrSocketIds.push(item.socket_id);
            }
          })
        );
        console.log(sendrSocketIds, "sendrSocketIds");
        if (sendrSocketIds.length > 0) {
          io.to(sendrSocketIds).emit("ack_send_message", {
            message_detail: message_detail,
            sender_detail: user_name,
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    });

    socket.on("user_assign", async (data: any) => {
      try {
        if (
          data.cid === undefined ||
          data.cid == null ||
          data.assigned_id === undefined ||
          data.assigned_id == null ||
          data.receiver_id === undefined ||
          data.receiver_id === null
        ) {
          return console.log("user_assign data missing");
        }
        let cid: any = data.cid;
        let uid: any = data.uid;
        let assigned_id: any = data.assigned_id;
        let receiver_id: any = data.receiver_id;
        let assigned_obj: any;

        assigned_obj = new user_assigned();
        assigned_obj.cid = cid;
        assigned_obj.assigned_id = assigned_id;
        assigned_obj.receiver_id = receiver_id;

        let check_data = await user_assigned.findOne({ cid, receiver_id });
        console.log(check_data);

        if (check_data) {
          const update_data = await user_assigned.findOneAndUpdate(
            { cid, receiver_id },
            { assigned_id },
            { new: true }
          );
        } else {
          await assigned_obj.save();
        }

        const sendrSocketIds: any[] = [];

        await Promise.all(
          socket_users.map(async (item) => {
            console.log(item);
            if (item.cid.toString() === cid.toString()) {
              sendrSocketIds.push(item.socket_id);
            }
          })
        );
        console.log(sendrSocketIds);

        if (sendrSocketIds.length > 0) {
          io.to(sendrSocketIds).emit("ack_user_assign", {
            user_assign: assigned_obj,
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    });

    socket.on("send_deliver_status", async (data: any) => {
      console.log(data, "deliverrrr");
      try {
        let updateData: any = {};
        const send_data = data.entry?.[0]?.changes[0]?.value?.statuses?.[0];
        const cid_number =
          data.entry?.[0]?.changes[0]?.value?.metadata?.display_phone_number;

        const cid: any = await company
          .findOne({ whatsapp_number: cid_number })
          .select("_id");

        if (send_data?.status == "read") {
          console.log("read");

          updateData.delivery_type = 3;
          updateData.read_time = new Date(
            parseInt(send_data?.timestamp, 10) * 1000
          ).toISOString();
        } else if (send_data?.status == "delivered") {
          console.log("delivered");
          updateData.delivery_type = 2;
          updateData.deliverd_time = new Date(
            parseInt(send_data?.timestamp, 10) * 1000
          ).toISOString();
        } else if (send_data?.status == "failed") {
          updateData.delivery_type = 4;
          updateData.fail_message = send_data?.errors[0]?.error_data?.details;
          updateData.deliverd_time = new Date(
            parseInt(send_data?.timestamp, 10) * 1000
          ).toISOString();
        }
        // else{
        //   delivery_type = 1
        //   var sent_time = new Date(parseInt(send_data?.timestamp, 10) * 1000).toISOString()
        // };

        let newMessageObj = await Whatsapp.findOneAndUpdate(
          { message_id: send_data.id },
          { $set: updateData },
          { new: true }
        );
        console.log(newMessageObj);

        const sendrSocketIds: any[] = [];

        await Promise.all(
          socket_users.map(async (item) => {
            console.log(item, "checkitem");
            if (item.cid.toString() === cid?._id.toString()) {
              sendrSocketIds.push(item.socket_id);
            }
          })
        );
        console.log(sendrSocketIds, "sendrSocketIds");
        if (sendrSocketIds.length > 0) {
          io.to(sendrSocketIds).emit("ack_deliver_status", {
            message_detail: newMessageObj,
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    });

    socket.on("read_all_message", async (data: any) => {
      console.log(data, "deliverrrr");
      try {
        let cid: any = data.cid;
        let sender_id: any = data.sender_id;
        let receiver_id: any = data.receiver_id;

        let CompanyDetail: any = await company.findById(data.cid);

        let unred_msg_id = await await Whatsapp.find({
          cid: cid,
          sender_id: receiver_id,
          delivery_type: 1,
        });

        let message_ids = unred_msg_id.map((msg) => msg?.message_id);

        const markAsRead = async (message_id: any) => {
          console.log(message_id);

          const obj = {
            messaging_product: "whatsapp",
            status: "read",
            message_id: message_id,
          };
          let apiUrl = `https://graph.facebook.com/v19.0/${CompanyDetail.whatsapp_phone_number_id}/messages`;

          await axios
            .post(apiUrl, obj, {
              headers: {
                Authorization: `Bearer ${CompanyDetail.whatsapp_accessToken}`,
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              if (res?.data.success) {
                console.log("Message read successfully");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        };

        for (let message_id of message_ids) {
          await markAsRead(message_id);
        }
        let newMessageObj = await Whatsapp.updateMany(
          {
            cid: cid,
            sender_id: receiver_id,
            delivery_type: 1,
          },
          { delivery_type: 3 },
          { new: true }
        );
        console.log(newMessageObj);

        let obj = {
          cid: cid,
          sender_id: sender_id,
          receiver_id: receiver_id,
        };
        const sendrSocketIds: any[] = [];

        await Promise.all(
          socket_users.map(async (item) => {
            console.log(item, "checkitem");
            if (item.cid.toString() === cid?.toString()) {
              sendrSocketIds.push(item.socket_id);
            }
          })
        );
        console.log(sendrSocketIds, "sendrSocketIds");
        if (sendrSocketIds.length > 0) {
          io.to(sendrSocketIds).emit("ack_read_all_message", {
            all_read: obj,
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    });

    socket.on("delete_message", async (data: any) => {
      let cid: any = data.cid;
      let message_id: any[] = data.message_id;
      let reciver_arr: any[] = [];
      let receiver_id: any = data.receiver_id;

      if (cid && message_id.length != 0) {
        let getDeleteData = await Whatsapp.updateMany(
          {
            message_id: { $in: message_id },
          },
          {
            is_deleted: 1,
          },
          {
            new: true,
          }
        );
        console.log(getDeleteData, "getDeleteData1212");
        reciver_arr.push(message_id.toString());
      }
      const sendrSocketIds: any[] = [];

      await Promise.all(
        socket_users.map(async (item) => {
          console.log(item);
          if (item.cid.toString() === cid.toString()) {
            sendrSocketIds.push(item.socket_id);
          }
        })
      );
      console.log(sendrSocketIds);

      if (sendrSocketIds.length > 0) {
        io.to(sendrSocketIds).emit("ack_delete_message", {
          receiver_id: receiver_id,
          cid: cid,
          user_assign: reciver_arr,
        });
      }
    });
    socket.on("clear_chat", async (data: any) => {
      try {
        console.log(data);

        let cid: any = data.cid;
        let uid: any = data.sender_id;
        let receiver_id: any = data.receiver_id;

        if (
          uid !== undefined &&
          uid !== null &&
          receiver_id !== undefined &&
          receiver_id !== null
        ) {
          let findQuery = {
            is_deleted: 0,
            $or: [
              { receiver_id: uid, sender_id: receiver_id },
              { receiver_id: receiver_id, sender_id: uid },
            ],
          };
          let cleardata = await Whatsapp.updateMany(
            findQuery,
            {
              is_deleted: 1,
            },
            {
              new: true,
            }
          );
          console.log(cleardata);
        }
        const sendrSocketIds: any[] = [];

        await Promise.all(
          socket_users.map(async (item) => {
            console.log(item);
            if (
              item.cid.toString() === cid.toString()
              // && uid.toString() === item?.uid.toString()
            ) {
              let post: any = {
                uid: uid,
                cid: cid,
                receiver_id: receiver_id,
                message: "Clear Chat Successfully !!",
              };
              io.to(item.socket_id).emit("ack_clear_chat", post);
            }
          })
        );
      } catch (error: any) {
        console.log("error", error);
        if (data.uid !== undefined && data.uid !== null) {
          const emiter_arr: any[] = [];
          await Promise.all(
            socket_users.map(async (item) => {
              if (item.uid.toString() === data.uid.toString()) {
                emiter_arr.push(item.socket_id);
              }
            })
          );
          if (emiter_arr.length > 0) {
            let get_error: any = JSON.stringify(error.toString());
            io.to(emiter_arr).emit("Socket_emit_error", get_error);
          }
        }
      }
    });
    socket.on("delete_user", async (data: any) => {
      try {
        console.log(data);

        let cid: any = data.cid;
        let uid: any = data.sender_id;
        let receiver_id: any = data.receiver_id;

        if (
          uid !== undefined &&
          uid !== null &&
          receiver_id !== undefined &&
          receiver_id !== null
        ) {
          let findQuery = {
            is_deleted: 0,
            $or: [
              { receiver_id: uid, sender_id: receiver_id },
              { receiver_id: receiver_id, sender_id: uid },
            ],
          };
          let cleardata = await Whatsapp.updateMany(
            findQuery,
            {
              is_deleted: 1,
            },
            {
              new: true,
            }
          );
          console.log(cleardata);
        }
        const sendrSocketIds: any[] = [];

        await Promise.all(
          socket_users.map(async (item) => {
            console.log(item);
            if (
              item.cid.toString() === cid.toString()
              // && uid.toString() === item?.uid.toString()
            ) {
              let post: any = {
                uid: uid,
                cid: cid,
                receiver_id: receiver_id,
                message: "Delete User Successfully !!",
              };
              io.to(item.socket_id).emit("ack_delete_user", post);
            }
          })
        );
      } catch (error: any) {
        console.log("error", error);
        if (data.uid !== undefined && data.uid !== null) {
          const emiter_arr: any[] = [];
          await Promise.all(
            socket_users.map(async (item) => {
              if (item.uid.toString() === data.uid.toString()) {
                emiter_arr.push(item.socket_id);
              }
            })
          );
          if (emiter_arr.length > 0) {
            let get_error: any = JSON.stringify(error.toString());
            io.to(emiter_arr).emit("Socket_emit_error", get_error);
          }
        }
      }
    });
    socket.on("log_out", async (data: any) => {
      let cid: any = data.cid;

      const sendrSocketIds: any[] = [];

      await Promise.all(
        socket_users.map(async (item) => {
          console.log(item);
          if (item.cid.toString() === cid.toString()) {
            sendrSocketIds.push(item.socket_id);
          }
        })
      );
      console.log(sendrSocketIds);

      if (sendrSocketIds.length > 0) {
        io.to(sendrSocketIds).emit("ack_log_out", {
          cid: cid,
        });
      }
    });
    socket.on("user_log_out", async (data: any) => {
      let cid: any = data.cid;
      let uid: any = data.uid;

      const sendrSocketIds: any[] = [];

      await Promise.all(
        socket_users.map(async (item) => {
          console.log(item);
          if (item.cid.toString() === cid.toString()) {
            sendrSocketIds.push(item.socket_id);
          }
        })
      );
      console.log(sendrSocketIds);

      if (sendrSocketIds.length > 0) {
        io.to(sendrSocketIds).emit("ack_user_log_out", {
          cid,
          uid,
        });
      }
    });
    socket.on("disconnect", async () => {
      console.log(socket.id);

      socket_users = socket_users.filter(
        (item) => item.socket_id !== socket.id
      );
    });
  });
};
// export default { receiveMessage, webhookVerified }
