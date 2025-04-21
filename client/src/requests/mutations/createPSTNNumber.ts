import { RouterInputs, RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type ICreatePSTNNumberInput = RouterInputs["superAdmin"]["pstn"]["add"];
export type ICreatePSTNNumberOutput = RouterOutputs["superAdmin"]["pstn"]["add"];

export const useCreatePSTNNumber = () => {
  const utils = trpc.useUtils()
  const { mutate, isPending } = trpc.superAdmin.pstn.add.useMutation({
    retry: false,
  });

  const addPSTNNumber = (
    input: ICreatePSTNNumberInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(data, variables, context) {
        utils.superAdmin.pstn.list.invalidate()
        opts?.onSuccess && opts.onSuccess(data, variables, context);
      }
    });
  };

  return {
    isFetching: isPending,
    addPSTNNumber,
  };
};
