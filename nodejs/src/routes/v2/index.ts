import { router } from "../../utils/trpc";
import { adminRouter } from "./adminRouter";
import { companyRouter } from "./company";
import { conferenceRouter } from "./conference";
import { dashboardRouter } from "./dashboardRouter";
import { dialplanRouter } from "./dialplan";
import { extensionRouter } from "./extension";
import { IVRRouter } from "./ivr";
import { recordingRouter } from "./recording";
import { ringGroupRouter } from "./ringGroup";
import { superAdminRouter } from "./superAdminRouter";
import { trunkRouter } from "./trunk";
import { userRouter } from "./user";

export const appRouter = router({
  admin: adminRouter,
  superAdmin: superAdminRouter,
  agent: userRouter,

  conference: conferenceRouter,
  company: companyRouter,
  dashboard: dashboardRouter,
  dialplan: dialplanRouter,
  extension: extensionRouter,
  trunk: trunkRouter,
  ivr: IVRRouter,
  recording: recordingRouter,
  ringGroup: ringGroupRouter,
});

export type AppRouter = typeof appRouter;