import React from "react";
import Cookies from "js-cookie";
import logo from "../../Assets/Image/logo_icon.png";
import img_logo from "../../Assets/Image/logo_txt.png";
import logoLogin from "../../Assets/Image/logo_login11.png";

const LogoDisply = () => {
  const Theme = Cookies.get("Theme");
  const small_logo = Cookies.get("small_logo") || null;
  const logo_text = Cookies.get("logo_text");
  const dark_logo_text = Cookies.get("dark_logo_text");
  const dark_small_logo = Cookies.get("dark_small_logo");
  const fileBaseUrl = process.env.REACT_APP_FILE_BASE_URL;
  return (
    <div>
      {Theme &&
        (Theme && Theme === "light" ? (
          <>
            {" "}
            {small_logo &&
            small_logo !== "undefined" &&
            small_logo != "null" ? (
              <img
                src={`${fileBaseUrl}${small_logo}`}
                alt=""
                style={{
                  marginTop: "12px",
                  width: "30px",
                  height: "30px",
                }}
              />
            ) : (
              <>
                {console.log(small_logo, "123123232")}
                <img src={logo} alt="" style={{ marginTop: "12px" }} />
              </>
            )}
            {logo_text !== "undefined" && logo_text != "null" ? (
              <img
                src={`${fileBaseUrl}${logo_text}`}
                alt=""
                style={{ marginTop: "12px" }}
                height="35px"
                width="180px"
              />
            ) : (
              <img src={img_logo} alt="" style={{ marginTop: "12px" }} />
            )}
          </>
        ) : (
          <>
            {" "}
            {dark_small_logo &&
            dark_small_logo !== "undefined" &&
            dark_small_logo != "null" ? (
              <img
                src={`${fileBaseUrl}${dark_small_logo}`}
                alt=""
                style={{
                  marginTop: "12px",
                  width: "30px",
                  height: "30px",
                }}
              />
            ) : (
              <img src={logo} alt="" style={{ marginTop: "12px" }} />
            )}
            {dark_logo_text &&
            dark_logo_text !== "undefined" &&
            dark_logo_text != "null" ? (
              <img
                src={`${fileBaseUrl}${dark_logo_text}`}
                alt=""
                style={{ marginTop: "12px" }}
                height="35px"
                width="180px"
              />
            ) : (
              <img src={img_logo} alt="" style={{ marginTop: "12px" }} />
            )}
          </>
        ))}
      {!Theme && <img src={logoLogin} alt="" />}
    </div>
  );
};

export default LogoDisply;
