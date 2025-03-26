import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Nav, Tab, Button, Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ReactComponent as LinkIcon } from "../../Assets/Icon/link.svg";
import { ReactComponent as CopyIcon } from "../../Assets/Icon/copy.svg";
import { toast } from "react-toastify";
import config from "../../config";
import { getapiAll, putapiall } from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

export default function Integrations() {
  const { t } = useTranslation();
  const url = process.env.REACT_APP_WHATSAPP_URL;
  const token = process.env.REACT_APP_WHATSAPP_VERIFY_TOKEN;
  const [accessToken, setAccessToken] = useState("");
  const [wNumber, setWNumber] = useState("");
  const [phoneNumberid, setPhoneNumberid] = useState("");
  const [loader, setLoader] = useState(false);
  let Token = Cookies.get("Token");
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    var name = e.target.name;
    if (name == "Token") {
      setAccessToken(e.target.value);
    } else if (name == "WNumber") {
      setWNumber(e.target.value);
    } else {
      setPhoneNumberid(e.target.value);
    }
  };

  const handleSave = (e) => {
    setLoader(true);
    e.preventDefault();
    const data = {
      whatsapp_accessToken: accessToken,
      whatsapp_number: wNumber,
      whatsapp_phone_number_id: phoneNumberid,
    };
    dispatch(
      putapiall({
        inputData: data,
        Api: config.WHATSAPP_TOKEN.TOKEN_PUT,
        Token: Token,
        urlof: config.WHATSAPP_TOKEN_KEY.TOKEN_PUT,
      })
    ).then((response) => {
      if (response.payload.response) {
        toast.success(t(response?.payload?.response?.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
        setLoader(false);
      } else {
        setLoader(false);
        toast.error(t(response?.payload?.error?.response?.data?.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      }
    });
    console.log("Access token saved:", accessToken);
  };

  useEffect(() => {
    setLoader(true);
    dispatch(
      getapiAll({
        Api: config.WHATSAPP_TOKEN.TOKEN_PUT,
        Token: Token,
        urlof: "systemrecording",
      })
    ).then((res) => {
      if (res) {
        var response = res?.payload?.response?.WhatsappDetail;
        setAccessToken(response?.whatsapp_accessToken);
        setWNumber(response?.whatsapp_number);
        setPhoneNumberid(response?.whatsapp_phone_number_id);
        console.log(res, "rescheck");
        setLoader(false);
      }
    });
  }, []);

  const handleCopyClick = (value) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.success("Copied successfully!", {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="tablespadding">
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ marginBottom: "24px", marginTop: "5px" }}
      >
        <span className="dashboardtext">{t("Integrations")}</span>
      </div>
      <Tab.Container defaultActiveKey="/WhatsApp">
        <Row>
          <Col sm={12}>
            <Nav variant="pills" className="flex-row tabs_border">
              <Nav.Item>
                <Nav.Link eventKey="/WhatsApp" className="nav-link2">
                  {t("WhatsApp")}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey="/WhatsApp">
                <div className="num_table">
                  <span
                    style={{
                      fontSize: "12px",
                      fontStyle: "italic",
                      fontFamily: "krub",
                    }}
                  >
                    {t(
                      "Note: To set up a Meta account, tap on the 'Access Token' link icon. After completing the configuration, copy the callback URL and verify the token, then paste them into the WhatsApp portal to finish the setup."
                    )}
                  </span>
                  <Form style={{ marginTop: "10px" }} onSubmit={handleSave}>
                    <div className="callback">
                      {t("Callback URL")}: {url}
                      <CopyIcon
                        style={{
                          height: "20px",
                          width: "20px",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                        onClick={() => handleCopyClick(url)}
                      />
                    </div>
                    <div className="callback" style={{ marginTop: "10px" }}>
                      {t("Verify token")}: {token}
                      <CopyIcon
                        style={{
                          height: "20px",
                          width: "20px",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                        onClick={() => handleCopyClick(token)}
                      />
                    </div>
                    <Form.Group controlId="formAccessToken" className="mt-3">
                      <Form.Label>
                        {t("Access Token")}
                        <a
                          href="https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#1--acquire-an-access-token-using-a-system-user-or-facebook-login"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none" }}
                        >
                          <span style={{ marginLeft: "5px" }}>
                            <LinkIcon
                              style={{ height: "15px", width: "15px" }}
                            />
                          </span>
                        </a>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("Enter WhatsApp API access token")}
                        value={accessToken}
                        name="Token"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formAccessToken" className="mt-3">
                      <Form.Label>{t("Whatsapp Number")}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("Enter Whatsapp Number")}
                        value={wNumber}
                        name="WNumber"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formAccessToken" className="mt-3">
                      <Form.Label>{t("Phone number ID")}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("Enter Phone number ID")}
                        value={phoneNumberid}
                        name="phoneNumberid"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Form.Group>

                    <div
                      className=" d-flex justify-content-end "
                      style={{
                        margin: "20px 0px",
                      }}
                    >
                      {loader ? (
                        <button className="btn_save">
                          <Spinner animation="border" size="sm" />
                        </button>
                      ) : (
                        <button className="btn_save">{t("Save")}</button>
                      )}
                    </div>
                  </Form>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
