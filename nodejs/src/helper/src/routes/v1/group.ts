import { Router } from "express";
import authUser from "../../middleware/authUser";
import groupCtrl from "../../controllers/v1/groupCtrl";
export const groupRoute = Router();

groupRoute.get("/details/:_id", authUser, groupCtrl.getDetailsById)
groupRoute.get("/list/users/:_id", authUser, groupCtrl.getGroupUsers)
groupRoute.get("/role/user/:_id", authUser, groupCtrl.getGroupUserRole)

