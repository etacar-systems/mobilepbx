import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function MinimizeIncomingcall({
  answerCall,
  rejectCall,
  incomingName,
  isVideoCall,
  callTypecheck,
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="minmize_callscreen">
        <div className="d-flex align-items-center mb-4 minimize_callname">
          <div className="custome_avtar">{incomingName[0]}</div>
          <h6 className="m-0 ps-2" style={{ fontSize: "14px" }}>
            {t("Incoming")}{" "}
            {isVideoCall == 1 && callTypecheck == "video"
              ? t("Video")
              : t("Audio")}{" "}
            {t("call from")} {incomingName}
          </h6>
        </div>
        <Container>
          <Row className="answer_btn">
            <Col xs={4}>
              <Button variant="primary">{t("Transfer")}</Button>{" "}
            </Col>
            <Col xs={4}>
              <Button
                variant="danger"
                onClick={rejectCall}
                onTouchStart={rejectCall}
              >
                {t("Reject")}
              </Button>{" "}
            </Col>
            <Col xs={4}>
              <Button
                variant="success"
                onClick={answerCall}
                onTouchStart={answerCall}
              >
                {t("Answer")}
              </Button>{" "}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
