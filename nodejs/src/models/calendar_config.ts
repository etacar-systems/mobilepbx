import mongoose, { Schema, Document } from "mongoose";

export interface Calendarconfig {
  uid:String;
  cid:String;
  client_id: any;
  client_secret: any;
  redirect_uri: String;
  access_token:String;
  refresh_token:String;
  expires_at:any;
  name:String;
  description:String;
  auto_refresh:Number;
}

export interface CalendarconfigModel extends Calendarconfig, Document {}

const prepSchema: Schema = new Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: "uid is required",
    },
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: "uid is required",
    },
    client_id: {
      type: String,
      required:true
    },
    client_secret: {
      type: String,
      required:true
    },
    redirect_uri: {
      type: String,
      default:""
    },
    access_token:{
      type: String,
      default:""
    },
    refresh_token:{
      type: String,
      default:""
    },
    expires_at:{
      type:Date,
      default:null
    },
    name:{
      type:String,
      required:true
    },
    description:{
      type:String,
      default:""
    },
    auto_refresh:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<CalendarconfigModel>("calendar_config", prepSchema);
