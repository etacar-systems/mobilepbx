import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Nav, Tab } from "react-bootstrap";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import FeaturesTab from "./FeaturesTabCustomer";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/down-arrow-svgrepo-com.svg";
import DeleteModal from "./DeleteModal";
import { useTranslation } from "react-i18next";

function InvoiceModal({
  handleClose,
  show,
  header,
  featuresData,
  setFeaturesData,
  Nexttab,
}) {
  const [formData, setFormData] = useState({
    company: "",
    companyaddress: "",
    companyzip: "",
    companyservice: "",
    companyname: "",
    companyamount: "",
    companyprice: "",
    companyservice2: "",
  });
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deletemodal, setDeletemodal] = useState(false);
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
  const selectedCompany =
    formData.company === 1
      ? "Company A"
      : formData.company === 2
      ? "Company B"
      : "";
  const selectedcompanyservice =
    formData.companyservice === 1
      ? "Company A"
      : formData.companyservice === 2
      ? "Company B"
      : "";
  const selectedcompanyservice2 =
    formData.companyservice2 === 1
      ? "Company A"
      : formData.companyservice2 === 2
      ? "Company B"
      : "";
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.company) {
      newErrors.company = t("Company is required");
      valid = false;
    }

    if (!formData.companyaddress) {
      newErrors.companyaddress = t("Street address is required");
      valid = false;
    }

    if (!formData.companyzip) {
      newErrors.companyzip = t("ZIP is required");
      valid = false;
    }

    if (!formData.companyservice) {
      newErrors.companyservice = t("Please select service is required");
      valid = false;
    }

    if (!formData.companyname) {
      newErrors.companyname = t("Name is required");
      valid = false;
    }

    if (!formData.companyamount) {
      newErrors.companyamount = t("Amount is required");
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validateForm()) {
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "companyzip" && isNaN(value)) {
      setErrors({
        ...errors,
        [name]: t("Please enter only numeric characters"),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const DeleteItem = () => {
    setDeletemodal(false);
  };
  const handleCloseDelete = () => {
    setDeletemodal(false);
  };
  const openDeletemodal = () => {
    setDeletemodal(true);
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
              <Closeicon width={25} onClick={handleClose} height={25} />
            </div>
          </div>
          <div className="p-3">
            <div
              style={{
                borderBottom:
                  "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <Tab.Container defaultActiveKey="/home">
                <Row>
                  <Col sm={12}>
                    <Nav variant="pills" className="flex-row tabs_border">
                      <Nav.Item>
                        <Nav.Link eventKey="/home" className="nav-link2">
                          {t("General")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link1" className="nav-link2">
                          {t("Features")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link2" className="nav-link2">
                          {t("Billing")}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={12}>
                    <Tab.Content>
                      <Tab.Pane eventKey="/home">
                        <Form>
                          <Row className="mt-3">
                            <Col lg={4}>
                              <Form.Label className="modal-head">
                                {t("Select Company")}
                              </Form.Label>
                              {/* <div className='select_entry1'>
                                                            <Form.Select aria-label="Default select example" className='modal-select'
                                                                name="company" value={formData.company} onChange={handleChange}
                                                            >
                                                                <option value="None selected" disabled>None selected</option>
                                                                <option value="Company A">Company A</option>
                                                                <option value="Company B">Company B</option>
                                                            </Form.Select>
                                                            {errors.company && <div className="text-danger error-ui">{errors.company}</div>}
                                                        </div> */}
                              <div
                                className="Selfmade-dropdown "
                                style={{ width: "100%" }}
                              >
                                <div
                                  className="Selfmadedropdown-btn "
                                  onClick={() => toggleDropdown("company")}
                                >
                                  {selectedCompany || t("--Select-- ")}

                                  <div>
                                    <Dropdownicon
                                      style={{ height: "10px", width: "10px" }}
                                    />
                                  </div>
                                </div>
                                {openDropdown === "company" && (
                                  <div className="Selfmadedropdown-content">
                                    {[
                                      { type: "Company A", value: 1 },
                                      { type: "Company B", value: 2 },
                                    ]?.map((number) => (
                                      <a
                                        key={number._id}
                                        onClick={() =>
                                          handleSelection(
                                            "company",
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
                                {errors.company && (
                                  <div className="text-danger error-ui">
                                    {errors.company}
                                  </div>
                                )}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <Form.Label className="modal-head">
                                {t("Street address")}
                              </Form.Label>
                              <Form.Control
                                className="search-bg"
                                name="companyaddress"
                                value={formData.companyaddress}
                                onChange={handleChange}
                              />
                              {errors.companyaddress && (
                                <div className="text-danger error-ui">
                                  {errors.companyaddress}
                                </div>
                              )}
                            </Col>
                            <Col lg={4}>
                              <Form.Label className="modal-head">
                                {t("ZIP")}
                              </Form.Label>
                              <Form.Control
                                className="search-bg"
                                name="companyzip"
                                value={formData.companyzip}
                                onChange={handleChange}
                              />
                              {errors.companyzip && (
                                <div className="text-danger error-ui">
                                  {errors.companyzip}
                                </div>
                              )}
                            </Col>
                          </Row>
                        </Form>
                        <div style={{ padding: "3px 11px" }}>
                          <Row className="mt-5">
                            <Col lg={3}>
                              <Form.Label className="modal-head invoicename">
                                {t("Service")}
                              </Form.Label>
                            </Col>
                            <Col lg={5}>
                              <Form.Label className="modal-head invoicename">
                                {t("Name")}
                              </Form.Label>
                            </Col>
                            <Col lg={2}>
                              <Form.Label className="modal-head invoicename">
                                {t("Amount")}
                              </Form.Label>
                            </Col>
                            <Col lg={1}>
                              <Form.Label className="modal-head invoicename">
                                {t("Price")}
                              </Form.Label>
                            </Col>
                            <Col lg={1}>
                              <Form.Label className="modal-head invoicename">
                                {t("Action")}
                              </Form.Label>
                            </Col>
                          </Row>
                          <Row
                            className="mt-3 "
                            style={{ marginBottom: "40px" }}
                          >
                            <Col lg={3}>
                              {/* <div className='select_entry1'>
                                                        <Form.Select aria-label="Default select example" className='modal-select'
                                                            name="companyservice" value={formData.companyservice} onChange={handleChange}
                                                        >
                                                            <option value="None selected" disabled>None selected</option>
                                                            <option value="Company A">Company A</option>
                                                            <option value="Company B">Company B</option>
                                                        </Form.Select>
                                                        {errors.companyservice && <div className="text-danger error-ui">{errors.companyservice}</div>}
                                                    </div> */}
                              <div
                                className="Selfmade-dropdown "
                                style={{ width: "100%" }}
                              >
                                <div
                                  className="Selfmadedropdown-btn "
                                  onClick={() =>
                                    toggleDropdown("companyservice2")
                                  }
                                >
                                  {selectedcompanyservice2 || t("--Select-- ")}

                                  <div>
                                    <Dropdownicon
                                      style={{ height: "10px", width: "10px" }}
                                    />
                                  </div>
                                </div>
                                {openDropdown === "companyservice2" && (
                                  <div className="Selfmadedropdown-content">
                                    {[
                                      { type: "Company A", value: 1 },
                                      { type: "Company B", value: 2 },
                                    ]?.map((number) => (
                                      <a
                                        key={number._id}
                                        onClick={() =>
                                          handleSelection(
                                            "companyservice2",
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
                                {errors.companyservice2 && (
                                  <div className="text-danger error-ui">
                                    {errors.companyservice2}
                                  </div>
                                )}
                              </div>
                            </Col>
                            <Col lg={5}>
                              <Form.Control
                                className="search-bg"
                                name="companyname"
                                value={formData.companyname}
                                onChange={handleChange}
                              />
                              {errors.companyname && (
                                <div className="text-danger error-ui">
                                  {errors.companyname}
                                </div>
                              )}
                            </Col>
                            <Col lg={2}>
                              <Form.Control
                                className="search-bg"
                                name="companyamount"
                                value={formData.companyamount}
                                onChange={handleChange}
                              />
                              {errors.companyamount && (
                                <div className="text-danger error-ui">
                                  {errors.companyamount}
                                </div>
                              )}
                            </Col>
                            <Col lg={1}>
                              <p
                                className="firewall_modal_date invoicename"
                                style={{ margin: "5px 0px" }}
                              >
                                410&nbsp;€
                              </p>
                            </Col>
                            <Col lg={1} className="table_edit">
                              <div>{""}</div>
                              <button
                                className="ms-1"
                                onClick={openDeletemodal}
                              >
                                <Delete_logo
                                  width={14}
                                  height={14}
                                  className="edithover"
                                />
                              </button>
                            </Col>
                          </Row>
                          <Row style={{ marginBottom: "25px" }}>
                            <Col lg={3}>
                              {/* <div className='select_entry1'>
                                                        <Form.Select aria-label="Default select example" className='modal-select'>
                                                            <option value="None selected" disabled>None selected</option>
                                                            <option value="Company A">Company A</option>
                                                            <option value="Company B">Company B</option>
                                                        </Form.Select>
                                                    </div> */}
                              <div
                                className="Selfmade-dropdown "
                                style={{ width: "100%" }}
                              >
                                <div
                                  className="Selfmadedropdown-btn "
                                  onClick={() =>
                                    toggleDropdown("companyservice")
                                  }
                                >
                                  {selectedcompanyservice || t("--Select-- ")}

                                  <div>
                                    <Dropdownicon
                                      style={{ height: "10px", width: "10px" }}
                                    />
                                  </div>
                                </div>
                                {openDropdown === "companyservice" && (
                                  <div className="Selfmadedropdown-content">
                                    {[
                                      { type: "Company A", value: 1 },
                                      { type: "Company B", value: 2 },
                                    ]?.map((number) => (
                                      <a
                                        key={number._id}
                                        onClick={() =>
                                          handleSelection(
                                            "companyservice",
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
                                {errors.companyservice && (
                                  <div className="text-danger error-ui">
                                    {errors.companyservice}
                                  </div>
                                )}
                              </div>
                            </Col>
                            <Col lg={5}>
                              <Form.Control className="search-bg" />
                            </Col>
                            <Col lg={2}>
                              <Form.Control className="search-bg" />
                            </Col>
                            <Col lg={1}>
                              <p className="firewall_modal_date invoicename">
                                {" "}
                                410&nbsp;€
                              </p>
                            </Col>
                            <Col lg={1} className="table_edit">
                              <div>{""}</div>
                              <button
                                className="ms-1"
                                onClick={openDeletemodal}
                              >
                                <Delete_logo
                                  width={14}
                                  height={14}
                                  className="edithover"
                                />
                              </button>
                            </Col>
                          </Row>
                          <button
                            className="add_new mt-3 mb-1"
                            onClick={handleClose}
                            style={{ marginLeft: "-9px" }}
                          >
                            {t("+ Add new")}
                          </button>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="link1">
                        <FeaturesTab
                          featuresData={featuresData}
                          setFeaturesData={setFeaturesData}
                          Nexttab={Nexttab}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="link2"></Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </div>
          <div
            className="d-flex justify-content-end me-4"
            style={{ marginBottom: "37px", marginRight: "33px" }}
          >
            <button className="btn_cancel me-2" onClick={handleClose}>
              {t("Cancel")}
            </button>
            <button className="btn_save" onClick={handleSave}>
              {t("Save")}
            </button>
          </div>
        </div>
      </Modal>
      {deletemodal && (
        <DeleteModal
          border="1px solid var(--main-lightdarkthemeborder-color)"
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={DeleteItem}
        />
      )}
    </>
  );
}
export default InvoiceModal;
