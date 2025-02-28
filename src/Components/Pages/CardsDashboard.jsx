import React from "react";
import { Card, Col, ProgressBar } from "react-bootstrap";
import ProgressCircle from "./CustomeChart";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function CardsDashboard({
  progress,
  handleProgressClick,
  progress1,
  handleProgressClick1,
}) {
  const data = useSelector(
    (state) =>
      state.getapiall.getapiall.dashboardData?.DashboardDetail
        ?.reports_counts_updated
  );
  console.log("cardetails ", data);
  const { t } = useTranslation();

  return (
    <>
      <Col lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body className="text-center" style={{ padding: "16px 15px" }}>
            <p className="chart-value mb-1 mt-2">{t("SLA")}</p>
            <div className="rowdata">
              <div className="col-12 text-center new-chart col-name">
                <ProgressCircle
                  passWholeProgress="progress-circle"
                  classNames="progress-circle__svg"
                  pragressLable="progress-circle__label1 chart-value progressfont"
                  onClick={handleProgressClick1}
                  // Totalcall={data?.sla?.answered_call + data?.sla?.missed_call}
                  Totalcall={data?.total_answered + data?.total_missed}
                  Answeredcall={data?.total_answered}
                  // Answeredcall={data?.sla?.answered_call}
                  Title1={t("Answered")}
                  Title2={t("Missed")}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body className="text-center" style={{ padding: "16px 15px" }}>
            <p className="chart-value mb-1 mt-2">{t("Calls comparison")}</p>
            <div className="rowdata">
              <div className="col-12 text-center new-chart col-name">
                <ProgressCircle
                  passWholeProgress="progress-circle"
                  classNames="progress-circle__svg"
                  bgcolor="var(--main-borderblue-color)"
                  pragressLable="progress-circle__label1 chart-value progressfont2"
                  onClick={handleProgressClick}
                  // Totalcall={data?.call_comparison.answered_call + data?.call_comparison?.local}
                  // Totalcall={data?.call_comparison?.answered_call + data?.call_comparison?.local}
                  // Answeredcall={data?.call_comparison.answered_call}
                  // Answeredcall={data?.call_comparison?.answered_call}
                  Totalcall={
                    (data?.today_total_calls -
                    data?.today_missed_calls) +
                    data?.today_total_calls
                  }
                  Answeredcall={data?.total_answered}
                  Title1={t("Answered")}
                  Title2={t("Called")}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body className="text-center" style={{ padding: "15px 36px" }}>
            <p className="chart-value">{t("Calls today")}</p>

            <div className="rowdata">
              <div className="col-12 text-center col-name">
                <h2>
                  {data?.today_total_calls +
                    (data?.today_total_calls - data?.today_missed_calls) ?? 0}
                </h2>
              </div>
            </div>

            <div className="rowdata mt-4">
              <div className="col-12 text-center col-name">
                <h4 className="m-b-0 chart-value">
                  {data?.today_total_calls > 0
                    ? (
                        ((data?.today_total_calls - data?.today_missed_calls) /
                          (data?.today_total_calls +
                            (data?.today_total_calls -
                              data?.today_missed_calls) ?? 0)) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </h4>
              </div>
            </div>

            <div
              className="col-12 col-name chartprogress"
              style={{ marginBottom: "8px", position: "relative" }}
            >
              {/* Blue Background (Total Calls) */}
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  backgroundColor: "var(--main-borderblue-color)",
                  borderRadius: "5px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Green Overlay (Answered Calls) */}
                <div
                  style={{
                    width: `${
                      data?.today_total_calls > 0
                        ? ((data?.today_total_calls -
                            data?.today_missed_calls) /
                            (data?.today_total_calls +
                              (data?.today_total_calls -
                                data?.today_missed_calls) ?? 0)) *
                          100
                        : 0
                    }%`,
                    height: "100%",
                    backgroundColor: "var(--main-green-color)",
                    borderRadius: "5px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                ></div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body className="text-center" style={{ padding: "15px 36px" }}>
            <p className="chart-value">{t("Missed today")}</p>

            <div className="rowdata">
              <div className="col-12 text-center col-name">
                <h2>{data?.today_missed_calls ?? 0}</h2>
              </div>
            </div>

            <div className="rowdata mt-4">
              <div className="col-12 text-center col-name">
                <h4 className="m-b-0 chart-value">
                  {data?.today_total_calls > 0
                    ? (
                        (data?.today_missed_calls / data?.today_total_calls) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </h4>
              </div>
            </div>

            <div
              className="col-12 col-name chartprogress"
              style={{ marginBottom: "8px", position: "relative" }}
            >
              {/* Blue Background (Total Calls) */}
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  backgroundColor: "var(--main-green-color)",
                  borderRadius: "5px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Red Overlay (Missed Calls) */}
                <div
                  style={{
                    width: `${
                      data?.today_total_calls > 0
                        ? (data?.today_missed_calls / data?.today_total_calls) *
                          100
                        : 0
                    }%`,
                    height: "100%",
                    backgroundColor: "var(--main-red-color)",
                    borderRadius: "5px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                ></div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default CardsDashboard;
