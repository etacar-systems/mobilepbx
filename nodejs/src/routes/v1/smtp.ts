import { Router } from "express";
import authUser from "../../middleware/authUser";
import smtpCtrl from "../../controllers/v1/smtpCtrl";

export const smtpRoute = Router();

smtpRoute.put("/config/update", authUser, smtpCtrl.UpdateSmtpDetail);
smtpRoute.get("/detail", authUser, smtpCtrl.GetSmtpDetail);
