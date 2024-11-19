import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import { ReactComponent as Personicon } from "../../Assets/Icon/person-line-drawing.svg";
import { ReactComponent as Usersicon } from "../../Assets/Icon/users-svgrepo.svg";
import { ReactComponent as Persontimeicon } from "../../Assets/Icon/time-svgrepo.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setExtensionStatus } from "../../Redux/Reducers/DataServices";
function DashboardCardDetails() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const allListeners = useSelector((state) => state.allListeners.allListeners);
  const data = useSelector((state) => state.getapiall.getapiall.dashboardData);
  let valuedata = data?.DashboardDetail?.reports_counts;
  console.log(data,valuedata, "datacheckfinal");
  console.log(allListeners, "allListenerscheck");
  const busyAndOnlineCount =
    (allListeners?.listener_params?.busy_extension?.length || 0) +
    (allListeners?.listener_params?.online_extension?.length || 0);
  const offlineCount = allListeners?.listener_params?.offline_extension?.length || 0;

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  
  return (
    <>
      <Col lg={3} md={6} className="col-name">
        <Card
          className="dear-card "
          style={{ padding: "20px 24px", whiteSpace: "nowrap" }}
        >
          <Card.Body style={{ padding: "20px " }}>
            <div className="d-flex align-items-center">
              <div className="icon-in-bg bg-green text-white rounded-circle">
                <Personicon className="icon-user fa-2x call-in-icon" />
                {/* <img className="icon-user fa-2x call-in-icon" src={personicon}></img> */}
              </div>
              <div className="ml-4">
                <span className="chart-value">{t("Agent online")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">{busyAndOnlineCount}</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="col-name">
        <Card
          className="dear-card"
          style={{ padding: " 20px 24px", whiteSpace: "nowrap" }}
        >
          <Card.Body style={{ padding: "20px " }}>
            <div className="d-flex align-items-center">
              <div className="icon-in-bg bg-primary newbg-primary text-white rounded-circle">
                <i
                  className="fa fa-sign-out fa-2x"
                  style={{ fontSize: "x-large" }}
                ></i>
              </div>
              <div className="ml-4">
                <span className="chart-value">{t("Agent offline")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">{offlineCount}</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="col-name">
        <Card
          className="dear-card"
          style={{ padding: "20px 24px", whiteSpace: "nowrap" }}
        >
          <Card.Body style={{ padding: "20px " }}>
            <div className="d-flex align-items-center">
              <div className="icon-in-bg bg-warning text-white rounded-circle">
                <Usersicon className="icon-users fa-2x  call-in-icon" />
              </div>
              <div className="ml-4">
                <span className="chart-value">{t("Calls queue")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">85</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="col-name">
        <Card
          className="dear-card"
          style={{ padding: "20px 24px", whiteSpace: "nowrap" }}
        >
          <Card.Body style={{ padding: "20px " }}>
            <div className="d-flex align-items-center">
              <div className="icon-in-bg bg-indigo text-white rounded-circle">
                <Persontimeicon className="icon-clock fa-2x call-in-icon" />
                {/* <img className="icon-clock fa-2x call-in-icon" src={persontimeicon}></img> */}
              </div>
              <div className="ml-4">
                <span className="chart-value">{t("Durations")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">
                  {formatDuration(valuedata?.total_duration_sec)}
                  </h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default DashboardCardDetails;
