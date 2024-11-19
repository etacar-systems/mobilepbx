import mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface assigend {
  cid: String;
  assigned_id: String;
  receiver_id: String;
}

export interface assignedModal extends assigend, Document {}

const AssignSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    assigned_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    receiver_id: {
      type: String,
      required: "receiver_id is required",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<assignedModal>("user_assigned", AssignSchema);
