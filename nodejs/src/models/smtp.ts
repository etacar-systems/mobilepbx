import mongoose, { Document, Schema } from "mongoose";

export interface SMTP {
  provider:string;
  smtp_server: string;
  is_auth: number;
  user_name: string;
  password: string;
  smtp_port:string;
  auth_method: number;
  start_tls: number;
  tls: number;
  sendgrid_token:string;
  sendgrid_auth:Number;
}

export interface SMTPModel extends SMTP, Document {}

const SMTPSchema: Schema = new Schema(
  {
    provider: {
      type: String,
      default: "",
    },
    smtp_server: {
      type: String,
      required: true,
    },
    is_auth: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    user_name: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    smtp_port:{
      type:String,
      required: true,
    },
    auth_method: {
      type: Number,
      enum: [1, 2, 3], //1 for none 2 for login 3 for crmmd5f
      default:1,
    },
    start_tls: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    sendgrid_token: {
      type: String,
      default: "",
    },
    sendgrid_auth:{
      type: Number,
      enum:[0,1], //0 for disabled 1 for enabled
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<SMTPModel>("smtp", SMTPSchema);
