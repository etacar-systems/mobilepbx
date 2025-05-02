import React, { useMemo } from "react";
import { Card, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Utils from "../../../../../utils";

import { ReactComponent as Personicon } from "../../../../../Assets/Icon/person-line-drawing.svg";
import { ReactComponent as Usersicon } from "../../../../../Assets/Icon/users-svgrepo.svg";
import { ReactComponent as Persontimeicon } from "../../../../../Assets/Icon/time-svgrepo.svg";
import { IGetDashboardStatisticOutput } from "../../../../../requests/queries";

export const DashboardCardDetails = ({
  valuedata,
}: {
  valuedata?: NonNullable<IGetDashboardStatisticOutput>["total_counts"];
}) => {
  const { t } = useTranslation();
  // @ts-ignore
  const allListeners = useSelector((state) => state.allListeners.allListeners);

  const { offlineExtensionsCount, onlineExtensionsCount, busyExtensionsCount } =
    useMemo(() => {
      const offlineExtensionsCount =
        allListeners?.listener_params?.offline_extension?.length || 0;
      const busyExtensionsCount =
        allListeners?.listener_params?.busy_extension?.length || 0;

      return {
        offlineExtensionsCount,
        busyExtensionsCount,
        onlineExtensionsCount:
          (allListeners?.listener_params?.online_extension?.length || 0) +
          busyExtensionsCount,
      };
    }, [allListeners?.listener_params]);

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
                <h4 className="mb-0 font-weight-medium chart-value">
                  {onlineExtensionsCount}
                </h4>
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
                <h4 className="mb-0 font-weight-medium chart-value">
                  {offlineExtensionsCount}
                </h4>
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
              <div className="icon-in-bg bg-red text-white rounded-circle">
                <Usersicon className="icon-users fa-2x  call-in-icon" />
              </div>
              <div className="ml-4">
                <span className="chart-value">{t("Agent busy")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">
                  {busyExtensionsCount}
                </h4>
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
                <span className="chart-value">{t("Average")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">
                  {Utils.formatDuration(
                    !valuedata
                      ? 0
                      : valuedata.total_duration_sec / valuedata.total_local
                    // (valuedata?.total_answered + valuedata?.total_outbound)
                    // valuedata?.avg_response_sec /
                    // (valuedata?.total_answered)
                  )}
                </h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};
