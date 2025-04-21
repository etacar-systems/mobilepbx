import { RouterInputs, RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IGetMissedCallsMetricsInput =
  RouterInputs['dashboard']['missedCalls'];

export type IGetMissedCallsMetricsOutput =
  RouterOutputs['dashboard']['missedCalls'];

export const useMissedCallsMetrics = (
  props: Omit<IGetMissedCallsMetricsInput, 'timeZone'>
) => {
  const { data, isFetching, refetch } =
    trpc.dashboard.missedCalls.useQuery({
      ...props,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }, {
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
    data,
  };
};
