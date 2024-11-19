import { NextFunction, Request, Response } from "express";
import user from "../../models/user";
import user_tokens from "../../models/user_tokens";
import message_setting_users from "../../models/message_setting_users";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import moment from "moment";


const UpdateUserMessageSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
  const user_detail = await User_token(token);
  let uid: any = user_detail?.uid
  let message_disappear_type = req.body.message_disappear_type
  let cid: any = req.body.cid
  let recevier_id: any = req.body.uid
  let isgroup: any = req.body.isgroup
  let message_dissapear_time: any;
  let current_time: any = moment().utc().format("YYYY-MM-DDTHH:mm:ss.sssZ")
  if (message_disappear_type == 0) {
    message_dissapear_time = moment(current_time).add(1, "day").format("YYYY-MM-DDTHH:mm:ss.sssZ")
  } else if (message_disappear_type == 1) {
    message_dissapear_time = moment(current_time).add(7, "days").format("YYYY-MM-DDTHH:mm:ss.sssZ")
  } else if (message_disappear_type == 2) {
    message_dissapear_time = moment(current_time).add(90, "days").format("YYYY-MM-DDTHH:mm:ss.sssZ")
  } else {
    message_dissapear_time = null;
  }
  //console.log("message_dissapear_time", message_dissapear_time)
  if (isgroup) {
    if (message_disappear_type !== undefined) {
      let get_user_data = await message_setting_users.findOne({
        cid: cid,
        $or: [
          { uid: uid },
          { group_id: uid }
        ],
        isgroup: 1
      })
      if (get_user_data !== null) {
        await message_setting_users.findOneAndUpdate(
          {
            _id: get_user_data._id
          },
          {
            message_disappear_type: message_disappear_type,
            message_dissapear_time: message_dissapear_time
          },
          {
            new: true,
            runValidators: true
          }
        );
      } else {
        const user_message_disappear = new message_setting_users();
        user_message_disappear.cid = cid;
        user_message_disappear.uid = uid;
        user_message_disappear.isgroup = isgroup;
        user_message_disappear.group_id = recevier_id;
        user_message_disappear.message_disappear_type = message_disappear_type;
        user_message_disappear.message_dissapear_time = message_dissapear_time;
        await user_message_disappear.save();
      }
      return res.status(200).send({
        success: 1,
        message: "Updated successfully"
      });
    } else {
      return res.status(400).send({
        success: 0,
        message: "some params are missing",
      });
    }
  } else {
    if (message_disappear_type !== undefined) {
      let get_user_data = await message_setting_users.findOne({
        cid: cid,
        $or: [
          { uid: uid, recevier_id: recevier_id },
          { recevier_id: uid, uid: recevier_id }
        ],
        isgroup: 0
      })
      if (get_user_data !== null) {
        await message_setting_users.findOneAndUpdate(
          {
            _id: get_user_data._id
          },
          {
            message_disappear_type: message_disappear_type,
            message_dissapear_time: message_dissapear_time
          },
          {
            new: true,
            runValidators: true
          }
        );
      } else {
        const user_message_disappear = new message_setting_users();
        user_message_disappear.cid = cid;
        user_message_disappear.uid = uid;
        user_message_disappear.isgroup = isgroup;
        user_message_disappear.recevier_id = recevier_id;
        user_message_disappear.message_disappear_type = message_disappear_type;
        user_message_disappear.message_dissapear_time = message_dissapear_time;
        await user_message_disappear.save();
      }
      return res.status(200).send({
        success: 1,
        message: "Updated successfully"
      });
    } else {
      return res.status(400).send({
        success: 0,
        message: "some params are missing",
      });
    }
  }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
const getUserMessageSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
  const user_detail = await User_token(token);
  let uid_login: any = user_detail?.uid
  let cid = req.query.cid
  let uid = req.query.uid
  let isgroup_tmp: any = req.query.isgroup
  let isgroup: any = parseInt(isgroup_tmp);
  let message_disappear_type: any = 4;
  if (uid && cid && isgroup !== undefined) {
    if (isgroup) {
      let find_user_message_detail: any = await message_setting_users.findOne({
        cid: cid,
        group_id: uid,
        isgroup: 1
      })
      if (find_user_message_detail) {
        message_disappear_type = find_user_message_detail.message_disappear_type
      }
    } else {
      let find_user_message_detail: any = await message_setting_users.findOne({
        cid: cid,
        $or: [
          { uid: uid_login, recevier_id: uid },
          { recevier_id: uid_login, uid: uid }
        ],
        isgroup: 0
      })
      if (find_user_message_detail) {
        if (find_user_message_detail.recevier_id == uid) {

        } else {

        }
        message_disappear_type = find_user_message_detail.message_disappear_type
      }
    }
    let UserMessageDetail: any = {
      uid: uid,
      message_disappear_type: message_disappear_type
    }
    return res.status(200).send({
      success: 1,
      message: "User Message Dissapear Detail",
      UserMessageDetail
    });
  } else {
    return res.status(400).send({
      success: 0,
      message: "some params are missing",
    })
  }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}
export default
  {
    UpdateUserMessageSetting,
    getUserMessageSetting
  };