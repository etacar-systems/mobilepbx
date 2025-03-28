import mongoose, { Schema } from "mongoose";

const prepSchema = new Schema(
  {
    chat_id: {
      type: String,
      default: "10259",
    },
    chat_origin: {
      type: String,
      default: "https://desk.contakti.com",
    },
  },
  {
    timestamps: true,
  }
);

export const SettingsModel = mongoose.model("settings", prepSchema);
