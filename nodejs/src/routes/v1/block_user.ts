import { Router } from "express";
import authUser from "../../middleware/authUser";
import blockUserCtrl from "../../controllers/v1/blockUserCtrl";
export const block_userRoutes = Router();

block_userRoutes.get("/", authUser, blockUserCtrl.getAllRecord);
block_userRoutes.post("/toggle", authUser, blockUserCtrl.updateBlockUser);
