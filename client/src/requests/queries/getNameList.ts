import { RouterOutputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

export type IKeys =
  | "extension"
  | "ivr"
  | "ringGroup"
  | "conference"
  | "recording"
  | "dialplan";
export type TExtensionNamesOutputs = RouterOutputs["extension"]["namelist"];

export const useNameListQuery = (props: { key: IKeys; enabled?: boolean }) => {
  const { data, isFetching, refetch } = trpc[props.key as "extension"].namelist.useQuery(
    undefined,
    {
      enabled: props.enabled !== false,
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
