import { router } from "../../../utils/trpc";

import { chatRouter } from "./chat";
import { pstnRouter } from "./pstn";
import { videoRouter } from "./video";

export const superAdminRouter = router({
  chat: chatRouter,
  pstn: pstnRouter,
  video: videoRouter,
});
