import { Router } from "express";
import authUser from "../../middleware/authUser";
import systemRecordCtrl from "../../controllers/v1/systemRecordCtrl";
export const system_record_route = Router();

system_record_route.post("/add", authUser, systemRecordCtrl.addRecording);
system_record_route.put("/edit", authUser, systemRecordCtrl.EditRecording);
system_record_route.delete(
  "/delete",
  authUser,
  systemRecordCtrl.deleteRecording
);
system_record_route.get("/list", authUser, systemRecordCtrl.getrecodlist);
