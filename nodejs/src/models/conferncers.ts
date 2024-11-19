import mongoose, { Document, Schema } from "mongoose";

export interface conference {
  conference_name: String;
  conference_description: String;
  conference_pin: String;
  conference_record: Boolean;
  extension_number: String;
  cid: String;
  conference_uuid: String;
  is_deleted: String;
  conference_profile: String;
  conference_flags: String;
  conference_account_code: String;
  conference_context: String;
  last_updated_user: String;
  assign_pstn_number: String;
}

export interface conferenceModal extends conference, Document {}

const conferenceSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    assign_pstn_number: {
      type: String,
      default: "",
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    conference_name: {
      type: String,
      requried: "conference_name is required",
    },
    conference_description: {
      type: String,
      requried: "conference_description is required",
    },
    conference_pin: {
      type: String,
      requried: "conference_pin is required",
    },
    conference_record: {
      type: Boolean,
      default: false,
    },
    extension_number: {
      type: String,
      requried: "conference_name is required",
    },
    conference_uuid: {
      type: String,
      requried: "conference_name is required",
    },
    conference_context: {
      type: String,
      default: "",
    },
    conference_account_code: {
      type: String,
      default: "",
    },
    conference_flags: {
      type: String,
      default: "",
    },
    conference_profile: {
      type: String,
      default: "",
    },
    is_deleted: {
      type: Number,
      enum: [0, 1],
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<conferenceModal>("conference", conferenceSchema);
