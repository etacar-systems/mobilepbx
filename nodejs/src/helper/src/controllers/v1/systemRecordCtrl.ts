import { NextFunction, Request, Response } from "express";
import audio_uplod from "../../audio_uplod";
import REGEXP from "../../regexp";
import system_recording from "../../models/system_recording";
import mongoose from "mongoose";

const addRecording = async (req: Request, res: Response) => {
  audio_uplod(req, res, async (error) => {
    if (error) {
      res.status(500).send({
        message: error.message,
      });
    } else {
      var myUrl = req?.file?.path;
      var data: any = req?.body;
      var record_name: any = data?.record_name;
      var description: any = data?.description;

      if (Object.keys(data).length === 0) {
        return res.status(400).send({
          success: 0,
          message: "Request Body Params Is Empty",
        });
      }

      if (myUrl == undefined) {
        return res.status(400).send({
          success: 0,
          message: "Audio file upload Mandatory",
        });
      }
      if (record_name == undefined) {
        return res.status(400).send({
          success: 0,
          message: "Record name is Mandatory",
        });
      }
      if (description == undefined) {
        return res.status(400).send({
          success: 0,
          message: "Description is Mandatory",
        });
      }
      if (!REGEXP.system_record.description.test(description)) {
        return res.status(400).send({
          success: 0,
          message: "Description is invalid",
        });
      }
      if (!REGEXP.system_record.record_name.test(record_name)) {
        return res.status(400).send({
          success: 0,
          message: "Record name is invalid",
        });
      }

      const objData = {
        record_name: record_name,
        description: description,
        record_url: myUrl,
      };

      const addRecord = await system_recording.create(objData);

      res.send({
        success: 1,
        message: "System Recording Added Successfully",
      });
    }
  });
};

const EditRecording = async (req: Request, res: Response) => {
  audio_uplod(req, res, async (error) => {
    if (error) {
      res.status(500).send({
        message: error.message,
      });
    } else {
      var myUrl: any = req?.file?.path;
      var data: any = req?.body;
      var record_name: any = data?.record_name;
      var description: any = data?.description;
      var record_id: any = data?.record_id;

      if (Object.keys(data).length === 0) {
        return res.status(400).send({
          success: 0,
          message: "Request Body Params Is Empty",
        });
      }

      if (record_name == undefined) {
        return res.status(400).send({
          success: 0,
          message: "Record name is Mandatory",
        });
      }
      if (description == undefined) {
        return res.status(400).send({
          success: 0,
          message: "Description is Mandatory",
        });
      }
      if (!REGEXP.system_record.description.test(description)) {
        return res.status(400).send({
          success: 0,
          message: "Description is invalid",
        });
      }
      if (!REGEXP.system_record.record_name.test(record_name)) {
        return res.status(400).send({
          success: 0,
          message: "Record name is invalid",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(record_id)) {
        return res.status(400).send({
          success: 0,
          message: "Record Id is Invalid",
        });
      }

      if (record_id == undefined) {
        return res.status(400).send({
          success: 0,
          message: "Record Id is Mandatory",
        });
      }

      if (req?.file == undefined) {
        const oldUrl = await system_recording
          .findById(record_id)
          .select("record_url");
        myUrl = oldUrl?.record_url;
        console.log(myUrl);
      }

      const objData: any = {
        record_name: record_name,
        description: description,
        record_url: myUrl,
      };

      const addRecord = await system_recording.findByIdAndUpdate(
        {
          _id: record_id,
        },
        objData,
        {
          new: true,
          runValidators: true,
        }
      );

      res.send({
        success: 1,
        message: "System Recording Update Successfully",
      });
    }
  });
};
const deleteRecording = async (req: Request, res: Response) => {
  try {
    let data: any = req.body;
    let record_id: any = data.record_id;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(record_id)) {
      return res.status(400).send({
        success: 0,
        message: "Firewall Id Is Invalid.",
      });
    }

    let getRecordlId = await system_recording.findById({
      _id: record_id,
    });

    if (getRecordlId == null) {
      return res.status(400).send({
        success: 0,
        message: "Firewall Not Exists.",
      });
    }

    await system_recording.deleteOne({
      _id: record_id,
    });

    return res.status(200).send({
      success: 1,
      message: "System Record Deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

const getrecodlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let data: any = req.body;
    let page: any = data.page;
    let size: any = data.size;
    let search: any = data.search?.toString();
    if (!page) page = 1;
    if (!size) size = 20;
    const limit = parseInt(size);
    const skip = (page - 1) * size;

    let find_query: { [key: string]: any } = {};
    if (search) {
      find_query = {
        is_deleted: 0,
        $or: [
          {
            record_name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
          {
            record_url: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    } else {
      find_query = {
        is_deleted: 0,
      };
    }

    console.log("find_query", find_query);

    const recording_list: any = await system_recording
      .find(find_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const recording_total_counts: any = await system_recording
      .find(find_query)
      .countDocuments();

    let total_page_count: any = Math.ceil(recording_total_counts / size);

    res.send({
      success: 1,
      message: "System Recording List",
      RecordingList: recording_list,
      total_page_count: total_page_count,
      Recording_total_counts: recording_total_counts,
    });
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
export default { addRecording, EditRecording, deleteRecording, getrecodlist };
