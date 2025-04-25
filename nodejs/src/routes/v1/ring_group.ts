import { Router } from "express";
import RingGroupCtrl from "../../controllers/v1/RingGroupCtrl";

export const RingGroupRoute = Router();

RingGroupRoute.post("/list", RingGroupCtrl.getRingGrouplist);
