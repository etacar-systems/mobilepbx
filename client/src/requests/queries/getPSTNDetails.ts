import { RouterInputs, RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IGetPSTNDetailsInput = RouterInputs["superAdmin"]["pstn"]["detail"];

export type IGetPSTNDetailsOutput =
  RouterOutputs["dashboard"]["statistic"];

export const usePSTNDetails = ({ uuid }: Partial<IGetPSTNDetailsInput>) => {
  const { data, isFetching, refetch } = trpc.superAdmin.pstn.detail.useQuery(
    { uuid: uuid || '' },
    {
      enabled: !!uuid,
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
