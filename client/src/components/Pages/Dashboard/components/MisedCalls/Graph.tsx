import { Card, Col, Nav, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import Utils from "../../../../../utils";
import { MultiLineChart } from "./MultiLineChart";
import {
  Multilinechart,
  Todaylables,
  Weeklables,
  Yearlables,
} from "../../../../ConstantConfig";
import { IGetMissedCallsMetricsOutput } from "../../../../../requests/queries";

interface IGraphProps<T = "today" | "week" | "month" | "year"> {
  value: T;
  onSelect: (type?: T) => void;
  totalMissedCalls: number;
  averageWaitingTime: number;
  data: NonNullable<IGetMissedCallsMetricsOutput>["data"];
}

export const Graph = ({
  value,
  onSelect,
  totalMissedCalls,
  averageWaitingTime,
  data,
}: IGraphProps) => {
  const { t } = useTranslation();

  const labels = useMemo(() => {
    if (value === "year") return Yearlables;
    else if (value === "month")
      return Array.from({ length: data.length }, (_, index) => `${index + 1}`);
    else if (value === "week") return Weeklables;
    else return Todaylables;
  }, [value, data]);

  const lineChartData = useMemo(() => {
    return {
      labels: labels.map((val) => t(val)),
      datasets: [
        {
          label: t("Missed"),
          data: data.map((missedCall) => Number(missedCall.missed_calls)),
          borderColor: Multilinechart.dataset1color,
          backgroundColor: Multilinechart.dataset1color,
          borderWidth: 2,
          yAxisID: "y",
          pointLabel: {
            display: true,
            formatter: function (value: string) {
              return value;
            },
          },
        },
        {
          label: t("Average waiting time"),
          data: data.map((missedCall) =>
            Number(missedCall.answered_calls) > 0
              ? Math.round(
                  Number(missedCall.total_response_time) /
                    Number(missedCall.answered_calls)
                )
              : 0
          ),
          borderColor: Multilinechart.dataset2color,
          backgroundColor: Multilinechart.dataset2color,
          borderWidth: 2,
          yAxisID: "y1",
          pointLabel: {
            display: true,
            formatter: function (value: string) {
              return Utils.formatDuration(value) || 0 + "s";
            },
          },
        },
      ],
    };
  }, [labels, data, t]);

  return (
    <Card.Body className="misscall" style={{ width: "100%", height: "500px" }}>
      <Row>
        <Col offset={1} xs={12} className="">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "100%" }}
          >
            <Nav
              className="nav nav-tabs3 mb-2"
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
      <div className="d-flex justify-content-start mb-3">
        <div className="mr-5">
          <label className="mb-0 header-size missed-header">
            {t("Missed calls")}
          </label>
          <h4 className="font-h4 missed-header">
            {totalMissedCalls} {t("Calls")}
          </h4>
        </div>
        <div className="mr-5">
          <label className="mb-0 header-size missed-header">
            {t("Average waiting time")}
          </label>
          <h4 className="font-h4 missed-header">
            {averageWaitingTime
              ? Utils.formatDuration(Math.round(averageWaitingTime))
              : 0 + "s"}
          </h4>
        </div>
      </div>
      <div id="chart-Event-sale-overview">
        <MultiLineChart data={lineChartData} />
      </div>
    </Card.Body>
  );
};
