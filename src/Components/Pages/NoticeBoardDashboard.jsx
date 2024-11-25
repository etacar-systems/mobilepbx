import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import useravatar from "../../Assets/Image/avatar1.jpg";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Bigsize } from "../../Assets/Icon/biggersize.svg";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import Textarea from "../Modal/Textdashboardmodal";
import { useTranslation } from "react-i18next";

function NoticeBoardDashboard({ timelineHeight }) {
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
        className="timeline-container new-timeline dashboardtablescroll"
        style={{ height: `${timelineHeight}px` }}
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
      <Card className="dear-card" style={{ width: "100%", marginTop: "6px" }}>
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
              <Bigsize height={14} width={14} style={{ cursor: "pointer" }} />
            </h2>
            <td className="table_edit" onClick={openmodal2} style={{ marginLeft: "10px" }}>
              <button>
                <Edit_logo width={14} height={14} className="edithover" />
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
                  <Bigsize height={14} width={14} style={{ cursor: "pointer" }} />
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
}

export default NoticeBoardDashboard;
