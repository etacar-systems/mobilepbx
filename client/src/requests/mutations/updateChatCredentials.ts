import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IUpdateChatCredentialsInput = RouterInputs["superAdminRouter"]["chat"]["settings"]["update"];

export const useUpdateChatCredentials = () => {
  const utils = trpc.useUtils()
  const { mutate, isPending } = trpc.superAdminRouter.chat.settings.update.useMutation({
    retry: false,
  });

  const updateChatCredentials = (
    input: IUpdateChatCredentialsInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(data, variables, context) {
        // @ts-ignore
        utils.superAdminRouter.chat.settings.credentials.setData(undefined, () => {
          return data;
        })
        opts?.onSuccess && opts.onSuccess(data, variables, context);
      }
    });
  };

  return {
    isFetching: isPending,
    updateChatCredentials,
  };
};
