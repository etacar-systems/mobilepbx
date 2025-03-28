import { PropsWithChildren } from "react";

import { AuthenticatedLayout } from "../layouts";

export const Protected = ({ children }: PropsWithChildren) => {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
