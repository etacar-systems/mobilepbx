import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-medium-image-zoom/dist/styles.css";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { AllWhatsappEmit } from "../Whatsapp/Whatsappsocketconfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Assign({ show, setShow, sidebarobjget }) {
  const { t } = useTranslation();
  const firstname = Cookies.get("firstname");
  const lastname = Cookies.get("lastname");
  const uid = Cookies.get("User_id");
  const cid = Cookies.get("Company_Id");
  const data = useSelector(
    (state) => state.getapiall.getapiall.complist.usersData
  );
  const dataa = [
    { first_name: firstname, last_name: lastname, cid: cid, _id: uid },
    ...data,
  ];
  const conversation_id = Cookies.get("conversation_id");

  const handleAssign = (val) => {
    setShow(false);
    const data = {
      cid: val?.cid,
      receiver_id: conversation_id,
      assigned_id: val?._id,
    };

    AllWhatsappEmit("user_assign", data);
    toast.success(
      `${t("User assigned successfully to")} ${sidebarobjget?.name}`,
      {
        autoClose: 2000,
      }
    );
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-img-open"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <div
          style={{
            backgroundColor: "var(--main-modalbackground-color)",
            width: "350px",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid var(--main-siderfont-color)",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ marginTop: "10px", padding: "0px 10px" }}
          >
            <span
              style={{
                fontSize: "20px",
                color: "var(--main-adminheaderpage-color)",
                fontWeight: "400",
              }}
            >
              {t("Assign number")}
            </span>
            <Closeicon width={30} onClick={() => setShow(false)} height={30} />
          </div>
          <hr
            className="mb-1 "
            style={{ color: "var(--main-sidebarfont-color)" }}
          />

          <div
            style={{ maxHeight: "250px", overflow: "auto" }}
            className="sidebar_scroll"
          >
            {dataa?.map((ele) => {
              return (
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{ padding: "13px" }}
                >
                  <h6
                    style={{
                      maxWidth: "60%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ele?.first_name} {ele?.last_name}
                  </h6>
                  <button
                    style={{
                      border: "none",
                      borderRadius: "50px",
                      fontSize: "12px",
                      backgroundColor: "var(--main-orange-color)",
                      color: "white",
                      padding: "3px 15px",
                    }}
                    onClick={() => {
                      handleAssign(ele);
                    }}
                  >
                    {t("Assign")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
