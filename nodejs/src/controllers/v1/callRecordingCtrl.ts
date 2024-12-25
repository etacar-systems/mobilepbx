import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload, sign } from "jsonwebtoken";
import { config } from "../../config";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";
import REGEXP from "../../regexp";
import mongoose from "mongoose";
import CdrModel from "../../models/cdrs";
import logger from "../../logger";

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
    const data = req.body;
    logger.info(`Full Request Object: ${JSON.stringify(req.body, null, 2)}`);
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
      const updatedData = { ...data }; // Copy the object to avoid modifying the original
      updatedData.call_raw_data = updatedData.call_flow; // Rename `call_flow` to `call_raw_data`
      delete updatedData.call_flow; // Delete the old `call_flow` field
      const insertedData = await CdrModel.insertMany(updatedData, { rawResult: true });

      // console.log(updatedData, "updatedData");
      // Log the response status and message instead of the full res object
      logger.info(`Response status:, Message: Data added successfully`, updatedData);

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
