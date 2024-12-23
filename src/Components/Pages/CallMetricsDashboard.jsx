import React, { useEffect, useState } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import PieChartDash from "./PieChartDash";
import LineChart from "./LinechartDash";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close-square-svgrepo-com.svg";
import { ReactComponent as Bigsize } from "../../Assets/Icon/biggersize.svg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Todaylables, Weeklables, Yearlables } from "../ConstantConfig";

function CallMetricsDashboard({
  activeTabs,
  handleSelects,
  screensize,
  theme,
  Theme,
}) {
  const { t } = useTranslation();
  const [show, setshow] = useState(false);
  const data = useSelector(
    (state) =>
      state.getapiall.getapiall.dashboardData?.DashboardDetail
        ?.call_metrics_detail
  );
  const Monthlables = Array.from(
    { length: data?.call_metrics.length || 0 },
    (_, index) => `${index + 1}`
  );
  const [Linechartlabels, setLinechartlabels] = useState([]);
  useEffect(() => {
    if (data && activeTabs) {
      if (activeTabs === "today") {
        setLinechartlabels(Todaylables);
      } else if (activeTabs === "week") {
        setLinechartlabels(Weeklables);
      } else if (activeTabs === "month") {
        setLinechartlabels(Monthlables);
      } else {
        setLinechartlabels(Yearlables);
      }
    }
  }, [activeTabs, data]);
  const Piechartdata = [
    data?.total_answered,
    data?.total_local,
    data?.total_missed,
  ];
  console.log(activeTabs, "activetabs");
  // const Linechartlabels  = data?.call_metrics?.map(item => item.hour);
  const answeredData = data?.call_metrics?.map((item) =>
    parseInt(item.answered)
  );
  const localData = data?.call_metrics?.map((item) =>
    parseInt(item.local_calls)
  );
  const MissedData = data?.call_metrics?.map((item) => parseInt(item.missed));
  const openmodal = () => {
    setshow(true);
  };
  const metricgraph = () => {
    return (
      <div
        className="bg-white data-theme"
        style={{
          borderRadius: "3px",
          border: "1px solid var(--main-bordermodaldashboard-color)",
        }}
      >
        <Row>
          <Col offset={4} xs={12} className="call_matrix_header_container">
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ width: "100%" }}
            >
              <Nav
                className="nav nav-tabs3 "
                activeKey={activeTabs}
                onSelect={handleSelects}
              >
                <Nav.Item>
                  <Nav.Link eventKey="today" className="nav-link2">
                    {t("Today")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="week" className="nav-link2">
                    {t("Week")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="month" className="nav-link2">
                    {t("Month")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="year" className="nav-link2">
                    {t("Year")}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </Col>
        </Row>
        <Row
          style={{
            height: screensize ? "760px" : "370px",
            margin: "0px auto auto 10px",
            width: "100%",
          }}
        >
          <Col offset={5} lg={4}>
            <div className="d-flex justify-content-start mt-3">
              <div className="mr-5">
                <label className="mb-0 text-white">{t("Inbound")}</label>
                <h6 className="metricfont">{data?.total_answered}</h6>
              </div>
              <div className="mr-5">
                <label className="mb-0 text-white">{t("Outbound")}</label>
                <h6 className="metricfont">{data?.total_local}</h6>
              </div>
              <div className="mr-5">
                <label className="mb-0 text-white">{t("Unanswered")}</label>
                <h6 className="metricfont">{data?.total_missed}</h6>
              </div>
            </div>
            <div style={{ height: "255px", width: "260px", margin: "auto" }}>
              <PieChartDash
                theme={theme}
                Theme={Theme}
                Piechartdata={Piechartdata}
              />
            </div>
          </Col>
          <Col
            lg={8}
            style={{ marginTop: screensize ? "180px" : "0px", height: "100%" }}
          >
            <LineChart
              theme={theme}
              Theme={Theme}
              Linechartlabels={Linechartlabels.map(label=>t(label))}
              answeredData={answeredData}
              MissedData={MissedData}
              localData={localData}
            />
          </Col>
        </Row>
      </div>
    );
  };
  return (
    <>
      <div
        className="call_metrics"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{t("Call Metrics")}</h2>
        <h2 onClick={openmodal}>
          <Bigsize height={14} width={14} style={{ cursor: "pointer" }} />
        </h2>
      </div>
      {metricgraph()}

      {show && (
        <Modal
          show={show}
          onHide={() => setshow(false)}
          dialogClassName="modal-supports-open"
          aria-labelledby="example-custom-modal-styling-title"
          style={{ backdropFilter: "brightness(0.2)", height: "auto" }}
        >
          <div style={{ padding: "12px" }}>
            <div
              className="call_metrics "
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>{t("Call Metrics")}</h2>
              <h2 onClick={() => setshow(false)}>
                <Bigsize height={14} width={14} style={{ cursor: "pointer" }} />
              </h2>
            </div>
            <div>{metricgraph()}</div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default CallMetricsDashboard;
