import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import RingGroupCtrl from "../../controllers/v1/RingGroupCtrl";

export const RingGroupRoute = Router();

RingGroupRoute.post("/add", authUser, RingGroupCtrl.addNewRecord);
RingGroupRoute.post("/detail", authUser, RingGroupCtrl.getRingGroupDetailByid);
RingGroupRoute.put("/edit", authUser, RingGroupCtrl.EditNewRecord);
RingGroupRoute.delete("/delete", authUser, RingGroupCtrl.DeleteRecord);
RingGroupRoute.post("/list", RingGroupCtrl.getRingGrouplist);
