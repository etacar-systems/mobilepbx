import { z } from "zod";

export const mimeTypes = {
  mp4: "video/mp4",
  // avi: "video/x-msvideo",
  // mkv: "video/x-matroska",
  mov: "video/quicktime",
  // wmv: "video/x-ms-wmv",
  // flv: "video/x-flv",
  webm: "video/webm",
  // mpeg: "video/mpeg",
  // "3gp": "video/3gpp",
  // "2gp": "video/2gpp",
} as const;

const pagesKeys = [
  "customers",
  "invoices",
  "pstn",
  "truncs",
  "outbound",
  "firewall",
  "smtp",
  "video_upload",
  "dashboard",
  "numbers",
  "extensions",
  "ring_groups",
  "conferences",
  "ivr",
  "time_condition",
  "call_recordings",
  "system_recordings",
  "reports",
  "integrations",
  "webphone",
  "chat",
  "history",
  "calendar",
  "whatsapp",
] as const;

const mimeKeys: Array<keyof typeof mimeTypes> = Object.keys(mimeTypes) as Array<
  keyof typeof mimeTypes
>;
const mimeValues = Object.values(mimeTypes);

export const uploadVideoDto = z.object({
  section: z.enum([pagesKeys[0], ...pagesKeys]),
  size: z.number(),
  ext: z.enum([mimeKeys[0], ...mimeKeys]),
  mime: z.enum([mimeValues[0], ...mimeValues]),
  base64: z.string().min(1),
});

export const getVideoURLDto = z.object({
  section: z.enum([pagesKeys[0], ...pagesKeys])
})
