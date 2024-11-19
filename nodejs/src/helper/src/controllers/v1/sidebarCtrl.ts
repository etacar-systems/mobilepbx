import { Request, Response, NextFunction } from "express";
import group from "../../models/group";
import user from "../../models/user";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import _ from "lodash";
import mongoose from "mongoose"

const getSidebarData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var cid: any = user_detail?.cid;
    var uid: any = user_detail?.uid;
  
    let create_uid = new mongoose.Types.ObjectId(uid)
    let create_uid_String = uid.toString();
    let create_cid = new mongoose.Types.ObjectId(cid)
  
  
    let get_detail: any[] = await user.aggregate([
      {
        $match: {
          _id: { $ne: create_uid },
          cid: create_cid,
          is_deleted: 0,
          isguest: { $ne: 1 },
          conversation_deleted_users: { $nin: [create_uid_String] }
        }
      },
      {
        $lookup: {
          from: "conversations",
          localField: "_id",
          foreignField: "sender_id",
          pipeline: [{
            $match: {
              receiver_id: create_uid,
              is_deleted: 0,
              delete_message_users: { $ne: create_uid_String },
              message_type: { $ne: 3 }
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          { $limit: 1 }
          ],
          as: "recived_message"
        },
      },
      {
        $lookup: {
          from: "conversations",
          localField: "_id",
          foreignField: "receiver_id",
          pipeline: [{
            $match: {
              sender_id: create_uid,
              is_deleted: 0,
              delete_message_users: { $ne: create_uid_String },
              message_type: { $ne: 3 }
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          { $limit: 1 }
          ],
          as: "sended_message"
        },
      },
      {
        $lookup: {
          from: "conversations",
          localField: "_id",
          foreignField: "sender_id",
          pipeline: [{
            $match: {
              receiver_id: create_uid,
              is_deleted: 0,
              delivery_type: { $ne: 3 },
              message_type: { $ne: 3 },
            }
          },
          ],
          as: "recived_message_unread"
        }
      },
      {
        $addFields: {
          message_data: {
            $concatArrays: ["$recived_message", "$sended_message"]
          },
          block_by: 0,
          description: "",
          isGroup: 0,
          isReported: 0,
          istyping: 0,
          name: { $concat: ["$first_name", " ", "$last_name"] },
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          cid: 1,
          user_extension: 1,
          image: "$user_image",
          is_online: 1,
          last_seen: "$updatedAt",
          message_data: 1,
          block_by: 1,
          description: 1,
          isGroup: 1,
          isReported: 1,
          istyping: 1,
          unread_msg_count: {
            $size: "$recived_message_unread"
          }
        }
      },
      {
        $unwind: {
          path: "$message_data",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { "message_data.createdAt": -1 }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          cid: { $first: "$cid" },
          user_extension: { $first: "$user_extension" },
          image: { $first: "$image" },
          is_online: { $first: "$is_online" },
          last_seen: { $first: "$last_seen" },
          message_data: { $first: "$message_data" },
          block_by: { $first: "$block_by" },
          description: { $first: "$description" },
          isGroup: { $first: "$isGroup" },
          isReported: { $first: "$isReported" },
          istyping: { $first: "$istyping" },
          unread_msg_count: { $first: "$unread_msg_count" }
        }
      },
      {
        $addFields: {
          last_message_time: "$message_data.createdAt",
          last_message: "$message_data.message",
          last_media_type: "$message_data.media_type",
        }
      },
      {
        $lookup: {
          from: "pinned_conversations",
          localField: "_id",
          foreignField: "pin_to",
          pipeline: [{
            $match: {
              pin_by: create_uid,
              pin_status: 1
            }
          },
          ],
          as: "pinned_detail"
        }
      },
      {
        $unwind: {
          path: "$pinned_detail",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "user_blocks",
          localField: "_id",
          foreignField: "block_id",
          pipeline: [{
            $match: {
              block_by: create_uid
            }
          },
          ],
          as: "blocke_user"
        }
      },
      {
        $lookup: {
          from: "user_blocks",
          localField: "_id",
          foreignField: "block_by",
          pipeline: [{
            $match: {
              block_id: create_uid
            }
          },
          ],
          as: "isblocked_by_reciver"
        }
      },
      {
        $lookup: {
          from: "conversations",
          localField: "_id",
          foreignField: "sender_id",
          pipeline: [{
            $match: {
              receiver_id: create_uid,
              message_type: { $ne: 3 },
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          { $limit: 1 }
          ],
          as: "recived_message_deleted"
        },
      },
      {
        $lookup: {
          from: "conversations",
          localField: "_id",
          foreignField: "receiver_id",
          pipeline: [{
            $match: {
              sender_id: create_uid
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          { $limit: 1 }
          ],
          as: "sended_message_deleted"
        },
      },
      {
        $addFields: {
          message_data_delete: {
            $concatArrays: ["$recived_message_deleted", "$sended_message_deleted"]
          },
          isblocked_by_reciver: {
            $size: "$isblocked_by_reciver"
          },
          isBlocked: {
            $size: "$blocke_user"
          }
        }
      },
      {
        $unwind: "$message_data_delete"
      },
      {
        $sort: { "message_data_delete.createdAt": -1 }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          cid: { $first: "$cid" },
          user_extension: { $first: "$user_extension" },
          image: { $first: "$image" },
          is_online: { $first: "$is_online" },
          last_seen: { $first: "$last_seen" },
          message_data: { $first: "$message_data" },
          message_data_delete: { $first: "$message_data_delete" },
          block_by: { $first: "$block_by" },
          description: { $first: "$description" },
          isGroup: { $first: "$isGroup" },
          isReported: { $first: "$isReported" },
          istyping: { $first: "$istyping" },
          unread_msg_count: { $first: "$unread_msg_count" },
          last_message_time: { $first: "$last_message_time" },
          last_message: { $first: "$last_message" },
          last_media_type: { $first: "$last_media_type" },
          isblocked_by_reciver: { $first: "$isblocked_by_reciver" },
          isBlocked: { $first: "$isBlocked" },
          pinned_detail: { $first: "$pinned_detail" }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          cid: 1,
          user_extension: 1,
          image: 1,
          is_online: 1,
          last_seen: 1,
          block_by: 1,
          description: 1,
          isGroup: 1,
          isReported: 1,
          istyping: 1,
          last_message_time: { $ifNull: ["$last_message_time", "$message_data_delete.createdAt"] },
          last_message: 1,
          last_media_type: 1,
          unread_msg_count: 1,
          pintime: { $ifNull: ["$pinned_detail.pin_time", null] },
          ispinned: { $ifNull: ["$pinned_detail.pin_status", 0] },
          isBlocked:1,
          isblocked_by_reciver: 1
        }
      },
    ]).sort({
      last_message_time: -1
    })
  
    //let temp_goup_id:any = new mongoose.Types.ObjectId("6662dc25075f9c040a92c9e5")
    let get_group_detail = await group.aggregate([
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $match: {
          cid: create_cid,
          is_deleted: 0,
          group_users: { $in: [create_uid_String] }
        }
      },
      {
        $lookup: {
          from: "group_members",
          localField: "_id",
          foreignField: "group_id",
          pipeline: [
            {
              $match: {
                member_id:create_uid
              }
            }
          ],
          as: "group_member_detail"
        }
      },
      {
        $unwind: {
          path: "$group_member_detail",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "group_conversations",
          localField: "_id",
          foreignField: "group_id",
          let: {
            add_member_time: "$group_member_detail.add_member_time",
            leave_member_time: "$group_member_detail.leave_member_time"
          },
          pipeline: [
            {
              $match: {
                is_deleted: 0,
                delete_message_users: { $ne: create_uid_String },
                message_type: { $ne: 3 },
                $expr: {
                  $cond: {
                    if: { $gt: ["$$add_member_time", null] },
                    then: {
                      $cond: {
                        if: { $ne: ["$$add_member_time", null] },
                        then: { $gte: ["$createdAt", "$$add_member_time"] },
                        else: {}
                      }
                    },
                    else: {
                      $lte: ["$createdAt", "$$leave_member_time"]
                    }
                  }
                }
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            },
            {
              $limit: 1
            }
          ],
          as: "group_messages"
        }
      },      
      {
        $lookup: {
          from: "group_message_status",
          localField: "_id",
          foreignField: "group_id",
          let: {
            add_member_time: "$group_member_detail.add_member_time",
            leave_member_time: "$group_member_detail.leave_member_time"
          },
          pipeline: [
            {
              $match: {
                receiver_id: uid,
                delivery_type: { $ne: 3 },
                message_type: { $ne: 3 },
                $expr: {
                  $cond: {
                    if: { $gt: ["$$add_member_time", null] },
                    then: {
                      $cond: {
                        if: { $ne: ["$$add_member_time", null] },
                        then: { $gte: ["$createdAt", "$$add_member_time"] },
                        else: {}
                      }
                    },
                    else: {
                      $lte: ["$createdAt", "$$leave_member_time"]
                    }
                  }
                }
              }
            },
          ],
          as: "group_messages_unread"
        }
      },
      {
        $unwind: {
          path: "$group_messages",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          block_by: 0,
          user_extension: "",
          isGroup: 1,
          isReported: 0,
          isBlocked: 0,
          istyping: 0,
          is_online: 0,
          isblocked_by_reciver: 0,
          last_seen: null,
          last_message_time: "$group_messages.createdAt",
          last_message: "$group_messages.message",
          last_media_type: "$group_messages.media_type"
        }
      },
      {
        $lookup: {
          from: "pinned_conversations",
          localField: "_id",
          foreignField: "pin_to",
          pipeline: [{
            $match: {
              pin_by: create_uid,
              pin_status: 1
            }
          },
          ],
          as: "pinned_detail"
        }
      },
      {
        $unwind: {
          path: "$pinned_detail",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: "$group_name",
          cid: 1,
          description: "$description",
          image: "$group_image",
          block_by: 1,
          user_extension: 1,
          isGroup: 1,
          isReported: 1,
          isBlocked: 1,
          istyping: 1,
          is_online: 1,
          last_seen: 1,
          last_message_time: {
            $ifNull: ["$last_message_time", "$createdAt"]
          },
          last_message: 1,
          last_media_type: 1,
          unread_msg_count: {
            $size: "$group_messages_unread"
          },
          pintime: { $ifNull: ["$pinned_detail.pin_time", null] },
          ispinned: { $ifNull: ["$pinned_detail.pin_status", 0] },
          isblocked_by_reciver: 1
        }
      }
    ]).sort({
      last_message_time: -1
    })

  
    let sidebarData_tmp: any[] = get_detail.concat(get_group_detail);
    let get_pinnde_arr: any[] = sidebarData_tmp.filter((item) => item.ispinned == 1)
    let get_normal_arr: any[] = sidebarData_tmp.filter((item) => item.ispinned == 0)
    get_pinnde_arr = _(get_pinnde_arr).orderBy("pintime", "desc").value()
    get_normal_arr = _(get_normal_arr).orderBy("last_message_time", "desc").value()
    let sidebarData: any[] = get_pinnde_arr.concat(get_normal_arr);
  
    return res.status(200).json({
      success: 1,
      message: "Sidebar List",
      sidebarData
    });
  } catch (error) {
    console.log("error",error)
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }

}
export default
  {
    getSidebarData
  };
