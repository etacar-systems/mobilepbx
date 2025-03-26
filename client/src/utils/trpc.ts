import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '../../../nodejs/src/routes/v2';
 
// @ts-ignore
export const trpc = createTRPCReact<AppRouter>();
