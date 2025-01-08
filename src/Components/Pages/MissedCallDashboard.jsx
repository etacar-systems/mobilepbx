import React, { useState } from "react";
import { Card } from "react-bootstrap";
import MultiLineChart from "./MultiLineChart";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Bigsize } from "../../Assets/Icon/biggersize.svg";
import { useTranslation } from "react-i18next";
function MissedCallDashboard({
  // missedCalledData,
  multilinechart,
  targetRef,
  theme,
  Theme,
  totalMissedCalled,
  totalAvgWaitTime,
}) {
  const { t } = useTranslation();
  const [show, setshow] = useState(false);

  // let todayMissedCall = 0,
  //   totalWaitingTime = 0;
  const openmodal = () => {
    setshow(true);
  };
  // multilinechart?.datasets[0]?.data?.map((item) => {
  //   todayMissedCall += item;
  // });

  // multilinechart?.datasets[1]?.data?.map((item) => {
  //   totalWaitingTime += item;
  // });
  const graphmissedcll = () => {
    return (
      <Card.Body
        className="misscall"
        style={{ width: "100%", height: "500px" }}
        ref={targetRef}
      >
        <div className="d-flex justify-content-start mb-3">
          <div className="mr-5">
            <label className="mb-0 header-size missed-header">
              {t("Missed calls")}
            </label>
            <h4 className="font-h4 missed-header">
              {totalMissedCalled}{" "}
              {/* {missedCalledData &&
                missedCalledData[missedCalledData.length - 1]?.count}{" "} */}
              {t("Calls")}
            </h4>
            <small className="text-muted">
              <span className="missedcallfont">9.5%</span> {t("of")} 47{" "}
              {t("Total")}
            </small>
          </div>
          <div className="mr-5">
            <label className="mb-0 header-size missed-header">
              {t("Average waiting time")}
            </label>
            <h4 className="font-h4 missed-header">
              {totalMissedCalled != 0
                ? Math.round((totalAvgWaitTime / totalMissedCalled) * 100) / 100
                : 0}{" "}
              {/* {missedCalledData &&
                missedCalledData[missedCalledData.length - 1]
                  ?.average_waiting_time}{" "} */}
              {t("Sec")}
            </h4>
            <small className="text-muted">
              <span className="missedcallfont">87.3%</span> {t("of")} 47{" "}
              {t("Total")}
            </small>
          </div>
        </div>
        <div id="chart-Event-sale-overview">
          <MultiLineChart data={multilinechart} theme={theme} Theme={Theme} />
        </div>
      </Card.Body>
    );
  };
  return (
    <>
      <Card className="dear-card" style={{ width: "100%" }}>
        <Card.Header
          className="call_metrics"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <h2>{t("Missed calls")}</h2>
          <h2 onClick={openmodal}>
            <Bigsize height={14} width={14} style={{ cursor: "pointer" }} />
          </h2>
        </Card.Header>
        {graphmissedcll()}
      </Card>
      {show && (
        <Modal
          show={show}
          onHide={() => setshow(false)}
          dialogClassName="modal-supports-open"
          aria-labelledby="example-custom-modal-styling-title"
          style={{ backdropFilter: "brightness(0.2)", height: "auto" }}
        >
          <div style={{ padding: "12px" }}>
            <Card className="dear-card" style={{ width: "100%" }}>
              <Card.Header
                className="call_metrics"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2>{t("Missed calls")}</h2>
                <h2 onClick={() => setshow(false)}>
                  <Bigsize
                    height={14}
                    width={14}
                    style={{ cursor: "pointer" }}
                  />
                </h2>
              </Card.Header>
              {graphmissedcll()}
            </Card>
          </div>
        </Modal>
      )}
    </>
  );
}

export default MissedCallDashboard;
