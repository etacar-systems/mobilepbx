import { z } from "zod";

import { paginationVariablesDto } from "../../general.dto";

export const ringGroupDto = z
  .object({
    search: z.string().optional().default(""),
    cid: z.string().optional(),
    sort_column: z
      .enum(["name", "description", "phone_number", "extension", "date"])
      .optional(),
    sort_direction: z.enum(["asc", "desc"]).optional(),
  })
  .merge(paginationVariablesDto);

export const getRingGroupDetails = z.object({
  uuid: z.string().uuid(),
});

export const ringStrategy = [
  {
    label: "Hunt",
    key: "sequence",
  },
  { label: "Ring all", key: "simultaneous" },
] as const;

export const ringGroupsFormDto = z.object({
  name: z
    .string({ message: "Ring group name is required" })
    .trim()
    .min(1, "Ring group name is required"),
  description: z
    .string({ message: "Ring group description is required" })
    .trim()
    .min(1, "Ring group description is required"),
  extension: z
    .string({ message: "Extension is required" })
    .trim()
    .min(1, { message: "Ring group extension must contain only digits" })
    .superRefine((arg, ctx) => {
      if (isNaN(Number(arg))) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_type,
          expected: "number",
          received: "string",
          message: "Ring group extension must contain only digits",
        });
      }
    }),
  strategy: z.enum(
    [
      ringStrategy.map((val) => val.key)[0],
      ...ringStrategy.map((val) => val.key),
    ],
    { message: "Ring group strategy is required" }
  ),
  duration: z
    .number({ message: "duration is required" })
    .min(1, "duration is required")
    .max(100, { message: "duration is required" }),
  extensions: z
    .array(z.string({ message: "At least one extension must be selected" }), {
      message: "At least one extension must be selected",
    })
    .min(1, { message: "At least one extension must be selected" })
    .superRefine((arg, ctx) => {
      if (arg.every((extension) => isNaN(Number(extension)))) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_type,
          expected: "number",
          received: "string",
          message: "End point is required",
        });
      }
    }),
  record_calls: z.boolean().optional(),
  active: z.boolean().optional(),
  sms: z.string().trim().optional(),
  ring_group_timeout_data: z.string().trim().min(1),
  ring_group_timeout_app: z.string().trim().min(1),
});
