import React, { useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { ReactComponent as DotsThreeVertical } from "../../Assets/Icon/DotsThreeVertical.svg";
import { ReactComponent as BackArrow } from "../../Assets/Icon/back-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { openChat, openSidebar } from "../../Redux/Reducers/DataServices";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Assign from "../Modal/Assign";
import { useTranslation } from "react-i18next";
import { AllWhatsappEmit } from "./Whatsappsocketconfig";
import Cookies from "js-cookie";

function Wpchatheader({ sidebarobjget }) {
  const data = useSelector(
    (state) => state.getapiall.getapiall.complist.usersData
  );
  const cid = Cookies.get("Company_Id");
  const Sidebar = useSelector(
    (state) => state.getapiall.getapiall.wpsidebarCompanydetail
  );
  const senderId = Sidebar?.CompanyDetail?.whatsapp_number;

  const convertToLocalTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const timeOptions = { hour: "2-digit", minute: "2-digit" }; // Options to exclude seconds
    const dateOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }; // Options for full date and time without seconds

    if (isToday) {
      return `Last seen at ${date.toLocaleTimeString(undefined, timeOptions)}`; // Only show time if it's today
    } else {
      return `Last seen on ${date.toLocaleDateString()} at ${date.toLocaleTimeString(
        undefined,
        timeOptions
      )}`; // Show full date and time otherwise
    }
  };

  var lastseensidebar = convertToLocalTime(
    sidebarobjget?.last_seen || sidebarobjget?.last_message_time
  );

  let imageshowpath = ``;
  const allListeners = useSelector((state) => state.allListeners.allListeners);

  const screensize = window.innerWidth > 991;
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [show, setShow] = useState(false);

  const handleToggle = (isOpen) => {
    setShowDropdown(isOpen);
  };
  const clearChat = () => {
    const data = {
      sender_id: senderId,
      receiver_id: sidebarobjget?._id,
      cid: cid,
    };
    AllWhatsappEmit("clear_chat", data);
  };

  const openModal = () => {
    setShow(true);
  };
  const backBtn = () => {
    dispatch(openChat(false));
    dispatch(openSidebar(true));
  };
  const { t } = useTranslation();
  return (
    <>
      <Row
        style={{ background: "var(--main-white-color)", height: "56px" }}
        className="borderend3"
      >
        <Col
          xs={9}
          style={{ display: "flex", padding: "3px", alignItems: "center" }}
          className="ps-1"
        >
          {!screensize && (
            <div onClick={backBtn} className="mx-1">
              <BackArrow width={25} height={25} />
            </div>
          )}
          <div className="ms-1">
            {sidebarobjget.image ? (
              <Image
                src={imageshowpath}
                style={{ width: "30px", height: "30px" }}
                alt=""
                roundedCircle
              />
            ) : (
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  background: "var(--main-orange-color)",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                {sidebarobjget?.name?.charAt(0)?.toUpperCase() ||
                  sidebarobjget?.first_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ms-3">
            <div
              style={{
                textTransform: "capitalize",
                color: "var(--main-adminheaderpage-color)",
              }}
            >
              {sidebarobjget.name ||
                sidebarobjget.first_name + sidebarobjget.last_name}
            </div>
          </div>
        </Col>
        <Col
          xs={3}
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <button
            style={{
              border: "none",
              borderRadius: "5px",
              fontSize: "12px",
              backgroundColor: "var(--main-orange-color)",
              color: "white",
              padding: "3px 10px",
            }}
            className="mb-1 mt-1 me-3"
            onClick={openModal}
          >
            {t("Assign")}
          </button>
          <DropdownButton
            align="start"
            id="dropdown-menu-align-end"
            show={showDropdown}
            className="custom-dropdown-button"
            onToggle={handleToggle}
            title={
              <DotsThreeVertical
                style={{ cursor: "pointer", marginLeft: "-10px" }}
              />
            }
          >
            <Dropdown.Item eventKey="2" onClick={clearChat}>
              {t("Clear Chat")}
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      <Assign show={show} setShow={setShow} sidebarobjget={sidebarobjget} />
    </>
  );
}

export default Wpchatheader;
