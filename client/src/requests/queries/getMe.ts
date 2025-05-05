import { RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

export type TUser = RouterOutputs['agent']['me']

export const useMe = () => {
  const { data, isFetching, refetch } = trpc.agent.me.useQuery(
    undefined,
    {
      refetchInterval: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      retryOnMount: false,
      suspense: true,
    }
  );

  return {
    refetch,
    isFetching,
    me: data,
  };
};

