import React from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { useTranslation } from "react-i18next";
export default function Textarea({ handleClose, show }) {
  const { t } = useTranslation();
  return (
    <Modal show={show} size="lg">
      <div className="modal-data">
        <div
          className="p-3"
          style={{
            borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
          }}
        >
          <div className="d-flex align-items-center justify-content-between add_new_num">
            <h6>{t("Add note")}</h6>
            <Closeicon width={23} onClick={handleClose} height={23} />
          </div>
        </div>
        <div className="p-3 mb-1">
          <textarea
            name=""
            id=""
            style={{
              width: "100%",
              padding: "6px 12px",
              height: "100px",
              borderColor: "var(--main-bordermodaldashboard-color)",
            }}
            className="search-bg textcall"
          ></textarea>
        </div>
        <div
          className=" d-flex justify-content-end "
          style={{ marginBottom: "30px", marginRight: "33px" }}
        >
          <button className="btn_cancel me-2" onClick={handleClose}>
            {t("Cancel")}
          </button>

          <button className="btn_save" onClick={handleClose}>
            {t("Post")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
