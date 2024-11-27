import mongoose, { Schema, Document } from "mongoose";

export interface user_block {
  cid: String;
  pin_by: Number;
  receiver_id: any;
  group_id: any;
  pin_status: Number;
  pin_message_id: any;
  isgroup: Number;
  pin_time: Date;
}

export interface User_blockModel extends user_block, Document { }
const prepSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "enterprise",
      required: "cid is required",
    },
    pin_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: "pin_by is required",
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
      default: null
    },
    pin_message_id: {
      type: String,
      required: "pin_message_id is required",
    },
    isgroup: {
      type: Number,
      required: "isgroup is required",
    },
    pin_time: {
      type: Date,
      default: null,
    },
    pin_status: {
      type: Number,
      required: "pin_status is required",
    }
  },
  {
    timestamps: true,
  }
)


export default mongoose.model<User_blockModel>("pinned_message", prepSchema)