import mongoose from "mongoose";
import user_tokens from "../models/user_tokens";
import user from "../models/user";
import user_admin from "../models/user_admin";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config";

const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
        jwt.verify(token,
            config.key.secret_key,
            async function (err, decoded: any) {
                if (err) {
                    res.send({
                        success: 2,
                        message: "JWT malformed."
                    })
                } else {
                    const user_token = await user_tokens.findOne({
                        token: token,
                        uid: decoded?.uid
                    });
                    if (!user_token) {
                        return res.send({
                            success: 2,
                            message: "Authentication failed"
                        })
                    }
                    const temp_user = await user_admin.findOne({
                        _id: decoded?.uid,
                        user_password: decoded?.user_password,
                        is_deleted: 0
                    });
                    if (!temp_user) {
                        return res.send({
                            success: 2,
                            message: "Authentication failed"
                        })
                    } else {
                        next();
                    }
                }
            });
    } else {
        return res.send({
            success: 2,
            message: "Token missing"
        })
    }
};

export default authAdmin;