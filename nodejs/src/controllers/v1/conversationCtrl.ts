import { Request, Response, NextFunction } from "express";
import conversation from "../../models/conversation";
import group_message_status from "../../models/group_message_status";
import message_reaction from "../../models/message_reaction";
import pinned_message from "../../models/pinned_message";
import user_block from "../../models/user_block";
import user from "../../models/user";
import { MESSAGE } from "../../constant";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import mongoose from "mongoose";

const getAllRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let page: any = req.query.page;
    let size: any = req.query.size;
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    const token = await get_token(req);
    const user_detail = await User_token(token);

    var sender_id = user_detail?.uid;
    let created_sendr_id: any = new mongoose.Types.ObjectId(sender_id);
    var receiver_id = req.params.receiver_id;
    let created_receiver_id: any = new mongoose.Types.ObjectId(receiver_id);
    if (sender_id !== null && receiver_id !== null) {
      var findCondition = {
        is_deleted: 0,
        delete_message_users: { $ne: sender_id },
        $or: [
          { receiver_id: sender_id, sender_id: receiver_id },
          { receiver_id: receiver_id, sender_id: sender_id },
        ],
      };

      const totalMessgesCount = await conversation
        .find(findCondition)
        .countDocuments();

      const temp_conversationsData = await conversation
        .find(findCondition)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const conversationsData = await Promise.all(
        temp_conversationsData.map(async (items) => {
          let cloneItem: any = items.toObject();
          if (items.message_type === 1) {
            const reply_message = await conversation.findOne({
              is_deleted: 0,
              _id: items.reply_message_id,
            });
            cloneItem["replay_message"] = reply_message;
          }

          if (
            items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.IMAGE ||
            items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.VIDEO ||
            items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.AUDIO ||
            items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.DOCUMENTS
          ) {
            cloneItem.message = items.message;
          }
          // if (cloneItem.message_reaction_users.length > 0) {
          //   let get_rection_details: any[] = await message_reaction.find({
          //     _id: { $in: cloneItem.message_reaction_users }
          //   }).select("uid user_name user_image user_extension reaction")
          //   cloneItem.message_reaction_users = get_rection_details
          // }
          // let get_pinned_msg: any = await pinned_message.findOne({
          //   pin_status: { $ne: 0 },
          //   isgroup: 0,
          //   pin_message_id: cloneItem._id,
          //   $or: [
          //     { pin_by: sender_id },
          //     { receiver_id: sender_id }
          //   ]
          // })

          // let ispinned: Number = 0
          // let pin_by: any = null
          // if (get_pinned_msg) {
          //   ispinned = 1
          //   pin_by = get_pinned_msg.pin_by
          // }
          // cloneItem["ispinned"] = ispinned;
          // cloneItem["pin_by"] = pin_by;
          return cloneItem;
        })
      );

      // let get_user_detail: any = await user.findById({
      //   _id: receiver_id
      // })
      // let user_custome_message: string = "";
      // if (get_user_detail) {
      //   user_custome_message = get_user_detail.user_custome_msg
      // }

      // let get_pinned_msg_my: any[] = await pinned_message.find({
      //   pin_status: 1,
      //   isgroup: 0,
      //   pin_by: created_sendr_id,
      //   receiver_id: created_receiver_id
      // }).sort({ pin_time: -1 }).distinct("pin_message_id")

      // let get_pinned_msg_reciver: any[] = await pinned_message.find({
      //   pin_status: 2,
      //   isgroup: 0,
      //   $or: [
      //     { pin_by: created_receiver_id, receiver_id: created_sendr_id },
      //     { pin_by: created_sendr_id, receiver_id: created_receiver_id }
      //   ]
      // }).sort({ pin_time: -1 }).distinct("pin_message_id")

      // let new_pinnedmessage_arr: any[] = get_pinned_msg_my.concat(get_pinned_msg_reciver)

      // let get_message_detail: any[] = await conversation.find({
      //   _id: { $in: new_pinnedmessage_arr },
      //   is_deleted: 0,
      //   delete_message_users: { $ne: sender_id },
      //   message_type: { $ne: 3 }
      // })

      return res.status(200).send({
        success: 1,
        message: "conversations data....",
        conversationsData: conversationsData,
        totalMessgesCount,
        // user_custome_message,
        // pinned_message: get_message_detail
      });
    } else {
      return res.status(400).send({
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
const clearChat = async (req: Request, res: Response, next: NextFunction) => {
  const token = await get_token(req);
  const user_detail = await User_token(token);
  var sender_id = user_detail?.uid;
  var receiver_id = req.body.receiver_id;
  if (receiver_id !== null) {
    var findCondition = {
      is_deleted: 0,
      block_message_users: { $ne: sender_id },
      delete_message_users: { $ne: sender_id },
      $or: [
        { receiver_id: sender_id, sender_id: receiver_id },
        { receiver_id: receiver_id, sender_id: sender_id },
      ],
    };
    await conversation.updateMany(
      findCondition,
      {
        $push: { delete_message_users: sender_id },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.send({
      success: 1,
      message: "conversations Clear Success",
    });
  } else {
    res.send({
      success: 0,
      message: "some params is missing",
    });
  }
};
export default {
  getAllRecord,
  clearChat,
};
