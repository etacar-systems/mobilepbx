import mongoose, { Schema, Document } from "mongoose";

export interface OutboundRoute {
  prefix: String;
  cid: String;
  gateway_id: String;
  gateway_2: String;
  gateway_3: String;
  expression_detail: String;
  context: String;
  description: String;
  dialplanoutbound_enabled: Boolean;
  outbound_route_uuid: String;
  order: String;
  outbound_name: String;
  is_deleted: Number;
  last_updated_user: String;
}

export interface OutboundRouteModel extends OutboundRoute, Document {}

const prepSchema: Schema = new Schema(
  {
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
    prefix: {
      type: String,
      default: "",
    },
    expression_detail: {
      type: String,
      default: "",
    },
    outbound_name: {
      type: String,
      default: "",
    },
    gateway_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trunks",
      defaul: null,
    },
    gateway_2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trunks",
      defaul: null,
    },
    gateway_3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trunks",
      defaul: null,
    },
    outbound_route_uuid: {
      type: String,
      default: "",
    },
    order: {
      type: String,
      default: "",
    },
    context: {
      type: String,
      default: "",
    },
    dialplanoutbound_enabled: {
      type: Boolean,
      default: false,
    },
    description: {
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

export default mongoose.model<OutboundRouteModel>("outbound_route", prepSchema);
