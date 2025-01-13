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
import ConstantConfig, {
  EXTENSIONVALALL,
  Numeric,
  TimeconditionDropArray,
} from "../ConstantConfig";
import { useTranslation } from "react-i18next";
import CustomTooltipModal from "../CustomTooltipModal";
import DestinationDropdown from "../DestinationDropdown";
import { useDispatch } from "react-redux";
import {
  getapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import config from "../../config";
import Cookies from "js-cookie";
import CustomDropDown from "../CustomDropDown";
import { ReactComponent as DeleteIcon } from "../../Assets/Icon/delete.svg";
import { toast } from "react-toastify";

function CallRoutingModal({ handleClose, show, optionValue, timeConditionID }) {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };
  // console.log("timeConditionID", timeConditionID);

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

  // -------------------------------------------------------------------------new--------------------------------------------------------------------------
  const user_extension = Cookies.get("user_extension");
  const [errors, setErrors] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dropdownSets, setDropdownSets] = useState([]);

  // console.log("user_extension", user_extension);
  const removeDropdownSet = (index) => {
    setFormData((prevFormData) => {
      const updatedTimeConditionData = prevFormData.timecondition_data.filter(
        (_, i) => i !== index
      );

      return {
        ...prevFormData,
        timecondition_data: updatedTimeConditionData,
      };
    });
    const updatedSets = dropdownSets.filter((_, i) => i !== index);
    setDropdownSets(updatedSets);
  };
  useEffect(() => {
    setDropdownSets([
      {
        dialplan_detail_tag: "condition",
        dialplan_detail_type: formData.Value,
        dialplan_detail_data: formData.Range,
      },
    ]);
  }, []);
  const [formData, setFormData] = useState({
    timename: "",
    timedesc: "",
    timedescnot: "",
    extension: "",
    timecondition_data: [
      {
        dialplan_detail_tag: "condition",
        dialplan_detail_type: "",
        dialplan_detail_data: "",
      },
    ],
    TimeList: "",
    description: "",
    selectFilter: "",
    selectFilter1: "",
    Range: "",
    Value: "",
  });
  const addNewDropdownSet = () => {
    // Use the current length of timecondition_data as the new index
    setFormData((prevFormData) => {
      const updatedTimeConditionData = [...prevFormData.timecondition_data];

      // Push a new object to the array
      updatedTimeConditionData.push({
        dialplan_detail_tag: "condition",
        dialplan_detail_type: "",
        dialplan_detail_data: "",
      });

      return {
        ...prevFormData,
        timecondition_data: updatedTimeConditionData,
      };
    });
  };
  const [timepass, setTimepass] = useState({});
  const yearList = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - 10 + i);

    return years;
  };
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfMonthList = (selectedMonth, selectedYear) => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };
  const dayOfWeekList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const weekOfYearList = () =>
    Array.from({ length: 52 }, (_, i) => `${t("Week")} ${i + 1}`);
  const weekOfMonthList = () => [
    "1st Week",
    "2nd Week",
    "3rd Week",
    "4th Week",
    "5th Week",
  ];
  const hoursOfDayList = () => Array.from({ length: 24 }, (_, i) => `${i}`);
  const timeOfDayList = () => ["Morning", "Afternoon", "Evening", "Night"];
  const dateTimeList = () => [
    "2023-08-09 12:00",
    "2023-08-10 12:00",
    "2023-08-11 12:00",
  ]; // Example list

  const helperFunction = (value, index) => {
    setTimepass((prevTimepass) => {
      const newTimepass = { ...prevTimepass };
      switch (value) {
        case "Year":
          newTimepass[index] = yearList();
          break;
        case "Month":
          newTimepass[index] = monthList;
          break;
        case "Day of Month":
          newTimepass[index] = dayOfMonthList(selectedMonth, selectedYear);
          break;
        case "Day of Week":
          newTimepass[index] = dayOfWeekList;
          break;
        case "Week of Year":
          newTimepass[index] = weekOfYearList();
          break;
        case "Hours of Day":
          newTimepass[index] = hoursOfDayList();
          break;
        case "Time of Day":
          newTimepass[index] = timeOfDayList();
          break;
        case "Date & Time":
          newTimepass[index] = dateTimeList();
          break;
        default:
          newTimepass[index] = [];
      }
      return newTimepass;
    });
  };
  const displayToApiTimeType = (type) => {
    const conversions = {
      Year: "year",
      Month: "mon",
      "Day of Month": "mday",
      "Day of Week": "wday",
      "Week of Year": "week",
      "Hours of Day": "hour",
      "Time of Day": "time",
      "Date & Time": "datetime",
    };
    return conversions[type] || type;
  };

  const apiToDisplayTimeType = (type) => {
    const conversions = {
      year: "Year",
      mon: "Month",
      mday: "Day of Month",
      wday: "Day of Week",
      week: "Week of Year",
      hour: "Hours of Day",
      time: "Time of Day",
      datetime: "Date & Time",
    };
    return conversions[type] || type;
  };

  const [apidropdown, setApidropdown] = useState(null);
  const dispatch = useDispatch();
  let Token = Cookies.get("Token");
  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.DROPDOWNAllSHOW,
        Token: Token,
        urlof: "systemrecording",
      })
    ).then((res) => {
      if (res) {
        setApidropdown(res?.payload?.response.data);
      }
    });
  }, [Token]);

  const data = {
    id: timeConditionID,
  };

  useEffect(() => {
    dispatch(
      postapiAll({
        inputData: data,
        Api: config.TIME_CONDITION.DETAIL,
        Token: Token,
        urlof: config.TIME_CONDITION_KEY.DETAIL,
      })
    ).then((response) => {
      // setsaveLoading(false);
      const editsvalues = response?.payload?.response?.data;
      console.log("edit", editsvalues);

      if (timeConditionID) {
        setFormData({
          timename: editsvalues?.name,
          extension: editsvalues?.extension,
          description: editsvalues?.description,
          selectFilter: editsvalues?.dialplan_action,
          selectFilter1: editsvalues?.dialplan_anti_action,
          timecondition_data: editsvalues?.timecondition_data,
          selectApp: editsvalues?.dialplan_action.split(":")[0], // First part before the colon
          selectData: editsvalues?.dialplan_action.split(":")[1],
          selectApp1: editsvalues?.dialplan_anti_action.split(":")[0], // First part before the colon
          selectData1: editsvalues?.dialplan_anti_action.split(":")[1],
        });
      }
    });
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      timecondition_data: [],
    };

    if (!formData.timename) {
      newErrors.timename = t("Time condition name is required");
      valid = false;
    }
    if (!formData.extension) {
      newErrors.extension = t("Extension is required");
      valid = false;
    } else if (
      !ConstantConfig.RINGGROUP.VALIDATION.EXTENSIONVAL.test(formData.extension)
    ) {
      newErrors.extension = t("Ring group extension must contain only digits");
      valid = false;
    } else if (!EXTENSIONVALALL.test(formData.extension)) {
      newErrors.extension = t("Invalid Extension");
      valid = false;
    }
    if (!formData.description) {
      newErrors.description = t("Description is required");
      valid = false;
    }
    if (!formData.selectFilter) {
      newErrors.selectFilter = t("Destination matches is required");
      valid = false;
    }
    if (!formData.selectFilter1) {
      newErrors.selectFilter1 = t("Destination non-matches is required");
      valid = false;
    }

    formData?.timecondition_data?.forEach((item, index) => {
      const rowErrors = {};
      if (!item.dialplan_detail_type) {
        rowErrors.TimeList = t("Time type is required");
        valid = false;
      }
      const [value, range] = item.dialplan_detail_data.split("-");
      if (!value) {
        rowErrors.Value = t("Value is required");
        valid = false;
      }
      if (!range) {
        rowErrors.Range = t("Range is required");
        valid = false;
      }
      if (Object.keys(rowErrors).length > 0) {
        newErrors.timecondition_data[index] = rowErrors;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validateForm()) {
      const listvalues = {
        name: formData.timename,
        extension: formData.extension,
        timecondition_enabled: "true",
        description: formData.description,
        order: "500",
        dialplan_action: formData.selectFilter,
        dialplan_anti_action: formData.selectFilter1,
        timecondition_data: formData.timecondition_data,
        time_condition_id: timeConditionID != null ? timeConditionID : "",
      };
      if (timeConditionID == null) {
        // setsaveLoading(true);
        dispatch(
          postapiAll({
            inputData: listvalues,
            Api: config.TIME_CONDITION.ADD,
            Token: Token,
            urlof: config.TIME_CONDITION_KEY.ADD,
          })
        ).then((res) => {
          if (res?.payload?.response) {
            // setsaveLoading(false);
            handleClose();
            // setsavedata(!savedata);
            // setCurrentPage(1);
            // setSearchterm("");
            setFormData("");
            toast.success(t(res.payload.response.message), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
          } else {
            if (res?.payload?.error) {
              toast.error(t(res.payload.error.response.data.message), {
                autoClose: config.TOST_AUTO_CLOSE,
              });
              // setsaveLoading(false);
            }
          }
        });
      }
      if (timeConditionID != null) {
        // setsaveLoading(true);
        dispatch(
          putapiall({
            inputData: listvalues,
            Api: config.TIME_CONDITION.UPDATE,
            Token: Token,
            urlof: config.TIME_CONDITION_KEY.UPDATE,
          })
        ).then((res) => {
          if (res?.payload?.response) {
            // setsaveLoading(false);
            handleClose();
            // setsavedata(!savedata);
            // setCurrentPage(1);
            // setSearchterm("");
            setFormData("");
            toast.success(t(res?.payload?.response?.message), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
          } else {
            if (res?.payload?.error) {
              toast.error(t(res?.payload?.error?.response?.data?.message), {
                autoClose: config.TOST_AUTO_CLOSE,
              });
              // setsaveLoading(false);
            }
          }
        });
      }
    }
  };

  // -------------------------------------------------------------------------new--------------------------------------------------------------------------
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
    if (name.includes("_")) {
      const [newId, index] = name.split("_");
      const ivrMenuOption = formData.timecondition_data;
      ivrMenuOption[index][newId] = value;
      setFormData((prevState) => ({
        ...prevState,
        timecondition_data: ivrMenuOption,
      }));
      const ivrMenuOptionError = errors.timecondition_data;

      if (ivrMenuOptionError && ivrMenuOptionError[index]) {
        ivrMenuOptionError[index][newId] = "";
      }

      setErrors((prevState) => ({
        ...prevState,
        timecondition_data: ivrMenuOptionError,
      }));
      return;
    }
    if (name == "selectFilter") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectFilter: value.app + ":" + value.data,
      }));
    } else if (name == "selectFilter1") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        selectFilter1: value.app + ":" + value.data,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({ ...errors, [name]: "" });

    const newErrors = {};
    if (!value || !String(value).trim()) {
      newErrors[name] = `${name.replace(/_/g, " ")} ${t("is required")}`;
    }
    if (name == "timename" && (!value || !String(value).trim())) {
      newErrors[name] = t("Time condition name is required");
    }
    if (name == "extension" && (!value || !String(value).trim())) {
      newErrors[name] = t("Extension name is required");
    }
    if (name == "description" && (!value || !String(value).trim())) {
      newErrors[name] = t("Description name is required");
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
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

  const handleSelection = (dropdown, value, index) => {
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };
      if (dropdown === "selectFilter") {
        updatedFormData.selectApp = value.app;
        updatedFormData.selectData = value.data;
        updatedFormData.selectFilter = `${value.app}:${value.data}`;
      } else if (dropdown === "selectFilter1") {
        updatedFormData.selectApp1 = value.app;
        updatedFormData.selectData1 = value.data;
        updatedFormData.selectFilter1 = `${value.app}:${value.data}`;
      } else if (dropdown.startsWith("TimeList_")) {
        const updatedTimeConditionData = [
          ...updatedFormData.timecondition_data,
        ];
        updatedTimeConditionData[index].dialplan_detail_type =
          displayToApiTimeType(value);
        updatedTimeConditionData[index].dialplan_detail_data = "";
        updatedFormData.timecondition_data = updatedTimeConditionData;
        helperFunction(value, index); // Pass both value and index
      } else if (
        dropdown.startsWith("Value_") ||
        dropdown.startsWith("Range_")
      ) {
        const updatedTimeConditionData = [
          ...updatedFormData.timecondition_data,
        ];
        const currentData =
          updatedTimeConditionData[index].dialplan_detail_data.split("-");
        if (dropdown.startsWith("Value_")) {
          currentData[0] = value;
        } else {
          currentData[1] = value;
        }
        updatedTimeConditionData[index].dialplan_detail_data =
          currentData.join("-");
        updatedFormData.timecondition_data = updatedTimeConditionData;
      }

      return updatedFormData;
    });
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    handleChange(syntheticEvent);
    setOpenDropdown(null);
  };

  return (
    <>
      {optionValue != "Office hours" ? (
        <Modal show={show} size="lg">
          <div className="new-dial">
            <div
              className="p-3"
              style={{
                borderBottom:
                  "1px solid var(--main-bordermodaldashboard-color)",
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
      ) : (
        <Modal show={show} size="lg">
          <div className="modal-data">
            <div
              className="p-3"
              style={{
                borderBottom:
                  "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between add_new_num">
                <h6>
                  {timeConditionID == null
                    ? "Add time condition"
                    : "Edit time condition"}
                </h6>
                {/* <h6>{header}</h6> */}
                <Closeicon width={23} onClick={handleClose} height={23} />
                {/* <img src={close} onClick={handleClose} alt="" width={25} /> */}
              </div>
            </div>
            <div className="p-3">
              <Form
                style={{
                  borderBottom:
                    "1px solid var(--main-bordermodaldashboard-color)",
                }}
                className="mb-3"
              >
                <Row>
                  <Col lg={4} className="mb-3">
                    <Form.Label className="modal-head">
                      {t("Time condition name")}
                      <CustomTooltipModal
                        tooltip={t("Enter the name for the time condition")}
                      />
                    </Form.Label>
                    <InputGroup className="">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        className="search-bg"
                        name="timename"
                        value={formData.timename || ""}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {errors.timename && (
                      <div className="text-danger error-ui">
                        {errors.timename}
                      </div>
                    )}
                  </Col>
                  <Col lg={4} className="mb-3">
                    <Form.Label className="modal-head">
                      {t("Description")}
                    </Form.Label>
                    <InputGroup className="">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        className="search-bg"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {errors.description && (
                      <div className="text-danger error-ui">
                        {errors.description}
                      </div>
                    )}
                  </Col>
                  <Col lg={4} className="mb-3">
                    <Form.Label className="modal-head">
                      {t("Extension")}
                      <CustomTooltipModal
                        tooltip={t("Enter the extension number")}
                      />
                    </Form.Label>
                    <InputGroup className="">
                      <Form.Control
                        disabled={timeConditionID != null}
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        className="search-bg"
                        name="extension"
                        value={formData.extension || ""}
                        onChange={handleChange}
                        // onKeyPress={handleKeyPress}
                      />
                    </InputGroup>
                    {errors.extension && (
                      <div className="text-danger error-ui">
                        {errors.extension}
                      </div>
                    )}
                  </Col>
                  <Col lg={4} className="mb-3">
                    <Form.Label className="modal-head">
                      {t("Destination matches")}
                    </Form.Label>

                    <DestinationDropdown
                      valueArray={apidropdown || {}}
                      name={"selectFilter"}
                      defaultValue={t("None selected")}
                      setOpenDropdown={setOpenDropdown}
                      toggleDropdown={toggleDropdown}
                      showValue={{
                        ring_group_timeout_app: formData.selectApp || "",
                        ring_group_timeout_data: formData.selectData || "",
                      }}
                      openDropdown={openDropdown}
                      handleSelection={handleSelection}
                    />
                    {errors.selectFilter && (
                      <div className="text-danger error-ui">
                        {errors.selectFilter}
                      </div>
                    )}
                  </Col>

                  <Col lg={4} className="mb-3">
                    <Form.Label className="modal-head">
                      {t("Destination non-matches")}
                    </Form.Label>
                    <DestinationDropdown
                      valueArray={apidropdown || {}}
                      name={"selectFilter1"}
                      defaultValue={t("None selected")}
                      setOpenDropdown={setOpenDropdown}
                      toggleDropdown={toggleDropdown}
                      showValue={{
                        ring_group_timeout_app: formData.selectApp1 || "",
                        ring_group_timeout_data: formData.selectData1 || "",
                      }}
                      openDropdown={openDropdown}
                      handleSelection={handleSelection}
                    />
                    {errors.selectFilter1 && (
                      <div className="text-danger error-ui">
                        {errors.selectFilter1}
                      </div>
                    )}
                  </Col>
                  <Col lg={4} />
                </Row>
                {console.log(
                  "formData?.timecondition_data",
                  formData?.timecondition_data
                )}

                {formData?.timecondition_data?.map((set, index) => {
                  return (
                    <Row
                      key={index}
                      style={{
                        display: "flex",
                        marginBottom: "15px",
                      }}
                    >
                      <Col>
                        <Form.Label className="modal-head">
                          {t("Time")}
                        </Form.Label>
                        <CustomDropDown
                          toggleDropdown={toggleDropdown}
                          showValue={
                            apiToDisplayTimeType(set.dialplan_detail_type) || ""
                          }
                          openDropdown={openDropdown}
                          valueArray={TimeconditionDropArray}
                          handleSelection={(item, value) =>
                            handleSelection(item, value, index)
                          }
                          name={`TimeList_${index}`}
                          defaultValue={t("None selected")}
                          setOpenDropdown={setOpenDropdown}
                          sorting={false}
                        />
                        {errors?.timecondition_data?.[index]?.TimeList && (
                          <div className="text-danger error-ui">
                            {errors.timecondition_data[index].TimeList}
                          </div>
                        )}
                      </Col>
                      <Col>
                        <Form.Label className="modal-head">
                          {t("Value")}
                          <CustomTooltipModal
                            tooltip={t(
                              "Define custome condition necessary to execute the destination selected above"
                            )}
                          />
                        </Form.Label>
                        <CustomDropDown
                          toggleDropdown={toggleDropdown}
                          showValue={
                            t(set.dialplan_detail_data.split("-")[0]) || ""
                          }
                          openDropdown={openDropdown}
                          valueArray={timepass[index] || []}
                          handleSelection={(item, value) =>
                            handleSelection(item, value, index)
                          }
                          name={`Value_${index}`}
                          defaultValue={t("None selected")}
                          setOpenDropdown={setOpenDropdown}
                          sorting={false}
                        />
                        {errors?.timecondition_data?.[index]?.Value && (
                          <div className="text-danger error-ui">
                            {errors.timecondition_data[index].Value}
                          </div>
                        )}
                      </Col>
                      <Col>
                        <Form.Label className="modal-head">
                          {t("Range")}
                          <CustomTooltipModal
                            tooltip={t(
                              "Define custome condition necessary to execute the destination selected above"
                            )}
                          />
                        </Form.Label>
                        <CustomDropDown
                          toggleDropdown={toggleDropdown}
                          showValue={
                            t(set.dialplan_detail_data.split("-")[1]) || ""
                          }
                          openDropdown={openDropdown}
                          valueArray={timepass[index] || []}
                          handleSelection={(item, value) =>
                            handleSelection(item, value, index)
                          }
                          name={`Range_${index}`}
                          defaultValue={t("None selected")}
                          setOpenDropdown={setOpenDropdown}
                          sorting={false}
                        />
                        {errors?.timecondition_data?.[index]?.Range && (
                          <div className="text-danger error-ui">
                            {errors.timecondition_data[index].Range}
                          </div>
                        )}
                      </Col>
                      <Col>
                        <div
                          style={{
                            height: "20px",
                            width: "20px",
                            marginTop: "30px",
                          }}
                        >
                          {index === 0 ? (
                            <button
                              className="btn_save"
                              type="button"
                              onClick={addNewDropdownSet}
                            >
                              {t("Add")}
                            </button>
                          ) : (
                            <button
                              className="btn_save"
                              type="button"
                              onClick={() => removeDropdownSet(index)}
                            >
                              <DeleteIcon
                                width={14}
                                height={14}
                                className="edithover"
                              />
                            </button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  );
                })}
              </Form>
            </div>
            <div
              className="d-flex justify-content-end me-4"
              style={{ marginBottom: "37px" }}
            >
              <button
                className="btn_cancel me-2"
                onClick={handleClose}
                // disabled={loader}
              >
                {t("Cancel")}
              </button>
              {/* {loader ? (
              <button className="btn_save">
                <Spinner animation="border" size="sm" />
              </button>
            ) : (
              <button className="btn_save" onClick={handleSave}>
                {t("Save")}
              </button>
            )} */}
              <button className="btn_save" onClick={handleSave}>
                {t("Save")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
export default CallRoutingModal;
