import React, { Suspense } from "react";
import { Card, Col, Row } from "react-bootstrap";
import callouticon from "../../Assets/Icon/calloutcoming.svg";
import callinicon from "../../Assets/Icon/calback.svg";
import { ReactComponent as Callmissicon } from "../../Assets/Icon/call-miss.svg";
import calltimeicon from "../../Assets/Icon/hglass.svg";
import { useTranslation } from "react-i18next";
const CalledLineChart = React.lazy(() => import("./CalledLineChart"));
const AnsweLineChart = React.lazy(() => import("./AnsweLineChart"));
const MissedLineChart = React.lazy(() => import("./MissedLineChart"));
const ResponseLineChart = React.lazy(() => import("./ResponseLineChart"));

function ChartCardDashboard({ chartData }) {
  console.log(chartData, "chartDatacheck");
  const { t } = useTranslation();
  return (
    <>
      <Col md={6} lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body>
            <Row className="rowdata clearfix">
              <Col className="col-auto col-name">
                <div className="stamp">
                  <div className="icon-in-bg bg-azura text-white rounded-circle">
                    <img
                      className="icon-call-out fa-2x call-icon"
                      src={callouticon}
                      style={{ width: "30px", height: "30px" }}
                    ></img>
                  </div>
                </div>
              </Col>
              <Col className="text-right col-name">
                <div className="text-muted " style={{ fontSize: "15px" }}>
                  {t(chartData[0]?.title)}
                </div>
                <h4>{chartData[0]?.value}</h4>
              </Col>
            </Row>
          </Card.Body>
          <div className="card-chart-bg">
            <CalledLineChart calledValue={chartData[0]?.value} />
          </div>
        </Card>
      </Col>

      <Col md={6} lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body>
            <Row className="rowdata clearfix">
              <Col className="col-auto col-name">
                <div className="stamp">
                  <div className="icon-in-bg bg-green text-white rounded-circle">
                    <img
                      className="icon-call-in fa-2x call-in-icon"
                      src={callinicon}
                      style={{ height: "30px", width: "30px" }}
                    ></img>
                  </div>
                </div>
              </Col>
              <Col className="text-right col-name">
                <div className="text-muted" style={{ fontSize: "15px" }}>
                  {t(chartData[1]?.title)}
                </div>
                <h4>{chartData[1]?.value}</h4>
              </Col>
            </Row>
          </Card.Body>
          <div className="card-chart-bg">
            <AnsweLineChart answeredValue={chartData[1]?.value} />
          </div>
        </Card>
      </Col>

      <Col md={6} lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body>
            <Row className="rowdata clearfix">
              <Col className="col-auto col-name">
                <div className="stamp">
                  <div className="icon-in-bg bg-red text-white rounded-circle">
                    <Callmissicon className="icon-call-end fa-2x call-in-icon" />
                    {/* <img
                      className="icon-call-end fa-2x call-in-icon"
                      src={callmissicon}
                    ></img> */}
                  </div>
                </div>
              </Col>
              <Col className="text-right col-name">
                <div className="text-muted" style={{ fontSize: "15px" }}>
                  {t(chartData[2]?.title)}
                </div>
                <h4 className="h4 m-0 chart-value">{chartData[2]?.value}</h4>
              </Col>
            </Row>
          </Card.Body>
          <div className="card-chart-bg">
            <MissedLineChart missedValue={chartData[2]?.value} />
          </div>
        </Card>
      </Col>

      <Col md={6} lg={3} className="col-name">
        <Card className="dear-card">
          <Card.Body>
            <Row className="rowdata clearfix">
              <Col xs={2} className="col-name">
                <div className="stamp">
                  <div className="icon-in-bg bg-warning text-white rounded-circle">
                    <img
                      className="fa fa-hourglass-o fa-2x call-in-icon"
                      src={calltimeicon}
                      style={{ height: "48px", width: "35px" }}
                    ></img>
                  </div>
                </div>
              </Col>
              <Col xs={10} className="text-right col-name">
                <div className="text-muted" style={{ fontSize: "15px" }}>
                  {t(chartData[3]?.title)}
                </div>
                <h4 className="h4 m-0 chart-value">{chartData[3]?.value}</h4>
              </Col>
            </Row>
          </Card.Body>
          <div className="card-chart-bg">
            <ResponseLineChart responseLineValue={chartData[3]?.value} />
          </div>
        </Card>
      </Col>
    </>
  );
}

export default ChartCardDashboard;
