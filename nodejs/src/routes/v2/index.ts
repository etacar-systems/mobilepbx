import { router } from "../../utils/trpc";
import { superAdminRouter } from "./superAdminRouter";

export const appRouter = router({
  superAdminRouter,
});

export type AppRouter = typeof appRouter;