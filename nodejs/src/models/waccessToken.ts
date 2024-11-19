import mongoose, { Document, Schema } from "mongoose";

export interface AccessToken {
  access_token: String;
}

export interface AccessTokenModel extends AccessToken, Document {}

const AccessTokenSchema: Schema = new Schema(
  {
    access_token: {
      type: "string",
      required: "access token required",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AccessTokenModel>(
  "accessToken",
  AccessTokenSchema
);
