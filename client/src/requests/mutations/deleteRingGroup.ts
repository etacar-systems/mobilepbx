import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

import { IListRingGroupsInput } from "../queries";
type IDeleteRingGroupInput = RouterInputs["admin"]["ringGroup"]["delete"];

export const useDeleteRingGroup = ({
  limit = 10,
  page = 1,
  ...props
}: IListRingGroupsInput) => {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.admin.ringGroup.delete.useMutation({
    retry: false,
  });

  const deleteRingGroup = (
    input: IDeleteRingGroupInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(response, variables, context) {
        utils.admin.ringGroup.list.setData(
          { ...props, page, limit },
          (data) => {
            if (data) {
              return {
                ...data,
                data: data.data.filter(
                  (number) => number.ring_group_uuid !== input.uuid
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
    deleteRingGroup,
  };
};
