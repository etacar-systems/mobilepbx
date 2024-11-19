import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { DropdownDivider, InputGroup } from "react-bootstrap";
import emaillogo from "../../Assets/Icon/email_logo.svg";
import phoneRegister from "../../Assets/Icon/phoneregister.svg";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { Numeric } from "../ConstantConfig";
import { useTranslation } from "react-i18next";

function CallRoutingModal({ handleClose, show }) {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const sliderRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(30);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedValuesFirst, setSelectedValuesFirst] = useState([
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
    "110",
  ]); // Initial values for the first array
  const [selectedValuesSecond, setSelectedValuesSecond] = useState([]); // Initial values for the second array

  const handleFirstItemClick = (value) => {
    if (!selectedValuesSecond.includes(value)) {
      setSelectedValuesFirst(
        selectedValuesFirst.filter((item) => item !== value)
      );
      setSelectedValuesSecond([...selectedValuesSecond, value]);
    }
  };

  const handleSecondInputChange = (value) => {
    if (!selectedValuesFirst.includes(value)) {
      setSelectedValuesSecond(
        selectedValuesSecond.filter((item) => item !== value)
      );
      setSelectedValuesFirst([...selectedValuesFirst, value]);
    }
  };

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (sliderRef.current) {
      const slider = noUiSlider.create(sliderRef.current, {
        start: [sliderValue],
        connect: "lower",
        step: 1,
        range: {
          min: 0,
          max: 100,
        },
      });

      slider.on("slide", (values, handle) => {
        setSliderValue(parseInt(values[handle]));
      });

      return () => {
        slider.destroy();
      };
    }
  }, [sliderValue]);
  const [formdata, setFormdata] = useState(
    { Externalnumber: "" },
    { Internalcall: "" },
    { BusyExternal: "" },
    { BusyInternal: "" }
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };
  const selectedExternalnumber =
    formdata.Externalnumber == Numeric.One
      ? "Voicemail"
      : formdata.Externalnumber == Numeric.Two
      ? "Extension"
      : formdata.Externalnumber == Numeric.Three
      ? "My Mobile"
      : formdata.Externalnumber
      ? "External Number"
      : "";
  const selectedInternalcall =
    formdata.Internalcall == Numeric.One
      ? "Voicemail"
      : formdata.Internalcall == Numeric.One
      ? "Extension"
      : formdata.Internalcall == Numeric.Three
      ? "My Mobile"
      : formdata.Internalcall
      ? "External Number"
      : "";
  const selectedBusyExternal =
    formdata.BusyExternal == Numeric.One
      ? "Voicemail"
      : formdata.BusyExternal == Numeric.One
      ? "Extension"
      : formdata.BusyExternal == Numeric.Three
      ? "My Mobile"
      : formdata.BusyExternal
      ? "External Number"
      : "";
  const selectedBusyInternal =
    formdata.BusyInternal == Numeric.One
      ? "Voicemail"
      : formdata.BusyInternal == Numeric.One
      ? "Extension"
      : formdata.BusyInternal == Numeric.Three
      ? "My Mobile"
      : formdata.BusyInternal
      ? "External Number"
      : "";

  //BusyInternal

  const handleSelection = (dropdown, value, displayValue) => {
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    handleChange(syntheticEvent);
    setFormdata((prevState) => ({
      ...prevState,
      [dropdown]: displayValue,
    }));

    setOpenDropdown(null); // Close the dropdown after selection
  };
  return (
    <>
      <Modal show={show} size="lg">
        <div className="new-dial">
          <div
            className="p-3"
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <h6>{t("Call routing")}</h6>
              <Closeicon width={23} onClick={handleClose} height={23} />
            </div>
          </div>

          <div className="p-3 ">
            <Form
              style={{
                borderBottom:
                  "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <Row className="mb-4">
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Unanswered calls")}
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder="30"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="input-palceholder search-bg emailforminput2"
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      className="input-palceholder"
                    >
                      {t("In Seconds")}
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Forward external calls to")}
                  </Form.Label>
                  <InputGroup className="">
                    <div
                      className="Selfmade-dropdown "
                      style={{ width: "100%" }}
                    >
                      <div
                        className="Selfmadedropdown-btn "
                        onClick={() => toggleDropdown("Externalcall")}
                      >
                        {selectedExternalnumber || t("None selected")}

                        <div>
                          <Dropdownicon />
                        </div>
                      </div>
                      {openDropdown === "Externalcall" && (
                        <div className="Selfmadedropdown-content">
                          {[
                            { type: "Voicemail", value: 1 },
                            { type: "Extension", value: 2 },
                            { type: "My Mobile", value: 3 },
                            { type: "External Number", value: 4 },
                          ]?.map((number) => (
                            <a
                              key={number._id}
                              onClick={() =>
                                handleSelection(
                                  "Externalcall",
                                  number.type,
                                  number.value
                                )
                              }
                            >
                              {number.type}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </InputGroup>
                </Col>
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("External number")}
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                    />
                  </InputGroup>
                </Col>

                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">
                    {t("Forward internal calls to")}
                  </Form.Label>
                  <InputGroup className="">
                    <div
                      className="Selfmade-dropdown "
                      style={{ width: "100%" }}
                    >
                      <div
                        className="Selfmadedropdown-btn "
                        onClick={() => toggleDropdown("Internalcall")}
                      >
                        {selectedInternalcall || "None selected"}

                        <div>
                          <Dropdownicon />
                        </div>
                      </div>
                      {openDropdown === "Internalcall" && (
                        <div className="Selfmadedropdown-content">
                          {[
                            { type: "Voicemail", value: 1 },
                            { type: "Extension", value: 2 },
                            { type: "My Mobile", value: 3 },
                            { type: "External Number", value: 4 },
                          ]?.map((number) => (
                            <a
                              key={number._id}
                              onClick={() =>
                                handleSelection(
                                  "Internalcall",
                                  number.type,
                                  number.value
                                )
                              }
                            >
                              {number.type}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </InputGroup>
                </Col>

                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">
                    {t("Busy external calls to")}
                  </Form.Label>
                  <InputGroup className="">
                    <div
                      className="Selfmade-dropdown "
                      style={{ width: "100%" }}
                    >
                      <div
                        className="Selfmadedropdown-btn "
                        onClick={() => toggleDropdown("BusyExternal")}
                      >
                        {selectedBusyExternal || t("None selected")}

                        <div>
                          <Dropdownicon />
                        </div>
                      </div>
                      {openDropdown === "BusyExternal" && (
                        <div className="Selfmadedropdown-content">
                          {[
                            { type: "Voicemail", value: 1 },
                            { type: "Extension", value: 2 },
                            { type: "My Mobile", value: 3 },
                            { type: "External Number", value: 4 },
                          ]?.map((number) => (
                            <a
                              key={number._id}
                              onClick={() =>
                                handleSelection(
                                  "BusyExternal",
                                  number.type,
                                  number.value
                                )
                              }
                            >
                              {number.type}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </InputGroup>
                </Col>
                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">
                    {t("Busy internal calls to")}
                  </Form.Label>
                  <InputGroup className="">
                    <div
                      className="Selfmade-dropdown "
                      style={{ width: "100%" }}
                    >
                      <div
                        className="Selfmadedropdown-btn "
                        onClick={() => toggleDropdown("BusyInternal")}
                      >
                        {selectedBusyInternal || t("None selected")}

                        <div>
                          <Dropdownicon />
                        </div>
                      </div>
                      {openDropdown === "BusyInternal" && (
                        <div className="Selfmadedropdown-content">
                          {[
                            { type: "Voicemail", value: 1 },
                            { type: "Extension", value: 2 },
                            { type: "My Mobile", value: 3 },
                            { type: "External Number", value: 4 },
                          ]?.map((number) => (
                            <a
                              key={number._id}
                              onClick={() =>
                                handleSelection(
                                  "BusyInternal",
                                  number.type,
                                  number.value
                                )
                              }
                            >
                              {number.type}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </InputGroup>
                </Col>

                <Form.Label className="mt-5">
                  {t("Select endpoints")}
                </Form.Label>
                <Col lg={6}>
                  <div
                    className=""
                    style={{
                      width: "100%",
                      height: "28vh",
                      border: "1px solid var(--main-callrouting-color)",
                      overflowY: "auto",
                    }}
                  >
                    {selectedValuesFirst.map((val) => (
                      <>
                        <div
                          key={val}
                          style={{
                            color: "var(--main-orange-color)",
                            fontSize: "14px",
                            borderBottom:
                              "1px solid var(--main-bordermodaldashboard-color)",
                            padding: "3px 7px",
                            fontWeight: "300",
                          }}
                          className="valueofdrag"
                          onClick={() => handleFirstItemClick(val)}
                        >
                          {val}
                        </div>
                      </>
                    ))}
                  </div>
                </Col>
                <Col lg={6}>
                  <InputGroup className="">
                    <div
                      className=""
                      style={{
                        width: "100%",
                        height: "28vh",
                        border: "1px solid var(--main-callrouting-color)",
                        overflowY: "auto",
                      }}
                    >
                      {selectedValuesSecond.map((val) => (
                        <>
                          <div
                            key={val}
                            style={{
                              color: "var(--main-orange-color)",
                              fontSize: "14px",
                              borderBottom:
                                "1px solid var(--main-bordermodaldashboard-color)",
                              padding: "3px 7px",
                              fontWeight: "300",
                            }}
                            className="valueofdrag"
                            onClick={() => handleSecondInputChange(val)}
                          >
                            {val}
                          </div>
                        </>
                      ))}
                    </div>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="mb-4 d-flex justify-content-end me-4">
            <button className="btn_cancel me-3" onClick={handleClose}>
              {t("Cancel")}
            </button>
            <button className="btn_save">{t("Save")}</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default CallRoutingModal;
