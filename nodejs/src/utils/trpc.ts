import { inferRouterInputs, inferRouterOutputs, initTRPC } from '@trpc/server'; 
import * as trpcExpress from '@trpc/server/adapters/express';

import { AppRouter } from '../routes/v2';

export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  // const session = await getSession({ req: opts.req });
 
  return {
    req,
    res,
  };
};
 
export type Context = Awaited<ReturnType<typeof createContext>>;
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

export interface ITokenPayload {
  uid: string,
  cid: string,
  iat: number
}

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
