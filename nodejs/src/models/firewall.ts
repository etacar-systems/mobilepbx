import mongoose, { Document, Schema } from "mongoose";

export interface Firewall {
  access_control_name: String;
  access_control_default: String;
  access_control_description: String;
  access_control_nodes: {
    node_type: String;
    node_cidr: String;
    node_description: String;
  }[];
  is_deleted: Number;
  last_updated_user: String;
  firewall_uuid: String;
  cid: String;
  add_assign_zone: String;
}

export interface FirewallModal extends Firewall, Document {}

const firewallSchema: Schema = new Schema(
  {
    access_control_name: {
      type: String,
      default: "",
    },
    cid: {
      type: mongoose.Schema.ObjectId,
      ref: "company",
      default: null,
    },
    firewall_uuid: {
      type: String,
      default: "",
    },
    last_updated_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    access_control_default: {
      type: String,
      default: "",
    },
    access_control_description: {
      type: String,
      default: "",
    },
    add_assign_zone: {
      type: String,
      default: "",
    },
    access_control_nodes: {
      type: [
        {
          node_type: {
            type: String,
            default: "",
          },
          node_cidr: {
            type: String,
            default: "",
          },
          node_description: {
            type: String,
            default: "",
          },
        },
      ],
    },
    is_deleted: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<FirewallModal>("firewall", firewallSchema);
