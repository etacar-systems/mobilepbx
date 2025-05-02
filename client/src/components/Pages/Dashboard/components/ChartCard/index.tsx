import React, { useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { LineChart } from "./LineChart";
import Utils from "../../../../../utils";

import totalCallsIcon from "../../../../../Assets/Icon/calloutcoming.svg";
import answeredCallsIcon from "../../../../../Assets/Icon/calback.svg";
import { ReactComponent as MissedCallIcon } from "../../../../../Assets/Icon/call-miss.svg";
import responseTimeIcon from "../../../../../Assets/Icon/hglass.svg";

interface IChartCardProps {
  totalCalls: number;
  totalMissed: number;
  totalAnswered: number;
  responseTime: number;
}

export const ChartCard = ({
  totalCalls,
  totalMissed,
  totalAnswered,
  responseTime,
}: IChartCardProps) => {
  const { t } = useTranslation();

  // console.log('chartData', chartData);

  const data = useMemo(() => {
    return [
      {
        title: "Called",
        value: totalCalls,
        label: undefined,
        img: (
          <img
            className="icon-call-out fa-2x call-icon"
            alt="total"
            src={totalCallsIcon}
            style={{ width: "30px", height: "30px" }}
          ></img>
        ),
        color: "blue",
        string: false,
      },
      {
        title: "answered",
        img: (
          <img
            className="icon-call-out fa-2x call-icon"
            alt="answered"
            src={answeredCallsIcon}
            style={{ width: "30px", height: "30px" }}
          ></img>
        ),
        value: totalAnswered,
        label: undefined,
        color: "green",
        string: false,
      },
      {
        title: "missed",
        img: <MissedCallIcon className="icon-call-end fa-2x call-in-icon" />,
        value: totalMissed,
        label: undefined,
        color: "red",
        string: false,
      },
      {
        title: "Response time",
        img: (
          <img
            className="icon-call-out fa-2x call-icon"
            alt="Average response time"
            src={responseTimeIcon}
            style={{ width: "30px", height: "30px" }}
          ></img>
        ),
        value: responseTime,
        color: "yellow",
        string: true,
      },
    ] as const;
  }, [totalCalls, totalMissed, totalAnswered, responseTime]);

  return (
    <>
      {data.map((chart) => (
        <Col key={chart.title} md={6} lg={3} className="col-name">
          <Card className="dear-card">
            <Card.Body>
              <Row className="rowdata clearfix">
                <Col xs={2} className="col-auto col-name">
                  <div className="stamp">
                    <div
                      className={`icon-in-bg text-white rounded-circle bg-${chart.color}`}
                    >
                      {chart.img}
                    </div>
                  </div>
                </Col>
                <Col className="text-right col-name">
                  <div
                    className="text-muted "
                    style={{ fontSize: "15px", textTransform: "capitalize" }}
                  >
                    {t(chart.title)}
                  </div>
                  <h4>
                    {chart.string
                      ? Utils.formatDuration(chart.value)
                      : chart.value}
                  </h4>
                </Col>
              </Row>
            </Card.Body>
            <div className="card-chart-bg">
              <LineChart
                label={t(chart.title)}
                color={chart.color}
                value={chart.value}
              />
            </div>
          </Card>
        </Col>
      ))}
    </>
  );
};
