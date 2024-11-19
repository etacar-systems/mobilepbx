import mongoose, { Schema, Document } from "mongoose";

export interface Extension {
  pstn_number: String;
  user_type: String;
  extension_number: String;
  first_name: String;
  last_name: String;
  password: String;
  email: String;
  mobile: String;
  country: String;
  is_deleted: Number;
  extension_uuid: String;
  cid: String;
}

export interface ExtensionModel extends Extension, Document {}

const prepSchema: Schema = new Schema(
  {
    pstn_number: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pstn_number",
      default: null,
    },
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    user_type: {
      type: Number,
      enum: [1, 2, 3], //1 for user 2 for admin 3 for super admin
      default: 1,
    },
    extension_number: {
      type: String,
      required: "extension_number is required",
    },
    extension_uuid: {
      type: String,
      required: "extension_uuid is required",
    },
    first_name: {
      type: String,
      required: "first_name is required",
    },
    last_name: {
      type: String,
      required: "last_name is required",
    },
    password: {
      type: String,
      required: "password is required",
    },
    email: {
      type: String,
      required: "email is required",
    },
    mobile: {
      type: String,
      required: "mobile is required",
    },
    country: {
      type: String,
      required: "country is required",
    },
    is_deleted: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ExtensionModel>("extension", prepSchema);
