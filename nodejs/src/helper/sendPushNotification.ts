import admin from "firebase-admin";
import { config } from "../config";
const params: any = {
  type: config.service.type,
  project_id: config.service.project_id,
  private_key_id: config.service.private_key_id,
  private_key: config.service.private_key,
  client_email: config.service.client_email,
  client_id: config.service.client_id,
  auth_uri: config.service.auth_uri,
  token_uri: config.service.token_uri,
  auth_provider_x509_cert_url: config.service.auth_provider_x509_cert_url,
  client_x509_cert_url: config.service.client_x509_cert_url,
  universe_domain: config.service.universe_domain,
};
admin.initializeApp({
  credential: admin.credential.cert(params),
});
const sendPushNotification = async (
  title: any,
  body: any,
  myTokens: any,
  mydata: any
) => {
  try {
    console.log("send notification function called");
    let registrationTokens = [...new Set(myTokens)];
    let message: any = {
      notification: {
        title: title,
        body: body,
      },
      data: mydata,
      tokens: registrationTokens,
    };
    admin
      .messaging()
      .sendMulticast(message)
      .then((response: any) => {
        console.log("push response", response);
      });
  } catch (error: any) {
    console.log("error", error);
  }
};

export default sendPushNotification;
