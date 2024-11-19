import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import logoLogin from "../../Assets/Image/logo_login.png";
import { ReactComponent as Emailicon } from "../../Assets/Icon/email_logo.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { postapiAll } from "../../Redux/Reducers/ApiServices";
import config from "../../config";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { regex_email } from "../ConstantConfig";
import LanguageSelect from "../Modal/LanguageSelect";
import logo from "../../Assets/Image/logo_icon.png";
import img_logo from "../../Assets/Image/logo_txt.png";
import LogoDisply from "./LogoDisply";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const abortControllerRef = useRef(null);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(false);
  const Themee = Cookies.get("Theme");
  useEffect(() => {
    if (Themee) {
      setTheme(Themee === "Dark");
      document.querySelector("body").setAttribute("data-theme", Themee);
    }
  }, [Themee]);
  const handlechange = (e) => {
    const { value, name } = e.target;
    setEmail(value);
  };
  const showToastWithId = (message, options) => {
    const { id } = options;

    if (!toast.isActive(id)) {
      // Check if the toast with this id is already active
      toast.error(message, { toastId: id });
    }
  };
  const handlereset = () => {
    if (email === "") {
      showToastWithId(t("please enter email"), { id: "tost" });

      return;
    }
    if (!regex_email.test(email)) {
      showToastWithId(t("Please enter a valid email address"), { id: "tost" });
      return;
    }
    setLoader(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const inputData = {
      email: email,
    };
    dispatch(
      postapiAll({
        inputData: inputData,
        Api: config.RESET_PASSWORD,
        signal: abortController.signal,
      })
    ).then((response) => {
      if (response?.payload?.error?.response?.data?.message) {
        toast.error(response?.payload?.error?.response?.data?.message);
        setLoader(false);
      } else {
        setLoader(false);
        Cookies.set("ftoken", response?.payload?.response?.token);
        navigate(`/forgotpasswordred`);
      }
    });
  };

  return (
    <>
      <LanguageSelect />
      <Container className="forregisteralign">
        <div class="pattern">
          <span class="orange"></span>
        </div>
        <Row
          lg={12}
          style={{ marginTop: "-25px", marginLeft: "0px", marginRight: "0px" }}
          className="widthpassword"
        >
          <Col
            className="auth-main "
            lg={12}
            style={{ height: "auto", marginRight: "0px" }}
          >
            <LogoDisply />
          </Col>
          <Col lg={12} className="mt-3">
            <Row>
              <Col lg={12} className="backofforgot">
                <InputGroup style={{ marginBottom: "15px" }}>
                  <Form.Control
                    placeholder={t("Email")}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    className="emailforminput"
                    onChange={handlechange}
                    value={email}
                  />
                </InputGroup>
                <Button
                  disabled={loader}
                  onClick={handlereset}
                  className="resetpass"
                >
                  {loader ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    t("RESET PASSWORD")
                  )}
                </Button>
                <span style={{ marginTop: "23px", letterSpacing: "0.2px" }}>
                  {t("Know your password?")}{" "}
                  <span className="Logincolor" onClick={() => navigate("/")}>
                    {t("Login")}
                  </span>
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ForgotPassword;
