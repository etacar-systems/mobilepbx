import { PropsWithChildren, Suspense } from "react";

import { AuthenticatedLayout } from "../layouts";
import { MeContextProvider } from "../contexts";

export const Protected = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<></>}>
      <MeContextProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </MeContextProvider>
    </Suspense>
  );
};
