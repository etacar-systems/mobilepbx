import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";

import { publicProcedure, ITokenPayload } from "../../../utils/trpc";
import { config } from "../../../config";

import role from "../../../models/role";
import user from "../../../models/user";
import user_tokens from "../../../models/user_tokens";

export const authorizedProcedure = publicProcedure.use(
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

      const existingUser: Record<
        "_doc",
        {
          _id: string;
          cid: string;
          pstn_number: null;
          last_updated_user: string;
          extension_uuid: string;
          first_name: string;
          last_name: string;
          user_image: string;
          is_deleted: number;
          user_custome_msg: string;
          is_online: number;
          last_seen: Date;
          user_devices: number;
          user_extension: string;
          user_email: string;
          conversation_deleted_users: [];
          role: string;
          mobile: string;
          country: string;
          user_record: boolean;
          createdAt: Date;
          updatedAt: Date;
        }
      > = await user.findOne(
        {
          _id: storedToken.uid,
          is_deleted: 0,
        },
        "-password"
      ) as any;

      if (!existingUser) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const userRole = await role.findById(existingUser._doc.role);
      if (
        userRole?.type === 3 ||
        userRole?.type === 2 ||
        userRole?.type === 1
      ) {
        return next({
          ctx: {
            user: {
              ...existingUser._doc,
              role:
                userRole?.type === 1
                  ? "agent"
                  : userRole?.type === 2
                  ? "admin"
                  : "superAdmin",
            },
          },
        });
      }

      throw new TRPCError({ code: "FORBIDDEN" });
    } else {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }
);
