import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";

import Textarea from "../../../../Modal/Textdashboardmodal";

import styles from "./noticedBoard.module.scss";

import { ReactComponent as ResizeIcon } from "../../../../../Assets/Icon/biggersize.svg";
import { ReactComponent as EditIcon } from "../../../../../Assets/Icon/edit.svg";

export const NoticeBoard = () => {
  const { t } = useTranslation();
  const [show, setshow] = useState(false);

  const [show2, setshow2] = useState(false);
  const openmodal = () => {
    setshow(true);
  };
  const openmodal2 = () => {
    setshow2(true);
  };
  const handleClose2 = () => {
    setshow2(false);
  };
  const graphnotice = () => {
    return (
      <div
        style={{ height: "calc(100% - 42px)" }}
        className="timeline-container new-timeline dashboardtablescroll"
      >
        <Card.Body className="noticeboard" style={{ height: "100%" }}>
          <div className="text-center text-muted mt-3">No Data Found</div>
          {/* <ul className="timeline">
            <li className="timeline-item">
              <div className="timeline-info">
                <span className="missed-header">Feb 15, 2024 - Timestamp</span>
              </div>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="timeline-title missed-header">Title</h3>
                <p className="missed-header">Text content...</p>
                <ul className="list-unstyled team-info sm margin-0">
                  <li>
                    <p className="missed-header">Posted by</p>
                  </li>
                  <br />
                  <li>
                    <img src={useravatar} alt="avatar" />
                  </li>
                  <li className="ml-2">
                    <span className="user-name">Linda Smith</span>
                  </li>
                </ul>
              </div>
            </li>

            <li className="timeline-item">
              <div className="timeline-info">
                <span className="missed-header">Feb 23, 2024 - Timestamp</span>
              </div>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="timeline-title missed-header">Title</h3>
                <p className="missed-header">Text content...</p>
                <ul className="list-unstyled team-info sm margin-0">
                  <li>
                    <p className="missed-header">Posted by</p>
                  </li>
                  <br />
                  <li>
                    <img src={useravatar} alt="avatar" />
                  </li>
                  <li className="ml-2">
                    <span className="user-name">Linda Smith</span>
                  </li>
                </ul>
              </div>
            </li>

            <li className="timeline-item period">
              <div className="timeline-info"></div>
              <div className="timeline-content">
                <h2 className="timeline-title ptag-use missed-header" style={{ padding: "15px" }}>
                  March 2024
                </h2>
              </div>
            </li>

            <li className="timeline-item">
              <div className="timeline-info">
                <span className="missed-header">April 02, 2024 - Timestamp</span>
              </div>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="timeline-title missed-header">Title</h3>
                <p className=" missed-header">Text content...</p>
                <ul className="list-unstyled team-info sm margin-0">
                  <li>
                    <p className="missed-header">Posted by</p>
                  </li>
                  <br />
                  <li>
                    <img src={useravatar} alt="avatar" />
                  </li>
                  <li className="ml-2">
                    <span className="user-name">Linda Smith</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul> */}
        </Card.Body>
      </div>
    );
  };
  return (
    <>
      <Card
        className={["dear-card", styles.wrapper].join(" ")}
        style={{
          width: "100%",
          height: "100%",
          marginBottom: "unset !important",
        }}
      >
        <Card.Header
          className="header call_metrics mb-0"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>{t("Notice board")}</h2>
          <div className="d-flex align-items-center ">
            <h2 onClick={openmodal}>
              <ResizeIcon
                height={14}
                width={14}
                style={{ cursor: "pointer" }}
              />
            </h2>
            <td
              className="table_edit"
              onClick={openmodal2}
              style={{ marginLeft: "10px" }}
            >
              <button>
                <EditIcon width={14} height={14} className="edithover" />
              </button>
            </td>
          </div>
        </Card.Header>
        {graphnotice()}
      </Card>
      {show && (
        <Modal
          show={show}
          onHide={() => setshow(false)}
          dialogClassName="modal-supports-open"
          aria-labelledby="example-custom-modal-styling-title"
          style={{ backdropFilter: "brightness(0.2)", height: "auto" }}
        >
          <div style={{ padding: "12px" }}>
            <Card className="dear-card " style={{ width: "100%" }}>
              <Card.Header
                className="header call_metrics"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>{t("Notice board")}</h2>
                <h2 onClick={() => setshow(false)}>
                  <ResizeIcon
                    height={14}
                    width={14}
                    style={{ cursor: "pointer" }}
                  />
                </h2>
              </Card.Header>
              {graphnotice()}
            </Card>
          </div>
        </Modal>
      )}
      {show2 && <Textarea show={show2} handleClose={handleClose2} />}
    </>
  );
};
