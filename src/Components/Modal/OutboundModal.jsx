import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import { useTranslation } from "react-i18next";
import config from "../../config";
import CustomDropDown from "../CustomDropDown";
import ConstantConfig from "../ConstantConfig";
import OutboundDropDown from "../OutboundDropDown";
import CustomTooltipModal from "../CustomTooltipModal";
import DropDown from "../Dropdown";

function OutboundModal({
  handleClose,
  show,
  header,
  handedatasave,
  formData,
  setFormData,
  loader,
}) {
  const { t } = useTranslation();
  const Token = Cookies.get("Token");
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [companylist, setcompanylist] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [matchPattern, setMatchPattern] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  const oredrNumber = [
    "100",
    "110",
    "120",
    "130",
    "140",
    "150",
    "160",
    "170",
    "180",
    "190",
    "200",
    "210",
    "220",
    "230",
    "240",
    "250",
    "260",
    "270",
    "280",
    "290",
    "300",
  ];

  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.OUTBOUND.PATTERN,
        Token: Token,
        urlof: config.OUTBOUND_KEY.PATTERN,
      })
    ).then((res) => {
      if (res?.payload?.response) {
        setMatchPattern(
          res?.payload?.response?.data?.dialplan_expression || {}
        );
      } else {
        console.log(res, "error");
      }
    });
  }, [dispatch, Token]);

  useEffect(() => {
    if (show) {
      setErrors({});
      setFormData({
        prefix: "",
        gateway_id: "",
        expression_detail: "",
        prepend: "",
      });
    }
  }, [show]);

  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.TRUNK.NAME_LIST,
        Token: Token,
        urlof: config.TRUNK_KEY.NAME_LIST,
      })
    ).then((res) => {
      if (res) {
        setData(res?.payload?.response?.data);
      }
    });
  }, [dispatch, Token]);

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

  const validateForm = (name, value) => {
    let valid = true;
    const newErrors = {};
    const regex = {
      prefix: "",
      cid: "",
      outbound_name: "",
      prepend: "",
      expression_detail: "",
    };
    if (
      (!value || !String(value).trim()) &&
      name !== "prepend" &&
      name !== "prefix" &&
      name !== "outbound_name"
    ) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
      valid = false;
    } else if (regex[name] && !regex[name].test(value)) {
      newErrors[name] = `${t("Invalid")} ${t(name.replace(/_/g, " "))}`;
      valid = false;
    } else if (name === "expression_detail") {
      const pattern = /^x+$/;
      if (!pattern.test(value)) {
        newErrors[name] =
          "Pattern must contain only 'x' characters (e.g., 'x', 'xx', 'xxx').";
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
        key == "dialplanoutbound_enabled" ||
        key == "gateway_2" ||
        key == "gateway_3" ||
        key == "description"
      ) {
        continue;
      }
      if (!validateForm(key, formData[key])) {
        isValid = false;
      }
    }
    if (isValid) {
      handedatasave();
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    console.log(name, value, checked, "namecheck");
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
    if (
      name !== "description" ||
      name !== "prefix" ||
      (name !== "prepend" && name !== "outbound_name")
    ) {
      validateForm(name, value);
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
              <Row className="mb-3 ">
                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Prepend")}
                    <CustomTooltipModal
                      tooltip={t("Enter the outbound name here.")}
                    />
                  </Form.Label>
                  <Form.Control
                    className="input_padding search-bg"
                    name="prepend"
                    value={formData.prepend}
                    onChange={handleChange}
                  />
                  {errors.prepend && (
                    <div className="text-danger error-ui">{errors.prepend}</div>
                  )}
                </Col>

                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Prefix")}
                    <CustomTooltipModal
                      tooltip={t(
                        "Enter the prifix number to add to the beginning of the destination number."
                      )}
                    />
                  </Form.Label>
                  <Form.Control
                    className="input_padding search-bg"
                    name="prefix"
                    value={formData.prefix}
                    onChange={handleChange}
                  />
                  {errors.prefix && (
                    <div className="text-danger error-ui">{errors.prefix}</div>
                  )}
                </Col>

                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Match pattern")}
                    <CustomTooltipModal
                      tooltip={t(
                        "Shortcut to create the outbound dialplan entries for the Gateway."
                      )}
                    />
                  </Form.Label>
                  <Form.Control
                    className="input_padding search-bg"
                    name="expression_detail"
                    value={formData.expression_detail}
                    onChange={handleChange}
                  />
                  {errors.expression_detail && (
                    <div className="text-danger error-ui">
                      {errors.expression_detail}
                    </div>
                  )}
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Label
                    className="modal-head"
                    style={{ marginLeft: "6px" }}
                  >
                    {t("Select trunk")}
                    <CustomTooltipModal
                      tooltip={t(
                        "Select the Gateway to use with this outbound route."
                      )}
                    />
                  </Form.Label>
                  <OutboundDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={formData.gateway_id}
                    openDropdown={openDropdown}
                    valueArray={data}
                    handleSelection={handleSelection}
                    name={"gateway_id"}
                    defaultValue={t("-- Select trunk --")}
                    mapValue={ConstantConfig.OUTBOUND.TRUNK_SELECT.MAPVALUE}
                    storeValue={ConstantConfig.OUTBOUND.TRUNK_SELECT.STOREVALUE}
                    setOpenDropdown={setOpenDropdown}
                  />
                  {errors.gateway_id && (
                    <div className="text-danger error-ui">
                      {errors.gateway_id}
                    </div>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
          <div
            className="d-flex justify-content-end "
            style={{ marginBottom: "35px", marginRight: "33px" }}
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

export default OutboundModal;
