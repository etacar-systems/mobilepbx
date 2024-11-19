import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import outboundRouteCtrl from "../../controllers/v1/outboundRouteCtrl";

export const OutboundRoute = Router();

OutboundRoute.post("/add", authUser, outboundRouteCtrl.addNewRecord);
OutboundRoute.post("/detail", authUser, outboundRouteCtrl.getOutboundByid);
OutboundRoute.put("/edit", authUser, outboundRouteCtrl.EditNewRecord);
OutboundRoute.delete("/delete", authUser, outboundRouteCtrl.DeleteRecord);
OutboundRoute.post("/list", authUser, outboundRouteCtrl.getOutboundlist);
OutboundRoute.get("/dialplan", authUser, outboundRouteCtrl.getMatchPattern);
