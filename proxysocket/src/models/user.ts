import mongoose, { Document, Schema } from "mongoose";

export const userStatuses = ['online', 'available', 'away', 'busy', 'lunch', 'vacation', 'other'] as const;

export interface User {
  cid: String;
  first_name: String;
  last_name: String;
  password: String;
  user_image: String;
  is_deleted: Number;
  user_custome_msg: String;
  is_online: Number;
  last_seen: Date;
  user_devices: Number;
  user_extension:String;
  user_email:String;
  conversation_deleted_users: String;
  status: typeof userStatuses,
}

export interface UserModel extends User, Document { }

const UserSchema: Schema = new Schema({
  cid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    default:null
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
    default: null
  },
  user_devices: {
    type: Number,
    default: 0
  },
  user_extension:{
    type: String,
    default: "",
  },
  user_email:{
    type:String,
    required: "user_email is required",
  },
  status: {
    type: String,
    enum: userStatuses,
    default: 'online'
  },
  conversation_deleted_users: [{
    type: String
  }],
},
  {
    timestamps: true,
  });

export default mongoose.model<UserModel>("user", UserSchema);


