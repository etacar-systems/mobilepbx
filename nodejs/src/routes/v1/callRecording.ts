import { Router } from "express";
import callRecordingCtrl from "../../controllers/v1/callRecordingCtrl";
import { config } from "../../config";
import { Request, Response, NextFunction } from "express";

export const callRecordingRoute = Router();

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }

    if(authHeader?.toString() !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NzJhMzBlNzVmYmJkMDk2YmM0YmEwOTEiLCJjaWQiOiI2NzJhMzBlNzVmYmJkMDk2YmM0YmEwOGYiLCJpYXQiOjE3MzQ3NzU1NzZ9.Md-fXoBXi9Eky2LGCrdwUV4eLerIW6Xua2bfHTQ_iv4") {
      return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
        success: 0,
        message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
      });
    }

    next();
  } catch (error) {
    return res.status(config.RESPONSE.STATUS_CODE.INTERNAL_SERVER).send({
      success: 0,
      message: config.RESPONSE.MESSAGE.INTERNAL_SERVER,
    });
  }
};

callRecordingRoute.post("/", middleware, callRecordingCtrl.addNewRecord);
