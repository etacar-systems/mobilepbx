import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import phonebookCtrl from "../../controllers/v1/phonebookCtrl";
import whatsappCtrl from "../../controllers/v1/whatsappCtrl";
import whatsappListCtrl from "../../controllers/v1/whatsappListCtrl";

export const whatsapp = Router();

whatsapp.post("/webhook",whatsappCtrl.receiveMessage);
whatsapp.post("/webhook",whatsappCtrl.receiveMessage);
whatsapp.post("/assign",whatsappListCtrl.assign_user);
whatsapp.post("/send-message",authUser,whatsappCtrl.sendMessage);
whatsapp.get("/sidebar",authUser,whatsappListCtrl.getChatList);
whatsapp.get("/wp-conversation/company/:receiver_id",authUser,whatsappListCtrl.whatsappCompanyRecord);
whatsapp.get("/wp-conversation/user/:receiver_id",authUser,whatsappListCtrl.whatsappUserRecord);

