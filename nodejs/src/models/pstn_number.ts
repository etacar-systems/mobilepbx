import mongoose, { Schema, Document } from "mongoose";

export interface PstnNumber {
  type: String;
  user: String;
  destination: String;
  caller_id_name: String;
  caller_id_number: String;
  destination_condition: String;
  destination_action: {
    destination_app: String;
    destination_data: String;
  }[];
  cid: String;
  select_trunks: String;
  description: String;
  destination_enabled: Boolean;
  last_updated_user: String;
  pstn_uuid: String;
  isassigned: Number;
  da: String;
  is_deleted: Number;
  select_type: Number;
  select_type_data: String;
  select_type_uuid: String;
  gateway_id: String;
}

export interface PstnNumberModel extends PstnNumber, Document {}

const prepSchema: Schema = new Schema(
  {
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    gateway_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trunks",
      defaul: null,
    },
    type: {
      type: String,
      default: "",
    },
    destination: {
      type: String,
      default: 0,
    },
    pstn_uuid: {
      type: String,
      default: 0,
    },
    caller_id_name: {
      type: String,
      default: null,
    },
    caller_id_number: {
      type: String,
      default: null,
    },
    destination_condition: {
      type: String,
      default: null,
    },
    user: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    destination_enabled: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
    destination_action: {
      type: [
        {
          destination_app: {
            type: String,
            default: "",
          },
          destination_data: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },
    isassigned: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    assigend_extensionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    select_type: {
      type: Number, // 1 ivr 2 ring group 3 extension 4 conference 5 recording 6 timecondition
      default: "",
    },
    select_type_data: {
      type: Object,
      default: {},
    },
    select_type_uuid: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<PstnNumberModel>("pstn_number", prepSchema);
