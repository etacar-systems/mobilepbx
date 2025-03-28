import { SettingsModel } from "../../../../../models/settings";
import { publicProcedure, router } from "../../../../../utils/trpc";
import { superAdminProcedure } from "../../procedure";
import { chatCredentialsDTO } from "./settings.dto";

export const chatSettingsRouter = router({
  credentials: publicProcedure.query(async () => {
    const settings = await SettingsModel.findOne();

    return {
      id: settings?.chat_id,
      origin: settings?.chat_origin,
    };
  }),
  update: superAdminProcedure
    .input(chatCredentialsDTO)
    .mutation(async ({ input }) => {
      const settings = await SettingsModel.findOne();
      if (!settings)
        await SettingsModel.create({
          chat_id: input.id,
          chat_origin: input.origin,
        });
      else
        await SettingsModel.updateOne(
          { _id: settings._id },
          { chat_id: input.id, chat_origin: input.origin }
        );

      return { id: input.id, origin: input.origin };
    }),
});
