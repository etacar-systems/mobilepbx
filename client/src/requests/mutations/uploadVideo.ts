import { useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IUploadVideoInput = RouterInputs["superAdminRouter"]["video"]["upload"];

export const useUploadVideo = () => {
  const utils = trpc.useUtils()
  const { mutate, isPending } = trpc.superAdminRouter.video.upload.useMutation({
    retry: false,
  });

  const uploadVideo = (
    input: IUploadVideoInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(data, variables, context) {
        utils.superAdminRouter.video.getUrl.setData({ section: input.section }, () => {
          return data;
        })
        opts?.onSuccess && opts.onSuccess(data, variables, context);
      }
    });
  };

  return {
    isFetching: isPending,
    uploadVideo,
  };
};
