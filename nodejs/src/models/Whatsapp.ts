import mongoose, { Schema, Document } from "mongoose";

export interface whatsapp {
  cid: String;
  agent_id: String;
  user_name: String;
  sender_id: String;
  receiver_id: String;
  message_id: String;
  message: any;
  message_type: Number;
  media_type: Number;
  delivery_type: Number;
  reply_message_id: String;
  block_message_users: String[];
  delete_message_users: String[];
  is_deleted: Number;
  is_edited: Number;
  sent_time: String;
  deliverd_time: String;
  read_time: String;
  file_path: String;
}

export interface whatsappModel extends whatsapp, Document {}

const whatsappSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: "cid is required",
    },
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required: "agent_id is required",
      default: null,
    },
    sender_id: {
      type: String,
      required: "sender_id is required",
    },
    receiver_id: {
      type: String,
      required: "receiver_id is required",
    },
    user_name: {
      type: String,
      default: "",
    },
    message_id: {
      type: String,
      required: "message_id is required",
    },
    message: {
      type: Schema.Types.Mixed,
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
    is_edited: {
      type: Number,
      default: 0,
    },
    sent_time: {
      type: Date,
      default: "",
    },
    deliverd_time: {
      type: Date,
      default: "",
    },
    read_time: {
      type: Date,
      default: "",
    },
    file_path: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<whatsappModel>("whatsapp", whatsappSchema);
