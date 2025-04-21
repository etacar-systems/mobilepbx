import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IGetCallMetricsInput =
  RouterInputs['dashboard']['callMetrics'];

export const useCallMetrics = (
  props: Omit<IGetCallMetricsInput, 'timeZone'>
) => {
  const { data, isFetching, refetch } =
    trpc.dashboard.callMetrics.useQuery({
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
    callMetrics: data,
  };
};
