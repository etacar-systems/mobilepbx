import { router } from "../../utils/trpc";
import { adminRouter } from "./adminRouter";
import { companyRouter } from "./company";
import { dashboardRouter } from "./dashboardRouter";
import { superAdminRouter } from "./superAdminRouter";
import { trunkRouter } from "./trunk";

export const appRouter = router({
  admin: adminRouter,
  superAdmin: superAdminRouter,

  company: companyRouter,
  dashboard: dashboardRouter,
  trunk: trunkRouter
});

export type AppRouter = typeof appRouter;