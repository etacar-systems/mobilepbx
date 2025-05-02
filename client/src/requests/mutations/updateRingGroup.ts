import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";
import { IListRingGroupsInput } from "../queries";

type IUpdateRingGroupInput = RouterInputs["admin"]["ringGroup"]["update"];

export const useUpdateRingGroup = (props?: IListRingGroupsInput) => {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.admin.ringGroup.update.useMutation({
    retry: false,
  });

  const updateRingGroup = (
    input: IUpdateRingGroupInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(response, variables, context) {
        if (props) {
          utils.admin.ringGroup.list.setData(
            { ...props, limit: props.limit || 10, page: props.page || 1 },
            (data) => {
              if (data) {
                const currentIndex = data.data.findIndex(
                  (number) => number.ring_group_uuid === input.uuid
                );

                if (data.data[currentIndex]) {
                  data.data[currentIndex] = {
                    ...data.data[currentIndex],
                    ring_group_name: input.name,
                    ring_group_extension: input.extension,
                    ring_group_description: input.description,
                  };

                  return data;
                }
              }
            }
          );
        }
        utils.ringGroup.details.invalidate(
          { uuid: input.uuid },
          {
            refetchType: "none",
          }
        );
        opts?.onSuccess && opts.onSuccess(response, variables, context);
      },
    });
  };

  return {
    isFetching: isPending,
    updateRingGroup,
  };
};
