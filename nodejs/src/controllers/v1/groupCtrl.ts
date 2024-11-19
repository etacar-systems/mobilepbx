import { Request, Response, NextFunction } from "express";
import group from "../../models/group";
import group_members from "../../models/group_members";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import notification_setting_users from "../../models/notification_setting_users";

const getDetailsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var cid = user_detail?.cid;
    let uid = user_detail?.uid;
    if (req.params._id) {
      let groupsDetails: any = await group
        .findOne({
          cid: cid,
          _id: req.params._id,
          is_deleted: 0,
        })
        .populate({
          path: "created_by",
          model: "user",
          select: "first_name last_name user_extension user_image",
        })
        .select(
          "description group_image is_deleted created_by createdAt group_name is_admin_send_message public_link public_link_expire_time"
        );

      let get_group_users_detail = await group_members
        .find({
          group_id: req.params._id,
        })
        .populate({
          path: "member_id",
          model: "user",
          select: "first_name last_name user_extension user_image",
        })
        .select("member_id is_admin isleaved");

      // let get_group_notification: any =
      //   await notification_setting_users.findOne({
      //     notification_mute_id: req.params._id,
      //     isgroup: 1,
      //     uid: uid,
      //   });

      // let get_type_notification: Number = 4;
      // if (get_group_notification !== null) {
      //   get_type_notification = get_group_notification.notification_mute_type;
      // }

      groupsDetails = groupsDetails.toObject();
      groupsDetails["group_users"] = get_group_users_detail;
      // groupsDetails.notification_mute_type = get_type_notification;
      return res.status(200).send({
        success: 1,
        message: "group details.",
        groupsDetails: groupsDetails ? groupsDetails : null,
        // public_link: groupsDetails.public_link,
        // public_link_expire_time: groupsDetails.public_link_expire_time,
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
const getGroupUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var group_id = req.params._id;
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var uid = user_detail?.uid;

    if (group_id) {
      const temp_group_user = await group_members.findOne({
        group_id: group_id,
        member_id: uid,
      });

      var groupRole = {
        ...temp_group_user,
        role: temp_group_user?.is_admin ? 2 : 1,
      };

      return res.status(200).send({
        success: 1,
        message: "User group role",
        groupRole,
      });
    } else {
      return res.status(400).send({
        success: 0,
        message: "some params missing",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const getGroupUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var group_id = req.params._id;
    const token = await get_token(req);
    const user_detail = await User_token(token);
    if (group_id) {
      let get_group_detail: any = await group
        .findOne({
          _id: group_id,
        })
        .select("public_link public_link_expire_time");
      const temp_group_users = await group_members
        .find({
          group_id: group_id,
        })
        .populate({
          path: "member_id",
          model: "user",
          select: "first_name last_name user_extension user_image",
        })
        .select("member_id is_admin isleaved");

      return res.status(200).send({
        success: 1,
        message: "Updated Successfully",
        groupUsers: temp_group_users,
        Group_detail: get_group_detail,
      });
    } else {
      return res.status(400).send({
        success: 0,
        message: "some params missing",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
export default {
  getDetailsById,
  getGroupUserRole,
  getGroupUsers,
};
