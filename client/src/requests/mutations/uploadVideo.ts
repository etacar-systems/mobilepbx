import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IUploadVideoInput = RouterInputs["superAdmin"]["video"]["upload"];

export const useUploadVideo = () => {
  const utils = trpc.useUtils()
  const { mutate, isPending } = trpc.superAdmin.video.upload.useMutation({
    retry: false,
  });

  const uploadVideo = (
    input: IUploadVideoInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(data, variables, context) {
        utils.superAdmin.video.getUrl.setData({ section: input.section }, () => {
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
