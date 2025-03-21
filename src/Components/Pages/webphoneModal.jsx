import { Modal, Button, Row, Col, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { ReactComponent as Calling } from "../../Assets/Icon/call_com.svg";
import { useEffect, useRef, useState } from "react";

const ContactCardModal = ({ show, onHide, contactName, activeTab }) => {
  const { t } = useTranslation();
  const [openDropdownId, setOpenDropdownId] = useState(false);
  const [openDropdownIdVideo, setOpenDropdownIdVideo] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefvideo = useRef(null);
  const call_function = useSelector(
    (state) => state.calling_function.calling_function
  );
  const transfer_function = useSelector(
    (state) => state.transfer_function.transfer_function
  );
  const tansferOn = useSelector((state) => state?.TransferOn?.TransferOn);
  console.log(tansferOn, "tansferOncheck");
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdownId(false);
      setOpenDropdownIdVideo(false);
    }
  };
  useEffect(() => {
    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId, openDropdownIdVideo]);

  const handlecall = () => {
    setOpenDropdownId(true);
  };
  const handleVideocall = () => {
    setOpenDropdownIdVideo(true);
  };
  const Company_name = Cookies.get("company_name");
  const makeCall = ({ name, number, flag }) => {
    console.log(name, number, flag, tansferOn, "checkinwhatigot");
    if (tansferOn === false) {
      if (number) {
        console.log(name, number, flag, tansferOn, "checkinwhatigot");
        call_function(number, name, flag);
      }
    } else {
      console.log(name, number, flag, tansferOn, "checkinwhatigot");
      transfer_function(number);
    }
    setOpenDropdownId(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <div className="webphone-modal">
        {/* <Modal.Header closeButton>
          <Modal.Title className="webphone-modal-header">
            {t("Contact card")}
          </Modal.Title>
        </Modal.Header> */}
        <Modal.Header
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="modal-delete"
        >
          <Modal.Title className="webphone-modal-header">
            {t("Contact card")}
          </Modal.Title>
          <Closeicon width={25} onClick={onHide} height={25} />
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-55 row">
            <Col className="mb-55 row">
              <b className="webphone-firstname">{t("Name")}</b>
              <br />
              <label className="webphone-lastname">
                {contactName?.name || ""}
              </label>
            </Col>
            <Col className="mb-55 row">
              <b className="webphone-firstname">{t("Extension")}</b>
              <br />
              <label className="webphone-lastname">
                {contactName?.extension || ""}
              </label>
            </Col>
            {contactName?.mobile && (
              <Col className="mb-55 row">
                <b className="webphone-firstname">{t("Mobile number")}</b>
                <br />
                <label className="webphone-lastname">
                  {contactName?.mobile || ""}
                </label>
              </Col>
            )}
          </Row>
          <Row className="mb-55 row">
            <Col className="mb-55 row">
              <b className="webphone-firstname">{t("Company")}</b>
              <br />
              <label className="webphone-lastname">
                {contactName?.company || ""}
              </label>
            </Col>
            {activeTab === "Contact" && (
              <Col className="mb-55 row">
                <b className="webphone-firstname">{t("Position")}</b>
                <br />
                <label className="webphone-lastname">
                  {contactName.position || ""}
                </label>
              </Col>
            )}
            <Col className="mb-55 row">
              <b className="webphone-firstname"></b>
              <br />
              <label className="webphone-lastname"></label>
            </Col>
          </Row>
          <Row className="mb-55 row">
            <Col className="mb-55 row" style={{ position: "relative" }}>
              <Button className="webphone-btn" onClick={() => handlecall()}>
                {t("Call")}
              </Button>
              <div
                style={{
                  position: "absolute",
                  bottom: "-50px",
                  left: "0px",
                }}
                // className="phonebook_call_model"
              >
                <Dropdown show={openDropdownId}>
                  <Dropdown.Menu
                    style={{
                      border: "1px solid var(--main-orange-color)",
                    }}
                    ref={dropdownRef}
                  >
                    {contactName?.mobile && (
                      <>
                        <Dropdown.Item
                          style={{
                            backgroundColor: "transparent",
                          }}
                          ref={dropdownRef}
                          className="no-hover-change "
                          onClick={() => {
                            makeCall({
                              number: contactName?.mobile,
                              name: contactName?.name,
                              flag: 1,
                            });
                          }}
                        >
                          <div className="row">
                            <div className="col-12 Numberlength">
                              {contactName?.mobile}{" "}
                            </div>
                          </div>
                        </Dropdown.Item>
                        <hr style={{ margin: "0px" }} />
                      </>
                    )}

                    <Dropdown.Item
                      style={{
                        backgroundColor: "transparent",
                      }}
                      ref={dropdownRef}
                      onClick={() => {
                        makeCall({
                          number: contactName?.extension,
                          name: contactName?.name,
                          flag: 1,
                        });
                      }}
                    >
                      <div className="row ">
                        <div className="col-9  Numberlength">
                          {contactName?.extension}
                        </div>
                        <div className="col-3 Numberlength">
                          <Calling
                            width={25}
                            height={25}
                            style={{
                              color: "var(--main-sidebarfont-color)",
                            }}
                          />
                        </div>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
            <Col className="mb-55 row" style={{ position: "relative" }}>
              <Button
                className="webphone-btn"
                onClick={() => handleVideocall("video")}
              >
                {t("Video")}
              </Button>
              <div
                style={{
                  position: "absolute",
                  bottom: "-50px",
                  left: "0px",
                }}
                // className="phonebook_call_model"
              >
                <Dropdown show={openDropdownIdVideo}>
                  <Dropdown.Menu
                    style={{
                      border: "1px solid var(--main-orange-color)",
                    }}
                    ref={dropdownRef}
                  >
                    {contactName?.mobile && (
                      <>
                        <Dropdown.Item
                          style={{
                            backgroundColor: "transparent",
                          }}
                          ref={dropdownRef}
                          className="no-hover-change"
                          onClick={() => {
                            makeCall({
                              number: contactName?.mobile,
                              name: contactName?.name,
                              flag: 0,
                            });
                          }}
                        >
                          <div className="row">
                            <div className="col-9 Numberlength">
                              {contactName?.mobile}{" "}
                            </div>
                            <div className="col-3 Numberlength">
                              <Calling
                                width={25}
                                height={25}
                                style={{
                                  color: "var(--main-sidebarfont-color)",
                                }}
                              />
                            </div>
                          </div>
                        </Dropdown.Item>
                        <hr style={{ margin: "0px" }} />
                      </>
                    )}
                    <Dropdown.Item
                      style={{
                        backgroundColor: "transparent",
                      }}
                      ref={dropdownRef}
                      onClick={() => {
                        makeCall({
                          number: contactName?.extension,
                          name: contactName?.name,
                          flag: 0,
                        });
                      }}
                    >
                      <div className="row">
                        <div className="col-9 Numberlength">
                          {contactName?.extension}
                        </div>
                        <div className="col-3 Numberlength">
                          <Calling
                            width={25}
                            height={25}
                            style={{
                              color: "var(--main-sidebarfont-color)",
                            }}
                          />
                        </div>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
            <Col className="mb-55 row">
              <Button className="webphone-btn">{t("SMS")}</Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn_cancel me-3"
            style={{ borderRadius: "50px" }}
            onClick={onHide}
          >
            {t("Close")}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ContactCardModal;
