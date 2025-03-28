import { router } from "../../../../utils/trpc";
import { chatSettingsRouter } from "./settings";

export const chatRouter = router({
  settings: chatSettingsRouter
})