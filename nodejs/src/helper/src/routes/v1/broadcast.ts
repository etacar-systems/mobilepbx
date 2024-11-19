import { Router } from "express";
import authUser from "../../middleware/authUser";
import broadcastCtrl from "../../controllers/v1/broadcastCtrl";

export const broadcastRouter = Router()

broadcastRouter.get("/users/:id", authUser, broadcastCtrl.getBroadcastUsers);
broadcastRouter.get("/:id", authUser, broadcastCtrl.getBroadConveration);
broadcastRouter.post("/", authUser, broadcastCtrl.createBroadcast);
broadcastRouter.get("/", authUser, broadcastCtrl.getBroadCastList);
broadcastRouter.put("/:id", authUser, broadcastCtrl.editBroadcast);
broadcastRouter.delete("/:id", authUser, broadcastCtrl.deleteBroadcast);

