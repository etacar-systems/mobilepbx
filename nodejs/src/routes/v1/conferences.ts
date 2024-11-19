import { Router } from "express";
import authUser from "../../middleware/authUser";
import conferncesCtrl from "../../controllers/v1/conferncesCtrl";

export const conferenceRoute = Router();

conferenceRoute.post("/add", authUser, conferncesCtrl.createConferference);
conferenceRoute.put("/edit", authUser, conferncesCtrl.editConferference);
conferenceRoute.delete("/delete", authUser, conferncesCtrl.deleteConference);
conferenceRoute.post("/detail", authUser, conferncesCtrl.conferenceGetById);
conferenceRoute.post("/list", authUser, conferncesCtrl.conferenceList);
conferenceRoute.get("/profile", authUser, conferncesCtrl.getConferenceProfile);
