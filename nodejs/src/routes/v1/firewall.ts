import { Router } from "express";
import authUser from "../../middleware/authUser";
import firewallCtrl from "../../controllers/v1/firewallCtrl";

export const firewallRoute = Router();

firewallRoute.post("/add", authUser, firewallCtrl.addFirewallData);
firewallRoute.post("/list", authUser, firewallCtrl.getFirewallRecord);
firewallRoute.delete("/delete", authUser, firewallCtrl.deleteFirewallData);
firewallRoute.post("/detail", authUser, firewallCtrl.getFirewallDataById);
firewallRoute.put("/update", authUser, firewallCtrl.editFirewallData);
