import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IGetRingGroupDetailsInput = RouterInputs["ringGroup"]["details"];

export const useRingGroupDetails = ({ uuid }: Partial<IGetRingGroupDetailsInput>) => {
  const { data, isFetching, refetch } = trpc.ringGroup.details.useQuery(
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
    data: !isFetching ? data : undefined,
  };
};
