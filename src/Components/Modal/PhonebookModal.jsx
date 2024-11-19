import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { InputGroup } from "react-bootstrap";
import emaillogo from "../../Assets/Icon/email_logo.svg";
import phoneRegister from "../../Assets/Icon/phoneregister.svg";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";
import ConstantConfig from "../ConstantConfig";

function PhonebookModal({
  handleClose,
  show,
  header,
  handledaatasave,
  formData,
  setFormData,
  loader,
}) {
  const { t } = useTranslation();
  useEffect(() => {
    setErrors({});
    setFormData({
      Firstname: "",
      Lastname: "",
      Phonenumber: "",
      Mobilenumber: "",
      Company: "",
      Position: "",
    });
  }, [show]);

  const [errors, setErrors] = useState({});
  const validateForm = (name, value) => {
    let valid = true;
    const newErrors = {};
    const regex = {
      Position: "",
    };

    if (
      (!value || !value.trim()) &&
      (name === "Firstname" || name === "Phonenumber")
    ) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
      valid = false;
    } else if (regex[name] && !regex[name].test(value)) {
      newErrors[name] = `${t("Invalid")} ${t(name.replace(/_/g, " "))}`;
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
      handledaatasave();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    const newErrors = {};
    if (
      (!value || !value.trim()) &&
      (name === "Firstname" || name === "Phonenumber")
    ) {
      newErrors[name] = `${name.replace(/_/g, " ")} ${t("is required")}`;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
  };

  const handleKeyPress = (e) => {
    const { value, selectionStart } = e.target;
    const plusCount = (value.match(/\+/g) || []).length;

    if (
      (e.key < "0" || e.key > "9") &&
      !(
        e.key === "+" &&
        plusCount < 1 &&
        (selectionStart === 0 || value[selectionStart - 1] === " ")
      )
    ) {
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
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("First name")}
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="Firstname"
                      value={formData.Firstname}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.Firstname && (
                    <div className="text-danger error-ui">
                      {errors.Firstname}
                    </div>
                  )}
                </Col>

                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Last name")}
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="Lastname"
                      value={formData.Lastname}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.Lastname && (
                    <div className="text-danger error-ui">
                      {errors.Lastname}
                    </div>
                  )}
                </Col>

                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Phone number")}
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="Phonenumber"
                      value={formData.Phonenumber}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>
                  {errors.Phonenumber && (
                    <div className="text-danger error-ui">
                      {errors.Phonenumber}
                    </div>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("Mobile number")}
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="Mobilenumber"
                      value={formData.Mobilenumber}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>
                  {errors.Mobilenumber && (
                    <div className="text-danger error-ui">
                      {errors.Mobilenumber}
                  </div>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">{t("Company")}</Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="Company"
                      value={formData.Company}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.Company && (
                    <div className="text-danger error-ui">{errors.Company}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label className="modal-head">
                    {t("Position")}
                  </Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="Position"
                      value={formData.Position}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.Position && (
                    <div className="text-danger error-ui">
                      {errors.Position}
                    </div>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
          <div
            className=" d-flex justify-content-end "
            style={{ marginBottom: "30px", marginRight: "33px" }}
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
export default PhonebookModal;
