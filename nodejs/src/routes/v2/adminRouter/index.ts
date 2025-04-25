import { router } from "../../../utils/trpc";
import { ringGroupRouter } from "./ringGroup";

export const adminRouter = router({
  ringGroup: ringGroupRouter,
});
