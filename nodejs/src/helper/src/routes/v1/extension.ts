import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import extensionCtrl from "../../controllers/v1/extensionCtrl";

export const extensionRoute = Router();

extensionRoute.post("/add",authUser,extensionCtrl.addNewRecord);
extensionRoute.post("/detail",authUser,extensionCtrl.getExtensionDetailByid);
extensionRoute.put("/edit",authUser,extensionCtrl.EditNewRecord);
extensionRoute.delete("/delete",authUser,extensionCtrl.DeleteRocrd);
extensionRoute.post("/list",authUser,extensionCtrl.getextantionlist);





