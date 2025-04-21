import { z } from "zod";

export const paginationVariablesDto = z.object({
  limit: z.number().min(0).optional().default(10),
  page: z.number().min(1).optional().default(1)
});
