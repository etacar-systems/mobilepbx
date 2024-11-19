import mongoose, { Document, Schema } from "mongoose";

export interface Phonebook {
  cid:String;
  first_name: String;
  last_name: String;
  phone_number: String;
  mobile_number: String;
  company: String;
  position: String;
}

export interface PhonebookModal extends Phonebook, Document {}

const phonebookSchema: Schema = new Schema(
  {
    cid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    first_name: {
      type: String,
      requried: "First name is requried",
    },
    last_name: {
      type: String,
      default:""
    },
    phone_number: {
      type: String,
      requried: "Phone number is requried",
    },
    mobile_number: {
      type: String,
      default:""
    },
    company: {
      type: String,
      default:""
    },
    position: {
      type: String,
      default:""
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

export default mongoose.model<PhonebookModal>("phonebook", phonebookSchema);
