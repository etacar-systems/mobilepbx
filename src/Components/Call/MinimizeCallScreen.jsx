import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ReactComponent as Mute } from "../../Assets/Icon/MicrophoneSlash.svg";
import { ReactComponent as Transfer } from "../../Assets/Icon/ArrowsLeftRight.svg";
import { ReactComponent as DialpadLogo } from "../../Assets/Icon/dial-pad.svg";
import { ReactComponent as Hold } from "../../Assets/Icon/Pause.svg";
import { ReactComponent as Plus } from "../../Assets/Icon/Plus.svg";
import { ReactComponent as End } from "../../Assets/Icon/Phone.svg";
import { ReactComponent as Maximize } from "../../Assets/Icon/maximize.svg";
import { ReactComponent as UnMute } from "../../Assets/Icon/unmute.svg";
import { ReactComponent as UnHold } from "../../Assets/Icon/unhold.svg";
import { useTranslation } from "react-i18next";

export default function MinimizeCallScreen({
  endCall,
  fullScreen,
  callHold,
  activeCalls,
  callTimer,
  muteCall,
  mute,
  setContactlistOpen,
  transferCallNavigate,
  setIsKeypad,
  setShow,
}) {
  const timeSet = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  };
  const { t } = useTranslation();
  const DialpadOpen = () => {
    setShow(true);
    setIsKeypad(true);
    fullScreen();
  };
  return (
    <>
      <div className="minmize_callscreen">
        <Container>
          <Row>
            <Col xs={10}>
              <div className="minimize_callname">
                <div className="d-flex align-items-center mb-2">
                  <div className="custome_avtar">{activeCalls[0]?.name[0]}</div>
                  <h6 className="m-0 ps-2" style={{ fontSize: "14px" }}>
                    {activeCalls[0]?.name}
                  </h6>
                </div>
                <p>
                  {t("Ongoing call…")} {timeSet(callTimer)}
                </p>
              </div>
            </Col>
            <Col xs={2}>
              <Maximize
                className="maximize_logo"
                onClick={fullScreen}
                onTouchStart={fullScreen}
              />
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="manage-col">
            <Col xs={2} className="text-center">
              {mute ? (
                <>
                  <div
                    className="minimize_btn"
                    onClick={muteCall}
                    onTouchStart={muteCall}
                  >
                    <UnMute style={{ height: "18px" }} />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="minimize_btn"
                    onClick={muteCall}
                    onTouchStart={muteCall}
                  >
                    <Mute />
                  </div>
                </>
              )}
            </Col>
            <Col xs={2} className="text-center">
              {activeCalls[0]?.hold ? (
                <>
                  <div
                    className="minimize_btn"
                    onClick={callHold}
                    onTouchStart={callHold}
                  >
                    <UnHold style={{ height: "18px" }} />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="minimize_btn"
                    onClick={callHold}
                    onTouchStart={callHold}
                  >
                    <Hold />
                  </div>
                </>
              )}
            </Col>
            <Col xs={2} className="text-center">
              <div
                className="minimize_btn"
                onClick={DialpadOpen}
                onTouchStart={DialpadOpen}
              >
                <DialpadLogo style={{ width: "100%", height: "100%" }} />
              </div>
            </Col>
            <Col xs={2} className="text-center">
              <div
                className="minimize_btn"
                onClick={transferCallNavigate}
                onTouchStart={transferCallNavigate}
              >
                <Transfer />
              </div>
            </Col>
            <Col xs={2} className="text-center">
              <div
                className="minimize_btn"
                // style={{ backgroundColor: "green" }}
                onClick={() => {
                  setContactlistOpen(true);
                }}
                onTouchStart={() => {
                  setContactlistOpen(true);
                }}
              >
                <Plus />
              </div>
            </Col>
            <Col xs={2} className="text-center">
              <div
                className="minimize_btn"
                style={{ backgroundColor: "red" }}
                onClick={endCall}
                onTouchStart={endCall}
              >
                <End style={{ color: "red" }} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
