import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IGetChatCredentialsInput =
  RouterInputs["superAdmin"]["chat"]["settings"]["credentials"];

export const useChatCredentials = (
  props: Partial<IGetChatCredentialsInput>
) => {
  const { data, isFetching, refetch } =
    trpc.superAdmin.chat.settings.credentials.useQuery(undefined, {
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
