import React, { useEffect, useMemo, useState } from "react";
// import { Col, Nav, Row } from "react-bootstrap";
// import PieChartDash from "../../../PieChartDash";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Bigsize } from "../../../../../Assets/Icon/biggersize.svg";
import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";
import { LineChart } from "./LineChart";
import { useQueryParams } from "../../../../../hooks";
import { MetricGraph } from "./MetricGraph";
import { useCallMetrics } from "../../../../../requests/queries";

export const CallMetrics = () => {
  const { t } = useTranslation();
  const [show, setshow] = useState(false);

  const { call_metrics } = useQueryParams([
    {
      key: "call_metrics" as const,
      allowedValues: ["today", "week", "month", "year"] as const,
    },
  ]);

  const { callMetrics } = useCallMetrics({ type: call_metrics.value || "today" });

  const { localCallsData, answeredCallsData, missedCallsData } = useMemo(() => {
    return (
      callMetrics?.data?.reduce<{
        localCallsData: Array<number>;
        answeredCallsData: Array<number>;
        missedCallsData: Array<number>;
        inboundCallsData: Array<number>;
        outboundCallsData: Array<number>;
      }>(
        (acc, val) => {
          acc.localCallsData.push(Number(val.local_calls));
          acc.answeredCallsData.push(Number(val.answered_calls));
          acc.missedCallsData.push(Number(val.missed_calls));
          acc.inboundCallsData.push(Number(val.inbound_calls));
          acc.outboundCallsData.push(Number(val.outbound_calls));

          return acc;
        },
        {
          localCallsData: [],
          answeredCallsData: [],
          missedCallsData: [],
          inboundCallsData: [],
          outboundCallsData: [],
        }
      ) || {
        localCallsData: [],
        answeredCallsData: [],
        missedCallsData: [],
        inboundCallsData: [],
        outboundCallsData: [],
      }
    );
  }, [callMetrics]);

  const openmodal = () => {
    setshow(true);
  };

  return (
    <>
      <div
        className="call_metrics"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{t("Call Metrics")}</h2>
        <h2 onClick={openmodal}>
          <Bigsize height={14} width={14} style={{ cursor: "pointer" }} />
        </h2>
      </div>
      <MetricGraph
        totalLocal={callMetrics?.total_counts.total_local || 0}
        totalMissed={callMetrics?.total_counts.total_missed || 0}
        totalAnswered={callMetrics?.total_counts.total_answered || 0}
        answeredCallsData={answeredCallsData}
        localCallsData={localCallsData}
        missedCallsData={missedCallsData}
        value={call_metrics.value || "today"}
        onSelect={call_metrics.set}
      />

      {show && (
        <Modal
          show={show}
          onHide={() => setshow(false)}
          dialogClassName="modal-supports-open"
          aria-labelledby="example-custom-modal-styling-title"
          style={{ backdropFilter: "brightness(0.2)", height: "auto" }}
        >
          <div style={{ padding: "12px" }}>
            <div
              className="call_metrics "
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>{t("Call Metrics")}</h2>
              <h2 onClick={() => setshow(false)}>
                <Bigsize height={14} width={14} style={{ cursor: "pointer" }} />
              </h2>
            </div>
            <div>
              {
                <MetricGraph
                  totalLocal={callMetrics?.total_counts.total_local || 0}
                  totalMissed={callMetrics?.total_counts.total_missed || 0}
                  totalAnswered={callMetrics?.total_counts.total_answered || 0}
                  answeredCallsData={answeredCallsData}
                  localCallsData={localCallsData}
                  missedCallsData={missedCallsData}
                  value={call_metrics.value || "today"}
                  onSelect={call_metrics.set}
                />
              }
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
