import { RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

export const useTrunksNames = () => {
  const { data, isFetching, refetch } = trpc.trunk.namesList.useQuery(
    undefined,
    {
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
    refetch,
    isFetching,
    names: data,
  };
};

export type IGetTrunksNamesOutput = RouterOutputs["trunk"]["namesList"];
