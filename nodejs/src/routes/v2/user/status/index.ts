import { userStatuses } from "../../../../models/user";
import userModel from "../../../../models/user";
import { router } from "../../../../utils/trpc";
import { authorizedProcedure } from "../../dashboardRouter/procedure";
import { updateDto } from "./status.dto";

export const statusRouter = router({
  list: authorizedProcedure.query(() => {
    return userStatuses;
  }),
  update: authorizedProcedure
    .input(updateDto)
    .mutation(async ({ ctx: { user }, input: { status } }) => {
      await userModel.updateOne(
        { _id: user._id },
        {
          status,
        }
      );
    }),
});
