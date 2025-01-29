import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { DropdownDivider, InputGroup } from "react-bootstrap";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import Spinner from "react-bootstrap/Spinner";
import switchimg from "../../Assets/Image/switch.png";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";
import DropDown from "../Dropdown";
import CustomTooltipModal from "../CustomTooltipModal";
import ConstantConfig, {
  EXTENSIONVALALL,
  RingStrategy,
  TypeInnumber,
} from "../ConstantConfig";

function RingGroupModal({
  allDropdown,
  ringDropdown,
  selectedValuesSecond,
  setSelectedValuesSecond,
  loader,
  loader2,
  handleClosee,
  show,
  header,
  datasaving,
  formData,
  setFormData,
  sliderValue,
  setSliderValue,
  selectedValuesFirst,
  setSelectedValuesFirst,
  apidropdown,
  selectType,
  setSelectType,
  setSelectExtension,
  selectExtension,
  filteredList,
  setFilteredList,
  mode,
  huntsliderValue,
  setHuntsliderValue,
}) {
  const { t } = useTranslation();
  const sliderRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showstate, setShowstate] = useState("");
  const huntsliderRef = useRef(null);
  const handleSelectType = (type) => {
    setSelectType({ id: type.value, display: type.type });
    setOpenDropdown(null);
    setErrors((prev) => ({ ...prev, Type: "" }));
    setSelectExtension("");
  };
  const handleSelectExtension = (destination) => {
    setSelectExtension({
      app: destination.app,
      data: destination.data,
      display: destination.extension || destination.name,
    });
    setOpenDropdown(null);
    setErrors((prev) => ({ ...prev, destination: "" }));
    setFormData((prev) => ({
      ...prev,
      ring_group_timeout_app: selectType.id,
      ring_group_timeout_data: destination.id,
    }));
  };
  useEffect(() => {
    switch (selectType.id) {
      case "1":
        setFilteredList(apidropdown?.ivr_menus);
        break;
      case "2":
        setFilteredList(apidropdown?.ring_groups);
        break;
      case "3":
        setFilteredList(apidropdown?.extensions);
        break;
      case "4":
        setFilteredList(apidropdown?.conference);
        break;
      case "5":
        setFilteredList(apidropdown?.recordings);
        break;
      case "6":
        setFilteredList(apidropdown?.timeconditions);
        break;
      default:
        setFilteredList([]);
    }
    if (show === "add") {
      setSelectExtension({ app: "", data: "", display: "" });
    }
  }, [selectType, apidropdown, show]);

  useEffect(() => {
    if (show) {
      setSelectExtension("");
      setSelectType("");
      setErrors({});
      setFormData({
        name: "",
        extension: "",
        ring_group_description: "",
        ring_group_greeting: "",
        ring_group_strategy: "",
        ring_group_call_timeout: "",
        ring_group_caller_id_number: "",
        ring_group_caller_id_name: "",
        timeout_destination: "",
        destinations: [],
        ring_group_ringback: "",
        // user_list: [],
        ring_group_missed_call_app: "",
        ring_group_missed_call_data: "",
        ring_group_forward_number: "",
        ring_group_forward_destination: "",
        ring_group_timeout_data: "",
        ring_group_timeout_app: "",
        ring_group_forward_toll_allow: "",
        destination: "",
      });
    }
  }, [show]);
  const [errors, setErrors] = useState({});
  const handleFirstItemClick = (value) => {
    if (!selectedValuesSecond.some((item) => item._id === value)) {
      const updatedSelectedValuesFirst = selectedValuesFirst.filter(
        (item) => item._id !== value
      );
      setSelectedValuesFirst(updatedSelectedValuesFirst);
      const selectedItem = selectedValuesFirst.find(
        (item) => item._id === value
      );
      setSelectedValuesSecond([...selectedValuesSecond, selectedItem]);
      setErrors((prev) => ({ ...prev, selectedValuesSecond: "" }));
    }
  };

  const handleSecondInputChange = (value) => {
    if (!selectedValuesFirst.some((item) => item._id === value)) {
      const updatedSelectedValuesSecond = selectedValuesSecond.filter(
        (item) => item._id !== value
      );
      setSelectedValuesSecond(updatedSelectedValuesSecond);
      const selectedItem = selectedValuesSecond.find(
        (item) => item._id === value
      );

      setSelectedValuesFirst([...selectedValuesFirst, selectedItem]);
    }
    if (selectedValuesSecond.length == 1) {
      setErrors((prev) => ({
        ...prev,
        selectedValuesSecond: t("At least one extension must be selected"),
      }));
    }
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
      if (sliderValue > 0) {
        setErrors((prev) => ({ ...prev, ring_group_call_timeout: "" }));
      }
      return () => {
        slider.destroy();
      };
    }
  }, [sliderValue, formData.ring_group_strategy]);
  useEffect(() => {
    if (huntsliderRef.current) {
      const huntslider = noUiSlider.create(huntsliderRef.current, {
        start: [huntsliderValue],
        connect: "lower",
        step: 1,
        range: {
          min: 0,
          max: 100,
        },
      });
      huntslider.on("slide", (values, handle) => {
        setHuntsliderValue(parseInt(values[handle]));
      });
      if (huntsliderValue > 0) {
        setErrors((prev) => ({ ...prev, ring_hunt: "" }));
      }
      return () => {
        huntslider.destroy();
      };
    }
  }, [huntsliderValue, formData.ring_group_strategy]);
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === "ring_group_strategy") {
      setFormData({
        ...formData,
        [name]: value === "Hunt" ? "sequence" : "simultaneous",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key < "0" || e.key > "9") {
      e.preventDefault();
    }
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name || !formData.name.trim() || formData.name.length <= 1) {
      newErrors.name = t("Ring group name is required ");
      valid = false;
    }

    if (
      !formData.ring_group_description ||
      !formData.ring_group_description.trim() ||
      formData.ring_group_description.length <= 1
    ) {
      newErrors.ring_group_description = t(
        "Ring group description is required"
      );
      valid = false;
    }
    if (!selectExtension.display) {
      newErrors.destination = t("End point is required");
      valid = false;
    }
    if (!selectType.display) {
      newErrors.Type = t("Type is required");
      valid = false;
    }

    if (!formData.extension || !formData.extension.trim()) {
      newErrors.extension = t("Ring group extension is required");
      valid = false;
    } else if (
      !ConstantConfig.RINGGROUP.VALIDATION.EXTENSIONVAL.test(formData.extension)
    ) {
      newErrors.extension = t("Ring group extension must contain only digits");
      valid = false;
    } else if (!EXTENSIONVALALL.test(formData.extension)) {
      newErrors.extension = t("Please enter a valid extension");
      valid = false;
    }

    if (formData.ring_group_strategy === "") {
      newErrors.ring_group_strategy = t("Ring group strategy is required");
      valid = false;
    }

    if (formData.ring_group_strategy === "simultaneous" && sliderValue == 0) {
      newErrors.ring_group_call_timeout = t("Ring group duration is required");
      valid = false;
    }
    if (formData.ring_group_strategy === "sequence" && huntsliderValue == 0) {
      newErrors.ring_hunt = t("Ring hunt duration is required");
      valid = false;
    }

    if (selectType.id == "") {
      newErrors.Type = t("Type is required");
      valid = false;
    }

    if (selectExtension.app == "") {
      newErrors.Destination = t("Destination is required");
      valid = false;
    }

    if (selectedValuesSecond.length === 0) {
      newErrors.selectedValuesSecond = t(
        "At least one extension must be selected"
      );
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSelection = (dropdown, value, isMulti) => {
    if (isMulti != undefined) {
      const syntheticEvent = {
        target: {
          name: "ring_group_timeout_data",
          value: value === "None selected" ? "" : value["data"],
        },
      };
      const syntheticEvent2 = {
        target: {
          name: "ring_group_timeout_app",
          value: value === "None selected" ? "" : value["app"],
        },
      };
      handleChange(syntheticEvent);
      handleChange(syntheticEvent2);
      setFormData((prevState) => ({
        ...prevState,
        ring_group_timeout_app: value === "None selected" ? "" : value["app"],
        ring_group_timeout_data: value === "None selected" ? "" : value["data"],
      }));
      setOpenDropdown(null);
      return;
    }
    if (dropdown == "ring_group_strategy") {
      if (value == "Ring all") {
        setShowstate("Ring all");
        setHuntsliderValue(0);
        // setFormData((prevState) => ({
        //   ...prevState,
        //   [dropdown]: "Ring All",
        // }));
      }
      if (value == "Hunt") {
        setHuntsliderValue(0);
        setSliderValue(0);
        setShowstate("Hunt");
        // setFormData((prevState) => ({
        //   ...prevState,
        //   [dropdown]: "Hunt",
        // }));
      }
    }
    // if (dropdown != "ring_group_strategy") {
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value === "None selected" ? "" : value,
      },
    };
    handleChange(syntheticEvent);
    if (dropdown != "ring_group_strategy") {
      setFormData((prevState) => ({
        ...prevState,
        [dropdown]: value === "None selected" ? "" : value,
      }));
    }

    setOpenDropdown(null);
  };
  const handleSave = () => {
    if (validateForm()) {
      datasaving();
    }
  };

  const [selectedSection, setSelectedSection] = useState("");
  useEffect(() => {
    if (mode == "edit" && formData.ring_group_strategy) {
      if (formData.ring_group_strategy == "sequence") {
        setShowstate("Hunt");
      }
      if (formData.ring_group_strategy === "simultaneous") {
        setShowstate("Ring all");
      }
    }
  }, [formData.ring_group_strategy]);

  useEffect(() => {
    if (formData.ring_group_ringback) {
      const ring_group_ringback_section = Object.keys(ringDropdown).find(
        (item) => {
          return Object.keys(ringDropdown[item]).includes(
            formData.ring_group_ringback
          );
        }
      );
      setSelectedSection(ring_group_ringback_section);
    }
  }, [formData.ring_group_ringback, ringDropdown]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleClickOutside = (event) => {
    if (openDropdown && !event.target.closest(".Selfmade-dropdown")) {
      setOpenDropdown(null);
    }
  };
  return (
    <>
      <Modal show={show} size="lg">
        <div className="modal-data">
          <div
            className="p-3"
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between add_new_num">
              <h6>{header}</h6>
              <Closeicon width={23} onClick={handleClosee} height={23} />
            </div>
          </div>
          <div className="p-3">
            <Form
              style={{
                borderBottom:
                  "1px solid var(--main-bordermodaldashboard-color)",
                paddingBottom: "30px",
              }}
            >
              <Row>
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Ring group name")}
                    <CustomTooltipModal tooltip={t("Enter name")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.name && (
                    <div className="text-danger error-ui">{errors.name}</div>
                  )}
                </Col>

                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Ring group description")}
                    <CustomTooltipModal tooltip={t("Enter the description")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="ring_group_description"
                      value={formData.ring_group_description}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.ring_group_description && (
                    <div className="text-danger error-ui">
                      {errors.ring_group_description}
                    </div>
                  )}
                </Col>
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Ring group extension")}
                    <CustomTooltipModal tooltip={t("Enter extension number")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      disabled={mode == "edit"}
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="extension"
                      value={formData.extension}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>
                  {errors.extension && (
                    <div className="text-danger error-ui">
                      {errors.extension}
                    </div>
                  )}
                </Col>
                <Col lg={4} className="mt-5">
                  <div className="mb-2">
                    <Form.Label className="modal-head">
                      {t("Ring group strategy")}
                      <CustomTooltipModal
                        tooltip={t("Select the ring strategy")}
                      />
                    </Form.Label>
                    <DropDown
                      toggleDropdown={toggleDropdown}
                      showValue={t(showstate)}
                      openDropdown={openDropdown}
                      // valueArray={[
                      //   "enterprise",
                      //   "sequence",
                      //   "simultaneous",
                      //   "random",
                      //   "rollover",
                      // ]}
                      valueArray={RingStrategy}
                      handleSelection={handleSelection}
                      name={"ring_group_strategy"}
                      defaultValue={t("None selected")}
                      setOpenDropdown={setOpenDropdown}
                    />
                    {errors.ring_group_strategy && (
                      <div className="text-danger error-ui">
                        {errors.ring_group_strategy}
                      </div>
                    )}
                  </div>
                  {formData.ring_group_strategy === "sequence" ? (
                    <>
                      <Form.Label className="modal-head ">
                        {t("Ring Hunt")}
                      </Form.Label>
                      <div
                        style={{ marginLeft: "2px" }}
                        ref={huntsliderRef}
                      ></div>
                      <div className="second_sek">
                        <strong>{t("Seconds")}:</strong> {huntsliderValue}{" "}
                        {t("sec")}
                      </div>
                      {errors.ring_hunt && (
                        <div className="text-danger error-ui">
                          {errors.ring_hunt}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Form.Label className="modal-head">
                        {t("Ring group duration")}
                      </Form.Label>
                      <div style={{ marginLeft: "2px" }} ref={sliderRef}></div>
                      <div className="second_sek">
                        <strong>{t("Seconds")}:</strong> {sliderValue}{" "}
                        {t("sec")}
                      </div>
                      {errors.ring_group_call_timeout && (
                        <div className="text-danger error-ui">
                          {errors.ring_group_call_timeout}
                        </div>
                      )}
                    </>
                  )}
                  <Col
                    xs={12}
                    className="status_namm mt-3"
                    // style={{
                    //   borderBottom:
                    //     "1px solid var(--main-bordermodaldashboard-color)",
                    // }}
                  >
                    <div className="modal-head d-flex justify-content-between">
                      {t("Record calls")}
                      <label className="switch" style={{ marginLeft: "8px" }}>
                        <input type="checkbox" id="skipBusyAgent" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </Col>

                  {/* <div
                    style={{
                      border: "1px solid var(--main-ringroupmodalcolor-color)",
                      borderRadius: "3px",
                      marginTop: "20px",
                    }}
                  >
                    <div className='musicback'>Music on hold<label className="switch">
                                        <input type="checkbox"
                                            id="musicOnHold"
                                            checked={checkboxStates.musicOnHold}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span className="slider"></span>
                                    </label></div>
                    <div className="Slider">
                      {t("Skip busy agent")}
                      <label className="switch">
                        <input
                          type="checkbox"
                          id="skip_busy_agent"
                          name="skip_busy_agent"
                          checked={formData.skip_busy_agent}
                          onChange={(e) => handleChange(e)}
                        />

                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className='musicback' style={{borderBottom:"none"}}>Remote call pickup<label className="switch">
                                        <input type="checkbox" id="remoteCallPickup"
                                            checked={checkboxStates.remoteCallPickup}
                                            onChange={handleCheckboxChange} />
                                        <span className="slider"></span>
                                    </label></div>
                  </div> */}
                </Col>
                <Col lg={8} className="mt-5">
                  <div style={{ display: "flex", width: "100%" }}>
                    <div style={{ width: "46%" }}>
                      <Form.Label className="modal-head">
                        {t("Select extensions")}
                      </Form.Label>
                      {loader2 ? (
                        <div
                          style={{
                            width: "100%",
                            height: "200px",
                            border: "1px solid var(--main-callrouting-color)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Spinner
                            animation="border"
                            size="sm"
                            style={{ color: "var(--main-orange-color)" }}
                          />
                        </div>
                      ) : (
                        <div
                          className=""
                          style={{
                            width: "100%",
                            height: "200px",
                            border:
                              "1px solid var(--main-bordermodaldashboard-color)",
                            overflowY: "auto",
                            borderRadius: "3px",
                          }}
                        >
                          {selectedValuesFirst?.map((val) => (
                            <>
                              <div
                                key={val._id}
                                style={{
                                  fontSize: "14px",
                                  borderBottom:
                                    "1px solid var(--main-bordermodaldashboard-color)",
                                  padding: "3px 7px",
                                  fontWeight: "300",
                                }}
                                className="valueofdrag"
                                onClick={() => handleFirstItemClick(val._id)}
                              >
                                {val.user_extension}
                              </div>
                            </>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        width: "8%",
                      }}
                    >
                      <img src={switchimg} height={21} width={21} />
                    </div>
                    <div style={{ width: "46%" }}>
                      <Form.Label className="modal-head">
                        {t("Selected extensions")}
                      </Form.Label>
                      <InputGroup className="">
                        <div
                          className=""
                          style={{
                            width: "100%",
                            height: "200px",
                            border:
                              "1px solid var(--main-bordermodaldashboard-color)",
                            overflowY: "auto",
                            borderRadius: "3px",
                          }}
                        >
                          {selectedValuesSecond.map((val) => (
                            <>
                              <div
                                key={val._id}
                                style={{
                                  fontSize: "14px",
                                  padding: "3px 7px",
                                  borderBottom:
                                    "1px solid var(--main-bordermodaldashboard-color)",
                                  fontWeight: "300",
                                }}
                                className="valueofdrag"
                                onClick={() => handleSecondInputChange(val._id)}
                              >
                                {val.user_extension}
                              </div>
                            </>
                          ))}
                        </div>
                      </InputGroup>
                      {errors.selectedValuesSecond && (
                        <div className="text-danger error-ui ">
                          {errors.selectedValuesSecond}
                        </div>
                      )}
                    </div>
                  </div>
                </Col>

                {/* <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("Call timeout destination")}
                    <CustomTooltipModal
                      tooltip={t(
                        "Select the timeout destination for this ring group"
                      )}
                    />
                  </Form.Label>
                  <DestinationDropdown
                    valueArray={allDropdown}
                    name={"ring_group_call_timeout_destination"}
                    defaultValue={t("None selected")}
                    setOpenDropdown={setOpenDropdown}
                    toggleDropdown={toggleDropdown}
                    showValue={{
                      ring_group_timeout_app: formData.ring_group_timeout_app,
                      ring_group_timeout_data: formData.ring_group_timeout_data,
                    }}
                    openDropdown={openDropdown}
                    handleSelection={handleSelection}
                  />
                  {errors.ring_group_call_timeout_destination && (
                    <div className="text-danger error-ui">
                      {errors.ring_group_call_timeout_destination}
                    </div>
                  )}
                </Col> */}
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("Remote no answer")}
                  </Form.Label>
                  <div className="Selfmade-dropdown">
                    <div
                      className="Selfmadedropdown-btn"
                      onClick={() => toggleDropdown("type")}
                    >
                      {t(selectType.display) || t("None selected")}
                      <div>
                        <Dropdownicon />
                      </div>
                    </div>
                    {openDropdown === "type" && (
                      <div className="Selfmadedropdown-content">
                        {TypeInnumber.sort((a, b) =>
                          a.type.localeCompare(b.type)
                        ).map((type) => (
                          <a
                            key={type.id}
                            onClick={() => handleSelectType(type)}
                          >
                            {t(type.type)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.Type && (
                    <p className="text-danger error-ui">{errors.Type}</p>
                  )}
                </Col>

                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("No answer endpoint")}
                  </Form.Label>
                  <div className="Selfmade-dropdown">
                    <div
                      className="Selfmadedropdown-btn"
                      onClick={() => toggleDropdown("destination")}
                    >
                      {selectExtension.display || t("None selected")}
                      <div>
                        <Dropdownicon />
                      </div>
                    </div>
                    {openDropdown === "destination" && (
                      <div className="Selfmadedropdown-content">
                        {filteredList && filteredList.length > 0 ? (
                          <>
                            {filteredList
                              ?.sort((a, b) => a.name.localeCompare(b.name))
                              .map((destination) => {
                                if (destination?.recording_filename) {
                                  return (
                                    <a
                                      key={destination.id}
                                      onClick={() =>
                                        handleSelectExtension(destination)
                                      }
                                    >
                                      {destination.name}
                                    </a>
                                  );
                                } else {
                                  return (
                                    <a
                                      key={destination.id}
                                      onClick={() =>
                                        handleSelectExtension(destination)
                                      }
                                    >
                                      {destination.extension}
                                    </a>
                                  );
                                }
                              })}
                          </>
                        ) : (
                          <div>{t("No Record")}</div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.destination && (
                    <p className="text-danger error-ui">{errors.destination}</p>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
          <div
            className="d-flex justify-content-end me-4"
            style={{ marginBottom: "37px" }}
          >
            <button
              className="btn_cancel me-3"
              onClick={handleClosee}
              disabled={loader || loader2}
            >
              {t("Cancel")}
            </button>
            {loader || loader2 ? (
              <button className="btn_save">
                <Spinner animation="border" size="sm" />
              </button>
            ) : (
              <button className="btn_save" onClick={handleSave}>
                {t("Save")}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RingGroupModal;
