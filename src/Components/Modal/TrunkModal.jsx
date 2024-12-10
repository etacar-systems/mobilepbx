import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Nav, Tab } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import CustomDropDown from "../CustomDropDown";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import config from "../../config";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import ConstantConfig, { trunkTransport } from "../ConstantConfig";
import CustomTooltipModal from "../CustomTooltipModal";
import DropDown from "../Dropdown";

function TrunkModal({ handleClose, show, header, loader, handlesavedata, formData, setFormData }) {
  const { t } = useTranslation();
  // STATE
  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [companylist, setcompanylist] = useState([]);
  const dispatch = useDispatch();
  const Token = Cookies.get("Token");
  // EFFECT
  useEffect(() => {
    if (show) {
      setErrors({});
      setFormData({
        gateway_name: "",
        cid: "",
        Secret: "",
        password: "",
        realm: "",
        proxy: "",
        description: "",
        transport: "",
      });
    }
  }, [show]);

  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.COMPANY_LIST,
        Token: Token,
        urlof: config.COMPANY_LIST_KEY,
      })
    ).then((res) => {
      if (res.payload.response) {
        setcompanylist(res?.payload?.response?.comnayNameList);
      }
    });
  }, [dispatch, Token]);

  // FUNCTIONS
  const validateForm = (name, value) => {
    let valid = true;
    const newErrors = {};
    const regex = {
      gateway_name: "",
      cid: "",
      Secret: "",
      password: "",
      realm: ConstantConfig.TRUNKS.VALIDATION.PROXY,
      proxy: ConstantConfig.TRUNKS.VALIDATION.PROXY,
      description: "",
      transport: "",
    };

    if (!value || !String(value).trim()) {
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
      if (key === "gateway_enabled") {
        continue;
      }
      if (key === "register") {
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
    validateForm(name, value);
  };

  const handleKeyPress = (e) => {
    if (e.key < "0" || e.key > "9") {
      e.preventDefault();
    }
  };
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const handleSelection = (dropdown, value) => {
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    handleChange(syntheticEvent);

    setOpenDropdown(null); // Close the dropdown after selection
  };

  return (
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
          <div
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
            }}
          >
            <Tab.Container defaultActiveKey="/home">
              <Row style={{ marginBottom: "17px" }}>
                <Col sm={12}>
                  <Nav variant="pills" className="flex-row tabs_border">
                    <Nav.Item>
                      <Nav.Link eventKey="/home" className="nav-link2">
                        {t("General")}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={12}>
                  <Tab.Content style={{ margin: "0 20px" }}>
                    <Tab.Pane eventKey="/home">
                      <Form>
                        <Row className="mt-3">
                          <Col lg={4}>
                            <Form.Label className="modal-head">
                              {t("Trunk name")}
                              <CustomTooltipModal tooltip={t("Enter the gateway name here.")} />
                            </Form.Label>
                            <Form.Control
                              className="search-bg"
                              name="gateway_name"
                              value={formData.gateway_name}
                              onChange={handleChange}
                            />
                            {errors.gateway_name && (
                              <div className="text-danger error-ui ">{errors.gateway_name}</div>
                            )}
                          </Col>
                          <Col lg={4}>
                            <Form.Label className="modal-head">
                              {t("Description")}
                              <CustomTooltipModal tooltip={t("Enter the description.")} />
                            </Form.Label>
                            <Form.Control
                              className="search-bg"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                            />
                            {errors.description && (
                              <div className="text-danger error-ui">{errors.description}</div>
                            )}
                          </Col>
                          <Col lg={4} className="mt-2">
                            <Form.Label className="modal-head">
                              {t("Username")}
                              <CustomTooltipModal tooltip={t("Enter the password here.")} />
                            </Form.Label>
                            <Form.Control
                              className="search-bg"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              autocomplete="new-password"
                            />
                            {errors.password && (
                              <div className="text-danger error-ui">{errors.password}</div>
                            )}
                          </Col>
                          <Col lg={4}>
                            <Form.Label className="modal-head">
                              {t("Password")}
                              <CustomTooltipModal tooltip={t("Enter the username here.")} />
                            </Form.Label>
                            <Form.Control
                              className="search-bg"
                              name="Secret"
                              value={formData.Secret}
                              onChange={handleChange}
                            />
                            {errors.Secret && (
                              <div className="text-danger error-ui">{errors.Secret}</div>
                            )}
                          </Col>
                          <Col lg={4} className="mt-2">
                            <Form.Label className="modal-head">
                              {t("Realm")}
                              <CustomTooltipModal tooltip={t("Enter the realm here.")} />
                            </Form.Label>
                            <Form.Control
                              className="search-bg"
                              name="realm"
                              value={formData.realm}
                              onChange={handleChange}
                            />
                            {errors.realm && (
                              <div className="text-danger error-ui">{errors.realm}</div>
                            )}
                          </Col>
                          <Col lg={4} className="mt-2">
                            <Form.Label className="modal-head">
                              {t("proxy")}
                              <CustomTooltipModal tooltip={t("Enter the proxy here.")} />
                            </Form.Label>
                            <Form.Control
                              className="search-bg"
                              name="proxy"
                              value={formData.proxy}
                              onChange={handleChange}
                            />
                            {errors.proxy && (
                              <div className="text-danger error-ui">{errors.proxy}</div>
                            )}
                          </Col>
                          <Col lg={4} className="mt-2">
                            <Form.Label className="modal-head" style={{ marginLeft: "6px" }}>
                              {t("Context")}
                              <CustomTooltipModal tooltip={t("Please select domain here.")} />
                            </Form.Label>
                            <CustomDropDown
                              toggleDropdown={toggleDropdown}
                              showValue={formData.cid}
                              openDropdown={openDropdown}
                              valueArray={companylist}
                              handleSelection={handleSelection}
                              name={"cid"}
                              defaultValue={t("None selected")}
                              mapValue={ConstantConfig.TRUNKS.COMPANY_SELECT.MAPVALUE}
                              storeValue={ConstantConfig.TRUNKS.COMPANY_SELECT.STOREVALUE}
                              setOpenDropdown={setOpenDropdown}
                              sorting={true}
                            />
                            {errors.cid && <div className="text-danger error-ui">{errors.cid}</div>}
                          </Col>
                          <Col lg={4} className="mt-2">
                            <Form.Label className="modal-head">
                              {t("Transport")}
                              <CustomTooltipModal tooltip={t("Enter the proxy here.")} />
                            </Form.Label>
                            <DropDown
                              toggleDropdown={toggleDropdown}
                              showValue={formData.transport}
                              openDropdown={openDropdown}
                              valueArray={trunkTransport}
                              handleSelection={handleSelection}
                              name={"transport"}
                              defaultValue={t("None selected")}
                              setOpenDropdown={setOpenDropdown}
                            />
                            {errors.transport && (
                              <div className="text-danger error-ui">{errors.transport}</div>
                            )}
                          </Col>
                        </Row>
                      </Form>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </div>
        <div
          className="mb-4 d-flex justify-content-end "
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
  );
}

export default TrunkModal;
