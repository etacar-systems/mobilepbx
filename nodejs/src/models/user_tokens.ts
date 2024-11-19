import mongoose, { Schema, Document } from "mongoose";

export interface user_tokens {
  uid: String;
  subscriber_id: Number;
  token: String;
  refresh_token: String;
  device_id: String;
  push_token: String;
  device_name: String;
  login_Time: any;
  osversion: Number;
  device_os_version: String;
  apns_push_token: String;
}

export interface User_tokensModel extends user_tokens, Document {}

const prepSchema: Schema = new Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: "uid is required",
    },
    subscriber_id: {
      type: Number,
      require: true,
    },
    token: {
      type: String,
      required: "token is required",
    },
    refresh_token: {
      type: String,
      default: "",
    },
    device_id: {
      type: String,
      default: "",
    },
    push_token: {
      type: String,
      default: "",
    },
    device_name: {
      type: String,
      default: "",
    },
    login_Time: {
      type: Date,
      default: null,
    },
    osversion: {
      type: Number,
      enum: [0, 1, 2, 3], //0 for enterprise login 1 for android and 2 for ios 3 for desktop
      default: 0,
    },
    device_os_version: {
      type: String,
      default: "",
    },
    apns_push_token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User_tokensModel>("user_tokens", prepSchema);
