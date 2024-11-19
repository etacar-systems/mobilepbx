import { Router } from "express";
import userCtrl from "../../controllers/v1/userCtrl";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";

export const UserRoute = Router();

UserRoute.post("/add", authUser, userCtrl.addUser);
UserRoute.post("/user", authUser, userCtrl.GetUserDetailsByID);
UserRoute.put("/edit", authUser, userCtrl.EditUser);
UserRoute.post("/delete", authUser, userCtrl.DeleteUser);
UserRoute.post("/login", userCtrl.userLogin);
UserRoute.post("/logout", userCtrl.userLogout);
UserRoute.get("/forward/list", authUser, userCtrl.getForwarduserlist);
UserRoute.post("/company_users", authUser, userCtrl.GetUserListByCompany);
UserRoute.get("/list", authUser, userCtrl.GetExtensionListByCompany);


