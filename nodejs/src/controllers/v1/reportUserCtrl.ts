import { Request, Response, NextFunction } from "express";
import user_report from "../../models/user_report";
import group from "../../models/group";
import group_members from "../../models/group_members";
import user from "../../models/user";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";

const getAllRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var data = req.body;
    let cid = data.cid;
    let report_by = data.report_by;
    let report_id = data.report_id;
    let page: any = req.query.page;
    let size: any = req.query.size;
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    const find_conditon: {
      [key: string]: any;
    } = {};

    if (cid !== "" && cid !== undefined) {
      find_conditon.cid = cid;
    }
    if (report_by !== "" && report_by !== undefined) {
      find_conditon.report_by = report_by;
    }
    if (report_id !== "" && report_id !== undefined) {
      find_conditon.report_id = report_id;
    }

    const total_reportData = await user_report
      .find(find_conditon)
      .countDocuments();

    const reportData = await user_report
      .find(find_conditon)
      .populate({
        path: "cid",
        model: "company",
        select: "company_name",
      })
      .populate({
        path: "report_by",
        model: "user",
        select: "first_name last_name user_extension",
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const report_data_tmp = await Promise.all(
      reportData.map(async (item) => {
        let cloneItem: any = item.toObject();
        let report_id_tmp = null;
        let group_admins: any[] = [];
        if (cloneItem.isGroup == 1) {
          report_id_tmp = await group
            .findById({
              _id: cloneItem.report_id,
            })
            .select("group_name");
          report_id_tmp = {
            first_name: report_id_tmp?.group_name,
            last_name: "",
            user_extension: "",
          };
          group_admins = await group_members
            .find({
              group_id: cloneItem.report_id,
              is_admin: 1,
            })
            .populate({
              path: "member_id",
              model: "user",
              select: "first_name last_name user_extension",
            });
        } else {
          report_id_tmp = await user
            .findById({
              _id: cloneItem.report_id,
            })
            .select("first_name last_name user_extension");
        }
        cloneItem.report_id = report_id_tmp;
        cloneItem["group_admins"] = group_admins;
        return cloneItem;
      })
    );

    return res.status(200).send({
      success: 1,
      message: "report users data....",
      reportData: report_data_tmp,
      total_reportData,
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const updateReportUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);
    var data = req.body;
    var cid = user_detail?.cid;
    var report_by = user_detail?.uid;
    var report_id = data.report_id;
    var status = data.status;

    if (report_id && status !== null && report_by) {
      if (data.status) {
        const post: any = new user_report();
        post.cid = cid;
        post.report_by = report_by;
        post.report_id = report_id;
        post.isGroup = data.group_id ? 1 : 0;
        await post.save();
        return res.status(200).send({
          success: 1,
          message: "Reported Successfully",
          post,
        });
      } else {
        if (data.group_id) {
          const post = await user_report.findOneAndDelete({
            isGroup: 1,
            report_id: report_id,
          });
          return res.status(200).send({
            success: 1,
            message: "UnReported Successfully",
            post,
          });
        } else {
          const post = await user_report.findOneAndDelete({
            report_by: report_by,
            report_id: report_id,
          });
          return res.status(200).send({
            success: 1,
            message: "UnReported Successfully",
            post,
          });
        }
      }
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
  getAllRecord,
  updateReportUser,
};
