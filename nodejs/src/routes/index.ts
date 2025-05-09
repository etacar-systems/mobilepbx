import { Router } from "express";
import path from "path";
import fs from "fs";

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
import { UserRoute } from "./v1/user";
import { companyRoute } from "./v1/company";
import { trunksRouteBKP } from "./v1/trunksBKP";
import { trunksRoute } from "./v1/trunks";
import { pstnRoute } from "./v1/pstn_number";
import { extensionRoute } from "./v1/extension";
import { RingGroupRoute } from "./v1/ring_group";
import { firewallRoute } from "./v1/firewall";
import { OutboundRoute } from "./v1/outbound_route";
import { phonebookRoute } from "./v1/phonebook";
import { system_record_route } from "./v1/system_record";
import { whatsapp } from "./v1/whatsapp";
import { conferenceRoute } from "./v1/conferences";
import { IVRRoute } from "./v1/IVR";
import { CDRLogs } from "./v1/cdr_logs";
import { TimeConditionRoute } from "./v1/time_condition";
import { PBXRoute } from "./v1/pbx_api";
import { Calendar } from "./v1/calendarRoutes";
import { resetUserpass } from "./v1/resetpassword";
import { companyFeatureRoute } from "./v1/company_features";
import { settingRoute } from "./v1/setting";
import { smtpRoute } from "./v1/smtp";
import { whatsapplogIn } from "./v1/loginWhatsapp";
import { emailRoute } from "./v1/email";
// import { dashboardRoute } from "./v1/dashboard";
import { callRecordingRoute } from "./v1/callRecording";

import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./v2";
import { createContext } from "../utils/trpc";
import { SUPPORT_VIDEOS_DIRECTORY_PATH } from "./v2/superAdminRouter/video";
import { mimeTypes } from "./v2/superAdminRouter/video/video.dto";
import { expressRouter } from "./v2/company";

export const route = Router();

route.use("/v1/admin", adminroutes);
route.use("/v1/company", companyRoute);
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
route.use("/v1/trunkBKP", trunksRouteBKP);
route.use("/v1/trunk", trunksRoute);
route.use("/v1/pstn", pstnRoute);
route.use("/v1/extension", extensionRoute);
route.use("/v1/ringgroup", RingGroupRoute);
route.use("/v1/firewall", firewallRoute);
route.use("/v1/outbound", OutboundRoute);
route.use("/v1/phonebook", phonebookRoute);
route.use("/v1/whatsapp", whatsapp);
route.use("/v1/system/record", system_record_route);
route.use("/v1/conference", conferenceRoute);
route.use("/v1/ivr", IVRRoute);
route.use("/v1/cdr_logs", CDRLogs);
route.use("/v1/time_condition", TimeConditionRoute);
route.use("/v1/pbx_api", PBXRoute);
route.use("/v1/calendar", Calendar);
route.use("/v1/reset", resetUserpass);
route.use("/v1/company_feature", companyFeatureRoute);
route.use("/v1/setting", settingRoute);
route.use("/v1/smtp", smtpRoute);
route.use("/v1/api", whatsapplogIn);
route.use("/v1/email", emailRoute);
// route.use("/v1/dashboard", dashboardRoute);
route.use("/v1/save-call-recording-details", callRecordingRoute);

route.use("/v1", expressRouter);
route.get("/v1/uploads/supportVideos/:file_name", (req, res) => {
  try {
    const filename = req.params.file_name;
    const file = fs.readFileSync(SUPPORT_VIDEOS_DIRECTORY_PATH + filename);

    if (file) {
      const ext = path.extname(filename);
      const mimeType: string | undefined = (mimeTypes as any)[ext];

      return res.status(200).send(file);
    }
  } catch (e) {
  } finally {
    return res.status(404).send();
  }
});

route.use(
  "/v1/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

route.use((req, res, next) => {
  const error = new Error("Route not found");
  return res.status(404).json({ message: error.message });
});
