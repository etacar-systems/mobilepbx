import { z } from "zod";

export const chatCredentialsDTO = z.object({
  id: z.string().min(1),
  origin: z.string().min(1),
});
