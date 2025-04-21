import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";

import { publicProcedure, ITokenPayload } from "../../../utils/trpc";
import { config } from "../../../config";

import role from "../../../models/role";
import user from "../../../models/user";
import user_tokens from "../../../models/user_tokens";

export const adminProcedure = publicProcedure.use(
  async ({ ctx, next }) => {
    const { req } = ctx;

    const token = req.header("Authorization")?.split(" ")[1];
    if (token) {
      const decodedToken: ITokenPayload = jwt.verify(
        token,
        config.key.secret_key
      ) as ITokenPayload;

      const storedToken = await user_tokens.findOne({
        token: token,
        uid: decodedToken?.uid,
      });

      if (!storedToken) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const admin = await user.findOne(
        {
          _id: storedToken.uid,
          is_deleted: 0,
        },
        "-password"
      );

      if (!admin) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const admin_role = await role.findById(admin.role);
      if (admin_role?.type === 2) {
        return next({ ctx: { admin } });
      }

      throw new TRPCError({ code: "FORBIDDEN" });
    } else {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }
);
