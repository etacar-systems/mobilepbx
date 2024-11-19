import { Router } from "express";
import authUser from "../../middleware/authUser";
import groupConversationCtrl from "../../controllers/v1/groupConversationCtrl";

export const group_conRoute = Router();
group_conRoute.get("/:group_id", authUser, groupConversationCtrl.getAllRecord);
group_conRoute.get(
  "/message/info/:message_id",
  authUser,
  groupConversationCtrl.getMessageInfo
);
