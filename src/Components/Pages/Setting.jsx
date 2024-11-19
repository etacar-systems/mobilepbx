import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "../Admin/AdminHeader";
import { ReactComponent as Phone } from "../../Assets/Icon/phoneregister.svg";
import { ReactComponent as Email } from "../../Assets/Icon/email-svgrepo-com.svg";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Col, InputGroup, Spinner } from "react-bootstrap";
import { ReactComponent as Call } from "../../Assets/Icon/phone-call-phone-svgrepo-com.svg";
import { ReactComponent as Icon3 } from "../../Assets/Icon/extension_logo.svg";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import Account from "./Account";
import CallRoutingModal from "../Modal/CallRoutingModal";
import { ReactComponent as Fileupload } from "../../Assets/Icon/fileupload.svg";

import RecordModal from "../Modal/RecordModal";
import { useTranslation } from "react-i18next";
import { postapiAll, putapiall } from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import config from "../../config";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { settingUpdate } from "../../Redux/Reducers/DataServices";

export default function Setting() {
  const { t } = useTranslation();

  const status = [
    {
      name: t("Available"),
    },
    {
      name: t("Away"),
    },
    {
      name: t("Busy"),
    },
    {
      name: t("Lunch"),
    },
    {
      name: t("Vacation"),
    },
    {
      name: t("Other"),
    },
  ];
  const options = [
    {
      name: t("Office hours"),
    },
    {
      name: t("BLF"),
    },
    {
      name: t("IP Phone"),
    },
    {
      name: t("DECT"),
    },
    {
      name: t("SBC"),
    },
    {
      name: t("Applications"),
    },
  ];
  const cid = Cookies.get("Company_Id");
  const uid = Cookies.get("User_id");
  const role = Cookies.get("role");
  let Token = Cookies.get("Token");
  const [message, setMessage] = useState("");
  const maxLength = 160;
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const sliderRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(30);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const [show, setShow] = useState(false);
  const [recordShow, setRecordShow] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [saveloading, setsaveLoading] = useState(false);
  const [saveUserDetail, setSaveUserDetail] = useState({});
  const [saveCompnayDetail, setSaveCompnayDetail] = useState({});
  const [domain, setDomain] = useState();
  const user_emeil = Cookies.get("user_email");
  const [formData, setFormData] = useState({
    Extension_number: "",
    First_name: "",
    Last_name: "",
    Email: "",
    Mobile: "",
    Pstn_number: "",
  });

  const [adminData, setAdminData] = useState({
    First_name: "",
    Last_name: "",
  });
  const [errors_admin, setErrors_admin] = useState({
    First_name: "",
    Last_name: "",
  });

  useEffect(() => {
    // Read the cookies and set the initial state values
    const firstNameFromCookie = Cookies.get("firstname");
    const lastNameFromCookie = Cookies.get("lastname");

    if (firstNameFromCookie) {
      setAdminData((prev) => ({
        ...prev,
        First_name: firstNameFromCookie,
      }));
    }

    if (lastNameFromCookie) {
      setAdminData((prev) => ({
        ...prev,
        Last_name: lastNameFromCookie,
      }));
    }
  }, []);

  const handleChange_admin = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (value === "") {
      setErrors_admin((prev) => ({
        ...prev,
        [name]: `${t(name.replace(/_/g, " "))} ${t("is required")}`,
      }));
    } else {
      setErrors_admin((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleChange1 = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setMessage(text);
    }
  };

  useEffect(() => {
    if (role == 1) {
      const data = {
        uid: uid,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.EXTENSION.VALUE,
          Token: Token,
          urlof: config.EXTENSION_KEY.VALUE,
        })
      ).then((response) => {
        const editsvalues = response?.payload?.response?.data;
        setSaveUserDetail({
          password: editsvalues?.password,
          country: editsvalues?.country,
          pstn_number: editsvalues?.pstn_number?._id,
          user_record: editsvalues?.user_record,
          pstn_number: editsvalues?.pstn_number?._id,
        });
        setFormData({
          Extension_number: editsvalues?.user_extension,
          First_name: editsvalues?.first_name,
          Last_name: editsvalues?.last_name,
          Email: editsvalues?.user_email,
          Mobile: editsvalues?.mobile,
          Pstn_number: editsvalues?.pstn_number?.destination,
        });
      });
    } else if (role == 2 || role == 4) {
      const data = {
        cid: cid,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.COMPANY_USER_DETAIL_LIST,
          Token: Token,
          urlof: config.COMPANY_USER_DETAIL_LIST_KEY,
        })
      ).then((response) => {
        const editsvalues = response?.payload?.response?.CompanyDatil;
        console.log(editsvalues, "editsvalueseditsvalues");
        setSaveCompnayDetail({
          company_street_address: editsvalues?.company_street_address,
          company_zipcode: editsvalues?.company_zipcode,
          company_city: editsvalues?.company_city,
          company_country: editsvalues?.company_country,
          company_vat: editsvalues?.company_vat,
          company_phone_number: editsvalues?.company_phone_number,
          company_password: editsvalues?.company_password,
          domain_name: editsvalues?.domain_name,
          company_contact_person: editsvalues?.company_contact_person,
          hex_code: editsvalues?.hex_code,
          company_name: editsvalues?.Company_name,
          company_email: editsvalues.Email,
          company_phone_number: editsvalues?.Phone_number,
          domain_name: editsvalues?.Domain,
          pbx: editsvalues?.pbx.toString(),
          extension: editsvalues?.extension.toString(),
          ring_group: editsvalues?.ring_group.toString(),
          conference: editsvalues?.conference.toString(),
          video_call: editsvalues?.video_call.toString(),
          ivr: editsvalues?.ivr.toString(),
          speech_to_text: editsvalues?.speech_to_text.toString(),
          phone_in_browser: editsvalues?.phone_in_browser.toString(),
          voicemail: editsvalues?.voicemail.toString(),
          callback: editsvalues?.callback.toString(),
          record_calls: editsvalues?.record_calls.toString(),
          reportage: editsvalues?.reportage.toString(),
          monitoring: editsvalues?.monitoring.toString(),
          caller_id: editsvalues?.caller_id.toString(),
          time_controls: editsvalues?.time_controls.toString(),
          whatsapp: editsvalues?.whatsapp.toString(),
          calendar_integration: editsvalues?.calendar_integration.toString(),
          text_to_speech: editsvalues?.text_to_speech.toString(),
          virtual_assistant: editsvalues?.virtual_assistant.toString(),
          domain_name: editsvalues?.domain_name.toString(),
          small_logo: editsvalues?.small_logo.toString(),
          logo_text: editsvalues?.logo_text.toString(),
          dark_small_logo: editsvalues?.dark_small_logo.toString(),
          dark_logo_text: editsvalues?.dark_logo_text.toString(),
          pbx_count: editsvalues?.pbx_count,
          extension_count: editsvalues?.extension_count,
          ring_group_count: editsvalues?.ring_group_count,
          conference_count: editsvalues?.conference_count,
          video_call_count: editsvalues?.video_call_count,
          ivr_count: editsvalues?.ivr_count,
          speech_to_text_count: editsvalues?.speech_to_text_count,
          phone_in_browser_count: editsvalues?.phone_in_browser_count,
          voicemail_count: editsvalues?.voicemail_count,
          callback_count: editsvalues?.callback_count,
          record_calls_count: editsvalues?.record_calls_count,
          reportage_count: editsvalues?.reportage_count,
          monitoring_count: editsvalues?.monitoring_count,
          caller_id_count: editsvalues?.caller_id_count,
          time_controls_count: editsvalues?.time_controls_count,
          whatsapp_count: editsvalues?.whatsapp_count,
          calendar_integration_count: editsvalues?.calendar_integration_count,
          text_to_speech_count: editsvalues?.text_to_speech_count,
          virtual_assistant_count: editsvalues?.virtual_assistant_count,
        });
        setFormData({
          First_name: editsvalues?.company_name,
          Email: editsvalues?.company_email,
          Mobile: editsvalues?.company_phone_number,
        });
        setDomain(editsvalues.domain_name);
      });
    }
  }, []);
  const cancel_admin = () => {
    setErrors_admin({ Last_name: "", First_name: "" });
    const firstNameFromCookie = Cookies.get("firstname");
    const lastNameFromCookie = Cookies.get("lastname");

    if (firstNameFromCookie) {
      setAdminData((prev) => ({
        ...prev,
        First_name: firstNameFromCookie,
      }));
    }

    if (lastNameFromCookie) {
      setAdminData((prev) => ({
        ...prev,
        Last_name: lastNameFromCookie,
      }));
    }
  };
  const handleAdmin = () => {
    if (errors_admin.First_name === "" && errors_admin.Last_name === "") {
      setsaveLoading(true);
      let data = {
        user_id: uid,
        first_name: adminData.First_name,
        last_name: adminData.Last_name,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.SETTING.ADMIN_UPDATE,
          Token: Token,
          urlof: config.SETTING.ADMIN_KEY,
        })
      ).then((res) => {
        if (res?.payload?.response) {
          setsaveLoading(false);
          Cookies.set(
            "firstname",
            res?.payload?.response.UserDetail.first_name
          );
          Cookies.set("lastname", res?.payload?.response.UserDetail.last_name);
          dispatch(
            settingUpdate({
              firstname: res?.payload?.response.UserDetail.first_name,
              lastname: res?.payload?.response.UserDetail.last_name,
            })
          );
          toast.success(res.payload.response.message, { autoClose: 2000 });
        } else {
          toast.error(res.payload.error.message, { autoClose: 2000 });
          setsaveLoading(false);
        }
      });
    }
  };
  const handlesavedata = () => {
    if (role == 1) {
      setsaveLoading(true);
      let data = {
        uid: uid,
        user_extension: formData.Extension_number,
        first_name: formData.First_name,
        last_name: formData.Last_name,
        user_email: formData.Email,
        mobile: formData.Mobile,
        user_type: "1",
        ...saveUserDetail,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.EXTENSION.UPDATE,
          Token: Token,
          urlof: config.EXTENSION_KEY.UPDATE,
        })
      ).then((res) => {
        if (res?.payload?.response) {
          setsaveLoading(false);
          Cookies.set("firstname", formData.First_name);
          Cookies.set("lastname", formData.Last_name);
          dispatch(
            settingUpdate({
              firstname: formData.First_name,
              lastname: formData.Last_name,
            })
          );
          toast.success(res.payload.response.message, { autoClose: 2000 });
        } else {
          toast.error(res.payload.error.message, { autoClose: 2000 });
          setsaveLoading(false);
        }
      });
    }

    if (role == 2 || role == 4) {
      setsaveLoading(true);
      let data = {
        cid: cid,
        ...saveCompnayDetail,
        company_name: formData.First_name,
        company_email: formData.Email,
        company_phone_number: formData.Mobile,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.COMPANY_USER_EDIT,
          Token: Token,
          urlof: config.COMPANY_USER_EDIT_KEY,
        })
      ).then((res) => {
        if (res?.payload?.response) {
          setsaveLoading(false);
          Cookies.set("company_name", formData.First_name);
          dispatch(settingUpdate({ company_name: formData.First_name }));
          toast.success(res.payload.response.message, { autoClose: 2000 });
        } else {
          toast.error(res.payload.error.message, { autoClose: 2000 });
          setsaveLoading(false);
        }
      });
    }
    if (role == 3) {
      setsaveLoading(true);
      let data = {
        company_name: formData.First_name,
        company_email: formData.Email,
        company_contact_person: formData.Mobile,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.COMPANY_USER_EDIT,
          Token: Token,
          urlof: config.COMPANY_USER_EDIT_KEY,
        })
      ).then((res) => {
        if (res?.payload?.response) {
          setsaveLoading(false);
          Cookies.set("company_name", formData.First_name);
          dispatch(settingUpdate({ company_name: formData.First_name }));
          toast.success(res.payload.response.message, { autoClose: 2000 });
        } else {
          toast.error(res.payload.error.message, { autoClose: 2000 });
          setsaveLoading(false);
        }
      });
    }
  };

  const validateForm = (name, value) => {
    let valid = true;
    const newErrors = {};

    if ((!value || !String(value).trim()) && name !== "Mobile") {
      newErrors[name] = `${name.replace(/_/g, " ")} ${t("is required")}`;
      valid = false;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
    return valid;
  };

  const handleSave = () => {
    let isValid = true;
    for (let key in formData) {
      if (!validateForm(key, formData[key])) {
        isValid = false;
      }
    }
    if (isValid) {
      handlesavedata();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    const newErrors = {};
    if (name === "Mobile") {
      return;
    }
    if (!value || !String(value).trim()) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key < "0" || e.key > "9") {
      e.preventDefault();
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

      return () => {
        slider.destroy();
      };
    }
  }, [sliderValue]);

  const handleDrop = (e) => {
    e.preventDefault();
    const { files: droppedFiles } = e.dataTransfer;

    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList) => {
    const filesArray = Array.from(fileList);
    setFiles(filesArray);
  };

  const handleInputChange = (e) => {
    const fileList = e.target.files;
    handleFiles(fileList);
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 105;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div
      style={{ maxHeight: dynamicHeight, overflow: "auto" }}
      className="sidebar_scroll tablespadding"
    >
      <AdminHeader pathname={t("Settings")} addBtn={true} />
      {role === "3" && (
        <div className="num_table set_lable_color">
          <Row className="set_lable_color">
            <Col lg={4} className="">
              <Form.Label
                className="modal-head"
                style={{ marginBottom: "0px" }}
              >
                {t("First name")}
              </Form.Label>
              <InputGroup className="">
                <InputGroup.Text id="basic-addon1" className="modal-icon">
                  <Icon3
                    className="registerpage-icon"
                    style={{ stroke: "var(--main-adminheaderpage-color)" }}
                  />
                </InputGroup.Text>
                <Form.Control
                  type="First name"
                  placeholder=""
                  aria-label="First name"
                  aria-describedby="basic-addon1"
                  className="search-bg emailforminput"
                  name="First_name"
                  value={adminData.First_name}
                  onChange={handleChange_admin}
                />
              </InputGroup>
              {errors_admin.First_name && (
                <div className="text-danger error-ui">
                  {errors_admin.First_name}
                </div>
              )}
            </Col>

            <Col lg={4} className="">
              <Form.Label
                className="modal-head"
                style={{ marginBottom: "0px" }}
              >
                {t("Last name")}
              </Form.Label>
              <InputGroup className="">
                <InputGroup.Text id="basic-addon1" className="modal-icon">
                  <Icon3
                    className="registerpage-icon"
                    style={{ stroke: "var(--main-adminheaderpage-color)" }}
                  />
                </InputGroup.Text>
                <Form.Control
                  type="Last name"
                  placeholder=""
                  aria-label="Last_name"
                  aria-describedby="basic-addon1"
                  className="search-bg emailforminput"
                  name="Last_name"
                  value={adminData.Last_name}
                  onChange={handleChange_admin}
                />
              </InputGroup>
              {errors_admin.Last_name && (
                <div className="text-danger error-ui">
                  {errors_admin.Last_name}
                </div>
              )}
            </Col>
            <Col lg={4} className="">
              <Form.Label
                className="modal-head"
                style={{ marginBottom: "0px" }}
              >
                {t("Email Address")}
              </Form.Label>
              <InputGroup className="">
                <InputGroup.Text id="basic-addon1" className="modal-icon">
                  <Email className="registerpage-icon2" />
                </InputGroup.Text>
                <Form.Control
                  disabled
                  type="Email Address"
                  placeholder=""
                  aria-label="Email Address"
                  aria-describedby="basic-addon1"
                  name="Email"
                  value={user_emeil}
                  autoComplete="new-email"
                  className="search-bg emailforminput"
                />
              </InputGroup>
            </Col>
          </Row>

          <div className=" d-flex justify-content-start my-3">
            {saveloading ? (
              <button className="btn_save">
                <Spinner animation="border" size="sm" />
              </button>
            ) : (
              <button className="btn_save py-1 px-2" onClick={handleAdmin}>
                {t("Update")}
              </button>
            )}
            <button
              onClick={cancel_admin}
              className="btn_cancel ms-3 py-1 px-2"
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      )}

      {role !== "3" && (
        <div className="num_table set_lable_color">
          {/* <Form> */}
          <Row className="set_lable_color">
            <Col lg={4} className="">
              <Form.Label
                className="modal-head"
                style={{ marginBottom: "0px" }}
              >
                {role == 1 ? t("First name") : t("Company name")}
              </Form.Label>
              <InputGroup className="">
                <InputGroup.Text id="basic-addon1" className="modal-icon">
                  <Icon3
                    className="registerpage-icon"
                    style={{ stroke: "var(--main-adminheaderpage-color)" }}
                  />
                </InputGroup.Text>
                <Form.Control
                  type="First name"
                  placeholder=""
                  aria-label="First name"
                  aria-describedby="basic-addon1"
                  className="search-bg emailforminput"
                  name="First_name"
                  value={formData.First_name}
                  onChange={handleChange}
                />
              </InputGroup>
              {errors.First_name && (
                <div className="text-danger error-ui">{errors.First_name}</div>
              )}
            </Col>
            {role == 1 && (
              <Col lg={4} className="">
                <Form.Label
                  className="modal-head"
                  style={{ marginBottom: "0px" }}
                >
                  {t("Last name")}
                </Form.Label>
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1" className="modal-icon">
                    <Icon3
                      className="registerpage-icon"
                      style={{ stroke: "var(--main-adminheaderpage-color)" }}
                    />
                  </InputGroup.Text>
                  <Form.Control
                    type="Last name"
                    placeholder=""
                    aria-label="Last_name"
                    aria-describedby="basic-addon1"
                    className="search-bg emailforminput"
                    name="Last_name"
                    value={formData.Last_name}
                    onChange={handleChange}
                  />
                </InputGroup>
                {errors.Last_name && (
                  <div className="text-danger error-ui">{errors.Last_name}</div>
                )}
              </Col>
            )}
            <Col lg={4} className="">
              <Form.Label
                className="modal-head"
                style={{ marginBottom: "0px" }}
              >
                {t("Email Address")}
              </Form.Label>
              <InputGroup className="">
                <InputGroup.Text id="basic-addon1" className="modal-icon">
                  <Email className="registerpage-icon2" />
                </InputGroup.Text>
                <Form.Control
                  disabled
                  type="Email Address"
                  placeholder=""
                  aria-label="Email Address"
                  aria-describedby="basic-addon1"
                  className="search-bg emailforminput"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  autoComplete="new-email"
                />
              </InputGroup>
            </Col>

            <Col lg={4} className={role == 1 ? "mt-3" : "mt-0"}>
              <Form.Label
                className="modal-head"
                style={{ marginBottom: "0px" }}
              >
                {t("Mobile Phone Number")}
              </Form.Label>
              <InputGroup className="">
                <InputGroup.Text id="basic-addon1" className="modal-icon">
                  <Phone className="registerpage-icon" />
                </InputGroup.Text>
                <Form.Control
                  placeholder=""
                  aria-label="Mobile"
                  aria-describedby="basic-addon1"
                  className="search-bg emailforminput"
                  name="Mobile"
                  value={formData.Mobile}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </InputGroup>
              {errors.Mobile && (
                <div className="text-danger error-ui">{errors.Mobile}</div>
              )}
            </Col>
            {role == 2 ||
              (role == 4 && (
                <Col lg={4} className="">
                  <Form.Label
                    className="modal-head"
                    style={{ marginBottom: "0px" }}
                  >
                    {t("Domain name")}
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      disabled
                      type="Email Address"
                      placeholder=""
                      aria-label="Email Address"
                      aria-describedby="basic-addon1"
                      className="search-bg emailforminput"
                      name="Email"
                      value={domain}
                      autoComplete="new-email"
                    />
                  </InputGroup>
                  {errors.Last_name && (
                    <div className="text-danger error-ui">
                      {errors.Last_name}
                    </div>
                  )}
                </Col>
              ))}
            {role == 1 && (
              <>
                <Col lg={4} className="mt-3">
                  <Form.Label
                    className="modal-head"
                    style={{ marginBottom: "0px" }}
                  >
                    {t("Phone Number")}{" "}
                  </Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1" className="modal-icon">
                      <Call className="registerpage-icon1" />
                    </InputGroup.Text>
                    <Form.Control
                      disabled
                      placeholder=""
                      aria-label="Mobile"
                      aria-describedby="basic-addon1"
                      className="search-bg emailforminput"
                      name="Pstn_number"
                      value={formData.Pstn_number}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label
                    className="modal-head"
                    style={{ marginBottom: "0px" }}
                  >
                    {t("Extension Number")}
                  </Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1" className="modal-icon">
                      <Call className="registerpage-icon1" />
                    </InputGroup.Text>
                    <Form.Control
                      disabled
                      placeholder=""
                      aria-label="Mobile"
                      aria-describedby="basic-addon1"
                      className="search-bg emailforminput"
                      name="Extension_number"
                      value={formData.Extension_number}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.Extension_number && (
                    <div className="text-danger error-ui">
                      {errors.Extension_number}
                    </div>
                  )}
                </Col>
              </>
            )}
          </Row>
          <Row className="mt-4">
            {role !== "2" && (
              <>
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Status settings")}
                  </Form.Label>
                  <div
                    style={{
                      border:
                        "1px solid var(--main-bordermodaldashboard-color)",
                    }}
                  >
                    {status?.map((val, index) => {
                      return (
                        <Row
                          key={index}
                          style={{
                            padding: "12px 8px",
                            borderBottom:
                              " 1px solid var(--main-bordermodaldashboard-color)",
                          }}
                          className="m-0 "
                        >
                          <Col xs={8} className="status_namm">
                            <h6>{val.name}</h6>
                          </Col>
                          <Col xs={1} style={{ marginRight: "11px" }}>
                            <div
                              className="badge_circle"
                              onClick={() => setRecordShow(true)}
                            >
                              <div></div>
                            </div>
                          </Col>
                          <Col xs={1}>
                            <div
                              className="badge_circle1"
                              onClick={() => setShow(true)}
                            >
                              <Call className="registerpage-icon1" />
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      justifyContent: "space-between",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      {" "}
                      <Form.Label className="modal-head m-0">
                        {t("Automatic SMS sender")}
                      </Form.Label>
                    </div>
                    <div>
                      {" "}
                      <div
                        className="musicback border-0"
                        style={{ gap: "6px" }}
                      >
                        {t("Activate")}
                        <label className="switch">
                          <input type="checkbox" id="skipBusyAgent" />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <Row className="align-items-center my-2">
                    <Col xs={12}>
                      <textarea
                        name=""
                        placeholder={t("SMS message")}
                        id=""
                        style={{
                          width: "100%",
                          padding: "6px 12px",
                          height: "100px",
                          borderColor: "var(--main-bordermodaldashboard-color)",
                        }}
                        value={message}
                        onChange={handleChange1}
                        className="search-bg"
                      ></textarea>
                    </Col>
                    <Col xs={12} className="status_namm">
                      <h6>
                        {" "}
                        {maxLength - message.length}{" "}
                        {t("characters remaining.")}
                      </h6>
                    </Col>
                  </Row>
                </Col>
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Voicemail")}
                  </Form.Label>
                  <div
                    style={{
                      border:
                        "1px solid var(--main-bordermodaldashboard-color)",
                    }}
                  >
                    <Col
                      xs={12}
                      className="status_namm"
                      style={{
                        borderBottom:
                          "1px solid var(--main-bordermodaldashboard-color)",
                      }}
                    >
                      <div className="musicback border-0">
                        {t("Enable Voicemail")}
                        <label className="switch">
                          <input type="checkbox" id="skipBusyAgent" />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      className="status_namm "
                      style={{
                        borderBottom:
                          "1px solid var(--main-bordermodaldashboard-color)",
                      }}
                    >
                      <div className="musicback border-0">
                        {t("Send E-Mail Alert New Voicemail")}
                        <label className="switch">
                          <input type="checkbox" id="skipBusyAgent" />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      className="status_namm "
                      style={{
                        borderBottom:
                          "1px solid var(--main-bordermodaldashboard-color)",
                      }}
                    >
                      <div className="musicback border-0">
                        {t("Send SMS Alert New Voicemail")}
                        <label className="switch ">
                          <input type="checkbox" id="skipBusyAgent" />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      className="status_namm "
                      style={{
                        borderBottom:
                          "1px solid var(--main-bordermodaldashboard-color)",
                      }}
                    >
                      <div style={{ margin: "10px" }}>
                        <h6>
                          {t("Ringtime before going to voicemail")} <br></br>(
                          {t("sec")})
                        </h6>
                        <div className="my-3" ref={sliderRef}></div>
                        <p className="second_sek mb-4">
                          <strong style={{ color: "" }}>{t("Seconds")}:</strong>{" "}
                          {sliderValue} {t("sec")}
                        </p>
                      </div>
                    </Col>
                    <Col xs={12} className="status_namm">
                      <div style={{ margin: "15px" }}>
                        <h6>{t("Voicemail Soundfile")}:</h6>
                        <div
                          className="drop-area"
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          onClick={openFileDialog}
                          style={{ marginBottom: "10px" }}
                        >
                          <Fileupload
                            height={50}
                            width={50}
                            style={{ opacity: "0.7" }}
                          />
                          <p className="drag_drop mb-2">
                            {t("Drag and drop files here or click")}
                          </p>
                          <input
                            type="file"
                            accept=".mp3,.wav"
                            ref={inputRef}
                            onChange={handleInputChange}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>
                    </Col>
                  </div>
                </Col>{" "}
              </>
            )}
            {role != 2 && (
              <Col lg={4}>
                <Form.Label className="modal-head">{t("Options")}</Form.Label>
                <div
                  style={{
                    border: "1px solid var(--main-bordermodaldashboard-color)",
                  }}
                >
                  {options?.map((val, index) => {
                    return (
                      <Row
                        key={index}
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid var(--main-bordermodaldashboard-color)",
                        }}
                        className=" m-0 align-items-center"
                      >
                        <Col xs={10} className="status_namm">
                          <h6>{val.name}</h6>
                        </Col>
                        <Col xs={2}>
                          <div
                            className="badge_circle1"
                            onClick={() => setShow(true)}
                          >
                            <Edit_logo className="registerpage-icon1" />
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              </Col>
            )}
          </Row>
          <div className=" d-flex justify-content-start my-3">
            {saveloading ? (
              <button className="btn_save">
                <Spinner animation="border" size="sm" />
              </button>
            ) : (
              <button className="btn_save py-1 px-2" onClick={handleSave}>
                {t("Update")}
              </button>
            )}
            <button className="btn_cancel ms-3 py-1 px-2">{t("Cancel")}</button>
          </div>
          {/* </Form> */}
        </div>
      )}
      <h3
        className="location_path my-4"
        style={{ color: "var(--main-orange-color)", fontSize: "15px" }}
      >
        {t("Account")}
      </h3>

      <div className="num_table set_lable_color">
        <Account />
      </div>

      {show && <CallRoutingModal show={show} handleClose={handleClose} />}
      {recordShow && (
        <RecordModal recordshow={recordShow} setRecordShow={setRecordShow} />
      )}
    </div>
  );
}
