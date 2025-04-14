import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { InputGroup } from "react-bootstrap";
import { ReactComponent as Emaillogo } from "../../Assets/Icon/email_logo.svg";
import { ReactComponent as PhoneRegister } from "../../Assets/Icon/phoneregister.svg";
import { ReactComponent as Hide } from "../../Assets/Icon/hide.svg";
import { ReactComponent as Show } from "../../Assets/Icon/show.svg";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import Cookies from "js-cookie";
import CountrySelector from "./Countrylist";
import { useTranslation } from "react-i18next";
import config from "../../config";
import CustomTooltipModal from "../CustomTooltipModal";
import ConstantConfig, {
  EXTENSIONVALALL,
  Password,
  Usertype,
  Usertype_Admin,
} from "../ConstantConfig";
import CustomDropDown from "../CustomDropDown";
function ExtensionModal({
  handleClose,
  show,
  header,
  setFormData,
  formData,
  loader,
  handlesavedata,
  mode,
  pstndestination,
  getPstnNumber,
}) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const Token = Cookies.get("Token");
  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  //   pstn_number: String;
  //   first_name: String;
  //   last_name: String;
  //   password: String;
  //   user_extension: String;
  //   user_email: String;
  //   role: Number;
  //   mobile: String;
  //   country: String;

  //   user_image: String;
  //   user_custom_msg: String;

  useEffect(() => {
    if (show) {
      setErrors({});
      setFormData({
        Extension_number: "",
        First_name: "",
        Last_name: "",
        Password: "",
        Email: "",
        Mobile: "",
        Country: "",
        Pstn_number: "",
        User_type: "",
        user_record: false,
      });
    }
  }, [show]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validateForm = (name, value) => {
    let valid = true;
    const newErrors = {};
    const regex = {
      Extension_number: EXTENSIONVALALL,
      Password: ConstantConfig.EXTENSION.VALIDATION.Password,
      Email: ConstantConfig.EXTENSION.VALIDATION.Email,
      Country: "",
      Pstn_number: "",
    };

    if (!value || !String(value).trim()) {
      if (name !== "Mobile") {
        // Allow blank for Mobile
        newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
        valid = false;
      }
    } else if (regex[name] && !regex[name].test(value)) {
      if (name === Password) {
        newErrors[name] = `${t(
          "please choose a strong password try a mix of letters numbers and symbols"
        )}`;
        valid = false;
      } else {
        newErrors[name] = `${t("Invalid")} ${t(name.replace(/_/g, " "))}`;
        valid = false;
      }
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
      if (
        key == "user_record" ||
        key == "Pstn_number" ||
        (formData.User_type === Usertype_Admin && key == "Extension_number")
      ) {
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
      if (name !== "Mobile") {
        newErrors[name] = `${name.replace(/_/g, " ")} ${t("is required")}`;
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
  };
  const handleSelection = (dropdown, value, displayValue) => {
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    handleChange(syntheticEvent);
    if (dropdown !== "User_type")
      setFormData((prevState) => ({
        ...prevState,
        [dropdown]: displayValue,
      }));

    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    if (mode === "edit" && dropdown === "") {
      // setOpenDropdown(null);
    } else {
      setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
    }
  };
  const handleClickOutside = (event) => {
    if (openDropdown == "Pstn_number") {
      setOpenDropdown(null);
    }
  };
  const handleDropdownClick = (e) => {
    e.stopPropagation();
    toggleDropdown("Pstn_number");
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  const handleKeyPress = (e) => {
    if (e.key < "0" || e.key > "9") {
      e.preventDefault();
    }
  };
  const Mobilenumberkeypress = (e) => {
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
  const selectedPstnNumber = getPstnNumber?.find(
    (number) => number._id === formData.Pstn_number
  )?.destination;
  useEffect(() => {
    if (formData.User_type === Usertype_Admin) {
      setErrors({ ...errors, ["Extension_number"]: "" });
      setFormData((prev) => ({
        ...prev,
        Extension_number: "",
        Pstn_number: "",
      }));
    }
  }, [formData.User_type]);
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
              {/* <img src={close} onClick={handleClose} alt="" width={25} /> */}
            </div>
          </div>
          <div className="p-3">
            <Form
              style={{
                borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <Row className="mb-5">
                <Col lg={4} className="mt-4">
                  <Form.Label className="modal-head">{t("Select number")}</Form.Label>

                  {mode === "edit" ? (
                    <CustomTooltipModal tooltip={t("This is not editable")} />
                  ) : (
                    <>
                      {getPstnNumber.length === 0 && (
                        <CustomTooltipModal tooltip={t("Please first create Pstn number")} />
                      )}
                    </>
                  )}

                  <div className="Selfmade-dropdown">
                    {formData.User_type !== Usertype_Admin ? (
                      <div className="Selfmadedropdown-btn" onClick={handleDropdownClick}>
                        {selectedPstnNumber || pstndestination || t("None selected")}
                        <div>
                          <Dropdownicon />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="Selfmadedropdown-btn"
                        style={{
                          backgroundColor: "var(--main-input-disabled)",
                        }}
                      >
                        {t("None selected")}
                        <div>
                          <Dropdownicon />
                        </div>
                      </div>
                    )}
                    {openDropdown === "Pstn_number" && (
                      <div className="Selfmadedropdown-content">
                        {getPstnNumber.length === 0 ? (
                          <div>{t("No Record")}</div>
                        ) : (
                          <>
                            {" "}
                            {[...getPstnNumber]
                              ?.sort((a, b) => a.destination - b.destination)
                              .map((number) => (
                                <a
                                  key={number._id}
                                  onClick={() =>
                                    handleSelection("Pstn_number", number.destination, number._id)
                                  }
                                >
                                  {number.destination}
                                </a>
                              ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.Pstn_number && (
                    <div className="text-danger error-ui">{errors.Pstn_number}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-4">
                  <Form.Label className="modal-head">{t("Extension number")}</Form.Label>
                  {mode == "edit" && <CustomTooltipModal tooltip={t("This is not editable")} />}

                  <InputGroup>
                    <Form.Control
                      disabled={mode == "edit" || formData.User_type === Usertype_Admin}
                      placeholder=""
                      aria-label="Extension Number"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="Extension_number"
                      value={formData.Extension_number}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>
                  {errors.Extension_number && (
                    <div className="text-danger error-ui">{errors.Extension_number}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-4">
                  <Form.Label className="modal-head">{t("User type")}</Form.Label>
                  <CustomDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={formData.User_type}
                    openDropdown={openDropdown}
                    valueArray={Usertype}
                    handleSelection={handleSelection}
                    name={"User_type"}
                    defaultValue={t("None selected")}
                    mapValue={"item"}
                    storeValue={"item"}
                    setOpenDropdown={setOpenDropdown}
                    mode={mode}
                    sorting={true}
                  />
                  {errors.User_type && (
                    <div className="text-danger error-ui">{errors.User_type}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">{t("First name")}</Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="First Name"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="First_name"
                      value={formData.First_name}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.First_name && (
                    <div className="text-danger error-ui">{errors.First_name}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">{t("Last name")}</Form.Label>
                  <InputGroup className="">
                    <Form.Control
                      placeholder=""
                      aria-label="Last Name"
                      aria-describedby="basic-addon1"
                      className="search-bg"
                      name="Last_name"
                      value={formData.Last_name}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.Last_name && (
                    <div className="text-danger error-ui">{errors.Last_name}</div>
                  )}
                </Col>
                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">
                    {t("Password")}
                    <CustomTooltipModal
                      tooltip={t(
                        "Password must be 4-15 characters long and can include letters, numbers, and special characters"
                      )}
                    />
                  </Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                      className="modal-icon"
                    >
                      {showPassword ? (
                        <Show height={15} width={15} />
                      ) : (
                        <Hide
                          height={17}
                          width={17}
                          style={{
                            fill: "var(--main-adminnumberheader-color)",
                          }}
                        />
                      )}{" "}
                      {/* Toggle eye icon */}
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"} // Toggle type between "text" and "password"
                      placeholder=""
                      aria-label="Password"
                      aria-describedby="basic-addon1"
                      className="search-bg emailforminput"
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </InputGroup>
                  {errors.Password && <div className="text-danger error-ui">{errors.Password}</div>}
                </Col>
                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">{t("Email")}</Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1" className="modal-icon">
                      <Emaillogo width={20} height={17} />
                      {/* <img src={emaillogo} className='registerpage-icon' />*/}
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder=""
                      aria-label="Email"
                      aria-describedby="basic-addon1"
                      className="search-bg emailforminput"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      autoComplete="new-email"
                    />
                  </InputGroup>
                  {errors.Email && <div className="text-danger error-ui">{errors.Email}</div>}
                </Col>
                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">{t("Mobile phone")}</Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1" className="modal-icon">
                      <PhoneRegister
                        width={10}
                        height={10}
                        style={{ fill: "var(--main-adminnumberheader-color)" }}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder=""
                      aria-label="Mobile"
                      aria-describedby="basic-addon1"
                      className="search-bg emailforminput"
                      name="Mobile"
                      value={formData.Mobile}
                      onChange={handleChange}
                      onKeyPress={Mobilenumberkeypress}
                    />
                  </InputGroup>
                  {errors.Mobile && <div className="text-danger error-ui">{errors.Mobile}</div>}
                </Col>
                <Col lg={4} className="mt-5">
                  <Form.Label className="modal-head">{t("Select country")}</Form.Label>
                  {console.log(openDropdown, "----------formData-----------")}
                  <InputGroup className="">
                    <CountrySelector
                      formData={formData}
                      handleChange={handleChange}
                      toggleDropdown={toggleDropdown}
                      handleSelection={handleSelection}
                      openDropdown={openDropdown}
                      setOpenDropdown={setOpenDropdown}
                    />
                  </InputGroup>

                  {errors.Country && <div className="text-danger error-ui">{errors.Country}</div>}
                </Col>
                {/* <Col lg={4} className="mt-5">
                  <Form.Label
                    className="modal-head"
                    style={{ marginLeft: "6px" }}
                  ></Form.Label>
                  <div
                    className="borderr"
                    style={{
                      border:
                        "1px solid var(--main-bordermodaldashboard-color)",
                      borderRadius: "3px",
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
                      <div style={{ color: "var(--main-adminheaderpage-color)" }}>
                        {t("User Record")}
                        <CustomTooltipModal
                          tooltip={t(
                            "Choose to enable or disable the user record."
                          )}
                        />
                      </div>
                      <label class="switch">
                        <input
                          type="checkbox"
                          checked={formData?.user_record}
                          name="user_record"
                          onChange={handleChange}
                        />
                        <span class="slider"></span>
                      </label>
                    </div>
                  </div>
                </Col> */}
              </Row>
            </Form>
          </div>
          <div
            className="d-flex justify-content-end "
            style={{ marginBottom: "37px", marginRight: "33px" }}
          >
            <button className="btn_cancel me-2" onClick={handleClose} disabled={loader}>
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

export default ExtensionModal;
