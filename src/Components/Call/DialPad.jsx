import React, { useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import { ReactComponent as Videocam } from "../../Assets/Icon/videocam.svg";
import { ReactComponent as Voicecall } from "../../Assets/Icon/voicemail.svg";
import { ReactComponent as Call } from "../../Assets/Icon/call.svg";
import { ReactComponent as Backspace } from "../../Assets/Icon/backspaceweb.svg";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CustomDropDown from "../CustomDropDown";
import Webphone from "../Pages/Webphone";
import config from "../../config";
import ConstantConfig, {
  SELECTSTATUS,
  TRANSFERCALL,
  voicemailNumber,
} from "../ConstantConfig";

function DialPad({}) {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [inputFocuse, setInputFocus] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [formData, setFormdata] = useState({
    selectstatus: "",
    Transfercall: "",
  });
  const call_function = useSelector(
    (state) => state.calling_function.calling_function
  );
  const inputRef = useRef();
  const [displayValue, setDisplayValue] = useState("0");
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [isLongPress, setIsLongPress] = useState(false);
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
    inputRef.current.focus();
    setInputFocus(true);

    const { selectionStart, selectionEnd } = inputRef.current;
    if (phoneNumber?.length < 15) {
      const newPhoneNumber =
        phoneNumber.slice(0, selectionStart) +
        number +
        phoneNumber.slice(selectionEnd);
      setPhoneNumber(newPhoneNumber);

      setTimeout(() => {
        inputRef.current.setSelectionRange(
          selectionStart + 1,
          selectionStart + 1
        );
      }, 0);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9*#+]/g, "");
    if (value.length <= 15) {
      setPhoneNumber(value);
    }
  };
  const deleteNumber = () => {
    inputRef.current.focus();

    const { selectionStart, selectionEnd } = inputRef.current;
    if (selectionStart === selectionEnd) {
      if (selectionStart > 0) {
        const newPhoneNumber =
          phoneNumber.slice(0, selectionStart - 1) +
          phoneNumber.slice(selectionEnd);
        setPhoneNumber(newPhoneNumber);

        setTimeout(() => {
          inputRef.current.setSelectionRange(
            selectionStart - 1,
            selectionStart - 1
          );
        }, 0);
      }
    } else {
      const newPhoneNumber =
        phoneNumber.slice(0, selectionStart) + phoneNumber.slice(selectionEnd);
      setPhoneNumber(newPhoneNumber);

      setTimeout(() => {
        inputRef.current.setSelectionRange(selectionStart, selectionStart);
      }, 0);
    }
  };

  const callConnect = (flag) => {
    const name = "Unknown";
    if (phoneNumber) {
      call_function(phoneNumber, name, flag);
      setPhoneNumber("");
    }
  };
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };
  const handleSelection = (dropdown, value) => {
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    handlechange(syntheticEvent);
  };
  const handleZeroTouchStart = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    const timer = setTimeout(() => {
      setDisplayValue("+");
      numberClick("+");
      setIsLongPress(true);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleZeroTouchEnd = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    clearTimeout(longPressTimer);
    if (!isLongPress) {
      numberClick("0");
    }
    setDisplayValue("0");
    setIsLongPress(false);
  };
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
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      callConnect(1);
    }
  };
  const VoicmailCall = () => {
    var flag = 1;
    var name = "Voicemail";

    call_function(voicemailNumber, name, flag);
  };

  return (
    <>
      <Container className="mb-3">
        <Row className="align-items-center">
          <Col xs={phoneNumber !== "" ? 10 : 12}>
            <Form.Control
              className="dial-pad-input text-center search-bg"
              value={phoneNumber}
              onChange={handleChange}
              autoFocus={inputFocuse}
              ref={inputRef}
              onKeyDown={handleKeyPress}
            />
          </Col>
          {phoneNumber !== "" && (
            <Col xs={2}>
              <Backspace
                className="back-icon"
                style={{ width: "25px", height: "25px", cursor: "pointer" }}
                onClick={deleteNumber}
              />
            </Col>
          )}
        </Row>
      </Container>
      <Container className="mb-3">
        <Row>
          <Col xs={6}>
            <CustomDropDown
              toggleDropdown={toggleDropdown}
              showValue={formData.selectstatus}
              openDropdown={openDropdown}
              valueArray={SELECTSTATUS}
              handleSelection={handleSelection}
              name={"selectstatus"}
              defaultValue={t("Available")}
              mapValue={"item"}
              storeValue={"item"}
              setOpenDropdown={setOpenDropdown}
              sorting={true}
            />
          </Col>
          <Col xs={6}>
            <CustomDropDown
              toggleDropdown={toggleDropdown}
              showValue={formData.Transfercall}
              openDropdown={openDropdown}
              valueArray={TRANSFERCALL}
              handleSelection={handleSelection}
              name={"Transfercall"}
              defaultValue={t("No transfer")}
              mapValue={"item"}
              storeValue={"item"}
              setOpenDropdown={setOpenDropdown}
              sorting={true}
            />
          </Col>
        </Row>
      </Container>
      <Container>
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
              onTouchStart={handleZeroTouchStart}
              onTouchEnd={handleZeroTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
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
          <Col
            xs={4}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="number-btn1 mt-4">
              <Videocam
                className="video-call-color"
                onClick={() => {
                  callConnect(0);
                }}
              />
            </div>
          </Col>
          <Col
            xs={4}
            className="d-flex align-items-center justify-content-center"
          >
            <div
              className="number-btn1 mt-4 voice-call-color"
              onClick={VoicmailCall}
            >
              <Voicecall className="video-call-color" />
            </div>
          </Col>
          <Col
            xs={4}
            className="d-flex align-items-center justify-content-center"
          >
            <div
              className="number-btn1 mt-4"
              onClick={() => {
                callConnect(1);
              }}
            >
              <Call className="video-call-color" />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default DialPad;
