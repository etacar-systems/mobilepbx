import { Router } from "express";
import authUser from "../../middleware/authUser";
import IVRCtrl from "../../controllers/v1/IVRCtrl";

export const IVRRoute = Router();

IVRRoute.post("/add", authUser, IVRCtrl.createIVR);
IVRRoute.post("/details", authUser, IVRCtrl.getIVRById);
IVRRoute.put("/edit", authUser, IVRCtrl.updateIVR);
IVRRoute.delete("/delete", authUser, IVRCtrl.deleteIVR);
IVRRoute.post("/list", authUser, IVRCtrl.getIVR);
