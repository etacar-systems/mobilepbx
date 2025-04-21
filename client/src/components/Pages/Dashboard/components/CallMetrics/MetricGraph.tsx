import { Col, Nav, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import {
  Todaylables,
  Weeklables,
  Yearlables,
} from "../../../../ConstantConfig";

interface IMetricGraphProps<T = "today" | "week" | "month" | "year"> {
  value: T;
  onSelect: (type?: T) => void;
  answeredCallsData: Array<number>;
  missedCallsData: Array<number>;
  localCallsData: Array<number>;
  totalAnswered: number;
  totalLocal: number;
  totalMissed: number;
}

export const MetricGraph = ({
  onSelect,
  value,
  answeredCallsData,
  missedCallsData,
  localCallsData,
  totalAnswered,
  totalLocal,
  totalMissed,
}: IMetricGraphProps) => {
  const { t } = useTranslation();

  const labels = useMemo(() => {
    if (value === "year") return Yearlables;
    else if (value === "month")
      return Array.from(
        { length: localCallsData.length },
        (_, index) => `${index + 1}`
      );
    else if (value === "week") return Weeklables;
    else return Todaylables;
  }, [value, localCallsData]);

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
              activeKey={value}
              onSelect={(key) => onSelect((key as typeof value) || undefined)}
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
          // height: screensize ? "760px" : "370px",
          margin: "0px auto auto 10px",
          width: "100%",
        }}
      >
        <Col offset={5} lg={4}>
          <div className="d-flex justify-content-start mt-3">
            <div className="mr-5">
              <label className="mb-0 text">{t("Answered")}</label>
              <h6 className="metricfont">{totalAnswered}</h6>
            </div>
            <div className="mr-5">
              <label className="mb-0 text">{t("Local")}</label>
              <h6 className="metricfont">{totalLocal}</h6>
            </div>
            <div className="mr-5">
              <label className="mb-0 text">{t("Missed")}</label>
              <h6 className="metricfont">{totalMissed}</h6>
            </div>
          </div>
          <div style={{ height: "255px", width: "260px", margin: "auto" }}>
            <PieChart data={[totalAnswered, totalLocal, totalMissed]} />
          </div>
        </Col>
        <Col
          lg={8}
          style={{
            // marginTop: screensize ? "180px" : "0px",
            height: "100%",
          }}
        >
          <LineChart
            labels={labels.map((label) => t(label))}
            answeredCallsData={answeredCallsData}
            missedCallsData={missedCallsData}
            localCallsData={localCallsData}
          />
        </Col>
      </Row>
    </div>
  );
};
