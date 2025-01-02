import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import { ReactComponent as Personicon } from "../../Assets/Icon/person-line-drawing.svg";
import { ReactComponent as Usersicon } from "../../Assets/Icon/users-svgrepo.svg";
import { ReactComponent as Persontimeicon } from "../../Assets/Icon/time-svgrepo.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setExtensionStatus } from "../../Redux/Reducers/DataServices";
import Utils from "../../utils";
function DashboardCardDetails() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const allListeners = useSelector((state) => state.allListeners.allListeners);
  const data = useSelector((state) => state.getapiall.getapiall.dashboardData);
  let valuedata = data?.DashboardDetail?.reports_counts_updated;
  // console.log(data, valuedata, "datacheckfinal");
  // console.log(allListeners, "allListenerscheck");
  const busyAndOnlineCount =
    (allListeners?.listener_params?.busy_extension?.length || 0) +
    (allListeners?.listener_params?.online_extension?.length || 0);
  const offlineCount = allListeners?.listener_params?.offline_extension?.length || 0;
  const [onlinecount, setOnlineCount] = useState(0);
  const [offlinecount, setofflineCount] = useState(offlineCount);
  useEffect(() => {
    const calculateOnlineSum = (array) => {
      let sum = 0;
      for (const item of array) {
        sum += item.is_online || 0; // Add `is_online` or default to 0
      }
      return sum;
    };
    const calculateofflineSum = (array) => {
      let sum = 0;
      for (const item of array) {
        sum += item.is_online === 0; // Add `is_online` or default to 0
      }
      return sum;
    };
    if (
      allListeners?.listener_params?.busy_extension?.length ||
      allListeners?.listener_params?.offline_extension?.length ||
      allListeners?.listener_params?.online_extension?.length
    ) {
      const busy_extension_sum =
        allListeners?.listener_params?.busy_extension.length &&
        calculateOnlineSum(allListeners?.listener_params.busy_extension);
      // console.log(`busy_extension_sum Extension Online Sum: ${busy_extension_sum}`);

      const offline_extension_sum =
        allListeners?.listener_params?.offline_extension.length &&
        calculateOnlineSum(allListeners?.listener_params.offline_extension);
      // console.log(`offline_extension_sum Extension Online Sum: ${offline_extension_sum}`);

      const online_extension_sum =
        allListeners?.listener_params?.online_extension.length &&
        calculateOnlineSum(allListeners?.listener_params.online_extension);
      // console.log(`offline_extension_sum Extension Online Sum: ${online_extension_sum}`);

      const offline_extension_count =
        allListeners?.listener_params?.offline_extension.length &&
        calculateofflineSum(allListeners?.listener_params.offline_extension);
      // console.log(`offline_extension_sum Extension Online Sum: ${offline_extension_count}`);
      setofflineCount(offline_extension_count);
      setOnlineCount(busy_extension_sum + offline_extension_sum + online_extension_sum);
    }
  }, [allListeners?.listener_params]);

  return (
    <>
      <Col lg={3} md={6} className="col-name">
        <Card className="dear-card " style={{ padding: "20px 24px", whiteSpace: "nowrap" }}>
          <Card.Body style={{ padding: "20px " }}>
            <div className="d-flex align-items-center">
              <div className="icon-in-bg bg-green text-white rounded-circle">
                <Personicon className="icon-user fa-2x call-in-icon" />
                {/* <img className="icon-user fa-2x call-in-icon" src={personicon}></img> */}
              </div>
              <div className="ml-4">
                <span className="chart-value">{t("Agent online")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">{onlinecount}</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="col-name">
        <Card className="dear-card" style={{ padding: " 20px 24px", whiteSpace: "nowrap" }}>
          <Card.Body style={{ padding: "20px " }}>
            <div className="d-flex align-items-center">
              <div className="icon-in-bg bg-primary newbg-primary text-white rounded-circle">
                <i className="fa fa-sign-out fa-2x" style={{ fontSize: "x-large" }}></i>
              </div>
              <div className="ml-4">
                <span className="chart-value">{t("Agent offline")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">{offlinecount}</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="col-name">
        <Card className="dear-card" style={{ padding: "20px 24px", whiteSpace: "nowrap" }}>
          <Card.Body style={{ padding: "20px " }}>
            <div className="d-flex align-items-center">
              <div className="icon-in-bg bg-warning text-white rounded-circle">
                <Usersicon className="icon-users fa-2x  call-in-icon" />
              </div>
              <div className="ml-4">
                <span className="chart-value">{t("Calls queue")}</span>
                <h4 className="mb-0 font-weight-medium chart-value">0</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} md={6} className="col-name">
        <Card className="dear-card" style={{ padding: "20px 24px", whiteSpace: "nowrap" }}>
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
                    valuedata?.total_duration_sec /
                    (valuedata?.total_local)
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
}

export default DashboardCardDetails;
