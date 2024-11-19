import axios from "axios";

let storeCookies: any;
export const loginCookies = {
  cookies: storeCookies,
};
export const pbxLogin = async () => {
  const apiUrl = "http://70.34.205.87:8080/pbx/index.pl";

  const params = {
    mod: "Login",
    action: "login",
    domain: "voip.mobiililinja.fi",
    user: "apiuser",
    password: "d6kVImEEV1A34B2fjduZpxxFAf4",
  };

  try {
    const data = await axios.post(apiUrl, null, { params });
    console.log("succesfully login to pbx server");

    const headers = data?.headers;
    const setCookie: any = headers["set-cookie"];

    const cookieValue = setCookie[1];
    console.log(cookieValue.split(";"));
    storeCookies = cookieValue.split(";")[0];
    return cookieValue;
  } catch (error) {
    return "";
  }
};
