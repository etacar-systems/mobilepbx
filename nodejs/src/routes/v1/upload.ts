import { Router } from "express";
import authUser from "../../middleware/authUser";
import uploadCtrl from "../../controllers/v1//uploadCtrl";
export const uploadRoute = Router();

uploadRoute.post("/", uploadCtrl.uploadFile);
