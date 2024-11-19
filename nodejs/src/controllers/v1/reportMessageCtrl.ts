import { Request, Response, NextFunction } from "express";
import message_report from "../../models/message_report";

const getAllRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var data = req.body;
    let cid = data.cid;
    let reporter_id = data.reporter_id;
    let sender_id = data.sender_id;

    let page: any = req.query.page;
    let size: any = req.query.size;
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    const find_conditon: {
      [key: string]: any;
    } = {};

    find_conditon.isRemoved = 0;

    if (cid !== "" && cid !== undefined) {
      find_conditon.cid = cid;
    }
    if (reporter_id !== "" && reporter_id !== undefined) {
      find_conditon.reporter_id = reporter_id;
    }
    if (sender_id !== "" && sender_id !== undefined) {
      find_conditon.sender_id = sender_id;
    }

    const total_messageCount = await message_report
      .find(find_conditon)
      .countDocuments();
    const reportMessageData = await message_report
      .find(find_conditon)
      .populate({
        path: "reporter_id",
        model: "user",
        select: "first_name last_name user_extension",
      })
      .populate({
        path: "sender_id",
        model: "user",
        select: "first_name last_name user_extension",
      })
      .populate({
        path: "cid",
        model: "company",
        select: "company_name",
      })
      .populate({
        path: "group_id",
        model: "group",
        select: "group_name",
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return res.status(200).send({
      success: 1,
      message: "report messageData",
      reportMessageData: reportMessageData,
      total_messageCount,
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
const deleteReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var report_id = req.params.report_id;
    if (report_id) {
      await message_report.findByIdAndDelete({
        _id: report_id,
      });
      return res.status(200).send({
        success: 1,
        message: "Report Deleted",
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
const ReportMessgeRemove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var report_id = req.params.report_id;
    if (report_id) {
      await message_report.findByIdAndUpdate(
        {
          _id: report_id,
        },
        {
          isRemoved: 1,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).send({
        success: 1,
        message: "Report updated",
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

export default {
  getAllRecord,
  deleteReport,
  ReportMessgeRemove,
};
