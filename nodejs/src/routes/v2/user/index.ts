import { router } from "../../../utils/trpc";
import { authorizedProcedure } from "../dashboardRouter/procedure";
import { statusRouter } from "./status";

export const userRouter = router({
  status: statusRouter,
  me: authorizedProcedure.query(async ({ ctx: { user } }) => {
    return user;
  })
})
