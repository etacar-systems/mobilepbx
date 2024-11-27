import mongoose, { Schema, Document } from "mongoose";

export interface Role {
  type: Number;
  name: String;
  is_deleted: Number;
}

export interface RoleModel extends Role, Document {}

const prepSchema: Schema = new Schema(
  {
    type: {
      type: Number,
      default: 0, // 1 --> user | 2 --> admin  | 3 --> super admin
    },
    name: {
      type: String,
      default: "",
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<RoleModel>("role", prepSchema);
