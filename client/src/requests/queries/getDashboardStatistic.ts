import { RouterInputs, RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IGetDashboardStatisticInput = RouterInputs["dashboard"]["statistic"];

export type IGetDashboardStatisticOutput =
  RouterOutputs["dashboard"]["statistic"];

export const useDashboardStatistic = (
  props: Omit<IGetDashboardStatisticInput, "timeZone">
) => {
  const { data, isFetching, refetch } = trpc.dashboard.statistic.useQuery(
    { ...props, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
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
    data,
  };
};
