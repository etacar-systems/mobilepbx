import calendar_config from "../models/calendar_config";
import { google } from "googleapis";
const REDIRECT_URI = "http://localhost:8000/google/redirect";
const refreshAccessToken=async(userConfig: any)=> {
  const oauth2Client = new google.auth.OAuth2(
    userConfig.client_id,
    userConfig.client_secret,
    "http://localhost:8000/google/redirect"
  );

  oauth2Client.setCredentials({
    refresh_token: userConfig.refresh_token,
  });

  try {
    // Get a new access token
    const { token } = await oauth2Client.getAccessToken();

  if (!token) throw new Error('No access token received');
  console.log('Access token:', token);

    // console.log("Access token refreshed successfully:", response.token);

    // // Update access token and expiration in the database
    // await calendar_config.updateOne(
    //   { uid: userConfig.uid },
    //   {
    //     $set: {
    //       access_token: response.token,
    //       expires_at: Date.now() + 3600 * 1000, // 1 hour from now
    //     },
    //   }
    // );

    return token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Token refresh failed");
  }
}

export default refreshAccessToken;
