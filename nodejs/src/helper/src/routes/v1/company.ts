import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import companyCtrl from "../../controllers/v1/companyCtrl";

export const companyRoute = Router();

companyRoute.post("/add", authUser,companyCtrl.addNewRecord);
companyRoute.get("/user/list", authUser,companyCtrl.getCompnayUsersById);
companyRoute.post("/list",authUser,companyCtrl.getCompnanylist);
companyRoute.post("/detail",authUser,companyCtrl.getCompanyDetailbyID);
companyRoute.put("/edit",authUser,companyCtrl.editCompany);
companyRoute.delete("/delete",authUser,companyCtrl.DeleteCompany);
companyRoute.get("/namelist",authUser,companyCtrl.getCompanyNameList);





