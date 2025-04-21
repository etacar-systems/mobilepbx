import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";


import { Graph } from "./Graph";
import { useQueryParams } from "../../../../../hooks";
import { useMissedCallsMetrics } from "../../../../../requests/queries";

import { ReactComponent as ResizeIcon } from "../../../../../Assets/Icon/biggersize.svg";

export const MissedCallCard = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const openModal = () => {
    setShow(true);
  };

  const { missed_calls } = useQueryParams([
    {
      key: "missed_calls" as const,
      allowedValues: ["today", "week", "month", "year"] as const,
    },
  ]);

  const { data } = useMissedCallsMetrics({
    type: missed_calls.value || "today",
  });

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
          <h2 onClick={openModal}>
            <ResizeIcon height={14} width={14} style={{ cursor: "pointer" }} />
          </h2>
        </Card.Header>
        <Graph
          value={missed_calls.value || "today"}
          onSelect={missed_calls.set}
          totalMissedCalls={data?.total_counts?.total_missed || 0}
          averageWaitingTime={data?.total_counts?.average_waiting_time || 0}
          data={data?.data || []}
        />
      </Card>
      {show && (
        <Modal
          show={show}
          onHide={() => setShow(false)}
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
                <h2 onClick={() => setShow(false)}>
                  <ResizeIcon
                    height={14}
                    width={14}
                    style={{ cursor: "pointer" }}
                  />
                </h2>
              </Card.Header>
              <Graph
                value={missed_calls.value || "today"}
                onSelect={missed_calls.set}
                totalMissedCalls={data?.total_counts?.total_missed || 0}
                averageWaitingTime={
                  data?.total_counts?.average_waiting_time || 0
                }
                data={data?.data || []}
              />
            </Card>
          </div>
        </Modal>
      )}
    </>
  );
};
