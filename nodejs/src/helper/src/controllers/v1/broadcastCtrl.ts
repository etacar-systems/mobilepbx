import { Request, Response, NextFunction } from "express";
import user from "../../models/user";
import user_tokens from "../../models/user_tokens";
import broadcast_users from "../../models/broadcast_users";
import conversation from "../../models/conversation";
import broadcast_conversation from "../../models/broadcast_conversation";
import { MESSAGE } from "../../constant";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";



const createBroadcast = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var data = req.body;
    let uid = user_detail?.uid
    let cid = user_detail?.cid
    let broadcast_users_tmp: any[] = data.broadcast_users
    let broadcast_name = data.broadcast_name
  
    const add_broadcast: any = new broadcast_users();
    add_broadcast.cid = cid
    add_broadcast.uid = uid
    add_broadcast.broadcast_name = broadcast_name
    add_broadcast.broadcast_users = broadcast_users_tmp
    add_broadcast.last_message_time = new Date()
    await add_broadcast.save();
  
    let get_broadcast_list = await broadcast_users.findById({
      _id: add_broadcast._id
    }).populate({
      path: "broadcast_users",
      model: "user",
      select: "first_name last_name user_extension user_image"
    })
  
    return res.status(200).send({
      success: 1,
      message: "BroadCast Created successfully",
      post: get_broadcast_list
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getBroadCastList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var uid = user_detail?.uid;
    let get_broadcast = await broadcast_users.find({
      uid: uid
    }).populate({
      path: "broadcast_users",
      model: "user",
      select: "first_name  last_name user_extension user_image"
    }).sort({
      last_message_time: -1
    })
    return res.status(200).send({
      success: 1,
      message: "BroadCast List",
      BroadCastList: get_broadcast
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const editBroadcast = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var _id = req.params.id;
    var data = req.body;
    let broadcast_users_detail = data.broadcast_users
    let broadcast_name = data.broadcast_name
    if (_id && data) {
      const post = await broadcast_users.findByIdAndUpdate(
        {
          _id: _id,
        },
        {
          broadcast_users: broadcast_users_detail,
          broadcast_name: broadcast_name
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).send({
        success: 1,
        message: "Updated successfully",
        Broadcast: post,
      });
    } else {
      return res.status(400).send({
        success: 0,
        message: "some params are missing",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const deleteBroadcast = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var _id = req.params.id;
    var uid = user_detail?.uid
    if (_id) {
      const post = await broadcast_users.findOneAndDelete(
        {
          _id: _id,
          uid: uid
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate({
        path: "broadcast_users",
        model: "user",
        select: "first_name  last_name user_extension user_image"
      })
      return res.status(200).send({
        success: 1,
        message: "Updated successfully",
        Broadcast: post,
      });
    } else {
      return res.status(400).send({
        success: 0,
        message: "some params are missing",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getBroadConveration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page: any = req.query.page;
    let size: any = req.query.size;
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;
  
    let broadcast_id = req.params.id
    let broadcast_detail = await broadcast_users.findById({
      _id: broadcast_id
    })
  
    var findCondition = {
      broadcast_id: broadcast_id,
      is_deleted: 0,
    };
  
    const totalMessgesCount = await broadcast_conversation
      .find(findCondition)
      .countDocuments();
  
  
    const temp_conversationsData = await broadcast_conversation
      .find(findCondition)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  
  
    const conversationsData = await Promise.all(
      temp_conversationsData.map(async (items: any) => {
        const cloneItem: any = items.toObject();
        if (items.message_type === 1) {
          const reply_message = await conversation.findOne({
            is_deleted: 0,
            _id: items.reply_message_id,
          });
          cloneItem["reply_message_id"] = reply_message;
        }
  
        if (
          items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.IMAGE ||
          items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.VIDEO ||
          items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.AUDIO ||
          items.media_type === MESSAGE.MESSAGE_MEDIA_TYPES.DOCUMENTS
        ) {
          cloneItem.message = items.message;
        }
        return cloneItem;
      })
    );
  
    return res.status(200).send({
      success: 1,
      message: "BroadCast Conversation",
      BroadCastCon: conversationsData,
      totalMessgesCount
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getBroadcastUsers = async (req: Request, res: Response, next: NextFunction) => {

  try {
    let broadcast_id = req.params.id

    let get_broadast_users = await broadcast_users.findOne({
      _id: broadcast_id
    }).populate({
      path: "broadcast_users",
      model: "user",
      select: "first_name  last_name user_extension user_image"
    })
  
    return res.status(200).send({
      success: 1,
      message: "BroadCast Conversation",
      BroadCastUSers: get_broadast_users
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
export default
  {
    getBroadConveration,
    deleteBroadcast,
    editBroadcast,
    getBroadCastList,
    createBroadcast,
    getBroadcastUsers
  };