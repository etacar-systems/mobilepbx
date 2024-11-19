import { Router } from "express";
import authUser from "../../middleware/authUser";
import settings from "../../controllers/v1/settings";

export const settingRoute = Router();

settingRoute.put("/change_password", authUser, settings.changePassword);
settingRoute.put("/update/user/detail", authUser, settings.UpdateUserDetail);
