import { z } from "zod";

export const NUMBER_POOL_MINIMUM_LENGTH = 3;
export const NUMBER_POOL_MAXIMUM_LENGTH = 15;

export const pstnNumberRangeDto = (
  gateways: Array<string>,
  companies: Array<string>
) =>
  z
    .object({
      destination_number_start: z
        .string({ message: "Destination number is required" })
        .trim()
        .min(1, "Destination number is required")
        .superRefine((val, ctx) => {
          const newVal = Number(val);

          if (isNaN(newVal)) {
            ctx.addIssue({
              code: z.ZodIssueCode.invalid_type,
              expected: "number",
              received: "nan",
              message:
                "Only numbers and an optional plus sign at the start are allowed.",
            });
          }

          if (
            val.length < NUMBER_POOL_MINIMUM_LENGTH ||
            val.length > NUMBER_POOL_MAXIMUM_LENGTH ||
            newVal < 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Destination number must be between start and end digits long.",
            });
          }
        }),
        destination_number_end: z
        .string({ message: "Destination number is required" })
        .trim()
        .min(1, "Destination number is required")
        .superRefine((val, ctx) => {
          const newVal = Number(val);

          if (isNaN(newVal)) {
            ctx.addIssue({
              code: z.ZodIssueCode.invalid_type,
              expected: "number",
              received: "nan",
              message:
                "Only numbers and an optional plus sign at the start are allowed.",
            });
          }

          if (
            val.length < NUMBER_POOL_MINIMUM_LENGTH ||
            val.length > NUMBER_POOL_MAXIMUM_LENGTH ||
            newVal < 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Destination number must be between start and end digits long.",
            });
          }

          // return newVal;
        }),
      gateway_id: z.enum([gateways[0], ...gateways], { message: "" }),
      company_id: z.enum([companies[0], ...companies], { message: "" }),
    })
    .transform((arg, ctx) => {
      const range = Number(arg.destination_number_end) - Number(arg.destination_number_start);

      if (range < 0) {
        // @ts-ignore
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          path: ["destination_number_start"],
          message: "The difference between numbers must be less than 100.",
        });
      }

      if (range >= 100) {
        // @ts-ignore
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          path: ["destination_number_start"],
          message: "The difference between numbers must be less than 100.",
        });
      }

      return { ...arg, number_range: range };
    });

export type TPSTNNumberFormArgs = z.infer<
  ReturnType<typeof pstnNumberRangeDto>
>;
