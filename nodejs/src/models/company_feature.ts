import mongoose, { Schema, Document } from "mongoose";

interface Feature {
  enable: Boolean;
  type_value: String;
}

interface CompanyFeatures extends Document {
  cid: String;
  hex_code: String;
  pbx: Boolean;
  extension: Boolean;
  ring_group: Boolean;
  conference: Boolean;
  video_call: Boolean;
  ivr: Boolean;
  speech_to_text: Boolean;
  phone_in_browser: Boolean;
  voicemail: Boolean;
  callback: Boolean;
  record_calls: Boolean;
  reportage: Boolean;
  monitoring: Boolean;
  caller_id: Boolean;
  time_controls: Boolean;
  whatsapp: Boolean;
  calendar_integration: Boolean;
  text_to_speech: Boolean;
  virtual_assistant: Boolean;
  is_deleted: Number;
  last_updated_user: String;
}

const featureSchema = new Schema(
  {
    enable: { type: Boolean, default: false },
    type_value: { type: String, default: "" },
  },
  {
    _id: false,
  }
);

const CompanyFeaturesSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    hex_code: {
      type: String,
      default: "",
    },
    pbx: { type: Boolean, default: true },
    extension: { type: Boolean, default: true },
    ring_group: { type: Boolean, default: true },
    conference: { type: Boolean, default: true },
    video_call: { type: Boolean, default: true },
    ivr: { type: Boolean, default: true },
    speech_to_text: { type: Boolean, default: true },
    phone_in_browser: { type: Boolean, default: true },
    voicemail: { type: Boolean, default: true },
    callback: { type: Boolean, default: true },
    record_calls: { type: Boolean, default: true },
    reportage: { type: Boolean, default: true },
    monitoring: { type: Boolean, default: true },
    caller_id: { type: Boolean, default: true },
    time_controls: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true },
    calendar_integration: { type: Boolean, default: true },
    text_to_speech: { type: Boolean, default: true },
    virtual_assistant: { type: Boolean, default: true },
    is_deleted: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const CompanyFeaturesModel = mongoose.model<CompanyFeatures>(
  "company_features",
  CompanyFeaturesSchema
);
