import React, { useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function DTMF({ DTMFhandler, setIsKeypad }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [inputFocuse, setInputFocus] = useState(true);
  const inputRef = useRef();
  const [displayValue, setDisplayValue] = useState("0");
  let timer;
  const dtmfTones = {
    1: new Audio(require("../../Assets/DialpadTones/1.wav")),
    2: new Audio(require("../../Assets/DialpadTones/2.wav")),
    3: new Audio(require("../../Assets/DialpadTones/3.wav")),
    4: new Audio(require("../../Assets/DialpadTones/4.wav")),
    5: new Audio(require("../../Assets/DialpadTones/5.wav")),
    6: new Audio(require("../../Assets/DialpadTones/6.wav")),
    7: new Audio(require("../../Assets/DialpadTones/7.wav")),
    8: new Audio(require("../../Assets/DialpadTones/8.wav")),
    9: new Audio(require("../../Assets/DialpadTones/9.wav")),
    0: new Audio(require("../../Assets/DialpadTones/0.wav")),
    "*": new Audio(require("../../Assets/DialpadTones/star.wav")),
    "#": new Audio(require("../../Assets/DialpadTones/hash.wav")),
    "+": new Audio(require("../../Assets/DialpadTones/0.wav")),
  };

  const playTone = (digit) => {
    const tone = dtmfTones[digit];
    if (tone) {
      tone.currentTime = 0;
      tone.play();
    }
  };

  const numberClick = (number) => {
    playTone(number);

    if (number) {
      inputRef.current.focus();
      setInputFocus(true);
      setPhoneNumber(phoneNumber + number);
      DTMFhandler(number);
    }
  };
  const { t } = useTranslation();
  const handleMouseDown = () => {
    timer = setTimeout(() => {
      setDisplayValue("+");
      numberClick("+");
    }, 500);
  };

  const handleMouseUp = () => {
    clearTimeout(timer);
    if (displayValue === "0") {
      numberClick("0");
    }
    setDisplayValue("0");
  };
  return (
    <>
      <Container className="py-4">
        <Row className="align-items-center mb-3">
          <Col xs={12}>
            <Form.Control
              className="dial-pad-input text-center search-bg"
              value={phoneNumber}
              autoFocus={inputFocuse}
              ref={inputRef}
            />
          </Col>
        </Row>
        <Row className="text-center">
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("1");
              }}
            >
              <h6>1</h6>
              <p></p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("2");
              }}
            >
              <h6>2</h6>
              <p>{t("ABC")}</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("3");
              }}
            >
              <h6>3</h6>
              <p>{t("DEF")}</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("4");
              }}
            >
              <h6>4</h6>
              <p>{t("GHI")}</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("5");
              }}
            >
              <h6>5</h6>
              <p>{t("JKL")}</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("6");
              }}
            >
              <h6>6</h6>
              <p>{t("MNO")}</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("7");
              }}
            >
              <h6>7</h6>
              <p>{t("PQRS")}</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("8");
              }}
            >
              <h6>8</h6>
              <p>{t("TUV")}</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("9");
              }}
            >
              <h6>9</h6>
              <p>{t("WXYZ")}</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("*");
              }}
            >
              <h6 className="mt-2">*</h6>
              <p></p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
            >
              <h6>0</h6>
              <p>+</p>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="number-btn"
              onClick={() => {
                numberClick("#");
              }}
            >
              <h6>#</h6>
              <p></p>
            </div>
          </Col>
          <div
            className="text-end"
            onClick={() => {
              setIsKeypad(false);
            }}
          >
            <h6 className="hide_btn">{t("Hide")}</h6>
          </div>
        </Row>
      </Container>
    </>
  );
}
