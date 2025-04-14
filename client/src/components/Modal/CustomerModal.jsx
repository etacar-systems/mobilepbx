import React, { useEffect, useState } from "react";
import { Modal, Tab, Nav, Form, Spinner } from "react-bootstrap";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import "./CustomerModalCss.css";
import FeaturesTab from "./FeaturesTabCustomer";
import CustomizeTab from "./CustomizeTabCustomer";
import CountrySelector from "./Countrylist";
import { ReactComponent as Keylogo } from "../../Assets/Icon/lock.svg";
import { ReactComponent as Emaillogo } from "../../Assets/Icon/email_logo.svg";
import { ReactComponent as Hide } from "../../Assets/Icon/hide.svg";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { ReactComponent as Show } from "../../Assets/Icon/show.svg";
import { useTranslation } from "react-i18next";
import CustomTooltipModal from "../CustomTooltipModal";
import ConstantConfig, { Password } from "../ConstantConfig";

const AddCustomerModal = ({
  handleClose,
  show,
  header,
  loader,
  formData,
  setFormData,
  handleSave,
  setErrors,
  errors,
  featuresData,
  setFeaturesData,
  Nexttab,
  setMode,
  mode,
  editValue,
  colors,
  setColors,
  error,
  seterror,
  setLogo,
  logo,
  logoDisplay,
  setLogoDisplay,
  activeTab,
  setActiveTab,
}) => {
  const { t } = useTranslation();

  // const [activeTab, setActiveTab] = useState("General");
  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const checkAllregex = (name, value) => {
    if ((!value || !String(value).trim()) && name !== "Phone_number") {
      if (name === Password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${t(
            "please choose a strong password try a mix of letters numbers and symbols"
          )}`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${t("Invalid")} ${t(name.replace(/_/g, " "))}`,
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  useEffect(() => {
    setColors(ConstantConfig.CUSTOMER.modalColor);
  }, []);

  const handleChange = (name, value) => {
    console.log("valueeeee", name, value);
    checkAllregex(name, value);
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const [openDropdown, setOpenDropdown] = useState(null);
  const handleSelection = (dropdown, value, displayValue) => {
    handleChange(dropdown, value);
    setFormData((prevState) => ({
      ...prevState,
      [dropdown]: displayValue,
    }));

    setOpenDropdown(null); // Close the dropdown after selection
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
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
    <Modal size="lg" show={show} onHide={handleClose}>
      <div className="modal-data">
        <div
          className="p-3 "
          style={{
            borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
          }}
        >
          <div className="d-flex align-items-center justify-content-between add_new_num">
            <h6>{header}</h6>
            <Closeicon width={23} onClick={handleClose} height={23} />
          </div>
        </div>
        <Modal.Body className="modal-new-add">
          <div
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
            }}
          >
            <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
              <Nav variant="tabs" className="custome-nav table-nav">
                <>
                  <Nav.Item className="custom-nav-item">
                    <Nav.Link eventKey="General" className="nav-link2">
                      {t("General")}
                    </Nav.Link>
                  </Nav.Item>
                </>
                <Nav.Item className="custom-nav-item">
                  <Nav.Link eventKey="Features" className="nav-link2">
                    {t("Features")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="custom-nav-item">
                  <Nav.Link eventKey="Billing" className="nav-link2">
                    {t("Billing")}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="custom-nav-item">
                  <Nav.Link eventKey="customize" className="nav-link2">
                    {t("Customize")}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content
                className="tabcontent"
                style={{ padding: "0px 17px 0px 17px" }}
              >
                {activeTab == "General" ? (
                  <Tab.Pane eventKey="General" className="show active">
                    <div className="customer col-md-12">
                      <div className="body customer-demo-card">
                        <div className="customer row clearfix">
                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("Company name")}
                            </label>
                            <div className="customer-form-group">
                              <input
                                type="text"
                                className="customer-form-control modal-select"
                                name="Company_name"
                                value={formData.Company_name}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                              />
                              {errors.Company_name && (
                                <div className="text-danger error-ui">
                                  {errors.Company_name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("Street address")}
                            </label>
                            <div className="customer-form-group">
                              <input
                                type="text"
                                className="customer-form-control modal-select"
                                name="Street_address"
                                value={formData.Street_address}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                              />
                              {errors.Street_address && (
                                <div className="text-danger error-ui">
                                  {errors.Street_address}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("ZIP")}
                            </label>
                            <div className="customer-form-group">
                              <input
                                type="text"
                                className="customer-form-control modal-select"
                                name="ZIP"
                                value={formData.ZIP}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                              />
                              {errors.ZIP && (
                                <div className="text-danger error-ui">
                                  {errors.ZIP}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("City")}
                            </label>
                            <div className="customer-form-group">
                              <input
                                type="text"
                                className="customer-form-control modal-select"
                                name="City"
                                value={formData.City}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                              />
                              {errors.City && (
                                <div className="text-danger error-ui">
                                  {errors.City}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("Select country")}{" "}
                            </label>
                            <div className="customer-form-group">
                              <div className="select_entry1 m-0">
                                <CountrySelector
                                  formData={formData}
                                  toggleDropdown={toggleDropdown}
                                  handleSelection={handleSelection}
                                  openDropdown={openDropdown}
                                  setOpenDropdown={setOpenDropdown}
                                />
                                {errors.Country && (
                                  <div className="text-danger error-ui">
                                    {errors.Country}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("VAT")}
                            </label>
                            <div className="customer-form-group">
                              <input
                                type="text"
                                className="customer-form-control modal-select"
                                name="Vat"
                                value={formData.Vat}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                              />
                              {errors.Vat && (
                                <div className="text-danger error-ui">
                                  {errors.Vat}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("Contact person")}
                            </label>
                            <div className="customer-input-group">
                              <div className="customer-prepend">
                                <span
                                  className="customer-input-group-text"
                                  style={{ fontSize: "11px" }}
                                >
                                  <i className="customer-contact-icon"></i>
                                </span>
                              </div>
                              <input
                                type="text"
                                className="customer-form-control modal-select emailforminput"
                                name="Contact_person"
                                value={formData.Contact_person}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                              />
                            </div>
                            {errors.Contact_person && (
                              <div className="text-danger error-ui">
                                {errors.Contact_person}
                              </div>
                            )}
                          </div>

                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("Email")}
                            </label>
                            <div className="customer-input-group">
                              <div className="customer-prepend">
                                <span className="customer-input-group-text">
                                  <Emaillogo height={17} width={17} />
                                </span>
                              </div>
                              <input
                                type="text"
                                className="customer-form-control modal-select emailforminput"
                                name="Email"
                                value={formData.Email}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                autocomplete="off"
                              />
                            </div>
                            {errors.Email && (
                              <div className="text-danger error-ui">
                                {errors.Email}
                              </div>
                            )}
                          </div>
                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("Phone number")}
                            </label>
                            <div className="customer-input-group">
                              <div className="customer-prepend">
                                <span
                                  className="customer-input-group-text"
                                  style={{ fontSize: "11px" }}
                                >
                                  <i className="customer-icon"></i>
                                </span>
                              </div>
                              <input
                                type="text"
                                className="customer-form-control modal-select emailforminput"
                                name="Phone_number"
                                value={formData.Phone_number}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                autoComplete="off"
                                onKeyPress={handleKeyPress}
                              />
                            </div>
                            {errors.Phone_number && (
                              <div className="text-danger error-ui">
                                {errors.Phone_number}
                              </div>
                            )}
                          </div>

                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("Password")}
                            </label>
                            <div className="customer-input-group">
                              <div className="customer-prepend">
                                <span
                                  className="customer-input-group-text"
                                  onClick={togglePasswordVisibility}
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
                                  )}
                                </span>
                              </div>
                              <input
                                type={showPassword ? "text" : "password"}
                                className="customer-form-control modal-select emailforminput"
                                name="Password"
                                value={formData.Password || ""}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                autocomplete="new-password"
                              />
                            </div>
                            {errors.Password && (
                              <div className="text-danger error-ui">
                                {errors.Password}
                              </div>
                            )}
                          </div>
                          <div className="customer col-lg-4 col-md-12">
                            <label className="labledata modal-head">
                              {t("Domain Name")}
                              <CustomTooltipModal
                                tooltip={t("Enter the name of domain ")}
                              />
                            </label>
                            <div className="customer-input-group">
                              <input
                                type="text"
                                className="customer-form-control modal-select emailforminput"
                                name="Domain"
                                value={formData.Domain}
                                onChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                              />
                            </div>
                            {errors.Domain && (
                              <div className="text-danger error-ui">
                                {errors.Domain}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                ) : activeTab == "Features" ? (
                  <Tab.Pane eventKey="Features">
                    <FeaturesTab
                      featuresData={featuresData}
                      setFeaturesData={setFeaturesData}
                      Nexttab={Nexttab}
                    />
                  </Tab.Pane>
                ) : activeTab == "Billing" ? (
                  <Tab.Pane eventKey="Billing">
                    <div className="col-md-12">
                      <div className="body demo-card">
                        <div className="row clearfix"></div>
                      </div>
                    </div>
                  </Tab.Pane>
                ) : activeTab == "customize" ? (
                  <Tab.Pane eventKey="customize">
                    <CustomizeTab
                      colors={colors}
                      setColors={setColors}
                      error={error}
                      seterror={seterror}
                      mode={mode}
                      setLogo={setLogo}
                      logo={logo}
                      logoDisplay={logoDisplay}
                      setLogoDisplay={setLogoDisplay}
                    />
                  </Tab.Pane>
                ) : (
                  ""
                )}
              </Tab.Content>
            </Tab.Container>
          </div>
        </Modal.Body>

        <div
          className=" d-flex justify-content-end "
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
  );
};

export default AddCustomerModal;
