import { Router } from "express";
import authUser from "../../middleware/authUser";
import reportMessageCtrl from "../../controllers/v1/reportMessageCtrl";

export const report_msgRouter = Router();

report_msgRouter.post("/", authUser, reportMessageCtrl.getAllRecord);
report_msgRouter.delete(
  "/:report_id",
  authUser,
  reportMessageCtrl.deleteReport
);
report_msgRouter.put(
  "/:report_id",
  authUser,
  reportMessageCtrl.ReportMessgeRemove
);
