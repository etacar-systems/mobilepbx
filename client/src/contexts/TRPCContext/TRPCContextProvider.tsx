import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import Cookies from "js-cookie";

import { trpc } from "../../utils/trpc";

export const TRPCContextProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: process.env.REACT_APP_API_BASE_URL + "trpc/",

          async headers(opts) {
            return {
              authorization: Cookies.get("Token")
                ? `Bearer ${Cookies.get("Token")}`
                : undefined,
                accept: "application/json"
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
