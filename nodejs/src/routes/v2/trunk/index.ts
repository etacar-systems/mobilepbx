import trunks from "../../../models/trunks";
import { router } from "../../../utils/trpc";
import { authorizedProcedure } from "../dashboardRouter/procedure";

export const trunkRouter = router({
  namesList: authorizedProcedure.query(async () => {
    const trunksNames: Array<{ _id: string; gateway_name: string }> =
      await trunks
        .find({
          is_deleted: 0,
        })
        .select({
          _id: true,
          gateway_name: true,
        });

    return trunksNames;
  }),
});
