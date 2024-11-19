import mongoose, { Document } from "mongoose";

export interface IVR {
  cid: String;
  ivr_uuid: String;
  name: String;
  extension: String;
  greet_long: String;
  greet_short: String;
  ivr_menu_parent_id: String;
  domain_id: String;
  context: String;
  description: String;
  ivr_enabled: String;
  ivr_menu_timeout: String;
  ivr_menu_exit_app: String;
  ivr_menu_exit_data: String;
  ivr_menu_direct_dial: String;
  ivr_menu_ringback: String;
  ivr_menu_cid_prefix: String;
  ivr_menu_invalid_sound: String;
  ivr_menu_exit_sound: String;
  ivr_menu_pin_number: String;
  ivr_menu_confirm_macro: String;
  ivr_menu_confirm_key: String;
  ivr_menu_tts_engine: String;
  ivr_menu_tts_voice: String;
  ivr_menu_confirm_attempts: String;
  ivr_menu_inter_digit_timeout: String;
  ivr_menu_max_failures: String;
  ivr_menu_max_timeouts: String;
  ivr_menu_digit_len: String;
  ivr_menu_option: {
    menu_digit: String;
    menu_option: String;
    menu_param: String;
    menu_order: String;
    ivr_menu_option_enabled: String;
    select_type: Number;
  }[];
  is_deleted: Number;
  last_updated_user: String;
  assign_pstn_number: String;
}

export interface IVRModel extends IVR, Document {}

const IVRSchema = new mongoose.Schema(
  {
    cid: {
      type: mongoose.Schema.ObjectId,
      ref: "company",
      default: null,
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    ivr_uuid: {
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
    greet_long: {
      type: String,
      default: "",
    },
    greet_short: {
      type: String,
      default: "",
    },
    ivr_menu_parent_id: {
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
    description: {
      type: String,
      default: "",
    },
    ivr_enabled: {
      type: String,
      default: "",
    },
    ivr_menu_timeout: {
      type: String,
      default: "",
    },
    ivr_menu_exit_app: {
      type: String,
      default: "",
    },
    ivr_menu_exit_data: {
      type: String,
      default: "",
    },
    ivr_menu_direct_dial: {
      type: String,
      default: "",
    },
    ivr_menu_ringback: {
      type: String,
      default: "",
    },
    ivr_menu_cid_prefix: {
      type: String,
      default: "",
    },
    ivr_menu_invalid_sound: {
      type: String,
      default: "",
    },
    ivr_menu_exit_sound: {
      type: String,
      default: "",
    },
    ivr_menu_pin_number: {
      type: String,
      default: "",
    },
    ivr_menu_confirm_macro: {
      type: String,
      default: "",
    },
    ivr_menu_confirm_key: {
      type: String,
      default: "",
    },
    ivr_menu_tts_engine: {
      type: String,
      default: "",
    },
    ivr_menu_tts_voice: {
      type: String,
      default: "",
    },
    ivr_menu_confirm_attempts: {
      type: String,
      default: "",
    },
    ivr_menu_inter_digit_timeout: {
      type: String,
      default: "",
    },
    ivr_menu_max_failures: {
      type: String,
      default: "",
    },
    ivr_menu_max_timeouts: {
      type: String,
      default: "",
    },
    ivr_menu_digit_len: {
      type: String,
      default: "",
    },
    assign_pstn_number: {
      type: String,
      default: "",
    },
    ivr_menu_option: {
      type: [
        {
          menu_digit: {
            type: String,
            default: "",
          },
          menu_option: {
            type: String,
            default: "",
          },
          menu_param: {
            type: String,
            default: "",
          },
          menu_order: {
            type: String,
            default: "",
          },
          ivr_menu_option_enabled: {
            type: String,
            default: "",
          },
          select_type: {
            type: Number, // 1 ivr 2 ring group 3 extension 4 conference 5 recording 6 timecondition
            default: "",
          },
        },
      ],
      default: [],
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVRModel>("IVR", IVRSchema);
