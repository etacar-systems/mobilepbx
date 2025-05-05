import mongoose, { Document, Schema } from "mongoose";
import { Role } from "./role";

export const userStatuses = ['online', 'available', 'away', 'busy', 'lunch', 'vacation', 'other'] as const;

export interface User {
  cid: String;
  pstn_number: String;
  first_name: String;
  last_name: String;
  password: String;
  user_image: String;
  is_deleted: Number;
  user_custom_msg: String;
  is_online: Number;
  last_seen: Date;
  user_devices: Number;
  user_extension: String;
  user_email: String;
  conversation_deleted_users: String;
  role: Role;
  mobile: String;
  country: String;
  extension_uuid: String;
  last_updated_user: String;
  user_record: Boolean;
  status: typeof userStatuses;
}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    pstn_number: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pstn_number",
      default: null,
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    extension_uuid: {
      type: String,
      default: "",
    },
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    user_image: {
      type: String,
      default: "",
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
    user_custome_msg: {
      type: String,
      default: "",
    },
    is_online: {
      type: Number,
      default: 0,
    },
    last_seen: {
      type: Date,
      default: null,
    },
    user_devices: {
      type: Number,
      default: 0,
    },
    user_extension: {
      type: String,
      default: "",
    },
    user_email: {
      type: String,
      required: "user_email is required",
    },
    conversation_deleted_users: [
      {
        type: String,
      },
    ],
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      default: null,
    },
    mobile: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    user_record: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: userStatuses,
      default: 'online'
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserModel>("user", UserSchema);
