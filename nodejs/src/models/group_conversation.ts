import mongoose, { Document, Schema } from "mongoose";

export interface group_conversation {
  cid: String;
  group_id: String;
  sender_id: String;
  originalName: String;
  message: String;
  message_caption: String;
  message_type: Number;
  media_type: Number;
  delivery_type: Number;
  reply_message_id: String;
  schedule_time: any;
  block_message_users: String[];
  delete_message_users: String[];
  is_deleted: Number;
  message_reaction_users: any;
  message_dissapear_time: any;
  is_edited: Number;
}

export interface GroupconversationModel extends group_conversation, Document {}

const prepSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "enterprise",
      required: "cid is required",
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
      required: "group_id is required",
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
    message_caption: {
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
    message_reaction_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message_reaction",
        default: null,
      },
    ],
    message_dissapear_time: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<GroupconversationModel>(
  "group_conversation",
  prepSchema
);
