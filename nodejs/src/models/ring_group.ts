import mongoose, { Schema, Document } from "mongoose";

export interface RingGroup {
  cid: String;
  ring_group_uuid: String;
  name: String;
  extension: String;
  record_calls:Boolean,
  ring_group_strategy: String;
  domain_id: String;
  ring_group_greeting: String;
  ring_group_call_timeout: String;
  ring_group_caller_id_name: String;
  ring_group_caller_id_number: Number;
  ring_group_ringback: String;
  ring_group_call_forward_enabled: String;
  ring_group_follow_me_enabled: String;
  ring_group_missed_call_app: String;
  ring_group_missed_call_data: String;
  ring_group_forward_enabled: String;
  ring_group_forward_destination: String;
  ring_group_forward_toll_allow: String;
  context: String;
  ring_group_timeout_app: String;
  ring_group_timeout_data: String;
  ring_group_enabled: String;
  ring_group_description: String;
  destinations: String[];
  is_deleted: Number;
  last_updated_user: String;
  assign_pstn_number: String;
  ring_hunt_timeout:String;
}

export interface RingGroupModel extends RingGroup, Document {}

const ringGroupSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    ring_group_uuid: {
      type: String,
      default: "",
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    extension: {
      type: String,
      default: "",
    },
    record_calls: { //new
      type: Boolean,
      default: false,
    },
    ring_group_strategy: {
      type: String,
      default: "",
    },
    domain_id: {
      type: String,
      default: "",
    },
    ring_group_greeting: {
      type: String,
      default: "",
    },
    ring_group_call_timeout: {
      type: String,
      default: "",
    },
    ring_group_caller_id_name: {
      type: String,
      default: "",
    },
    ring_group_caller_id_number: {
      type: Number, // 1 ivr 2 ring group 3 extension 4 conference 5 recording 6 timecondition
      default: "",
    },
    ring_group_ringback: {
      type: String,
      default: "",
    },
    ring_group_call_forward_enabled: {
      type: String,
      default: "",
    },
    ring_group_follow_me_enabled: {
      type: String,
      default: "",
    },
    ring_group_missed_call_app: {
      type: String,
      default: "",
    },
    ring_group_missed_call_data: {
      type: String,
      default: "",
    },
    ring_group_forward_enabled: {
      type: String,
      default: "",
    },
    ring_group_forward_destination: {
      type: String,
      default: "",
    },
    ring_group_forward_toll_allow: {
      type: String,
      default: "",
    },
    context: {
      type: String,
      default: "",
    },
    ring_group_timeout_app: {
      type: String,
      default: "",
    },
    ring_group_timeout_data: {
      type: String,
      default: "",
    },
    ring_group_enabled: {
      type: String,
      default: "",
    },
    ring_group_description: {
      type: String,
      default: "",
    },
    destinations: {
      type: [String],
      default: [],
    },
    assign_pstn_number: {
      type: String,
      default: "",
    },
    ring_hunt_timeout: {
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

export default mongoose.model<RingGroupModel>("RingGroup", ringGroupSchema);
