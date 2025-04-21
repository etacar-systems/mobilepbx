import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

type IGetVideoURLInput = RouterInputs["superAdmin"]["video"]["getUrl"];

export const useGetVideoURL = ({ section }: Partial<IGetVideoURLInput>) => {
  const { data, isFetching, refetch, isSuccess } =
    trpc.superAdmin.video.getUrl.useQuery(
      {
        section: (section || "") as IGetVideoURLInput["section"],
      },
      {
        enabled: !!section,
        refetchInterval: false,
        refetchOnMount: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        // retryDelay: false
      }
    );

  return {
    refetch,
    isFetching,
    url:
      data && isSuccess ? process.env.REACT_APP_API_BASE_URL + data : undefined,
  };
};
