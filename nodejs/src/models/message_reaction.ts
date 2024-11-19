import mongoose, { Schema, Document } from "mongoose";

export interface user_block {
  cid: String;
  uid: String;
  user_name: String;
  user_image: String;
  user_extension: String;
  message_id: String;
  reaction: String;
  isGroup: Number;
}

export interface Message_ReactionModel extends user_block, Document {}
const prepSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "enterprise",
      required: "cid is required",
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: "uid is required",
    },
    user_name: {
      type: String,
      required: "user_name is required",
    },
    user_image: {
      type: String,
      default: "",
    },
    user_extension: {
      type: String,
      default: "",
    },
    message_id: {
      type: String,
      required: "message_id is required",
    },
    reaction: {
      type: String,
      required: "reaction is required",
    },
    isGroup: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Message_ReactionModel>(
  "message_reaction",
  prepSchema
);
