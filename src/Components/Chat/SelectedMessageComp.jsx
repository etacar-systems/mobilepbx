import React from "react";
import { Col, Row } from "react-bootstrap";
import { ReactComponent as Closeselect } from "../../Assets/Icon/closeselect.svg";
import { ReactComponent as Delete } from "../../Assets/Icon/delete.svg";
import { ReactComponent as Forwardicon } from "../../Assets/Icon/forwardicon.svg";
import { useTranslation } from "react-i18next";

export default function SelectedMessageComp({
  count,
  setSelectOpen,
  setDeleteMultiple,
  setForwardMultiple,
  closeselectcomp,
}) {
  const { t } = useTranslation();
  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "10vh",
      }}
    >
      <Col xs={6} className="d-flex justify-content-start align-items-center">
        <Closeselect
          style={{ width: "15px", height: "15px" }}
          onClick={closeselectcomp}
        />
        <span
          style={{
            marginLeft: "10px",
            color: "var(--main-adminheaderpage-color)",
          }}
        >
          {count} {t("Selected")}
        </span>
      </Col>
      <Col xs={6} className="d-flex justify-content-end">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px 20px",
          }}
          onClick={() => setDeleteMultiple(true)}
        >
          <Delete
            style={{
              width: "15px",
              height: "15px",
              fill: "var(--main-adminheaderpage-color)",
              stroke: "var(--main-adminheaderpage-color)",
            }}
          />
          <div
            style={{
              paddingLeft: "5px",
              color: "var(--main-adminheaderpage-color)",
            }}
          >
            {t("Delete")}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 20px",
          }}
          onClick={() => setForwardMultiple(true)}
        >
          <Forwardicon
            style={{
              width: "15px",
              height: "15px",
              fill: "var(--main-adminheaderpage-color)",
            }}
          />
          <div
            style={{
              paddingLeft: "5px",
              color: "var(--main-adminheaderpage-color)",
            }}
          >
            {t("Forward")}
          </div>
        </div>
      </Col>
    </Row>
  );
}
