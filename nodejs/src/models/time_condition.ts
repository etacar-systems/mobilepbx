import mongoose, { Schema, Document } from "mongoose";

interface ITimeCondition extends Document {
  cid: String;
  time_condition_uuid: String;
  name: String;
  extension: String;
  order: String;
  domain_id: String;
  context: String;
  timecondition_enabled: Boolean;
  description: String;
  dialplan_action: String;
  dialplan_anti_action: String;
  timecondition_data: {
    dialplan_detail_tag: String;
    dialplan_detail_type: String;
    dialplan_detail_data: String;
    dialplan_detail_uuid: String;
  }[];
  is_deleted: Number;
  last_updated_user: String;
  assign_pstn_number: String;
}

const TimeConditionSchema: Schema = new Schema(
  {
    time_condition_uuid: {
      type: String,
      default: "",
    },
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    assign_pstn_number: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    extension: {
      type: String,
      default: "",
    },
    order: {
      type: String,
      default: "",
    },
    domain_id: {
      type: String,
      default: "",
    },
    context: {
      type: String,
      default: "",
    },
    timecondition_enabled: {
      type: Boolean,
      default: "",
    },
    description: {
      type: String,
      required: false,
    },
    dialplan_action: {
      type: String,
      default: "",
    },
    dialplan_anti_action: {
      type: String,
      default: "",
    },
    timecondition_data: [
      {
        dialplan_detail_tag: {
          type: String,
          default: "",
        },
        dialplan_detail_type: {
          type: String,
          default: "",
        },
        dialplan_detail_data: {
          type: String,
          default: "",
        },
        dialplan_detail_uuid: {
          type: String,
          default: "",
        },
      },
    ],
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITimeCondition>(
  "TimeCondition",
  TimeConditionSchema
);
