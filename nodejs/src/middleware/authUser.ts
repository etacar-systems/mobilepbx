import user_tokens from "../models/user_tokens";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import user from "../models/user";

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    jwt.verify(token, config.key.secret_key, async function (err, decoded) {
      if (err) {
        res.send({
          success: 2,
          message: "JWT malformed.",
        });
      } else {
        const user_token_check = await user_tokens.findOne({
          token: token,
        });

        if (!user_token_check) {
          return res.send({
            success: 2,
            message: "Authentication failed",
          });
        } else {
          // @ts-ignore
          req.user_id = user_token_check.uid,
          next();
        }
      }
    });
  } else {
    return res.send({
      success: 2,
      message: "Token missing",
    });
  }
};

export default authUser;
