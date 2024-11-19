import { Router } from "express";
import authUser from "../../middleware/authUser";
import message_disappearCtrl from "../../controllers/v1/message_disappearCtrl";

export const message_disappearRoute = Router();

message_disappearRoute.get(
  "/",
  authUser,
  message_disappearCtrl.getUserMessageSetting
);
message_disappearRoute.put(
  "/setting",
  authUser,
  message_disappearCtrl.UpdateUserMessageSetting
);
