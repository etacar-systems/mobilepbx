import mongoose, { Schema, Document } from "mongoose";

interface broadcast_users {
  cid: String;
  uid: String;
  broadcast_name: String;
  broadcast_users: String[];
  last_message: String;
  last_message_time: Date;
  last_media_type: Number;
}

export interface broadcast_usersModel extends broadcast_users, Document {}

const prepSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: "cid is required",
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: "uid is required",
    },
    broadcast_name: {
      type: String,
      required: "broadcast_name",
    },
    broadcast_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: "broadcast_users is required",
      },
    ],
    last_message: {
      type: String,
      default: "",
    },
    last_message_time: {
      type: Date,
      default: null,
    },
    last_media_type: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<broadcast_usersModel>(
  "broadcast_users",
  prepSchema
);
