import { z } from "zod";

import { paginationVariablesDto } from "../../general.dto";

export const NUMBER_POOL_MINIMUM_LENGTH = 3;
export const NUMBER_POOL_MAXIMUM_LENGTH = 15;

export const pstnListDto = z
  .object({
    search: z.string().optional().default(""),
    cid: z.string().optional(),
    sort_column: z
      .enum(["destination", "trunk_name", "company_name"])
      .optional(),
    sort_direction: z.enum(["asc", "desc"]).optional(),
  })
  .merge(paginationVariablesDto);

export const getPSTNDetails = z.object({
  uuid: z.string().uuid(),
});

export const selectionDto = z.object({
  gateway_id: z.string().min(5),
  company_id: z.string().min(5),
})

export const updateDto = getPSTNDetails.merge(selectionDto);

export const pstnNumberRangeDto = z.object({
  destination_number: z
    .string({ message: "Destination number is required" })
    .superRefine((val, ctx) => {
      const n = Number(val);
      if (
        isNaN(n) ||
        val.length < NUMBER_POOL_MINIMUM_LENGTH ||
        val.length > NUMBER_POOL_MAXIMUM_LENGTH ||
        n < 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            `Destination number must be between ${NUMBER_POOL_MINIMUM_LENGTH} and ${NUMBER_POOL_MAXIMUM_LENGTH} digits long.`,
        });
      }
    }),
  range: z
    .number({ message: "Destination number is required" })
    .superRefine((val, ctx) => {
      if (val < 0 || val >= 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          path: ["range"],
          maximum: 100,
          inclusive: true,
          type: "number",
          message: "The difference between numbers must be less than 100.",
        });
      }
    }),
}).merge(selectionDto);
