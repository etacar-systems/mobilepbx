import { Router } from "express";
import authUser from "../../middleware/authUser";
import sidebarCtrl from "../../controllers/v1/sidebarCtrl";

export const sidebarRoute = Router();

sidebarRoute.get("/",authUser,sidebarCtrl.getSidebarData);