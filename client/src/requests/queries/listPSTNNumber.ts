import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

export type IListPSTNNumberInput = RouterInputs["superAdmin"]["pstn"]["list"];

export const useListPSTNNumber = ({
  page = 1,
  limit = 10,
  search,
  cid,
  sort_column,
  sort_direction,
}: IListPSTNNumberInput) => {
  const { data, isFetching } = trpc.superAdmin.pstn.list.useQuery(
    {
      page,
      search,
      cid,
      limit,
      sort_column,
      sort_direction,
    },
    {
      // enabled: !!cid,
      refetchInterval: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      retryOnMount: false,
    }
  );

  return {
    isFetching,
    data,
  };
};
