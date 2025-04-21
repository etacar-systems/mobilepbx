import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";
import { IListPSTNNumberInput } from "../queries";

type IUpdatePSTNNumberInput = RouterInputs["superAdmin"]["pstn"]["update"];

export const useUpdatePSTNNumber = ({
  limit = 10,
  page = 1,
  ...props
}: IListPSTNNumberInput) => {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.superAdmin.pstn.update.useMutation({
    retry: false,
  });

  const updatePSTNNumber = (
    input: IUpdatePSTNNumberInput,
    opts?: Parameters<typeof mutate>[1]
  ) => {
    mutate(input, {
      ...opts,
      onSuccess(response, variables, context) {
        utils.superAdmin.pstn.list.setData(
          { ...props, limit, page },
          (data) => {
            if (data) {
              const currentIndex = data.data.findIndex((number) => number.pstn_range_uuid === input.uuid);

              if (data.data[currentIndex]) {
                data.data[currentIndex] = {
                  ...data.data[currentIndex],
                  gateway_id: input.gateway_id,
                  company_name: response?.companyName || "",
                  trunk_name: response?.trunkName || "",
                  cid: input.company_id,
                }

                return data;
              }
            
            }
          }
        );
        opts?.onSuccess && opts.onSuccess(response, variables, context);
      },
    });
  };

  return {
    isFetching: isPending,
    updatePSTNNumber,
  };
};
