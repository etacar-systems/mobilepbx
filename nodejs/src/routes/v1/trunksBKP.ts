import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import trunksCtrlBKP from "../../controllers/v1/trunksCtrlBKP";

export const trunksRouteBKP = Router();

trunksRouteBKP.post("/add", authUser, trunksCtrlBKP.addNewRecord);
trunksRouteBKP.put("/edit", authUser, trunksCtrlBKP.EditNewRecord);
trunksRouteBKP.delete("/delete", authUser, trunksCtrlBKP.DeleteRocrd);
trunksRouteBKP.post("/list", authUser, trunksCtrlBKP.gettrunkslist);
trunksRouteBKP.post("/detail", authUser, trunksCtrlBKP.getTrunkdetailByid);
trunksRouteBKP.get("/namelist", authUser, trunksCtrlBKP.getTrunkNameList);
