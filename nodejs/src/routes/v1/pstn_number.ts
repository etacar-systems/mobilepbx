import { Router } from "express";
import authUser from "../../middleware/authUser";
import authAdmin from "../../middleware/authAdmin";
import pstnNumberCtrl from "../../controllers/v1/pstnNumberCtrl";

export const pstnRoute = Router();

pstnRoute.get(
  "/unassigned/list",
  authUser,
  pstnNumberCtrl.getAnAssignedPstnNumberList
);
pstnRoute.get(
  "/detail/get",
  authUser,
  pstnNumberCtrl.getPstnNumberdetailByid
);
pstnRoute.post("/add", authUser, pstnNumberCtrl.addNewRecord);
pstnRoute.post("/assign_pstn", authUser, pstnNumberCtrl.assignPSTNInNumber);
pstnRoute.put("/update_pstn", authUser, pstnNumberCtrl.updateAssignPSTN);
// pstnRoute.put("/edit", authUser, pstnNumberCtrl.updatePstnNumber);
pstnRoute.post("/detail", authUser, pstnNumberCtrl.getNumberdetailByid);
pstnRoute.delete("/delete_pstn", authUser, pstnNumberCtrl.removeAssignpstn);
pstnRoute.post("/list", authUser, pstnNumberCtrl.getpstnNumberList);
pstnRoute.post(
  "/companywise_pstn",
  authUser,
  pstnNumberCtrl.CompanyWisePstnList
);
// pstnRoute.delete("/delete", authUser, pstnNumberCtrl.removepstn);
pstnRoute.post("/dropdown", authUser, pstnNumberCtrl.dropdownData);
pstnRoute.post("/dropdown/call/reports", authUser, pstnNumberCtrl.CallReportsdropdownData);

