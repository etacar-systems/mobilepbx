import { Request, Response, NextFunction } from "express";
import mongoose, { mongo } from "mongoose";
import user from "../../models/user";
import group from "../../models/group";
import user_tokens from "../../models/user_tokens";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import { config } from "../../config";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import REGEXP from "../../regexp";
import _ from "lodash";

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
  console.log("user login");
  var data = req.body;
  let message: any = "";

  const results_user = await user.findOne({
    user_email: data.user_email,
    password: data.password
  });
  if (results_user == null) {
    message = "Password Incorrect"
  }

  const results = await user.findOne({
    user_email: data.user_email
  });
  if (results == null) {
    message = "This E-Mail Does not exist"
  }

  if (results && results_user) {
    const token = jwt.sign(
      {
        uid: results._id,
        cid: results.cid.toString()
      },
      config.key.secret_key
    );
    console.log("results", results.cid.toString())
    const token_post = new user_tokens();
    token_post.uid = results._id as string;
    token_post.token = token;
    token_post.push_token = data.push_token ? data.push_token : "";
    //token_post.push_type = results.push_type ? results.push_type : 0;
    await token_post.save();
    console.log("token_post", token_post)

    const userToken = await user_tokens.findOne({
      uid: results._id
    })
    const userData = await user.findOne({
      _id: results._id
    }).select("first_name last_name user_email user_mobile_no  user_address user_extension user_did cid is_send_sms_attachement")
    res.send({
      success: 1,
      message: "Your Token and Details",
      Token: token,
      UserDetails: userData
    });
  } else {
    return res.status(400).send({
      success: 0,
      message: message,
    });
  }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var token = req.header("Authorization");
    //const token = await get_token(req);
    const user_detail = await User_token(token);
    var uid = user_detail?.uid;
    let log = await user_tokens.findOneAndDelete({
      token: token,
      uid: uid,
    });
    return res.status(200).send({
      success: 1,
      message: "Logout Successfully",
      logoutUser: log
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const addUser = async (req: Request, res: Response, next: NextFunction) => {
      let data:any= req.body;
      let cid:any = data.cid
      let user_extension:any = data.user_extension
      let first_name:any = data.first_name
      let last_name:any = data.last_name
      let user_email:any = data.user_email
      let password:any = data.password

      if(Object.keys(data).length === 0){
       return res.status(400).send({
          success: 0,
          message: "Request Body Params Is Empty"
        });
      }
      if(cid == undefined){
        return res.status(400).send({ 
          success: 0, 
          message: "Cid Is Mandatory."
        });
      }
      if(!mongoose.Types.ObjectId.isValid(cid)){
        return res.status(400).send({ 
          success: 0, 
          message: "Invalid ObjectId" 
        });
      }
      if(user_extension == undefined){
        return res.status(400).send({ 
          success: 0, 
          message: "User Extentsion Is Mandatory."
        });
      }
      if(!REGEXP.USER.user_extension.test(user_extension)){
        return res.status(400).send({ 
          success: 0, 
          message: "User Extentsion Is Invalid." 
        });
      }
      if(first_name == undefined){
        return res.status(400).send({ 
          success: 0, 
          message: "First Name Is Mandatory."
        });
      }
      if(!REGEXP.USER.first_name.test(first_name)){
        return res.status(400).send({ 
          success: 0, 
          message: "User Extentsion Is Invalid." 
        });
      }
      if(last_name == undefined){
        return res.status(400).send({ 
          success: 0, 
          message: "Last Name Is Mandatory."
        });
      }
      if(!REGEXP.USER.last_name.test(last_name)){
        return res.status(400).send({ 
          success: 0, 
          message: "Last Name Is Invalid." 
        });
      }
      if(user_email == undefined){
        return res.status(400).send({ 
          success: 0, 
          message: "User Email Is Mandatory."
        });
      }
      if(!REGEXP.USER.user_email.test(user_email)){
        return res.status(400).send({ 
          success: 0, 
          message: "User Email Is Invalid." 
        });
      }
      if(password == undefined){
        return res.status(400).send({ 
          success: 0, 
          message: "Password Is Mandatory."
        });
      }
      if(!REGEXP.USER.password.test(password)){
        return res.status(400).send({ 
          success: 0, 
          message: "Password Is Invalid." 
        });
      }

      let create_add_obj:any = {
        cid:cid,
        user_extension:user_extension,
        first_name:first_name,
        last_name:last_name,
        user_email:user_email,
        password:password
      }
      const addpost = await user.create(create_add_obj)

      res.send({
        success: 1,
        message: "Add success",
        addpost,
      });
}
const getForwarduserlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let cid: any = user_detail?.cid;
    let uid: any = user_detail?.uid;

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
        $addFields: {
          message_data: {
            $concatArrays: ["$recived_message", "$sended_message"]
          },
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
          message_data: 1
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
          image: { $first: "$image" }
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
          isBlocked: {
            $size: "$blocke_user"
          },
          isGroup: 0,
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
          message_data: { $first: "$message_data" },
          message_data_delete: { $first: "$message_data_delete" },
          last_message_time: { $first: "$last_message_time" },
          last_message: { $first: "$last_message" },
          last_media_type: { $first: "$last_media_type" },
          isBlocked:{$first:"$isBlocked"},
          isGroup:{$first:"$isGroup"}
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          cid: 1,
          user_extension: 1,
          image: 1,
          last_message_time: { $ifNull: ["$last_message_time", "$message_data_delete.createdAt"] },
          last_message: 1,
          last_media_type: 1,
          isBlocked:1,
          isGroup:1
        }
      },
    ]).sort({
      last_message_time: -1
    })

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
          group_users: { $in: [create_uid_String] },
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
                member_id:create_uid,
               // isleaved:1
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
          let: {updatedAt: "$group_member_detail.updatedAt" },
          pipeline: [
            {
              $match: {
                is_deleted: 0,
                delete_message_users: { $ne: create_uid_String },
                message_type: { $ne: 3 },
                $expr: {
                  $cond: {
                    if: { $gt: ["$$updatedAt", null] },
                    then: { $lte: ["$createdAt", "$$updatedAt"] },
                    else: {}
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
        $unwind: {
          path: "$group_messages",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          isGroup: 1,
          isBlocked:0,
          user_extension: "",
          last_message_time: "$group_messages.createdAt",
          last_message: "$group_messages.message",
          last_media_type: "$group_messages.media_type",
          is_admin :  "$group_member_detail.is_admin",
          isleaved : "$group_member_detail.isleaved"
        }
      },
      {
        $project: {
          _id: 1,
          name: "$group_name",
          cid: 1,
          description: "$description",
          image: "$group_image",
          user_extension: 1,
          isGroup: 1,
          isBlocked: 1,
          is_admin :1,
          isleaved :1,
          last_message_time: {
            $ifNull: ["$last_message_time", "$createdAt"]
          },
          last_message: 1,
          last_media_type: 1
        }
      }
    ]).sort({
      last_message_time: -1
    })
    console.log(JSON.stringify(get_group_detail, null, 2));

    let sidebarData_tmp: any[] = get_detail.concat(get_group_detail);
    let sidebarData: any[] = _(sidebarData_tmp).orderBy("last_message_time", "desc").value()
    return res.status(200).json({
      success: 1,
      message: "ForwardUser List",
      ForwardList:sidebarData
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
export default {
  userLogin,
  userLogout,
  addUser,
  getForwarduserlist
};
