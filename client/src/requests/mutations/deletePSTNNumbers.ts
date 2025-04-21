import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

import { IListPSTNNumberInput } from "../queries";
type IDeletePSTNNumberInput = RouterInputs["superAdmin"]["pstn"]["delete"];

export const useDeletePSTNNumber = ({
  limit = 10,
  page = 1,
  ...props
}: IListPSTNNumberInput) => {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.superAdmin.pstn.delete.useMutation({
    retry: false,
  });

  const deletePSTNNumber = (
    input: IDeletePSTNNumberInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(response, variables, context) {
        utils.superAdmin.pstn.list.setData(
          { ...props, page, limit },
          (data) => {
            if (data) {
              return {
                ...data,
                data: data.data.filter(
                  (number) => number.pstn_range_uuid !== input.uuid
                ),
              };
            }
          }
        );
        opts?.onSuccess && opts.onSuccess(response, variables, context);
      },
    });
  };

  return {
    isFetching: isPending,
    deletePSTNNumber,
  };
};
