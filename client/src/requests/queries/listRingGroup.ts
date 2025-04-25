import { useEffect, useState } from "react";

import { RouterInputs } from "../../contexts";
import { trpc } from "../../utils/trpc";

export type IListRingGroupsInput = RouterInputs["admin"]["ringGroup"]["list"];

export const useListRingGroups = ({
  limit = 10,
  page = 1,
  ...opts
}: IListRingGroupsInput) => {
  const [pages, setPages] = useState<{
    ring_group_total_counts: number;
    total_page_count: number;
  }>({
    ring_group_total_counts: 0,
    total_page_count: 0,
  });
  const { data, isFetching, refetch } = trpc.admin.ringGroup.list.useQuery(
    {
      limit,
      page,
      ...opts,
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
    if (!data?.total_page_count || !data?.ring_group_total_counts) return;

    setPages({
      total_page_count: data.total_page_count,
      ring_group_total_counts: data.ring_group_total_counts,
    });
  }, [pages, data?.total_page_count, data?.ring_group_total_counts]);

  return {
    refetch,
    isFetching,
    data: {
      ...(data || {}),
      ...pages,
    },
  };
};
