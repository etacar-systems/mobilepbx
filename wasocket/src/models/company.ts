import mongoose, { Schema, Document } from "mongoose";

export interface Company {
  company_name: String;
  company_street_address: String;
  company_zipcode: String;
  company_city: String;
  company_country: String;
  company_vat: String;
  company_contact_person: String;
  company_password: String;
  company_email: String;
  company_phone_number: String;
  is_deleted: Number;
  assigned_pstn_pool: String;
  domain_name: String;
  domain_uuid: String;
  hex_code: String;
  pbx: Boolean;
  pbx_count: Number;
  extension: Boolean;
  extension_count: Number;
  ring_group: Boolean;
  ring_group_count: Number;
  conference: Boolean;
  conference_count: Number;
  video_call: Boolean;
  video_call_count: Number;
  ivr: Boolean;
  ivr_count: Number;
  speech_to_text: Boolean;
  speech_to_text_count: Number;
  phone_in_browser: Boolean;
  phone_in_browser_count: Number;
  voicemail: Boolean;
  voicemail_count: Number;
  callback: Boolean;
  callback_count: Number;
  record_calls: Boolean;
  record_calls_count: Number;
  reportage: Boolean;
  reportage_count: Number;
  monitoring: Boolean;
  monitoring_count: Number;
  caller_id: Boolean;
  caller_id_count: Number;
  time_controls: Boolean;
  time_controls_count: Number;
  whatsapp: Boolean;
  whatsapp_count: Number;
  calendar_integration: Boolean;
  calendar_integration_count: Number;
  text_to_speech: Boolean;
  text_to_speech_count: Number;
  virtual_assistant: Boolean;
  virtual_assistant_count: Number;
  small_logo: String;
  logo_text: String;
  dark_small_logo: String;
  dark_logo_text: String;
  last_updated_user: String;
  whatsapp_accessToken: String;
  whatsapp_number: String;
  whatsapp_phone_number_id: String;
}

export interface CompanyModel extends Company, Document {}

const prepSchema: Schema = new Schema(
  {
    company_name: {
      type: String,
      default: "",
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    domain_name: {
      type: String,
      required: "Domain name is requried",
    },
    domain_uuid: {
      type: String,
      required: "Domain name is requried",
    },
    company_street_address: {
      type: String,
      default: "",
    },
    company_zipcode: {
      type: String,
      default: "",
    },
    company_city: {
      type: String,
      default: "",
    },
    company_country: {
      type: String,
      default: "",
    },
    company_vat: {
      type: String,
      default: "",
    },
    company_contact_person: {
      type: String,
      default: "",
    },
    company_password: {
      type: String,
      required: "company_password is required",
    },
    company_email: {
      type: String,
      default: "",
    },
    company_phone_number: {
      type: String,
      default: "",
    },
    is_deleted: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    isassign_pstn: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    assigned_pstn_pool: {
      type: String,
      default: "",
    },
    hex_code: {
      type: String,
      default: "",
    },
    pbx: {
      type: Boolean,
      default: true,
    },
    pbx_count: {
      type: Number,
      default: 1,
    },
    extension: {
      type: Boolean,
      default: true,
    },
    extension_count: {
      type: Number,
      default: 0,
    },
    ring_group: {
      type: Boolean,
      default: true,
    },
    ring_group_count: {
      type: Number,
      default: 0,
    },
    conference: {
      type: Boolean,
      default: true,
    },
    conference_count: {
      type: Number,
      default: 0,
    },
    video_call: {
      type: Boolean,
      default: true,
    },
    video_call_count: {
      type: Number,
      default: 1,
    },
    ivr: {
      type: Boolean,
      default: true,
    },
    ivr_count: {
      type: Number,
      default: 0,
    },
    speech_to_text: {
      type: Boolean,
      default: true,
    },
    speech_to_text_count: {
      type: Number,
      default: 1,
    },
    phone_in_browser: {
      type: Boolean,
      default: true,
    },
    phone_in_browser_count: {
      type: Number,
      default: 1,
    },
    voicemail: {
      type: Boolean,
      default: true,
    },
    voicemail_count: {
      type: Number,
      default: 1,
    },
    callback: {
      type: Boolean,
      default: true,
    },
    callback_count: {
      type: Number,
      default: 1,
    },
    record_calls: {
      type: Boolean,
      default: true,
    },
    record_calls_count: {
      type: Number,
      default: 1,
    },
    reportage: {
      type: Boolean,
      default: true,
    },
    reportage_count: {
      type: Number,
      default: 0,
    },
    monitoring: {
      type: Boolean,
      default: true,
    },
    monitoring_count: {
      type: Number,
      default: 1,
    },
    caller_id: {
      type: Boolean,
      default: true,
    },
    caller_id_count: {
      type: Number,
      default: 1,
    },
    time_controls: {
      type: Boolean,
      default: true,
    },
    time_controls_count: {
      type: Number,
      default: 1,
    },
    whatsapp: {
      type: Boolean,
      default: true,
    },
    whatsapp_count: {
      type: Number,
      default: 0,
    },
    calendar_integration: {
      type: Boolean,
      default: true,
    },
    calendar_integration_count: {
      type: Number,
      default: 1,
    },
    text_to_speech: {
      type: Boolean,
      default: true,
    },
    text_to_speech_count: {
      type: Number,
      default: 1,
    },
    virtual_assistant: {
      type: Boolean,
      default: true,
    },
    virtual_assistant_count: {
      type: Number,
      default: 1,
    },
    small_logo: {
      type: String,
      default: "",
    },
    logo_text: {
      type: String,
      default: "",
    },
    dark_small_logo: {
      type: String,
      default: "",
    },
    dark_logo_text: {
      type: String,
      default: "",
    },
    whatsapp_accessToken: {
      type: String,
      default: "",
    },
    whatsapp_number: {
      type: String,
      default: "",
    },
    whatsapp_phone_number_id: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<CompanyModel>("company", prepSchema);
