import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { InputGroup, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import CustomTooltipModal from "../CustomTooltipModal";
import ConstantConfig, { EXTENSIONVALALL } from "../ConstantConfig";

function ConferenceModal({
  handleClose,
  show,
  header,
  setFormData,
  formData,
  loader,
  handlesavedata,
  mode,
  conferenceProfile,
}) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const Token = Cookies.get("Token");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (name, value) => {
    let valid = true;
    const newErrors = {};
    const regex = {
      extension_number: EXTENSIONVALALL,
    };

    if (!value || !value.trim()) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
      valid = false;
    } else if (regex[name] && !regex[name].test(value)) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is invalid")}`;
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
      if (key === "conference_record" || key === "conference_flags") {
        continue;
      }
      if (!validateForm(key, formData[key])) {
        isValid = false;
      }
    }

    if (isValid) {
      handlesavedata();
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });

    const newErrors = {};
    if (!value || !String(value).trim()) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key < "0" || e.key > "9") {
      e.preventDefault();
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
              <Closeicon width={23} onClick={handleClose} height={23} />
            </div>
          </div>
          <div className="p-3">
            <Form
              style={{
                borderBottom:
                  "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <Row className="mb-3">
                <Col lg={4} className="mb-3">
                  <Form.Label className="modal-head">
                    {t("Conference name")}
                    <CustomTooltipModal tooltip={t("Enter conference name")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="conference_name"
                      value={formData.conference_name}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.conference_name && (
                    <div className="text-danger error-ui">
                      {errors.conference_name}
                    </div>
                  )}
                </Col>

                <Col lg={4} className="mb-3">
                  <Form.Label className="modal-head">
                    {t("Conference description")}
                    <CustomTooltipModal tooltip={t("Enter the description")} />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="conference_description"
                      value={formData.conference_description}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.conference_description && (
                    <div className="text-danger error-ui">
                      {errors.conference_description}
                    </div>
                  )}
                </Col>
                <Col lg={4} className="mb-3">
                  <Form.Label className="modal-head">
                    {t("Extension")}
                    <CustomTooltipModal
                      tooltip={t("Enter conference extension number")}
                    />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      disabled={mode == "edit"}
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="extension_number"
                      value={formData.extension_number}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>
                  {errors.extension_number && (
                    <div className="text-danger error-ui">
                      {errors.extension_number}
                    </div>
                  )}
                </Col>
                <Col lg={4} className="mb-3">
                  <Form.Label className="modal-head">
                    {t("Admin PIN")}
                    <CustomTooltipModal
                      tooltip={t(
                        "Optional pin number to source access to the conference"
                      )}
                    />
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="conference_pin"
                      value={formData.conference_pin}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>
                  {errors.conference_pin && (
                    <div className="text-danger error-ui">
                      {errors.conference_pin}
                    </div>
                  )}
                </Col>
                <Col lg={8} className="mb-3">
                  <Form.Label className="modal-head">
                    {t("Settings")}
                  </Form.Label>
                  <div
                    className="borderr"
                    style={{
                      border:
                        "1px solid var(--main-bordermodaldashboard-color)",
                      borderRadius: "3px 3px 0px 0px",
                    }}
                  >
                    <div
                      style={{
                        margin: "12px 15px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      className="modal-head"
                    >
                      {t("Conference record")}
                      <label class="switch">
                        <input
                          type="checkbox"
                          checked={formData?.conference_record}
                          name="conference_record"
                          onChange={handleChange}
                        />
                        <span class="slider"></span>
                      </label>
                    </div>
                  </div>
                  <div
                    className="borderr"
                    style={{
                      border:
                        "1px solid var(--main-bordermodaldashboard-color)",
                      borderRadius: "0px 0px 3px 3px",
                    }}
                  >
                    <div
                      style={{
                        margin: "12px 15px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      className="modal-head"
                    >
                      {t("Conference leader arrive")}
                      <label class="switch">
                        <input
                          type="checkbox"
                          checked={formData?.conference_flags}
                          name="conference_flags"
                          onChange={handleChange}
                        />
                        <span class="slider"></span>
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
          <div
            className="d-flex justify-content-end "
            style={{ marginBottom: "37px", marginRight: "33px" }}
          >
            <button
              className="btn_cancel me-2"
              onClick={handleClose}
              disabled={loader}
            >
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
export default ConferenceModal;
