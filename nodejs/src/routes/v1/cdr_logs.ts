import { Router } from "express";
import authUser from "../../middleware/authUser";
import CDRLogsCtrl from "../../controllers/v1/cdrlogCtrl";

export const CDRLogs = Router();

CDRLogs.get("/", authUser, CDRLogsCtrl.getAllRecord);
CDRLogs.get("/domain", authUser, CDRLogsCtrl.getAllRecordByDomain);
CDRLogs.post("/recordings", authUser, CDRLogsCtrl.getAllRecordings);
CDRLogs.post("/new/domain", authUser, CDRLogsCtrl.getAllDataByDomain);
CDRLogs.post("/new/domain_list", authUser, CDRLogsCtrl.getAllDataByDomainList);
