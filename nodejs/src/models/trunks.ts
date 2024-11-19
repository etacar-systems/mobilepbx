import mongoose, { Schema, Document } from "mongoose";

export interface Trunks {
  gateway_name: String;
  cid: String;
  username: String;
  password: String;
  realm: String;
  from_user: String;
  proxy: String;
  expire_seconds: String;
  retry_seconds: String;
  register: boolean;
  profile: String;
  context: String;
  gateway_enabled: Boolean;
  description: String;
  trunks_uuid: String;
  is_deleted: Number;
  last_updated_user: String;
  transport: String;
}

export interface TrunksModel extends Trunks, Document {}

const prepSchema: Schema = new Schema(
  {
    gateway_name: {
      type: String,
      default: "",
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    cid: {
      type: mongoose.Schema.ObjectId,
      ref: "company",
      default: null,
    },
    username: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    realm: {
      type: String,
      default: "",
    },
    from_user: {
      type: String,
      default: "",
    },
    proxy: {
      type: String,
      default: "",
    },
    expire_seconds: {
      type: String,
      default: "",
    },
    retry_seconds: {
      type: String,
      default: "",
    },
    register: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default: "",
    },
    context: {
      type: String,
      default: "",
    },
    gateway_enabled: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
    },
    trunks_uuid: {
      type: String,
      default: "",
    },
    transport: {
      type: String,
      default: "",
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

export default mongoose.model<TrunksModel>("trunks", prepSchema);
