import { Router } from "express";
import { adminroutes } from "./v1/admin";
import { broadcastRouter } from "././v1/broadcast";
import { block_userRoutes } from "././v1/block_user";
import { conversationRoute } from "././v1/conversation";
import { group_conRoute } from "././v1/group_conversation";
import { groupRoute } from "././v1/group";
import { message_disappearRoute } from "././v1/message_disappear";
import { sidebarRoute } from "././v1/sidebar";
import { uploadRoute } from "././v1/upload";
import { report_msgRouter } from "././v1/report_message";
import { report_userRoute } from "././v1/report_user";
import {UserRoute} from "./v1/user";
import { companyRoute } from "./v1/company";
import { trunksRoute } from "./v1/trunks";
import { pstnRoute } from "./v1/pstn_number";
import { extensionRoute } from "./v1/extension";
import { RingGroupRoute } from "./v1/ring_group";
import { firewallRoute } from "./v1/firewall";
import { OutboundRoute } from "./v1/outbound_route";
import { phonebookRoute } from "./v1/phonebook";
import { system_record_route } from "./v1/system_record";
import { whatsapp } from "./v1/whatsapp";

export const route = Router();

route.use("/v1/admin",adminroutes);
route.use("/v1/company",companyRoute);
route.use("/v1/broadcast", broadcastRouter);
route.use("/v1/block/user", block_userRoutes);
route.use("/v1/conversation", conversationRoute);
route.use("/v1/conversation/group", group_conRoute);
route.use("/v1/group", groupRoute);
route.use("/v1/message/disappear", message_disappearRoute);
route.use("/v1/sidebar", sidebarRoute);
route.use("/v1/upload", uploadRoute);
route.use("/v1/report/message", report_msgRouter);
route.use("/v1/report/user", report_userRoute);
route.use("/v1/user", UserRoute);
route.use("/v1/trunk", trunksRoute);
route.use("/v1/pstn", pstnRoute);
route.use("/v1/extension", extensionRoute);
route.use("/v1/ringgroup", RingGroupRoute);
route.use("/v1/firewall", firewallRoute);
route.use("/v1/outbound", OutboundRoute);
route.use("/v1/phonebook", phonebookRoute);
route.use("/v1/whatsapp", whatsapp);
route.use("/v1/system/record", system_record_route);


route.use((req, res, next) => {
    const error = new Error("Route not found")
    return res.status(404).json({ message: error.message })
})