import { z } from "zod";

export const remoteNoAnswerStrategy = [
  { label: "Extension", key: "extension" },
  { label: "Ring groups", key: "ringGroup" },
  { label: "IVR", key: "ivr" },
  { label: "Conferences", key: "conference" },
  { label: "System recordings", key: "recording" },
  { label: "Time Condition", key: "dialplan" },
] as const;

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
    .string({ message: "Extension is required" }).trim().min(1, { message: "Ring group extension must contain only digits" })
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
    .max(100, { message: "duration is required" })
    .default(0),
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
  record_calls: z.boolean().optional().default(false),
  remote_no_answer_strategy: z.enum([
    remoteNoAnswerStrategy.map((val) => val.key)[0],
    ...remoteNoAnswerStrategy.map((val) => val.key),
  ], { message: "Type is required" }),
  active: z.boolean().optional().default(false),
  sms: z.string().trim().optional(),
  endpoint_uuid: z.string({ message: "End point is required" }).uuid({ message: "End point is required" })
})

export type TRingGroupsFormArgs = z.infer<typeof ringGroupsFormDto>;
