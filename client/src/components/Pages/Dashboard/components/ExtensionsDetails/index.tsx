import { Badge, Card, Col, ProgressBar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { RingGroups } from "./RingGroups";
import { IGetDashboardStatisticOutput } from "../../../../../requests/queries";

interface IExtensionsDetailsProps {
  extensions?: NonNullable<IGetDashboardStatisticOutput>["data"];
  ringGroups?: NonNullable<IGetDashboardStatisticOutput>["ring_group"];
}

export const ExtensionsDetails = ({ extensions, ringGroups }: IExtensionsDetailsProps) => {
  const { t } = useTranslation();
  // @ts-ignore
  const allListeners = useSelector((state) => state.allListeners.allListeners);

  return (
    <div className="row clearfix">
      <Col lg={4} md={12} sm={12} className="col-name p-0">
        <RingGroups ringGroups={ringGroups} />
      </Col>

      <Col lg={8} md={12} className="col-name p-0">
        <Card className="dear-card" style={{ height: "100%" }}>
          <Card.Header className="call_metrics">
            <h2 style={{ marginBottom: "20px" }}>{t("Extensions")}</h2>
          </Card.Header>
          <div className="table-container3 dashboardtablescroll">
            <div className="table-responsive new-table-responsive">
              <table className=" table-news table m-0 ">
                <tbody>
                  {extensions?.map((val) => {
                    if (val) {
                      const localCalls = Number(val?.local_calls) || 0;
                      const answered = Number(val?.answered) || 0;
                      const missed = Number(val?.missed) || 0;

                      const total = localCalls + answered + missed;

                      const localCallsPercent =
                        total > 0 ? ((localCalls / total) * 100).toFixed(0) : 0;
                      const answeredPercent =
                        total > 0 ? ((answered / total) * 100).toFixed(0) : 0;
                      const missedPercent =
                        total > 0 ? ((missed / total) * 100).toFixed(0) : 0;

                      return (
                        <tr
                          className="table-custom-body-trs"
                          style={{
                            borderBottom: "5px solid var(--main-grey-color)",
                            padding: "20px",
                          }}
                          key={val.extension}
                        >
                          <td
                            className="table-custom-body-td"
                            style={{ padding: "0.5rem" }}
                          >
                            <a href="#" className="name-atag">
                              {val.caller_name}
                            </a>
                            <p className="mb-0 text-muted text-size">
                              {t("Status")}:{" "}
                              <Badge
                                className="but-badge"
                                style={{
                                  color:
                                    !!allListeners?.listener_params?.online_extension?.find(
                                      (extension: any) =>
                                        extension.extension_uuid ===
                                        val.extension_uuid
                                    )
                                      ? "var(--main-green-color)"
                                      : "var(--main-orangecustomermodal-color)",
                                }}
                              >
                                {!!allListeners?.listener_params?.online_extension?.find(
                                  (extension: any) =>
                                    extension.extension_uuid ===
                                    val.extension_uuid
                                )
                                  ? t("Online")
                                  : t("Offline")}
                              </Badge>
                            </p>
                          </td>
                          <td
                            className="text-right table-custom-body-td"
                            style={{ padding: "0.5rem" }}
                          >
                            <h6 className="font-14 mb-0 text-size small-cusnum">
                              {/* {val?.user_extension} } */}
                              {val?.extension}
                            </h6>
                            <span className="text-muted text-size">
                              {t("Extension")}
                            </span>
                          </td>
                          <td
                            className="w250 table-custom-body-td"
                            style={{
                              width: "50%",
                              padding: "0.5rem",
                              paddingLeft: "calc( 0.5rem + 10px )",
                            }}
                          >
                            <ProgressBar className="progress-height">
                              <ProgressBar
                                now={Number(localCallsPercent)}
                                style={{
                                  background: "var(--main-borderblue-color)",
                                }}
                              />
                              <ProgressBar
                                variant="green"
                                now={Number(answeredPercent)}
                              />
                              <ProgressBar
                                variant="red"
                                now={Number(missedPercent)}
                              />
                            </ProgressBar>
                            <div className="d-flex bd-highlight mt-2 justify-content-start">
                              <div className="flex-fill bd-highlight">
                                <small className="per-size">
                                  <i
                                    className="fa fa-phone-square text-blue"
                                    style={{ fontSize: "14px" }}
                                  ></i>{" "}
                                  {localCallsPercent}% {t("Called")}
                                </small>
                              </div>
                              <div className="flex-fill bd-highlight">
                                <small className="per-size">
                                  <i
                                    className="fa fa-phone-square text-green"
                                    style={{ fontSize: "14px" }}
                                  ></i>{" "}
                                  {answeredPercent}% {t("Answered")}
                                </small>
                              </div>
                              <div className="flex-fill bd-highlight">
                                <small className="per-size">
                                  <i
                                    className="fa fa-phone-square text-danger"
                                    style={{ fontSize: "14px" }}
                                  ></i>{" "}
                                  {missedPercent}% {t("Missed")}
                                </small>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </Col>
    </div>
  );
};
