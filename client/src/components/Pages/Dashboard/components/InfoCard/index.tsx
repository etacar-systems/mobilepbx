import React from "react";
import { Card, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import ProgressCircle from "../../../Dashboard/CustomeChart";
import { IGetDashboardStatisticOutput } from "../../../../../requests/queries";

interface IInfoCardProps {
  data?: NonNullable<IGetDashboardStatisticOutput>["total_counts"];
}

export const InfoCard = ({ data }: IInfoCardProps) => {
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
                  Totalcall={
                    !data ? 0 : data.total_answered + data.total_missed
                  }
                  Answeredcall={data?.total_answered}
                  Title1={t("Answered")}
                  Title2={t("Missed")}
                  completedColor={undefined}
                  bgcolor={undefined}
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
                  Totalcall={
                    !data ? 0 : data.total_calls
                    //data.total_answered
                    // data.today_total_calls
                  }
                  Answeredcall={!data ? 0 : data?.total_answered}
                  Title1={t("Answered")}
                  Title2={t("Called")}
                  completedColor={undefined}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body className="text-center" style={{ padding: "24px 36px" }}>
            <p className="chart-value">{t("Calls today")}</p>

            <div className="rowdata">
              <div className="col-12 text-center col-name">
                <h2>
                  {
                    data?.today_total_calls ?? 0 //+
                    // ((data?.today_total_calls ?? 0) -
                    //   (data?.today_missed_calls ?? 0))
                  }
                </h2>
              </div>
            </div>

            <div className="rowdata mt-4">
              <div className="col-12 text-center col-name">
                <h4 className="m-b-0 chart-value">
                  {!data || data.today_total_calls <= 0
                    ? 0
                    : (
                        (data.today_answered_calls / data.today_total_calls) *
                        100
                      ).toFixed(2)}
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
                      !data || data.today_total_calls <= 0
                        ? 0
                        : (data.today_answered_calls / data.today_total_calls) *
                          100
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
          <Card.Body className="text-center" style={{ padding: "24px 36px" }}>
            <p className="chart-value">{t("Missed today")}</p>

            <div className="rowdata">
              <div className="col-12 text-center col-name">
                <h2>{data?.today_missed_calls || 0}</h2>
              </div>
            </div>

            <div className="rowdata mt-4">
              <div className="col-12 text-center col-name">
                <h4 className="m-b-0 chart-value">
                  {!data || data.today_total_calls <= 0
                    ? 0
                    : (
                        (data.today_missed_calls / data.today_total_calls) *
                        100
                      ).toFixed(2)}
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
                      !data || data.today_total_calls <= 0
                        ? 0
                        : (data?.today_missed_calls / data?.today_total_calls) *
                          100
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
};
