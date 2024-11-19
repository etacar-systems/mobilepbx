import { Request, Response, NextFunction } from "express";
import group_conversation from "../../models/group_conversation";
import user from "../../models/user";
import group_message_status from "../../models/group_message_status";
import message_reaction from "../../models/message_reaction";
import pinned_message from "../../models/pinned_message";
import group from "../../models/group";
import { MESSAGE } from "../../constant";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import moment from "moment";
import group_members from "../../models/group_members";

const getAllRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let page: any = req.query.page;
    let size: any = req.query.size;
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    var group_id = req.params.group_id;
    var cid = user_detail?.cid;
    var uid = user_detail?.uid;

    let get_group_role: any = await group_members.findOne({
      group_id: group_id,
      member_id: uid,
      isleaved: 1,
    });

    let last_find_query: any = {};
    if (get_group_role) {
      last_find_query = {
        group_id: group_id,
        delete_message_users: { $ne: uid },
        is_deleted: 0,
        createdAt: { $lte: get_group_role.updatedAt },
      };
    } else {
      last_find_query = {
        group_id: group_id,
        delete_message_users: { $ne: uid },
        is_deleted: 0,
      };
    }

    let group_user = await group.findById({
      _id: group_id,
    });
    let group_users = [];
    if (group_user) {
      group_users = group_user.group_users;
    }
    if (group_id) {
      const totalMessgesCount = await group_conversation
        .find(last_find_query)
        .countDocuments();

      const temp_conversationsData = await group_conversation
        .find(last_find_query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const conversationsData = await Promise.all(
        temp_conversationsData.map(async (items) => {
          let cloneItem: any = items.toObject();
          if (items.message_type === 1) {
            const reply_message = await group_conversation.findOne({
              is_deleted: 0,
              _id: items.reply_message_id,
            });
            cloneItem["reply_message_id"] = reply_message;
          }

          let sender = await user
            .findById({
              _id: items.sender_id,
            })
            .select("first_name last_name");
          if (
            items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.IMAGE ||
            items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.VIDEO ||
            items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.AUDIO ||
            items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.DOCUMENTS
          ) {
            cloneItem.message = items.message;
          }
          cloneItem.sender_id = sender;
          // if (cloneItem.message_reaction_users.length > 0) {
          //   let get_rection_details: any[] = await message_reaction.find({
          //     _id: { $in: cloneItem.message_reaction_users }
          //   }).select("uid user_name user_image user_extension reaction")
          //   cloneItem.message_reaction_users = get_rection_details
          // }
          return cloneItem;
        })
      );

      // let new_convertion = await Promise.all(
      //   conversationsData.map(async (items) => {
      //     const cloneItem: any = items;
      //     await group_message_status.findOneAndUpdate(
      //       {
      //         group_id: cloneItem.group_id,
      //         message_id: cloneItem._id,
      //         receiver_id: uid,
      //       },
      //       {
      //         delivery_type: 3,
      //       },
      //       {
      //         new: true,
      //       }
      //     );

      //     let get_group_msg = await group_message_status
      //       .find({
      //         group_id: cloneItem.group_id,
      //         message_id: cloneItem._id,
      //         delivery_type: 2,
      //       })
      //       .countDocuments();

      //     let get_group_msg_read = await group_message_status
      //       .find({
      //         group_id: cloneItem.group_id,
      //         message_id: cloneItem._id,
      //         delivery_type: 3,
      //       })
      //       .countDocuments();
      //     let delivery_type = items.delivery_type;
      //     if (group_users.length - 1 == get_group_msg) {
      //       delivery_type = 2;
      //     }
      //     if (group_users.length - 1 == get_group_msg_read) {
      //       delivery_type = 3;
      //     }

      //     let updtaed_msg = await group_conversation.findByIdAndUpdate(
      //       {
      //         _id: items._id,
      //       },
      //       {
      //         delivery_type: delivery_type,
      //       },
      //       {
      //         new: true,
      //       }
      //     );

      //     cloneItem.delivery_type = updtaed_msg?.delivery_type;

      //     // let get_pinned_msg: any = await pinned_message.findOne({
      //     //   pin_status: { $ne: 0 },
      //     //   isgroup: 1,
      //     //   group_id: group_id,
      //     //   pin_message_id: cloneItem._id
      //     // });

      //     // let ispinned: Number = 0
      //     // let pin_by: any = null
      //     // if (get_pinned_msg) {
      //     //   ispinned = 1
      //     //   pin_by = get_pinned_msg.pin_by
      //     // }
      //     // cloneItem["ispinned"] = ispinned;
      //     // cloneItem["pin_by"] = pin_by;

      //     return cloneItem;
      //   })
      // );

      // let get_pinned_msg: any[] = await pinned_message.find({
      //   pin_status: { $ne: 0 },
      //   isgroup: 1,
      //   group_id: group_id
      // }).sort({ pin_time: -1 }).distinct("pin_message_id")

      // let get_message_detail: any[] = await group_conversation.find({
      //   _id: { $in: get_pinned_msg },
      //   is_deleted: 0,
      //   delete_message_users: { $ne: uid },
      //   message_type: { $ne: 3 }
      // })

      return res.status(200).send({
        success: 1,
        message: "conversations data....",
        conversationsData: conversationsData,
        totalMessgesCount,
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
const getMessageInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var message_id = req.params.message_id;
    var tmp_message_deliverd = await group_message_status
      .find({
        message_id: message_id,
        delivery_type: 2,
      })
      .populate({
        path: "receiver_id",
        model: "user",
      });
    var tmp_message_read = await group_message_status
      .find({
        message_id: message_id,
        delivery_type: 3,
      })
      .populate({
        path: "receiver_id",
        model: "user",
      });

    return res.status(200).send({
      success: 1,
      message: "all messages updated",
      ReadData: tmp_message_read,
      DeliverdData: tmp_message_deliverd,
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
export default {
  getAllRecord,
  getMessageInfo,
};
