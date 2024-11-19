import mongoose from "mongoose";
import user_tokens from "../models/user_tokens";
import user from "../models/user";
import { Request } from "express";

interface userData{
    uid:string;
    cid:string;
  }

const User_token = async (token:any)=>{
    const get_user_detail_token = await user_tokens.findOne({
        token:token
    })
    if (!get_user_detail_token) {
        return undefined;
    }
    const get_user_detail = await user.findOne({
        _id:get_user_detail_token?.uid
    })
    if(get_user_detail){
        const user_data:userData={
            uid: get_user_detail?._id as string,
            cid: get_user_detail?.cid as string
        }
        return user_data
    }
    return undefined;
} 

export default User_token;