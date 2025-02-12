import React, { useEffect, useRef, useState } from "react";
import loginImg from "../../Assets/Image/login-new.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
// import { ReactComponent as Hide } from "../../Assets/Icon/eye-hide-svgrepo-com.svg";
// import { ReactComponent as Show } from "../../Assets/Icon/eye-show-svgrepo-com.svg";
import { postapiAll } from "../../Redux/Reducers/ApiServices";
import { ReactComponent as Lock } from "../../Assets/Icon/lock-filled-svgrepo-com.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as Hide } from "../../Assets/Icon/hide.svg";
import { ReactComponent as Show } from "../../Assets/Icon/show.svg";
import LanguageSelect from "../Modal/LanguageSelect";
import config from "../../config";
import LogoDisply from "./LogoDisply";

//api config //

const LoginAPi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_MOBIILILINJA_LOGIN}`;
//api config //

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useTranslation();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [loading, setloading] = useState(false);
  const iconRef = useRef(null);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [errors, setErrors] = useState({
    Email: "",
    Password: "",
  });
  const token = Cookies.get("Token");
  const Role = Cookies.get("role");
  const Theme = Cookies.get("Theme");
  const hex_code = Cookies.get("hex_code");
  console.log(hex_code, Role, "RoleRole");
  if (hex_code && hex_code !== "undefined" && Role !== "3") {
    document.documentElement.style.setProperty("--main-orange-color", hex_code);
    document.documentElement.setAttribute(
      "style",
      `--main-orange-color: ${hex_code}`
    );
    document.documentElement.style.cssText = `--main-orange-color: ${hex_code}`;
  } else {
    document.documentElement.style.removeProperty("--main-orange-color");
  }
  useEffect(() => {
    if (Theme) {
      setTheme(Theme === "Dark");
      document.querySelector("body").setAttribute("data-theme", Theme);
    }
  }, [Theme]);
  useEffect(() => {
    if (token && Role && window.location.pathname == "/") {
      switch (Role) {
        case "1":
          navigate("/webphone");
          break;
        case "2":
          navigate("/number");
          break;
        case "3":
          navigate("/customers", { replace: true });
          break;
        case "4":
          navigate("/dashboard");
          break;
      }
    }
  }, [navigate]);
  const [theme, setTheme] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const handletheme = () => {
    setTheme(!theme);
    if (!theme) {
      document.querySelector("body").setAttribute("data-theme", "Dark");
    } else {
      document.querySelector("body").setAttribute("data-theme", "light");
    }
  };
  const setPasswordHide = () => {
    setPasswordShow((state) => !state);
  };
  const checkAllregex = (name, value) => {
    if (!value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name} is Required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  useEffect(() => {
    // Check for remembered credentials on component mount
    const rememberedEmail = Cookies.get("rememberedEmail");
    const rememberedPassword = Cookies.get("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
      setFormData({
        Email: rememberedEmail,
        Password: rememberedPassword,
      });
      setRememberMe(true);
    }
  }, []);

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleInputChange = (name, value) => {
    switch (name) {
      case "Email":
        checkAllregex(name, value);
        break;
      case "Password":
        checkAllregex(name, value);
        break;
    }
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const checkAllFields = () => {
    let hasErrors = false;

    const regexPatterns = {
      Email: "",
      Password: "",
    };

    Object.keys(formData).forEach((name) => {
      const value = formData[name];

      if (typeof value === "string" || value instanceof String) {
        if (!value?.trim()) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: t(`${name} is Required`),
          }));
          hasErrors = true;
        } else if (regexPatterns[name] && !value.match(regexPatterns[name])) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: t(`${name} is invalid`),
          }));
          hasErrors = true;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        }
      }
    });
    return hasErrors;
  };
  const registerPage = () => {
    navigate("/registerPage");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = () => {
    const hasErrors = checkAllFields();
    const combineInput = {
      user_email: formData.Email,
      password: formData.Password,
    };
    if (!hasErrors) {
      if (formData.Email && formData.Password) {
        setloading(true);
        dispatch(
          postapiAll({ inputData: combineInput, Api: LoginAPi, urlof: "login" })
        ).then((response) => {
          if (response?.payload?.response?.Token) {
            setloading(false);
            Cookies.set("Token", response?.payload?.response?.Token);
            Cookies.set(
              "RefreshToken",
              response?.payload?.response?.RefreshToken
            );
            Cookies.set(
              "User_id",
              response?.payload?.response?.UserDetails._id
            );
            Cookies.set(
              "Sip_number",
              response?.payload?.response?.UserDetails.user_extension
            );
            Cookies.set(
              "Company_Id",
              response?.payload?.response?.UserDetails?.cid
            );
            Cookies.set(
              "user_email",
              response?.payload?.response?.UserDetails?.user_email
            );
            Cookies.set(
              "firstname",
              response?.payload?.response?.UserDetails?.first_name
            );
            Cookies.set(
              "lastname",
              response?.payload?.response?.UserDetails?.last_name
            );
            Cookies.set(
              "role",
              response?.payload?.response?.UserDetails?.role?.type
            );
            Cookies.set(
              "user_extension",
              response?.payload?.response?.UserDetails?.user_extension
            );
            Cookies.set(
              "domain_name",
              response?.payload?.response?.UserDetails?.company_details
                ?.domain_name
            );
            Cookies.set(
              "sip_password",
              response?.payload?.response?.UserDetails?.sip_password
            );
            Cookies.set(
              "company_name",
              response?.payload?.response?.UserDetails?.company_name
            );
            Cookies.set(
              "domain_uuid",
              response?.payload?.response?.UserDetails?.domain_uuid
            );
            Cookies.set(
              "profile_url",
              response?.payload?.response?.UserDetails?.user_image
            );
            Cookies.set(
              "company_features",
              JSON.stringify(
                response?.payload?.response?.UserDetails?.company_details
              )
            );
            Cookies.set(
              "dark_small_logo",
              response?.payload?.response?.UserDetails?.company_details
                ?.dark_small_logo || null
            );
            Cookies.set(
              "dark_logo_text",
              response?.payload?.response?.UserDetails?.company_details
                ?.dark_logo_text || null
            );
            Cookies.set(
              "logo_text",
              response?.payload?.response?.UserDetails?.company_details
                ?.logo_text || null
            );
            Cookies.set(
              "small_logo",
              response?.payload?.response?.UserDetails?.company_details
                ?.small_logo || null
            );
            Cookies.set(
              "hex_code",
              response?.payload?.response?.UserDetails?.company_details
                ?.hex_code
            );
            Cookies.set(
              "sip_username",
              "sheerbit.com"
              //   response?.payload?.response?.UserDetails?.sip_username
            );

            Cookies.set("username", formData.Email);
            toast.success(t("Login Successfully"), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
            switch (response?.payload?.response?.UserDetails?.role?.type) {
              case 1:
                navigate("/webphone", { replace: true });
                break;
              case 2:
                navigate("/dashboard ", { replace: true });
                break;
              case 3:
                navigate("/customers", { replace: true });
                break;
              case 4:
                navigate("/dashboard", { replace: true });
                break;
              default:
                navigate("/", { replace: true });
            }

            setIsButtonClicked(true);
            if (rememberMe) {
              Cookies.set("rememberedEmail", formData.Email, { expires: 30 });
              Cookies.set("rememberedPassword", formData.Password, {
                expires: 30,
              });
            } else {
              Cookies.remove("rememberedEmail");
              Cookies.remove("rememberedPassword");
            }
          } else {
            if (response?.payload?.error) setloading(false);
            toast.error(t(response?.payload?.error?.response?.data?.message), {
              autoClose: 2000,
            });
            setIsButtonClicked(false);
          }
        });
      } else {
        toast.error("Wrong Email or Password", { autoClose: 2000 });
      }
    } else {
      // toast.error(t("Email and Password are Required"));
    }
  };

  return (
    <>
      <LanguageSelect main={false} />
      <Container className="loginPageContainer">
        <Row
          className="Loginpagebox mb-0"
          style={{
            borderBottom: "4px solid var(--main-orange-color)",
            borderTop: "1px solid var(--main-whiteborder-color)",
            borderRadius: "5px",
            marginLeft: "0px",
            marginRight: "0px",
            background: "var(--main-tabledarkbackground-color)",
          }}
        >
          <Col lg={7} md={12} sm={12} xs={12} className="imgcol">
            <img
              src={loginImg}
              className="imgwidth"
              style={{ height: "100%", marginTop: "-11px" }}
            />
          </Col>
          <Col lg={5} md={12} sm={12} xs={12} style={{ padding: "32px" }}>
            <div style={{ paddingLeft: "18px" }}>
              <LogoDisply />
              <div className="mb-3">
                <p className="lead login_to">{t("Login to your account")}</p>
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  onKeyDown={handleKeyDown}
                  className="form-control"
                  id="signin-email"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  value={formData.Email}
                  placeholder={t("Email")}
                  name="Email"
                  autocomplete="new-email"
                />
                {errors.Email && (
                  <div style={{ color: "red", fontSize: "0.8em" }}>
                    {t(errors.Email)}
                  </div>
                )}
              </div>
              <div className="form-group mb-3">
                <InputGroup>
                  <Form.Control
                    id="signin-password"
                    placeholder={t("Password")}
                    name="Password"
                    type={passwordShow ? "text" : "password"}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                    value={formData.Password}
                    onKeyDown={handleKeyDown}
                    className="emailforminput2"
                    autocomplete="new-password"
                  />
                  <InputGroup.Text
                    onClick={setPasswordHide}
                    className="Loginpasswordinput"
                  >
                    {passwordShow ? (
                      <Show alt="" width={18} height={16} />
                    ) : (
                      <Hide alt="" width={18} height={18} />
                    )}
                    {/* <img src={passwordShow ? show : hide } alt="" width={18} /> */}
                  </InputGroup.Text>
                </InputGroup>
                {errors.Password && (
                  <div style={{ color: "red", fontSize: "0.8em" }}>
                    {t(errors.Password)}
                  </div>
                )}
              </div>
              <div className="form-group clearfix mb-3 d-flex">
                <input
                  type="checkbox"
                  style={{ width: "20px", height: "20px" }}
                  className="custom-checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
                <label className="fancy-checkbox element-left">
                  <span style={{ marginLeft: "8px" }} className="accounttext">
                    {t("Remember me")}
                  </span>
                </label>
              </div>
              <button
                type="submit"
                id="login"
                name="login"
                className="login-button"
                onClick={handleLogin}
                disabled={isButtonClicked}
              >
                {loading ? t("Loading...") : t("LOGIN")}{" "}
              </button>
              <div
                className="mt-4 "
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span class="helper-text m-b-10 ">
                  <Lock width={15} height={14} />
                  <span
                    onClick={() => navigate("/forgotpassword")}
                    className="forgotpass"
                  >
                    {t("Forgot password?")}
                  </span>
                </span>
                <div style={{ fontSize: "14px" }} className="accounttext">
                  {t("Don't have an account?")}{" "}
                  <span onClick={registerPage} className="forgotpass">
                    {t("Register")}
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div style={{ color: "var(--main-orange-color)", height: "3px" }}></div>
      </Container>
    </>
  );
}

export default LoginPage;
