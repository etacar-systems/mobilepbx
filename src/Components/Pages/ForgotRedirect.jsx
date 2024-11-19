import React, { useRef, useState } from "react";
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
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { toast } from "react-toastify";
import { putapiall } from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { regex_pssword } from "../ConstantConfig";
import ConstantConfig from "../ConstantConfig";

function ForgotRedirect() {
  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const token = Cookies.get("ftoken");
  const handlechange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const showToastWithId = (message, options) => {
    const { id } = options;

    if (!toast.isActive(id)) {
      // Check if the toast with this id is already active
      toast.error(message, { toastId: id });
    }
  };
  const handlereset = () => {
    if (password.password === "" || password.confirmPassword === "") {
      showToastWithId(t("Please enter password"), { id: "tost" });
      return;
    }
    if (!ConstantConfig.EXTENSION.VALIDATION.Password.test(password.password)) {
      showToastWithId(
        t(
          "please choose a strong password try a mix of letters numbers and symbols"
        ),
        { id: "tost" }
      );
      return;
    }
    if (password.password !== password.confirmPassword) {
      showToastWithId(t("Passwords do not match"), { id: "tost" });

      return;
    }
    setLoader(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const inputData = {
      password: password.password,
      token: token,
    };
    dispatch(
      putapiall({
        inputData: inputData,
        Api: config.UPDATE_PASSWORD,
        signal: abortController.signal,
      })
    ).then((response) => {
      if (response?.payload?.error?.success === 0) {
        toast.error(response?.payload?.error?.message);
        setLoader(false);
      } else {
        setLoader(false);
        Cookies.remove("ftoken");
        navigate(`/`);
        toast.success(response?.payload?.response?.message);
      }
    });
  };
  return (
    <Container className="forregisteralign">
      <div class="pattern">
        <span class="orange"></span>
      </div>

      <Row
        lg={12}
        style={{
          marginTop: "-25px",
          marginLeft: "0px",
          marginRight: "0px",
          justifyContent: "center",
        }}
        className="widthpassword"
      >
        <Col
          className="auth-main "
          lg={12}
          style={{ height: "auto", marginRight: "0px" }}
        >
          <img src={logoLogin} style={{ marginRight: "10px" }} />
        </Col>
        <Col lg={6} className="mt-3">
          <Row
            style={{
              backgroundColor: "var(--main-white-color)",
              border: "1px solid var(--main-sideborder-color)",
              justifyContent: "center",
            }}
          >
            <Col lg={12} className="backofforgot">
              <InputGroup style={{ marginBottom: "15px" }}>
                <Form.Control
                  placeholder={t("New password")}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  className="emailforminput"
                  onChange={handlechange}
                  name="password"
                />
              </InputGroup>
            </Col>
            <Col
              lg={12}
              className="backofforgot_1"
              style={{ paddingTop: "0px" }}
            >
              <InputGroup style={{ marginBottom: "15px" }}>
                <Form.Control
                  placeholder={t("Enter password again")}
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  className="emailforminput"
                  onChange={handlechange}
                  name="confirmPassword"
                />
              </InputGroup>
            </Col>
            <Col
              lg={6}
              className="d-flex justify-content-center"
              style={{ padding: "0px 0px 23px 0px " }}
            >
              <Button onClick={handlereset} className="resetpass_2">
                {loader ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  t("RESET PASSWORD")
                )}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotRedirect;
