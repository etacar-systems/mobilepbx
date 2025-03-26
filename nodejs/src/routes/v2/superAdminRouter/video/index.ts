import fs from "fs";

import { superAdminProcedure } from "../procedure";
import { publicProcedure, router } from "../../../../utils/trpc";
import { getVideoURLDto, mimeTypes, uploadVideoDto } from "./video.dto";
import { TRPCError } from "@trpc/server";

export const SUPPORT_VIDEOS_DIRECTORY_PATH = "uploads/supportVideos/";

const findVideoBySectionAndReturn = (name: string) => {
  const existingVideos = fs.readdirSync(SUPPORT_VIDEOS_DIRECTORY_PATH);

  for (let video of existingVideos) {
     const videoName = video.split(".")[0];

    if (videoName === name) {
      return video;
    }
  }
}

export const videoRouter = router({
  upload: superAdminProcedure.input(uploadVideoDto).mutation(async (opts) => {
    const data = opts.input;

    const matches =
      data.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) || [];
    const mime = matches[1] || data.mime;

    const extension =
      (Object.entries(mimeTypes).find(([_, type]) => type === mime) || [])[0] ||
      data.ext;

    const videoData = matches[2];

    const filePath = `${data.section}.${extension}`;

    if (!fs.existsSync(SUPPORT_VIDEOS_DIRECTORY_PATH)) {
      fs.mkdirSync(SUPPORT_VIDEOS_DIRECTORY_PATH);
    }

    const existingVideo = findVideoBySectionAndReturn(data.section);

    if (existingVideo) {
      fs.rmSync(SUPPORT_VIDEOS_DIRECTORY_PATH + existingVideo);
    }

    fs.writeFileSync(
      SUPPORT_VIDEOS_DIRECTORY_PATH + filePath,
      Buffer.from(videoData, "base64")
    );

    return SUPPORT_VIDEOS_DIRECTORY_PATH + filePath;
  }),
  getUrl: publicProcedure.input(getVideoURLDto).query(async ({ ctx, input }) => {
    const existingVideo = findVideoBySectionAndReturn(input.section);

    if (!existingVideo) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return SUPPORT_VIDEOS_DIRECTORY_PATH + existingVideo;

  }),
  remove: superAdminProcedure.input(getVideoURLDto).mutation(async ({ ctx, input }) => {
    const existingVideo = findVideoBySectionAndReturn(input.section);

    if (!existingVideo) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    if (existingVideo) {
      fs.rmSync(SUPPORT_VIDEOS_DIRECTORY_PATH + existingVideo);
    }

    return;
  })
});
