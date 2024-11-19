import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import reportUserCtrl from "../../controllers/v1/reportUserCtrl";

export const report_userRoute = Router();

report_userRoute.post("/", authAdmin, reportUserCtrl.getAllRecord);
report_userRoute.post("/toggle", authAdmin, reportUserCtrl.updateReportUser);
