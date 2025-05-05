import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IUpdateUserStatus = RouterInputs["agent"]["status"]["update"];

export const useUpdateUserStatus = () => {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.agent.status.update.useMutation({
    retry: false,
  });

  const updateUserStatus = (
    input: IUpdateUserStatus,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(data, variables, context) {
        utils.agent.me.setData(undefined, (prev) =>
          prev
            ? {
                ...prev,
                status: input.status,
              }
            : undefined
        );
        opts?.onSuccess && opts.onSuccess(data, variables, context);
      },
    });
  };

  return {
    isFetching: isPending,
    updateUserStatus,
  };
};
