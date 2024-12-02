import { NextFunction, Request, Response } from "express";
import audio_uplod from "../../audio_uplod";
import REGEXP from "../../regexp";
import system_recording from "../../models/system_recording";
import mongoose from "mongoose";
import get_token from "../../helper/userHeader";
import User_token from "../../helper/helper";
import company from "../../models/company";
import axios from "axios";
import pstn_number from "../../models/pstn_number";
import { config } from "../../config";

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
        const oldUrl = await system_recording.findById(record_id).select("record_url");
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
    const token = await get_token(req);
    const user_detail = await User_token(token);
    let data: any = req.body;
    let record_id: any = data.record_id;

    if (user_detail === undefined) {
      return res.status(config.RESPONSE.STATUS_CODE.COMPANY_NOT_EXIST).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.COMPANY_ERROR,
      });
    }

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        success: 0,
        message: "Request Body Params Is Empty",
      });
    }

    if (record_id == undefined) {
      return res.status(400).send({
        success: 0,
        message: "Recording id is Mandatory.",
      });
    }

    let api_config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: "https://mobilepbx.mobiililinja.fi/webapi/core/recording/delete.php",
      auth: {
        username: "apiuser",
        password: "d6kVImEEV1A34B2fjduZpxxFAf4",
      },
      params: {
        id: record_id,
      },
    };
    try {
      const data: any = await axios.request(api_config);

      if (data?.data?.message == "Failed to Find Recording, Try Again !!") {
        return res.status(500).send({
          success: 0,
          message: data?.data?.message,
        });
      } else {
        await pstn_number.updateOne(
          {
            select_type_uuid: record_id,
          },
          {
            isassigned: 0,
            destination_action: [],
            select_type_data: {},
            select_type: "",
            select_type_uuid: "",
            last_updated_user: user_detail?.uid,
          },
          {
            runValidators: true,
          }
        );
        return res.status(200).send({
          success: 1,
          message: data?.data?.message,
        });
      }
    } catch (error: any) {
      console.log(error, "11");
      return res.status(500).send({
        success: 0,
        message: "Failed to delete System Record",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};

const getrecodlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await get_token(req);
    const user_detail = await User_token(token);

    let companyDetail: any = await company.findOne({
      _id: user_detail?.cid,
      is_deleted: 0,
    });

    console.log(companyDetail);

    if (!companyDetail) {
      return res.status(400).send({
        success: 0,
        message: "Company Not Found.",
      });
    }

    //   console.log(user_detail);
    let api_config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        "https://mobilepbx.mobiililinja.fi/webapi/core/recording/fetch_recording_by_domain.php?id=" +
        companyDetail?.domain_uuid,
      auth: {
        username: "apiuser",
        password: "d6kVImEEV1A34B2fjduZpxxFAf4",
      },
    };

    try {
      const data: any = await axios.request(api_config);

      if (data?.data?.message) {
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "System recording found successfully",
          data: [],
        });
      } else {
        return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
          success: 1,
          message: "System recording found successfully",
          data: data.data,
        });
      }
    } catch (error: any) {
      console.log(error, "11");
      return res.status(500).send({
        success: 0,
        message: "Failed to fetch system recording",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error",
    });
  }
};
export default { addRecording, EditRecording, deleteRecording, getrecodlist };
