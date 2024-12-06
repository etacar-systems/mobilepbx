import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { InputGroup, Spinner } from "react-bootstrap";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as DeleteIcon } from "../../Assets/Icon/delete.svg";
import DestinationDropdown from "../DestinationDropdown";
import DropDownSound from "../DropDownSound";
import DropDown from "../Dropdown";
import CustomDropDown from "../CustomDropDown";
import CustomTooltipModal from "../CustomTooltipModal";
import DropdownGreet from "../DropdownGreet";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import config from "../../config";
import Cookies from "js-cookie";
import ConstantConfig, { EXTENSIONVALALL, Timeout_retries, TypeInnumber } from "../ConstantConfig";

function IVRModal({
  allDropdown,
  soundDropdown,
  handleClose,
  show,
  header,
  formData,
  setFormData,
  saveData,
  IVRList,
  ringDropdown,
  loader,
  mode,
}) {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [errors, setErrors] = useState({});
  const Token = Cookies.get("Token");
  const dispatch = useDispatch();
  const [apidropdown, setApidropdown] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [showState, setShowState] = useState("");
  const [showState1, setShowState1] = useState("");
  const [showState2, setShowState2] = useState("");
  const [endpoint, setEndpoint] = useState([
    {
      name: "",
    },
  ]);

  const [select_type, setSelect_type] = useState({
    value: "",
    name: "",
  });
  const [showAnnoucnment, setShowAnnouncement] = useState("");
  useEffect(() => {
    // setsaveLoading(true);
    dispatch(
      getapiAll({
        Api: config.DROPDOWNAllSHOW,
        Token: Token,
        urlof: "systemrecording",
      })
    ).then((res) => {
      if (res) {
        setApidropdown(res?.payload?.response?.data);
        // setsaveLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    switch (select_type.value.toString()) {
      case "1": // IVR
        setFilteredList(apidropdown?.ivr_menus);
        break;
      case "2": // Ring groups
        setFilteredList(apidropdown?.ring_groups);
        break;
      case "3": // Extension
        setFilteredList(apidropdown?.extensions);
        break;
      case "4": // Conferences
        setFilteredList(apidropdown?.conference);
        break;
      case "5": // System recordings
        setFilteredList(apidropdown?.recordings);
        break;
      case "6": // Time Condition
        setFilteredList(apidropdown?.timeconditions);
        break;
      default:
        setFilteredList([]); // Default case, empty the list or handle as needed
        break;
    }
    // if (mode == "add") {
    //   setSelectExtension("");
    // }
  }, [apidropdown, select_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("$")) {
      const [newId, index] = name.split("$");
      const ivrMenuOption = formData.ivr_menu_option;
      ivrMenuOption[index][newId] = value;
      setFormData((prevState) => ({
        ...prevState,
        ivr_menu_option: ivrMenuOption,
      }));
      const ivrMenuOptionError = errors.ivr_menu_option;
      if (ivrMenuOptionError && ivrMenuOptionError[index]) {
        ivrMenuOptionError[index][newId] = "";
      }
      setErrors((prevState) => ({
        ...prevState,
        ivr_menu_option: ivrMenuOptionError,
      }));
      //   formData.ivr_menu_option.forEach((item, index) => {

      //   if (!item.menu_param) {
      //     if (!errors.ivr_menu_option) {
      //       errors.ivr_menu_option = [];
      //     }
      //     if (!errors.ivr_menu_option[index]) {
      //       errors.ivr_menu_option[index] = {};
      //     }
      //     errors.ivr_menu_option[index].menu_param = t(
      //       "Destination is Mandatory"
      //     );

      //   }
      //   else
      //   {
      //     errors.ivr_menu_option[index].menu_param = ""
      //   }

      // });
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };
  const toggleDropdown = (dropdown, type) => {
    if (type) {
      setSelect_type({
        value: type.select_type,
        name: "select_type",
      });
    }
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = t("IVR name is required");
      valid = false;
    }

    if (!formData.description) {
      newErrors.description = t("Description is required");
      valid = false;
    }

    if (!formData.extension) {
      newErrors.extension = t("Extension is required");
      valid = false;
    } else if (!ConstantConfig.RINGGROUP.VALIDATION.EXTENSIONVAL.test(formData.extension)) {
      newErrors.extension = t("Ring group extension must contain only digits");
      valid = false;
    } else if (!EXTENSIONVALALL.test(formData.extension)) {
      newErrors.extension = t("Invalid Extension");
      valid = false;
    }

    // if (!formData.ivr_menu_timeout || isNaN(formData.ivr_menu_timeout)) {
    //   newErrors.ivr_menu_timeout = t("Menu timeout must be a number");
    //   valid = false;
    // }

    if (!formData.ivr_menu_exit_app && !formData.ivr_menu_exit_data) {
      newErrors.ivr_menu_exit = t("Exit application is required");
      valid = false;
    }
    // if (formData.ivr_menu_direct_dial === undefined) {
    //   newErrors.ivr_menu_direct_dial = t("Direct dial option is required");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_ringback) {
    //   newErrors.ivr_menu_ringback = t("Ringback is required");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_cid_prefix) {
    //   newErrors.ivr_menu_cid_prefix = t("CID prefix is required");
    //   valid = false;
    // }

    if (!formData.ivr_menu_invalid_sound) {
      newErrors.ivr_menu_invalid_sound = t("Invalid sound is required");
      valid = false;
    }

    if (!formData.greet_long) {
      newErrors.greet_long = t("Annoucenment is required");
      valid = false;
    }

    // if (!formData.ivr_menu_pin_number) {
    //   newErrors.ivr_menu_pin_number = t("PIN number is required");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_confirm_macro) {
    //   newErrors.ivr_menu_confirm_macro = t("Confirm macro is required");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_confirm_key) {
    //   newErrors.ivr_menu_confirm_key = t("Confirm key is required");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_tts_engine) {
    //   newErrors.ivr_menu_tts_engine = t("TTS engine is required");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_tts_voice) {
    //   newErrors.ivr_menu_tts_voice = t("TTS voice is required");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_confirm_attempts || isNaN(formData.ivr_menu_confirm_attempts)) {
    //   newErrors.ivr_menu_confirm_attempts = t("Confirm attempts must be a number");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_inter_digit_timeout || isNaN(formData.ivr_menu_inter_digit_timeout)) {
    //   newErrors.ivr_menu_inter_digit_timeout = t("Inter-digit timeout must be a number");
    //   valid = false;
    // }

    if (!formData.ivr_menu_max_failures || isNaN(formData.ivr_menu_max_failures)) {
      newErrors.ivr_menu_max_failures = t("Max failures must be a number");
      valid = false;
    }

    // if (!formData.ivr_menu_max_timeouts || isNaN(formData.ivr_menu_max_timeouts)) {
    //   newErrors.ivr_menu_max_timeouts = t("Max timeouts must be a number");
    //   valid = false;
    // }

    // if (!formData.ivr_menu_digit_len || isNaN(formData.ivr_menu_digit_len)) {
    //   newErrors.ivr_menu_digit_len = t("Digit length must be a number");
    //   valid = false;
    // }

    formData.ivr_menu_option.forEach((item, index) => {
      if (!newErrors.ivr_menu_option) {
        newErrors.ivr_menu_option = [];
      }
      if (!newErrors.ivr_menu_option[index]) {
        newErrors.ivr_menu_option[index] = {};
      }

      if (!item.menu_digit) {
        newErrors.ivr_menu_option[index].menu_digit = t("Entrie is required");
        valid = false;
      } else if (!ConstantConfig.IVR.VALIDATION.ENTRIES.test(item.menu_digit)) {
        newErrors.ivr_menu_option[index].menu_digit = t(t("Please enter the value ​​from 0 to 9"));
        valid = false;
      }

      if (!item.select_type) {
        newErrors.ivr_menu_option[index].select_type = t(t("Destination type is required"));
        valid = false;
      }

      if (!item.menu_param) {
        newErrors.ivr_menu_option[index].menu_param = t(t("Destination endpoint is required"));
        valid = false;
      }

      // Uncomment if menu_order validation is needed
      // if (!item.menu_order) {
      //   newErrors.ivr_menu_option[index].menu_order = t("Order is mandatory");
      //   valid = false;
      // }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveData();
    }
  };
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;

    if (id.includes("$")) {
      const [newId, index] = id.split("$");
      const ivrMenuOption = formData.ivr_menu_option;
      ivrMenuOption[index][newId] = checked;
      setFormData((prevState) => ({
        ...prevState,
        ivr_menu_option: ivrMenuOption,
      }));
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [id]: checked ? 1 : 0,
    }));
  };
  const handleSelection = (dropdown, value, isMulti) => {
    var domain = Cookies.get("domain_name");
    // const syntheticEvent = {
    //   target: {
    //     name: dropdown,
    //     value: value === "None selected" ? "" : value.app + " " + value.data,
    //   },
    // };
    // handleChange(syntheticEvent);

    // setOpenDropdown(null);
    // if(dropdown === "greet_long"){
    //   setShowAnnouncement()
    // }
    if (isMulti === 1) {
      const syntheticEvent = {
        target: {
          name: dropdown,
          value: value === "None selected" ? "" : value.app + " " + value.data,
        },
      };

      handleChange(syntheticEvent);
      return;
    } else if (isMulti === 2) {
      const syntheticEvent1 = {
        target: {
          name: "ivr_menu_exit_app",
          value: value === "None selected" ? "" : value.app,
        },
      };
      handleChange(syntheticEvent1);
      const syntheticEvent2 = {
        target: {
          name: "ivr_menu_exit_data",
          value: value === "None selected" ? "" : value.data,
        },
      };
      handleChange(syntheticEvent2);
    }

    const syntheticEvent3 = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    if (dropdown === "greet_long") {
      const syntheticEvent3 = {
        target: {
          name: "greet_long",
          value: value,
        },
      };
      setShowState(isMulti);
      handleChange(syntheticEvent3);
    } else if (dropdown === "ivr_menu_invalid_sound") {
      const makeUrl = `/var/lib/freeswitch/recordings/${domain}/${value}`;
      const syntheticEvent3 = {
        target: {
          name: "ivr_menu_invalid_sound",
          value: makeUrl,
        },
      };
      setShowState1(isMulti);
      handleChange(syntheticEvent3);
    } else {
      handleChange(syntheticEvent3);
    }

    setOpenDropdown(null);
  };
  //   if (mode === "Edit" && formData.ivr_menu_exit_sound) {
  //     const extractName = formData.ivr_menu_exit_sound.substring(
  //       formData.ivr_menu_exit_sound.lastIndexOf("/") + 1
  //     );
  //     const findMatch = (obj, targetName) => {
  //       for (const [key, value] of Object.entries(obj)) {
  //         if (typeof value === "object" && !Array.isArray(value)) {
  //           const nestedResult = findMatch(value, targetName);
  //           if (nestedResult) return { [key]: nestedResult };
  //         } else if (value === targetName) {
  //           return { [key]: value };
  //         }
  //       }
  //       return null;
  //     };

  //     const matchResult = findMatch(soundDropdown, extractName);

  //     if (matchResult.recordings) {
  //       setShowState2(Object.keys(matchResult.recordings)[0]);
  //     } else if (matchResult.sounds) {
  //       setShowState2(Object.keys(matchResult.sounds)[0]);
  //     } else {
  //       console.log("No match found");
  //     }
  //   }
  // }, [formData.ivr_menu_exit_sound]);
  useEffect(() => {
    if (mode === "Edit" && formData.ivr_menu_invalid_sound) {
      const extractName = formData.ivr_menu_invalid_sound.substring(
        formData.ivr_menu_invalid_sound.lastIndexOf("/") + 1
      );
      const findMatch = (obj, targetName) => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === "object" && !Array.isArray(value)) {
            const nestedResult = findMatch(value, targetName);
            if (nestedResult) return { [key]: nestedResult };
          } else if (value === targetName) {
            return { [key]: value };
          }
        }
        return null;
      };

      const matchResult = findMatch(soundDropdown, extractName);
      if (matchResult?.recordings) {
        setShowState1(Object.keys(matchResult?.recordings)[0]);
      } else if (matchResult?.sounds) {
        setShowState1(Object.keys(matchResult?.sounds)[0]);
      } else {
        console.log("No match found");
      }
    }
  }, [formData.ivr_menu_invalid_sound]);
  const handleAddMenu = (e) => {
    setSelect_type({
      value: "",
      name: "",
    });
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      ivr_menu_option: [
        ...prevState.ivr_menu_option,
        {
          menu_digit: "",
          select_type: "",
          menu_option: "",
          menu_param: "",
          menu_order: 102,
          ivr_menu_option_enabled: 1,
        },
      ],
    }));
    setEndpoint((prev) => [
      ...(Array.isArray(prev) ? prev : []), // Ensure prev is an array
      { name: "" }, // Add a new blank object
    ]);
  };

  const handleRemoveMenu = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      ivr_menu_option: prevState.ivr_menu_option.filter((_, i) => i !== index),
    }));
    setErrors((prevState) => ({
      ...prevState,
      ivr_menu_option: prevState.ivr_menu_option?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key < "0" || e.key > "9") {
      e.preventDefault();
    }
  };
  const handleKeyPress2 = (e) => {
    if ((e.key < "0" || e.key > "9") && e.key !== "#" && e.key !== "$") {
      e.preventDefault();
    }
  };
  const showSelectType = (value) => {
    const newData_type = TypeInnumber.filter((item) => item.value == value);

    return newData_type[0]?.type;
  };

  //  const [checkEndPoint,setCheckEndpoint] = useState([])
  const showEndPoint = (value) => {
    let extension;
    if (value?.menu_param?.startsWith("transfer")) {
      extension = value?.menu_param?.split(" ")[1]; // Get the second part after "transfer"
    } else {
      extension = value?.menu_param?.split(" ")[0]; // Get the first part if there's no "transfer"
    }
    const name = value.menu_param;

    let newEndpoint;
    switch (value?.select_type?.toString()) {
      case "1": // IVR
        newEndpoint = apidropdown?.ivr_menus;
        break;
      case "2": // Ring groups
        newEndpoint = apidropdown?.ring_groups;
        break;
      case "3": // Extension
        newEndpoint = apidropdown?.extensions;
        break;
      case "4": // Conferences
        newEndpoint = apidropdown?.conference;
        break;
      case "5": // System recordings
        newEndpoint = apidropdown?.recordings;
        break;
      case "6": // Time Condition
        newEndpoint = apidropdown?.timeconditions;
        break;
      default:
        newEndpoint = [];
        break;
    }

    // Filter by extension
    let newData;
    if (value?.select_type?.toString() === "5") {
      newData = newEndpoint?.filter((item) => item?.data === name);
    } else {
      newData = newEndpoint?.filter((item) => item?.extension === extension);
    }

    // Return the name if data is found, otherwise "None selected"

    return newData?.length >= 0 ? newData[0]?.extension || newData[0]?.name : "";
  };
  const handleRetries = (type, drop) => {
    const syntheticEvent_retry = {
      target: {
        name: drop,
        value: type,
      },
    };
    handleChange(syntheticEvent_retry);
    toggleDropdown(drop);
  };
  const handleSelectType = (type, drop, index) => {
    // formData.ivr_menu_option[index].menu_digit = index + 1;
    const syntheticEvent3 = {
      target: {
        name: drop,
        value: type.value,
      },
    };
    handleChange(syntheticEvent3);
    toggleDropdown(drop);
    setSelect_type({
      value: type.value,
      name: type.type,
    });
    setEndpoint((prev) => {
      // Create a new array with the updated value
      const updatedEndpoint = prev.map(
        (item, idx) =>
          idx === index
            ? { ...item, name: "" } // Set 'name' to blank for the specific index
            : item // Keep other objects unchanged
      );

      return updatedEndpoint;
    });
    formData.ivr_menu_option[index].menu_param = "";
  };
  const handleSelectExtension = (type, drop, index) => {
    const syntheticEvent3 = {
      target: {
        name: drop,
        value: type.data,
      },
    };
    handleChange(syntheticEvent3);
    toggleDropdown(drop);
    setEndpoint((prev) => {
      // Create a new array with the updated or added object
      const updatedEndpoint = prev.map(
        (item, idx) =>
          idx === index
            ? { ...item, name: type.extension || type.name } // Update the object at the specified index
            : item // Keep other objects unchanged
      );

      // If the index is not in the array, add a new object
      if (index >= prev.length) {
        updatedEndpoint.push({ name: type.extension || type.name });
      }

      return updatedEndpoint;
    });
  };
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

  useEffect(() => {
    if (formData.greet_long) {
      var showvalue = allDropdown["recordings"].find(
        (item) => item.recording_filename == formData.greet_long
      );
      setShowState(showvalue?.name);
    }
  }, [formData.greet_long]);
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
              <Closeicon width={25} onClick={handleClose} height={25} />
            </div>
          </div>
          <div className="p-3 ">
            <Form
              style={{
                borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <Row className="mb-3">
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("IVR name")}
                    <CustomTooltipModal tooltip={t("Enter a name for the IVR menu ")} />
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
                  {errors.name && <div className="text-danger error-ui">{errors.name}</div>}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">{t("Description")}</Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.description && (
                    <div className="text-danger error-ui">{errors.description}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("Extension")}
                    <CustomTooltipModal tooltip={t("Enter the extension number")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="extension"
                      value={formData.extension}
                      onChange={handleChange}
                      disabled={mode == "Edit"}
                    />
                  </InputGroup>
                  {errors.extension && (
                    <div className="text-danger error-ui">{errors.extension}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("Announcement")}
                    <CustomTooltipModal
                      tooltip={t("The long greeting is played when entering the menu")}
                    />
                  </Form.Label>
                  <DropdownGreet
                    toggleDropdown={toggleDropdown}
                    showValue={showState || formData.greet_long}
                    openDropdown={openDropdown}
                    valueArray={allDropdown["recordings"] || []}
                    handleSelection={handleSelection}
                    name={"greet_long"}
                    defaultValue={t("None selected")}
                    mapValue={"name"}
                    storeValue={"recording_filename"}
                    setOpenDropdown={setOpenDropdown}
                  />
                  {errors.greet_long && (
                    <div className="text-danger error-ui">{errors.greet_long}</div>
                  )}
                </Col>

                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">{t("Invalid retry recording")}</Form.Label>
                  <DropDownSound
                    valueArray={soundDropdown}
                    name="ivr_menu_invalid_sound"
                    defaultValue={t("None selected")}
                    setOpenDropdown={setOpenDropdown}
                    toggleDropdown={toggleDropdown}
                    showValue={showState1 || formData.ivr_menu_invalid_sound}
                    openDropdown={openDropdown}
                    handleSelection={handleSelection}
                    isMulti={1}
                  />
                  {errors.ivr_menu_invalid_sound && (
                    <div className="text-danger error-ui">{errors.ivr_menu_invalid_sound}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">{t("Timeout retries")}</Form.Label>
                  <div className="Selfmade-dropdown">
                    <div
                      className="Selfmadedropdown-btn"
                      onClick={() => toggleDropdown(`ivr_menu_max_failures`)}
                    >
                      {formData.ivr_menu_max_failures || t("None selected")}
                      <div>
                        <Dropdownicon />
                      </div>
                    </div>
                    {openDropdown === `ivr_menu_max_failures` && (
                      <div className="Selfmadedropdown-content">
                        {Timeout_retries.map((type) => (
                          <a
                            key={type}
                            onClick={() => handleRetries(type, `ivr_menu_max_failures`)}
                          >
                            {type}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.ivr_menu_max_failures && (
                    <div className="text-danger error-ui">{errors.ivr_menu_max_failures}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("IVR menu exit")}
                    <CustomTooltipModal
                      tooltip={t("Select the exit action to be performed if the IVR exits")}
                    />
                  </Form.Label>
                  <DestinationDropdown
                    valueArray={allDropdown}
                    name={"ivr_menu_exit"}
                    defaultValue={t("None selected")}
                    setOpenDropdown={setOpenDropdown}
                    toggleDropdown={toggleDropdown}
                    showValue={{
                      ivr_menu_exit_app: formData.ivr_menu_exit_app,
                      ivr_menu_exit_data: formData.ivr_menu_exit_data,
                    }}
                    openDropdown={openDropdown}
                    handleSelection={handleSelection}
                    isMulti={2}
                  />
                  {errors.ivr_menu_exit && (
                    <div className="text-danger error-ui">{errors.ivr_menu_exit}</div>
                  )}
                </Col>
              </Row>

              {formData.ivr_menu_option?.map((item, index) => {
                return (
                  <Row className="mb-4" key={index}>
                    <Col lg={2} className="mt-3">
                      <Form.Label className="modal-head">{t("Entries")}</Form.Label>
                      <InputGroup>
                        <Form.Control
                          placeholder=""
                          aria-label="menu_digit"
                          aria-describedby="basic-addon1"
                          name={`menu_digit$${index}`}
                          value={formData.ivr_menu_option[index].menu_digit || ""}
                          onChange={handleChange}
                          onKeyPress={handleKeyPress2}
                        />
                      </InputGroup>
                      <div>
                        {" "}
                        {errors.ivr_menu_option && errors.ivr_menu_option[index]?.menu_digit && (
                          <div className="text-danger error-ui">
                            {errors.ivr_menu_option && errors.ivr_menu_option[index]?.menu_digit}
                          </div>
                        )}
                      </div>
                    </Col>

                    <Col lg={4} className="mt-3">
                      <Form.Label className="modal-head">{t("Destination type")}</Form.Label>

                      <div className="Selfmade-dropdown">
                        <div
                          className="Selfmadedropdown-btn"
                          onClick={() => toggleDropdown(`select_type$${index}`)}
                        >
                          {t(showSelectType(formData.ivr_menu_option[index].select_type)) ||
                            t("None selected")}
                          <div>
                            <Dropdownicon />
                          </div>
                        </div>
                        {openDropdown === `select_type$${index}` && (
                          <div className="Selfmadedropdown-content">
                            {TypeInnumber?.sort((a, b) => a.type.localeCompare(b.type)).map(
                              (type) => (
                                <a
                                  key={type}
                                  onClick={() =>
                                    handleSelectType(type, `select_type$${index}`, index)
                                  }
                                >
                                  {t(type.type)}
                                </a>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        {" "}
                        {errors.ivr_menu_option && errors.ivr_menu_option[index]?.select_type && (
                          <div className="text-danger error-ui">
                            {errors.ivr_menu_option && errors.ivr_menu_option[index]?.select_type}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={4} className="mt-3">
                      <Form.Label className="modal-head">{t("Destination endpoint")}</Form.Label>
                      <div className="Selfmade-dropdown">
                        <div
                          className="Selfmadedropdown-btn"
                          onClick={() =>
                            toggleDropdown(`menu_param$${index}`, formData.ivr_menu_option[index])
                          }
                        >
                          {endpoint[index]?.name ||
                            showEndPoint(formData.ivr_menu_option[index]) ||
                            t("None selected")}
                          <div>
                            <Dropdownicon />
                          </div>
                        </div>
                        {openDropdown === `menu_param$${index}` && (
                          <div className="Selfmadedropdown-content">
                            {filteredList && filteredList?.length > 0 ? (
                              <>
                                {[...filteredList]
                                  .sort((a, b) => a?.name.localeCompare(b?.name))
                                  .map((destination) => {
                                    return (
                                      <a
                                        onClick={() =>
                                          handleSelectExtension(
                                            destination,
                                            `menu_param$${index}`,
                                            index
                                          )
                                        }
                                      >
                                        {destination?.extension || destination?.name}
                                      </a>
                                    );
                                  })}
                              </>
                            ) : (
                              <div>{t("No Record")}</div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        {errors.ivr_menu_option && errors.ivr_menu_option[index]?.menu_param && (
                          <div className="text-danger error-ui">
                            {errors.ivr_menu_option && errors.ivr_menu_option[index]?.menu_param}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={2} style={{ marginTop: "45px" }}>
                      {index === 0 && (
                        <div>
                          <button className="btn_save" onClick={handleAddMenu}>
                            {t("Add")}
                          </button>
                        </div>
                      )}
                      {index !== 0 && (
                        <button
                          className="btn_save"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveMenu(index);
                          }}
                        >
                          <DeleteIcon width={14} height={14} className="edithover" />
                        </button>
                      )}
                    </Col>
                  </Row>
                );
              })}
            </Form>
          </div>
          <div className="mb-4 d-flex justify-content-end me-4">
            <button className="btn_cancel me-2" onClick={handleClose}>
              {t("Cancel")}
            </button>
            {loader ? (
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
export default IVRModal;
