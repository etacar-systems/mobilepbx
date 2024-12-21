import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import trunksCtrl from "../../controllers/v1/trunksCtrl";

export const trunksRoute = Router();

trunksRoute.post("/add", authUser, trunksCtrl.addNewRecord);
trunksRoute.put("/edit", authUser, trunksCtrl.EditNewRecord);
trunksRoute.delete("/delete", authUser, trunksCtrl.DeleteRocrd);
trunksRoute.post("/list", authUser, trunksCtrl.gettrunkslist);
trunksRoute.post("/detail", authUser, trunksCtrl.getTrunkdetailByid)
trunksRoute.get("/namelist", authUser, trunksCtrl.getTrunkNameList)
