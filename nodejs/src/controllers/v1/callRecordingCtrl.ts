import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import CdrModel from "../../models/cdrs";
import logger from "../../logger";
import company from "../../models/company";
import user from "../../models/user";

const BASE_RECORDING_URL = "https://mobilepbx.mobiililinja.fi/call_recording/";

const validateData = (data: any[], requiredFields: string[]): string | null => {
  for (const [index, item] of data.entries()) {
    for (const field of requiredFields) {
      if (!item.hasOwnProperty(field)) {
        return `Missing required field '${field}' in object at index ${index}`;
      }
    }
  }
  return null;
};
const addNewRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
	let data;
    	data = req.body;
    logger.info(`Full Request Object: ${JSON.stringify(req.body, null, 2)}`);
    //logger.info(`Full Request Object: ${JSON.stringify(req.body.json.variables, null, 2)}`);
   // logger.info(`Full Request Object: ${JSON.stringify(req.body.call_flow.caller_profile.username, null, 2)}`);
    //  console.log(JSON.stringify(req.body, null, 2));
    // if (!Array.isArray(data)) {
    //   return res.status(config.RESPONSE.STATUS_CODE.INVALID_FIELD).send({
    //     success: 0,
    //     message: "Request Body Params Is Empty",
    //   });
    // }

    const requiredFields = [
      "xml_cdr_uuid",
      "domain_name",
      "domain_uuid",
      "sip_call_id",
      "extension_uuid",
      "direction",
      "caller_id_name",
      "caller_id_number",
      "destination_number",
      "start_stamp",
      "duration",
      "record_name",
      "status",
      "hangup_cause",
      "module_name",
      "recording_url",
    ];

    // const validationError = validateData(data, requiredFields);
    // if (validationError) {
    //   return res.status(400).json({ message: validationError });
    // }

    try {
      // Insert data into the database
      let updatedData; // Copy the object to avoid modifying the original
      updatedData = { ...data };
      updatedData.call_raw_data = updatedData.call_flow; // Rename `call_flow` to `call_raw_data`

      if (updatedData.record_name) {
        updatedData.recording_url = `${BASE_RECORDING_URL}${updatedData.record_name}`;
      } else {
        updatedData.recording_url = null; // Set to null if record_name is missing
      }

      // const pipeline: PipelineStage[] = [
      //   {
      //     $match: {
      //       xml_cdr_uuid: updatedData.xml_cdr_uuid, // Match xml_cdr_uuid from updatedData
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "users", // Join with the 'users' collection
      //       localField: "extension_uuid", // cdrs.extension_uuid
      //       foreignField: "extension_uuid", // users.extension_uuid
      //       as: "userDetails",
      //     },
      //   },
      //   { $unwind: "$userDetails" }, // Unwind the array from the $lookup
      //   {
      //     $lookup: {
      //       from: "companies", // Join with the 'companies' collection
      //       localField: "domain_uuid", // cdrs.domain_uuid
      //       foreignField: "domain_uuid", // companies.domain_uuid
      //       as: "companyDetails",
      //     },
      //   },
      //   { $unwind: "$companyDetails" }, // Unwind the array from the $lookup
      // ];

      // const cdrs_list = await CdrModel.aggregate(pipeline)

      // const cdrs_list = await CdrModel.aggregate(pipeline).exec();

      if (updatedData.leg == "a" && updatedData.direction == "local" && updatedData.status !="missed") {

        const compData = await company.findOne({ domain_uuid: updatedData.domain_uuid })
        const userData = await user.findOne({ cid: compData?._id, user_extension: updatedData.caller_id_number, is_deleted: 0 })
        logger.info(`userDatauserDatauserData: ${userData}`);
        updatedData.extension_uuid = userData?.extension_uuid;
      }
      delete updatedData.call_flow; // Delete the old `call_flow` field
      const insertedData = await CdrModel.insertMany(updatedData);
      // Log the response status and message instead of the full res object
      logger.info(`Response status:, Message: Data added successfully: ${updatedData}`);
      return res.status(config.RESPONSE.STATUS_CODE.SUCCESS).send({
        success: 1,
        message: "Data added successfully",
      });
    } catch (error: any) {
      // Log error with the relevant response data
      logger.error(`Error while inserting data: ${error.message}`);
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: "Failed To Create Trunks",
        error: error.message,
      });
    }
  } catch (error: any) {
    // Log the error without trying to stringify the res object
    logger.error(`callrecord Object error: ${error.message}`);
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      error: error.message,
    });
  }
};

export default {
  addNewRecord,
};
