import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import user_block from "../../models/user_block";
import User_token from "../../helper/helper";
import get_token from "../../helper/userHeader";


const getAllRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = get_token(req);
    const user_detail = await User_token(token);
    if (user_detail?.uid) {
      const blockData = await user_block.find({
        cid: user_detail?.cid,
        block_by: user_detail?.uid,
      });
      return res.status(200).send({
        success: 1,
        message: "block users data....",
        blockData: blockData,
      });
    } else {
      return res.status(400).send({
        success: 0,
        message: "some params missing",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}

const updateBlockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = get_token(req);
    const user_detail = await User_token(token);
    let data: any = req.body;
    let cid: any = user_detail?.cid;
    let block_by: any = user_detail?.uid;
    let block_id: any = data.block_id;
    let status: any = data.status;
  
    if (block_id && status !== null && block_by) {
      if (data.status) {
        const post = new user_block();
        post.cid = cid;
        post.block_by = block_by;
        post.block_id = block_id;
        await post.save();
        return res.status(200).send({
          success: 1,
          message: "Block Successfully",
          post,
        });
      } else {
        const post = await user_block.findOneAndDelete({
          block_by: block_by,
          block_id: block_id,
        });
        return res.status(200).send({
          success: 1,
          message: "Unblock Successfully",
          post,
        });
      }
    } else {
      return res.status(400).send({
        success: 0,
        message: "some params missing",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: 0,
      message: "Internal Server Error"
    });
  }
}

export default {
  updateBlockUser,
  getAllRecord
};