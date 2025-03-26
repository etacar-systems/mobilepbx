import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IRemoveVideoInput = RouterInputs["superAdminRouter"]["video"]["remove"];

export const useRemoveVideo = () => {
  const utils = trpc.useUtils()
  const { mutate, isPending } = trpc.superAdminRouter.video.remove.useMutation({
    retry: false,
  });

  const removeVideo = (
    input: IRemoveVideoInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(data, variables, context) {
        // @ts-ignore
        utils.superAdminRouter.video.getUrl.setData({ section: input.section }, () => {
          return null;
        })
        opts?.onSuccess && opts.onSuccess(data, variables, context);
      }
    });
  };

  return {
    isFetching: isPending,
    removeVideo,
  };
};
