import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import trunksCtrl from "../../controllers/v1/trunksCtrl";

export const trunksRoute = Router();

trunksRoute.post("/add",trunksCtrl.addNewRecord);
trunksRoute.put("/edit",trunksCtrl.EditNewRecord);
trunksRoute.delete("/delete",trunksCtrl.DeleteRocrd);
trunksRoute.post("/list",trunksCtrl.gettrunkslist);
trunksRoute.post("/detail",trunksCtrl.getTrunkdetailByid);
trunksRoute.get("/namelist",trunksCtrl.getTrunkNameList);








