import axios from "axios";
import accessToken from "../../models/waccessToken";

export const getAccessToken = async () => {
  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;

  try {
    console.log(APP_ID, APP_SECRET, "APP_SECRET");
    const response = await axios.get(
      `https://graph.facebook.com/oauth/access_token`,
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          grant_type: "client_credentials",
        },
      }
    );
    const newToken = response.data.access_token;
    console.log("New Token:", newToken);
    const data = { access_token: newToken };
    const token = await accessToken.create(data);
  } catch (error) {
    console.error("Error getting access token:", error);
  }
};
