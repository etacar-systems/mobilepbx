import mongoose, { Schema, Document } from "mongoose";

interface message_setting_users {
  cid: String;
  uid: String;
  message_disappear_type: Number;
  isgroup: Number;
  recevier_id: String;
  group_id: String;
  message_dissapear_time: any;
}

export interface message_disappearModel extends message_setting_users, Document { }

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
    message_disappear_type: {
      type: Number,
      required: "message_disappear_type is required"
    },
    isgroup: {
      type: Number,
      require: "isgroup id required"
    },
    recevier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
      default: null
    },
    message_dissapear_time: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<message_disappearModel>("message_setting_users", prepSchema);