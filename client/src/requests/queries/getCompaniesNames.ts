import { RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

export const useCompaniesNames = (
) => {
  const { data, isFetching, refetch } =
    trpc.company.namesList.useQuery(undefined, {
      refetchInterval: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      retryOnMount: false,
    });

  return {
    refetch,
    isFetching,
    names: data,
  };
};

export type IGetCompaniesNamesOutput = RouterOutputs["company"]["namesList"];
