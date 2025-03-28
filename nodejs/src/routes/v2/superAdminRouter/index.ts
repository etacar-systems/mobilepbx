import { router } from "../../../utils/trpc";

import { chatRouter } from "./chat";
import { videoRouter } from "./video";

export const superAdminRouter = router({
  video: videoRouter,
  chat: chatRouter,
});
