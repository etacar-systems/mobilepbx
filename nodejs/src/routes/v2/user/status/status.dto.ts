import { z } from "zod";
import { userStatuses } from "../../../../models/user";

export const updateDto = z.object({
  status: z.enum(userStatuses),
})