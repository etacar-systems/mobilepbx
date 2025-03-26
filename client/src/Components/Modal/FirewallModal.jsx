import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { getapiAll, postapiAll } from "../../Redux/Reducers/ApiServices";
import Spinner from "react-bootstrap/Spinner";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../config";
import CustomTooltipModal from "../CustomTooltipModal";
import CustomDropDown from "../CustomDropDown";
import ConstantConfig, { isassignlist } from "../ConstantConfig";
function FirewallModal({
  handleClose,
  show,
  header,
  handledatasave,
  formData,
  setFormData,
  loader,
  mode,
  Diaplydate,
}) {
  const getCompanyListAPi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_COMPANY_LIST}`;
  const { t } = useTranslation();
  const Token = Cookies.get("Token");
  const selectStyle = {
    backgroundColor: `var(--main-fordarkthemeborderonlt-color)`,
  };
  const [openDropdown, setOpenDropdown] = useState(null);
  const [data, setdata] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.COMPANY_LIST,
        Token: Token,
        urlof: config.COMPANY_LIST_KEY,
      })
    ).then((res) => {
      if (res.payload.response) {
        setdata(res?.payload?.response?.comnayNameList);
      }
    });
  }, [mode]);
  useEffect(() => {
    if (show) {
      setErrors({});
      setFormData({
        Description: "",
        Assigned_Zone: "",
        Network: "",
        cid: "",
      });
    }
  }, [show]);

  const [errors, setErrors] = useState({});
  const validateForm = (name, value) => {
    let valid = true;
    const newErrors = {};
    const regex = {
      node_cidr:
        mode === "add"
          ? /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/
          : /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\/(3[0-2]|[1-2]?[0-9]))?$/,
    };

    if (typeof value === "string") {
      value = value.trim();
    }

    if (!value) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
      valid = false;
    } else if (regex[name] && typeof value === "string" && !regex[name].test(value)) {
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
      handledatasave();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    if (!value || !value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.replace(/_/g, " ")} ${t("is required")}`,
      }));
    }
  };

  const date = new Date();
  const formattedDate2 = `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${date.getFullYear()}`;
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

    setOpenDropdown(null);
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
                borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <Row style={{ marginBottom: "37px" }}>
                <Col lg={2}>
                  <Form.Label className="modal-head fmodal">{t("Network/Host")}</Form.Label>
                  <div className="fmodal">
                    <Form.Control
                      className="input_padding search-bg "
                      name="Network"
                      value={formData.Network}
                      onChange={handleChange}
                    />
                    {errors.Network && <div className="text-danger error-ui">{errors.Network}</div>}
                  </div>
                </Col>
                <Col lg={3}>
                  <Form.Label className="modal-head fmodal" style={{ marginBottom: "30px" }}>
                    {t("Add Assigned Zone	")}
                  </Form.Label>

                  <CustomDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={formData?.Assigned_Zone}
                    openDropdown={openDropdown}
                    valueArray={isassignlist}
                    handleSelection={handleSelection}
                    name={"Assigned_Zone"}
                    defaultValue={t("None selected")}
                    mapValue={"name"}
                    storeValue={"name"}
                    setOpenDropdown={setOpenDropdown}
                    sorting={true}
                  />
                  {errors.Assigned_Zone && (
                    <div className="text-danger error-ui">{errors.Assigned_Zone}</div>
                  )}
                </Col>
                <Col lg={3}>
                  <Form.Label className="modal-head fmodal  " style={{ marginBottom: "30px" }}>
                    {t("Select Company")}
                  </Form.Label>
                  <CustomDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={formData.cid}
                    openDropdown={openDropdown}
                    valueArray={data}
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

                <Col lg={2}>
                  <Form.Label className="modal-head fmodal">{t("Description")} </Form.Label>
                  <div className="fmodal">
                    <Form.Control
                      className="input_padding search-bg "
                      name="Description"
                      value={formData.Description}
                      onChange={handleChange}
                    />
                    {errors.Description && (
                      <div className="text-danger error-ui">{errors.Description}</div>
                    )}
                  </div>
                </Col>
                <Col lg={2}>
                  <Form.Label className="modal-head fmodal">{t("Date")}</Form.Label>
                  <div className="fmodal firewalldata">
                    {Diaplydate && mode == "edit" ? Diaplydate : formattedDate2}
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
          <div
            className="d-flex justify-content-end"
            style={{ marginBottom: "35px", marginRight: "33px" }}
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
export default FirewallModal;
