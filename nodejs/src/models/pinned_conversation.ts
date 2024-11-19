import mongoose, { Schema, Document } from "mongoose";

export interface user_block {
  cid: String;
  pin_by: Number;
  pin_to: String;
  pin_time: String;
  pin_status: Number;
}

export interface User_blockModel extends user_block, Document {}
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
    pin_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: "pin_to is required",
    },
    pin_time: {
      type: Date,
      default: null,
    },
    pin_status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User_blockModel>(
  "pinned_conversation",
  prepSchema
);
