import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { InputGroup, Nav, Tab } from "react-bootstrap";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import FeaturesTab from "../Modal/FeaturesTabCustomer";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { Calendar, Numeric } from "../ConstantConfig";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import config from "../../config";
function CalendarModal({
  handleClose,
  show,
  header,
  handlesavedata,
  setFormData,
  formData,
}) {
  console.log(formData,"formDatacheck")
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const Token = Cookies.get("Token");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  console.log(errors,"checkerrors")
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const handleSelection = (dropdown, value, displayValue) => {
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    handleChange(syntheticEvent);
    setFormData((prevState) => ({
      ...prevState,
      [dropdown]: displayValue,
    }));

    setOpenDropdown(null); // Close the dropdown after selection
  };
  const validateForm = (name, value) => {
    console.log(name,value,'finallechecking')
    let valid = true;
    const newErrors = {};
    const regex = {};

    // Convert value to a string before trimming, or default to an empty string if value is null or undefined
    const trimmedValue = typeof value === 'string' ? value.trim() : '';

    if (!trimmedValue) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
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
    validateForm(name, value);
  };
  const selectedAuto_Refresh =
    formData.Auto_Refresh == "1"
      ? t("1")
      : formData.Auto_Refresh == "2"
      ? t("2")
      : formData.Auto_Refresh == "3"
      ? t("3")
      : formData.Auto_Refresh
      ? t("4")
      : "";
  const selectedEWS_Version =
    formData.EWS_Version == 1
      ? t("1")
      : formData.EWS_Version == 2
      ? t("2")
      : formData.EWS_Version == 3
      ? t("3")
      : formData.EWS_Version
      ? t("4")
      : "";
  const selectedAuto_Refresh2 =
    formData.Auto_Refresh2 == 1
      ? t("1")
      : formData.Auto_Refresh2 == 2
      ? t("2")
      : formData.Auto_Refresh2 == 3
      ? t("3")
      : formData.Auto_Refresh2
      ? t("4")
      : "";
  const selectedAuto_Refresh3 =
    formData.Auto_Refresh3 == 1
      ? t("1")
      : formData.Auto_Refresh3 == 2
      ? t("2")
      : formData.Auto_Refresh3 == 3
      ? t("3")
      : formData.Auto_Refresh3
      ? t("4")
      : "";

  useEffect(() => {
    setLoader(true);
    dispatch(
      getapiAll({
        Api: config.CALENDAR.DETAIL,
        Token: Token,
        urlof: config.CALENDAR_KEY.DETAIL,
      })
    ).then((res) => {
      setLoader(false);
      const data = res?.payload?.response?.CalanderDetail;
      console.log(data,"checkdatya")
      setFormData({
        Name: data.name,
        Description:data.description,
        Auto_Refresh: data.auto_refresh,
        Remote_Url: data.redirect_uri,
        Client_id: data.client_id,
        Client_secret: data.client_secret,
      });
    });
  }, []);

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
              {/* <img src={close} onClick={handleClose} alt="" width={25} /> */}
            </div>
          </div>
          <div className="p-3">
            <div
              style={{
                borderBottom:
                  "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <Tab.Container defaultActiveKey="link1">
                <Row>
                  <Col sm={12}>
                    <Nav variant="pills" className="flex-row tabs_border">
                      <Nav.Item>
                        <Nav.Link eventKey="link1" className="nav-link2">
                          {t("Add ICal")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link2" className="nav-link2">
                          {t("Add Outlook")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link3" className="nav-link2">
                          {t("Add CalDAV")}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={12}>
                    <Tab.Content>
                      <Tab.Pane eventKey="link1">
                        <div style={{ padding: "20px 0px" }}>
                          <span className="modalcal">{t("Add ICal")}</span>
                          <Form style={{ marginBottom: "35px" }}>
                            <Row className="mt-4">
                              <Col lg={4} className="mt-4">
                                <Form.Label className="modal-head">
                                  {t("Name")}
                                </Form.Label>
                                <InputGroup>
                                  <Form.Control
                                    placeholder=""
                                    className="search-bg"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                  />
                                </InputGroup>
                                {errors.Name && (
                                  <div className="text-danger error-ui">
                                    {errors.Name}
                                  </div>
                                )}
                              </Col>
                              <Col lg={4} className="mt-4">
                                <Form.Label className="modal-head">
                                  {t("Description")}
                                </Form.Label>
                                <InputGroup>
                                  <Form.Control
                                    placeholder=""
                                    className="search-bg"
                                    name="Description"
                                    value={formData.Description}
                                    onChange={handleChange}
                                  />
                                </InputGroup>
                                {errors.Description && (
                                  <div className="text-danger error-ui">
                                    {errors.Description}
                                  </div>
                                )}
                              </Col>
                              <Col lg={4} className="mt-4">
                                <Form.Label className="modal-head">
                                  {t("Auto Refresh")}
                                </Form.Label>
                                <InputGroup>
                                  <div
                                    className="Selfmade-dropdown "
                                    style={{ width: "100%" }}
                                  >
                                    <div
                                      className="Selfmadedropdown-btn "
                                      onClick={() =>
                                        toggleDropdown("Auto_Refresh")
                                      }
                                    >
                                    {selectedAuto_Refresh || t("Auto Refresh")}

                                      <div>
                                        <Dropdownicon />
                                      </div>
                                    </div>
                                    {openDropdown === "Auto_Refresh" && (
                                      <div className="Selfmadedropdown-content">
                                        {Calendar?.map((number) => (
                                          <a
                                            key={number._id}
                                            onClick={() =>
                                              handleSelection(
                                                "Auto_Refresh",
                                                number.type,
                                                number.value
                                              )
                                            }
                                          >
                                            {number.type}
                                          </a>
                                        ))}
                                      </div>
                                    )}{" "}
                                    {errors.Auto_Refresh && (
                                      <div className="text-danger error-ui">
                                        {errors.Auto_Refresh}
                                      </div>
                                    )}
                                  </div>
                                </InputGroup>
                              </Col>
                              <Col lg={4} className="mt-4">
                                <Form.Label className="modal-head">
                                  {t("Client ID")}
                                </Form.Label>
                                <InputGroup>
                                  <Form.Control
                                    placeholder=""
                                    className="search-bg"
                                    name="Client_id"
                                    value={formData.Client_id}
                                    onChange={handleChange}
                                  />
                                </InputGroup>
                                {errors.Client_id && (
                                  <div className="text-danger error-ui">
                                    {errors.Client_id}
                                  </div>
                                )}
                              </Col>
                              <Col lg={4} className="mt-4">
                                <Form.Label className="modal-head">
                                  {t("Client secret")}
                                </Form.Label>
                                <InputGroup>
                                  <Form.Control
                                    placeholder=""
                                    className="search-bg"
                                    name="Client_secret"
                                    value={formData.Client_secret}
                                    onChange={handleChange}
                                  />
                                </InputGroup>
                                {errors.Client_secret && (
                                  <div className="text-danger error-ui">
                                    {errors.Client_secret}
                                  </div>
                                )}
                              </Col>
                              <Col lg={4} className="mt-4">
                                <Form.Label className="modal-head">
                                  {t("Redirect URL")}
                                </Form.Label>
                                <InputGroup>
                                  <Form.Control
                                    placeholder=""
                                    className="search-bg"
                                    name="Remote_Url"
                                    value={formData.Remote_Url}
                                    onChange={handleChange}
                                  />
                                </InputGroup>
                                {errors.Remote_Url && (
                                  <div className="text-danger error-ui">
                                    {errors.Remote_Url}
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="link2">
                        <div style={{ padding: "20px 0px" }}>
                          <span className="modalcal">{t("Add Outlook")}</span>
                          <Form style={{ marginBottom: "35px" }}>
                            <Row className="mt-4">
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "35%" }}
                                >
                                  {t("Name")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "65%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    name="Name2"
                                    value={formData.Name2}
                                    onChange={handleChange}
                                    placeholder={t("Name")}
                                  />
                                  {errors.Name2 && (
                                    <div className="text-danger error-ui">
                                      {errors.Name2}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "35%" }}
                                >
                                  {t("Description")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "65%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    name="Description2"
                                    value={formData.Description2}
                                    onChange={handleChange}
                                    placeholder={t("Description")}
                                  />
                                  {errors.Description2 && (
                                    <div className="text-danger error-ui">
                                      {errors.Description2}
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "35%" }}
                                >
                                  {t("Email")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "65%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    placeholder={t("Email")}
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                  />
                                  {errors.Email && (
                                    <div className="text-danger error-ui">
                                      {errors.Email}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "35%" }}
                                >
                                  {t("Username")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "65%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    placeholder={t("Username")}
                                    name="Username"
                                    value={formData.Username}
                                    onChange={handleChange}
                                  />
                                  {errors.Username && (
                                    <div className="text-danger error-ui">
                                      {errors.Username}
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "35%" }}
                                >
                                  {t("Password")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "65%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    placeholder={t("Password")}
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                  />
                                  {errors.Password && (
                                    <div className="text-danger error-ui">
                                      {errors.Password}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "35%" }}
                                >
                                  {t("EWS Server URL")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "65%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    placeholder={t("EWS Server URL")}
                                    name="EWS_Server_URL"
                                    value={formData.Password}
                                    onChange={handleChange}
                                  />
                                  {errors.EWS_Server_URL && (
                                    <div className="text-danger error-ui">
                                      {errors.EWS_Server_URL}
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "35%" }}
                                >
                                  {t("EWS Version")}
                                </Form.Label>
                                {/* <div
                                  className="select_entry1"
                                  style={{ width: "70%" }}
                                >
                                  <Form.Select
                                    aria-label="Default select example"
                                    className="modal-select"
                                    name="EWS_Version"
                                    value={formData.EWS_Version}
                                    onChange={handleChange}
                                    placeholder={t("Description")}
                                  >
                                    <option value="">EWS Version</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                  </Form.Select>
                                  {errors.EWS_Version && (
                                    <div className="text-danger error-ui">
                                      {errors.EWS_Version}
                                    </div>
                                  )}
                                </div> */}
                                <div
                                  className="Selfmade-dropdown "
                                  style={{ width: "65%" }}
                                >
                                  <div
                                    className="Selfmadedropdown-btn "
                                    onClick={() =>
                                      toggleDropdown("EWS_Version")
                                    }
                                  >
                                    {selectedEWS_Version || t("EWS Version")}

                                    <div>
                                      <Dropdownicon />
                                    </div>
                                  </div>
                                  {openDropdown === "EWS_Version" && (
                                    <div className="Selfmadedropdown-content">
                                      {Calendar?.map((number) => (
                                        <a
                                          key={number._id}
                                          onClick={() =>
                                            handleSelection(
                                              "EWS_Version",
                                              number.type,
                                              number.value
                                            )
                                          }
                                        >
                                          {number.type}
                                        </a>
                                      ))}
                                    </div>
                                  )}{" "}
                                  {errors.EWS_Version && (
                                    <div className="text-danger error-ui">
                                      {errors.EWS_Version}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "35%" }}
                                >
                                  {t("Auto Refresh")}
                                </Form.Label>
                                {/* <div
                                  className="select_entry1"
                                  style={{ width: "65%" }}
                                >
                                  <Form.Select
                                    aria-label="Default select example"
                                    className="modal-select"
                                    name="Auto_Refresh2"
                                    value={formData.Auto_Refresh2}
                                    onChange={handleChange}
                                  >
                                    <option value="">{t("Auto Refresh")}</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                  </Form.Select>
                                  {errors.Auto_Refresh2 && (
                                    <div className="text-danger error-ui">
                                      {errors.Auto_Refresh2}
                                    </div>
                                  )}
                                </div> */}
                                <div
                                  className="Selfmade-dropdown "
                                  style={{ width: "65%" }}
                                >
                                  <div
                                    className="Selfmadedropdown-btn "
                                    onClick={() =>
                                      toggleDropdown("Auto_Refresh2")
                                    }
                                  >
                                    {selectedAuto_Refresh2 || t("Auto Refresh")}

                                    <div>
                                      <Dropdownicon />
                                    </div>
                                  </div>
                                  {openDropdown === "Auto_Refresh2" && (
                                    <div className="Selfmadedropdown-content">
                                      {Calendar?.map((number) => (
                                        <a
                                          key={number._id}
                                          onClick={() =>
                                            handleSelection(
                                              "Auto_Refresh2",
                                              number.type,
                                              number.value
                                            )
                                          }
                                        >
                                          {number.type}
                                        </a>
                                      ))}
                                    </div>
                                  )}{" "}
                                  {errors.Auto_Refresh2 && (
                                    <div className="text-danger error-ui">
                                      {errors.Auto_Refresh2}
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="link3">
                        <div style={{ padding: "20px 0px" }}>
                          <span className="modalcal">{t("Add CalDAV")}</span>
                          <Form style={{ marginBottom: "35px" }}>
                            <Row className="mt-4">
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "30%" }}
                                >
                                  {t("Name")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "70%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    placeholder={t("Name")}
                                    name="Name3"
                                    value={formData.Name3}
                                    onChange={handleChange}
                                  />
                                  {errors.Name3 && (
                                    <div className="text-danger error-ui">
                                      {errors.Name3}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "30%" }}
                                >
                                  {t("Description")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "70%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    name="Description3"
                                    value={formData.Description3}
                                    onChange={handleChange}
                                    placeholder={t("Description")}
                                  />
                                  {errors.Description3 && (
                                    <div className="text-danger error-ui">
                                      {errors.Description3}
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "30%" }}
                                >
                                  {t("Username")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "70%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    placeholder={t("Username")}
                                    name="Username2"
                                    value={formData.Username2}
                                    onChange={handleChange}
                                  />
                                  {errors.Username2 && (
                                    <div className="text-danger error-ui">
                                      {errors.Username2}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "30%" }}
                                >
                                  {t("Password")}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "70%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    name="Password2"
                                    value={formData.Password2}
                                    onChange={handleChange}
                                    placeholder={t("Password")}
                                  />
                                  {errors.Password2 && (
                                    <div className="text-danger error-ui">
                                      {errors.Password2}
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "30%" }}
                                >
                                  {t("Auto Refresh")}
                                </Form.Label>
                                {/* <div
                                  className="select_entry1"
                                  style={{ width: "70%" }}
                                >
                                  <Form.Select
                                    aria-label="Default select example"
                                    className="modal-select"
                                    name="Auto_Refresh3"
                                    value={formData.Auto_Refresh3}
                                    onChange={handleChange}
                                  >
                                    <option value="" disabled>
                                      {t("Auto Refresh")}
                                    </option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                  </Form.Select>
                                  {errors.Auto_Refresh3 && (
                                    <div className="text-danger error-ui">
                                      {errors.Auto_Refresh3}
                                    </div>
                                  )}
                                </div> */}
                                <div
                                  className="Selfmade-dropdown "
                                  style={{ width: "70%" }}
                                >
                                  <div
                                    className="Selfmadedropdown-btn "
                                    onClick={() =>
                                      toggleDropdown("Auto_Refresh3")
                                    }
                                  >
                                    {selectedAuto_Refresh3 || t("Auto Refresh")}

                                    <div>
                                      <Dropdownicon />
                                    </div>
                                  </div>
                                  {openDropdown === "Auto_Refresh3" && (
                                    <div className="Selfmadedropdown-content">
                                      {Calendar?.map((number) => (
                                        <a
                                          key={number._id}
                                          onClick={() =>
                                            handleSelection(
                                              "Auto_Refresh3",
                                              number.type,
                                              number.value
                                            )
                                          }
                                        >
                                          {number.type}
                                        </a>
                                      ))}
                                    </div>
                                  )}{" "}
                                  {errors.Auto_Refresh3 && (
                                    <div className="text-danger error-ui">
                                      {errors.Auto_Refresh3}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col
                                lg={6}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <Form.Label
                                  className="modal-head fmodal"
                                  style={{ width: "30%" }}
                                >
                                  {t("Principal URL")}{" "}
                                </Form.Label>
                                <div
                                  className="select_entry1"
                                  style={{ width: "70%" }}
                                >
                                  <Form.Control
                                    className="search-bg"
                                    placeholder={t("Principal URL")}
                                    name="Principal_URL"
                                    value={formData.Principal_URL}
                                    onChange={handleChange}
                                  />
                                  {errors.Principal_URL && (
                                    <div className="text-danger error-ui">
                                      {errors.Principal_URL}
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ padding: "10px 20px" }}>
              <a
                // href="https://ui.mobiililinja.fi/nodejs/calendar.pdf"
                href="https://pabx.mobiililinja.fi/nodejs/calendar.pdf"
                className="configurationlink"
              >
                {"Need help configure the calendar"}
              </a>
            </div>
            <div
              className="d-flex justify-content-end me-4"
              style={{ marginBottom: "37px" }}
            >
              <button className="btn_cancel me-3" onClick={handleClose}>
                {t("Cancel")}
              </button>
              <button className="btn_save" onClick={handleSave}>
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default CalendarModal;
