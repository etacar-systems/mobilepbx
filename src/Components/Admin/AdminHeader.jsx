import React from "react";
import { useTranslation } from "react-i18next";

export default function AdminHeader({ openModal, pathname, addBtn, btnName }) {
  const { t } = useTranslation();
  return (
    <>
      <div
        className="d-flex  justify-content-between"
        style={{ marginBottom: "21px", marginTop: "5px" }}
      >
        <span className="dashboardtext" style={{ lineHeight: "21px" }}>
          {t(pathname)}
        </span>
        {!addBtn && (
          <div>
            <button className="add_new" onClick={openModal}>
              {btnName ? btnName : t("Add new")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
