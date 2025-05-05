import { trpc } from "../../utils/trpc";

export const useAgentStatuses = () => {
  const { data, isFetching, refetch } = trpc.agent.status.list.useQuery(
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
    statuses: data,
  };
};

