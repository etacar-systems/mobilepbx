import axios from "axios";

let storeCookies: any;
export const loginCookies = {
  cookies: storeCookies,
};
export const pbxLogin = async () => {
  const apiUrl = "http://70.34.207.207/:8080/pbx/index.pl";
  const params = {
    mod: "Login",
    action: "login",
    domain: "mobilepbx.mobiililinja.fi",
    user: "apiuser",
    password: "aZuiqEW7tSHLfoGeMUgzMaDoVcW4zxB0",
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
