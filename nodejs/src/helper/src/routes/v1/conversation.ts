import { Router } from "express";
import conversationCtrl from "../../controllers/v1/conversationCtrl";
import authUser from "../../middleware/authUser";

export const conversationRoute = Router();


conversationRoute.get("/user/:receiver_id", authUser, conversationCtrl.getAllRecord)
conversationRoute.post("/clear", authUser, conversationCtrl.clearChat)
