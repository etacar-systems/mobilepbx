import mongoose, { Document, Schema, model } from 'mongoose';

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
}

// Create the schema for the CDR
const CdrSchema = new Schema<CdrDocument>(
  {
    xml_cdr_uuid: { type: String, required: true },
    domain_name: { type: String, required: true },
    domain_uuid: { type: String, required: true },
    sip_call_id: { type: String, required: true },
    extension_uuid: { type: String, required: true },
    direction: { type: String, required: true },
    caller_id_name: { type: String, required: true },
    caller_id_number: { type: String, required: true },
    destination_number: { type: String, required: true },
    start_stamp: { type: Date, required: true },
    duration: { type: Number, required: true },
    record_name: { type: String, default: null },
    status: { type: String, required: true },
    hangup_cause: { type: String, required: true },
    module_name: { type: String, required: true },
    recording_url: { type: String, default: null },
  },
  {
    collection: 'cdrs', // Explicitly set the collection name
    timestamps: false, // Disable createdAt and updatedAt timestamps
  }
);

// Create and export the model
const CdrModel = model<CdrDocument>('Cdr', CdrSchema);
export default CdrModel;
