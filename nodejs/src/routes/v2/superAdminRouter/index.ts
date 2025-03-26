import { router } from "../../../utils/trpc";
import { videoRouter } from "./video";

export const superAdminRouter = router({
  video: videoRouter
});
