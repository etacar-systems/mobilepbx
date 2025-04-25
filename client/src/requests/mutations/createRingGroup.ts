import { RouterInputs, RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type ICreateRingGroupInput = RouterInputs["admin"]["ringGroup"]["add"];
export type ICreateRingGroupOutput = RouterOutputs["admin"]["ringGroup"]["add"];

export const useCreateRingGroup = () => {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.admin.ringGroup.add.useMutation({
    retry: false,
  });

  const addRingGroup = (
    input: ICreateRingGroupInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(data, variables, context) {
        utils.admin.ringGroup.list.invalidate();
        opts?.onSuccess && opts.onSuccess(data, variables, context);
      },
    });
  };

  return {
    isFetching: isPending,
    addRingGroup,
  };
};
