import mongoose, { Schema, Document } from "mongoose";

interface broadcast_conversation {
  cid: String;
  broadcast_id: String;
  sender_id: String;
  originalName: String;
  message: String;
  message_type: Number;
  media_type: Number;
  delivery_type: Number;
  reply_message_id: String;
  schedule_time: Date;
  block_message_users: String[];
  delete_message_users: String[];
  is_deleted: Number;
}

export interface broadcast_conversationModel
  extends broadcast_conversation,
    Document {}

const prepSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: "cid is required",
    },
    broadcast_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "broadcast_users",
      required: "broadcast_id is required",
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: "sender_id is required",
    },
    originalName: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    message_type: {
      type: Number,
      default: 0,
    },
    media_type: {
      type: Number,
      default: 0,
    },
    delivery_type: {
      type: Number,
      default: 1,
    },
    reply_message_id: {
      type: String,
      default: "",
    },
    schedule_time: {
      type: Date,
      default: null,
    },
    block_message_users: [
      {
        type: String,
      },
    ],
    delete_message_users: [
      {
        type: String,
      },
    ],
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<broadcast_conversationModel>(
  "broadcast_conversation",
  prepSchema
);
