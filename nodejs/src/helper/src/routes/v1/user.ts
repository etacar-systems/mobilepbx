import { Router } from "express";
import userCtrl from "../../controllers/v1/userCtrl";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";

export const UserRoute = Router();


UserRoute.post("/add",userCtrl.addUser)
UserRoute.post("/login",userCtrl.userLogin)
UserRoute.post("/logout",userCtrl.userLogout)
UserRoute.get("/forward/list",authUser,userCtrl.getForwarduserlist)










