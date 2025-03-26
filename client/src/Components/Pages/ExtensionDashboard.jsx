import React from "react";
import { Badge, Card, ProgressBar } from "react-bootstrap";

function ExtensionDashboard() {
  return (
    <Card className="dear-card">
      <Card.Header className="call_metrics">
        <h2>Extensions</h2>
      </Card.Header>
      <div className="table-container3">
        <div className="table-responsive new-table-responsive">
          <table className="table-news table table-custom spacing5 m-0">
            <tbody>
              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">500</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar
                      variant="blue"
                      now={60}
                      className="fontcolor"
                    />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">301</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar variant="blue" now={60} />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">301</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar variant="blue" now={60} />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">301</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar variant="blue" now={60} />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">301</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar variant="blue" now={60} />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">301</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar variant="blue" now={60} />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">301</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar variant="blue" now={60} />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">301</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar variant="blue" now={60} />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="table-custom-body-trs">
                <td className="table-custom-body-td">
                  <a href="#" className="name-atag">
                    John Smith
                  </a>
                  <p className="mb-0 text-muted text-size">
                    Status:{" "}
                    <Badge variant="success" className="but-badge">
                      Online
                    </Badge>
                  </p>
                </td>
                <td className="text-right table-custom-body-td">
                  <h6 className="font-14 mb-0 text-size">301</h6>
                  <span className="text-muted text-size">Sales agent</span>
                </td>
                <td className="w350 table-custom-body-td">
                  <ProgressBar className="progress-height">
                    <ProgressBar variant="blue" now={60} />
                    <ProgressBar variant="green" now={20} />
                    <ProgressBar variant="red" now={20} />
                  </ProgressBar>
                  <div className="d-flex bd-highlight mt-2 call-data">
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-blue"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        60% Called
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-green"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Answered
                      </small>
                    </div>
                    <div className="flex-fill bd-highlight">
                      <small className="per-size">
                        <i
                          className="fa fa-phone-square text-danger"
                          style={{ fontSize: "14px" }}
                        ></i>{" "}
                        20% Missed
                      </small>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

export default ExtensionDashboard;
