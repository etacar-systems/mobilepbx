import { useEffect, useState } from "react";

import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

export type IListPSTNNumberInput = RouterInputs["superAdmin"]["pstn"]["list"];

export const useListPSTNNumber = ({
  page = 1,
  limit = 10,
  search,
  cid,
  sort_column,
  sort_direction,
}: IListPSTNNumberInput) => {
  const [pages, setPages] = useState<{
    total_page_count: number;
    pstn_total_counts: number;
  }>({
    total_page_count: 0,
    pstn_total_counts: 0,
  });
  const { data, isFetching } = trpc.superAdmin.pstn.list.useQuery(
    {
      page,
      search,
      cid,
      limit,
      sort_column,
      sort_direction,
    },
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

  useEffect(() => {
    if (!data?.total_page_count || !data?.pstn_total_counts) return;

    setPages({
      total_page_count: data.total_page_count,
      pstn_total_counts: data.pstn_total_counts,
    });
  }, [pages, data?.total_page_count, data?.pstn_total_counts]);

  return {
    isFetching,
    data: {
      ...(data || {}),
      ...pages,
    },
  };
};
