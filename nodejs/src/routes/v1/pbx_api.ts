import { Router } from "express";
import authUser from "../../middleware/authUser";
import PBXAPICtrl from "../../controllers/v1/pbx_apiCtrl";

export const PBXRoute = Router();

PBXRoute.get("/dropdown", authUser, PBXAPICtrl.getDropdown);
PBXRoute.get("/dropdown/:id", authUser, PBXAPICtrl.getDropdownByCid);
PBXRoute.get("/ring_dropdown", authUser, PBXAPICtrl.getRingBackDropdown);
PBXRoute.get("/sound_dropdown", authUser, PBXAPICtrl.getSoundDropdown);
