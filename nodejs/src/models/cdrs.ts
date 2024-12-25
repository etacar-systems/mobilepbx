import mongoose, { Document, Schema, model } from "mongoose";

// Define the interface for the CDR document
export interface CdrDocument extends Document {
  xml_cdr_uuid: string;
  domain_name: string;
  domain_uuid: string;
  sip_call_id: string;
  extension_uuid: string;
  direction: string;
  caller_id_name: string;
  caller_id_number: string;
  destination_number: string;
  start_stamp: Date;
  duration: number;
  record_name?: string | null;
  status: string;
  hangup_cause: string;
  module_name: string;
  recording_url?: string | null;
  call_raw_data?: string | null;
}

// Create the schema for the CDR
const CdrSchema = new Schema<CdrDocument>(
  {
    xml_cdr_uuid: { type: String, required: false },
    domain_name: { type: String, required: false },
    domain_uuid: { type: String, required: false },
    sip_call_id: { type: String, required: false },
    extension_uuid: { type: String, required: false },
    direction: { type: String, required: false },
    caller_id_name: { type: String, required: false },
    caller_id_number: { type: String, required: false },
    destination_number: { type: String, required: false },
    start_stamp: { type: Date, required: false },
    duration: { type: Number, required: false },
    record_name: { type: String, default: null },
    status: { type: String, required: false },
    hangup_cause: { type: String, required: false },
    module_name: { type: String, required: false },
    recording_url: { type: String, default: null },
    call_raw_data: { type: String, default: null },
  },
  {
    collection: "cdrs", // Explicitly set the collection name
    timestamps: false, // Disable createdAt and updatedAt timestamps
    strict: false,
  }
);

// Create and export the model
const CdrModel = model<CdrDocument>("Cdr", CdrSchema);
export default CdrModel;
