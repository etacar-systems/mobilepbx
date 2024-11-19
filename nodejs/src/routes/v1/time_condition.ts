import { Router } from "express";
import authUser from "../../middleware/authUser";
import TimeConditionCtrl from "../../controllers/v1/TimeConditionCtrl";
export const TimeConditionRoute = Router();

TimeConditionRoute.post(
  "/list",
  authUser,
  TimeConditionCtrl.getTimeConditionList
);
TimeConditionRoute.post("/add", authUser, TimeConditionCtrl.addTimeCondition);
TimeConditionRoute.put("/edit", authUser, TimeConditionCtrl.editTimeCondition);
TimeConditionRoute.delete(
  "/delete",
  authUser,
  TimeConditionCtrl.deleteTimeCondition
);
TimeConditionRoute.post(
  "/details",
  authUser,
  TimeConditionCtrl.getTimeConditionById
);
