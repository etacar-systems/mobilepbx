import { z } from "zod";

export const statisticQueryDto = z
  .object({
    startDate: z.string().date(),
    endDate: z.string().date(),
    // timezoneOffset: z.number().max(840).min(-720),
    timeZone: z.string().superRefine((value, ctx) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: value });
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
        })
      }
    }),
  })
  .superRefine((val, ctx) => {
    if (new Date(val.endDate) < new Date(val.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: "",
      });
    }
  });

export const callMetricsQueryDto = z.object({
  timeZone: z.string().superRefine((value, ctx) => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: value });
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
      })
    }
  }),
  type: z.enum(["today", "week", "month", "year"]).optional().default("today"),
});
