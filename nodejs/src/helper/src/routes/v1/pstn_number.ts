import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import pstnNumberCtrl from "../../controllers/v1/pstnNumberCtrl";

export const pstnRoute = Router();

pstnRoute.get("/unassigned/list",authUser,pstnNumberCtrl.getAnAssignedPstnNumberList);
pstnRoute.post("/add",authUser,pstnNumberCtrl.addNewRecord);
pstnRoute.post("/list",authUser,pstnNumberCtrl.getpstnNumberList);
pstnRoute.delete("/delete",authUser,pstnNumberCtrl.removepstn);







