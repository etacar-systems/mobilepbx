import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { ReactComponent as Mute } from "../../Assets/Icon/MicrophoneSlash.svg";
import { ReactComponent as UnMute } from "../../Assets/Icon/unmute.svg";
import { ReactComponent as Transfer } from "../../Assets/Icon/ArrowsLeftRight.svg";
import { ReactComponent as DialpadLogo } from "../../Assets/Icon/dial-pad.svg";
import { ReactComponent as Hold } from "../../Assets/Icon/Pause.svg";
import { ReactComponent as UnHold } from "../../Assets/Icon/unhold.svg";
import { ReactComponent as Record } from "../../Assets/Icon/VinylRecord.svg";
import { ReactComponent as Plus } from "../../Assets/Icon/Plus.svg";
import { ReactComponent as End } from "../../Assets/Icon/Phone.svg";
import DialPad from "./DialPad";
import DTMF from "./DTMF";
import { useTranslation } from "react-i18next";

export default function CallScreen({
  callState,
  setCallState,
  makeCall,
  endCall,
  callHold,
  activeCalls,
  callTimer,
  muteCall,
  mute,
  setContactlistOpen,
  isMultipleCall,
  currentCallEnd,
  transferCall,
  transferCallNavigate,
  DTMFhandler,
  setIsKeypad,
  isKeypad,
  currentCallHold,
  callerName,
  recordCall,
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

  return (
    <>
      {!callState && (
        <DialPad
          setCallState={setCallState}
          makeCall={makeCall}
          DTMFhandler={DTMFhandler}
          callState={callState}
        />
      )}
      {(callState == "Connected" || callState == "Calling") && (
        <Container className="w-100">
          {!isKeypad && (
            <Row>
              <Col xs={isMultipleCall ? 6 : 12}>
                <Container className="text-center">
                  <Row>
                    <Col>
                      {callerName && (
                        <p style={{ fontSize: "22px" }} className="unknown">
                          {callerName}
                        </p>
                      )}

                      <p className="unknown1">{activeCalls[0]?.number}</p>
                      <p className="call_timer">
                        {callState == "Connected"
                          ? `${t("Connected")} - ${timeSet(callTimer)}`
                          : t("Calling ...")}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4}>
                      {mute ? (
                        <>
                          <div className="call_btn" onClick={muteCall}>
                            <UnMute style={{ height: "25px" }} />
                          </div>
                          <p className="call_btn_text">{t("Unmute")}</p>
                        </>
                      ) : (
                        <>
                          <div className="call_btn" onClick={muteCall}>
                            <Mute />
                          </div>
                          <p className="call_btn_text">{t("mute")}</p>
                        </>
                      )}
                    </Col>

                    <Col xs={4}>
                      <div
                        className="call_btn"
                        onClick={transferCallNavigate}
                        onTouchStart={transferCallNavigate}
                      >
                        <Transfer />
                      </div>
                      <p className="call_btn_text">{t("Transfer")}</p>
                    </Col>
                    <Col xs={4}>
                      <div
                        className="call_btn"
                        onClick={() => {
                          setIsKeypad(true);
                        }}
                      >
                        <DialpadLogo
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <p className="call_btn_text">{t("Keypad")}</p>
                    </Col>
                  </Row>

                  <Row>
                    {!isMultipleCall && (
                      <Col xs={4}>
                        {activeCalls[0]?.hold ? (
                          <>
                            <div className="call_btn" onClick={callHold}>
                              <UnHold style={{ height: "25px" }} />
                            </div>
                            <p className="call_btn_text">{t("Unhold")}</p>
                          </>
                        ) : (
                          <>
                            <div className="call_btn" onClick={callHold}>
                              <Hold />
                            </div>
                            <p className="call_btn_text">{t("Hold")}</p>
                          </>
                        )}
                      </Col>
                    )}

                    <Col xs={4}>
                      <div className="call_btn" onClick={recordCall}>
                        <Record />
                      </div>
                      <p className="call_btn_text">{t("Record")}</p>
                    </Col>
                    <Col xs={4}>
                      <div
                        className="call_btn"
                        // style={{ backgroundColor: "green" }}
                        onClick={() => {
                          setContactlistOpen(true);
                        }}
                        // onTouchStart={setContactlistOpen(true)}
                      >
                        <Plus />
                      </div>
                      <p className="call_btn_text">{t("Add")}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div
                        className="call_btn"
                        style={{ backgroundColor: "red" }}
                        onClick={endCall}
                      >
                        <End />
                      </div>
                      <p className="call_btn_text">{t("End")}</p>
                    </Col>
                  </Row>
                </Container>
              </Col>
              {isMultipleCall && (
                <Col xs={6}>
                  {activeCalls?.map((item, index) => (
                    <Row
                      key={item.call._id}
                      className="align-items-center border mb-2"
                    >
                      <Col xs={6} className="text-left multiple_call">
                        <p>{item.name}</p>
                        <p>{item.number}</p>
                      </Col>
                      <Col xs={3}>
                        <Button
                          className=""
                          style={{
                            backgroundColor: "var(--main-orange-color)",
                            border: "none",
                          }}
                          onClick={() => {
                            currentCallHold(item);
                          }}
                          onTouchStart={currentCallHold(item)}
                        >
                          {item?.hold ? (
                            <UnHold className="multiple_call_btn" />
                          ) : (
                            <Hold className="multiple_call_btn" />
                          )}
                        </Button>
                      </Col>
                      <Col xs={3}>
                        <Button
                          variant="danger"
                          className=""
                          style={{
                            backgroundColor: "var(--main-red-color)",
                            border: "none",
                          }}
                          onClick={() => {
                            currentCallEnd(item);
                          }}
                          onTouchStart={currentCallEnd(item)}
                        >
                          <End className="multiple_call_btn" />
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </Col>
              )}
            </Row>
          )}
          {isKeypad && (
            <DTMF
              DTMFhandler={DTMFhandler}
              setIsKeypad={setIsKeypad}
              callState={callState}
            />
          )}
        </Container>
      )}
    </>
  );
}
