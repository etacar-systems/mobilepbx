import mongoose, { Document, Schema } from "mongoose";

export interface System_recording {
  record_name: String;
  description: String;
  record_url: String;
}

export interface SystemRecodModal extends System_recording, Document {}

const recordSchema: Schema = new Schema(
  {
    record_name: {
      type: String,
      required: "Record name is required",
    },
    description: {
      type: String,
      required: "Record description is required",
    },
    record_url: {
      type: String,
      required: "Record URL is required",
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

export default mongoose.model<SystemRecodModal>("system_record", recordSchema);
