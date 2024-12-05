import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Cookies from "js-cookie";
import { getapiAll, postapiAll } from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import CustomDropDown from "../CustomDropDown";
import { useTranslation } from "react-i18next";
import config from "../../config";
import ConstantConfig, { pstn } from "../ConstantConfig";
import DestinationDropdown from "../DestinationDropdown";
import CustomTooltipModal from "../CustomTooltipModal";
import OutboundDropDown from "../OutboundDropDown";

function PstnModal({
  handleClose,
  show,
  header,
  handlesavedata,
  formData,
  setFormData,
  loader,
  checkboxStates,
  setCheckboxStates,
  allDropdown,
  mode,
}) {
  const { t } = useTranslation();
  const getCompanyListAPi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_COMPANY_LIST}`;

  const Token = Cookies.get("Token");
  const [trunkname, setrunkname] = useState([]);
  const [companylist, setcompanylist] = useState([]);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const number_pool_minimum_length = 3;
  const number_pool_maximum_length = 15;

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

  useEffect(() => {
    if (show) {
      setErrors({});
      setFormData({
        destination_number: "",
        Domain: "",
        range: "",
        gateway_id: "",
        Number: "",
      });
      setCheckboxStates({
        Enabled: false,
      });
    }
  }, [show]);

  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxStates((prevState) => ({
      ...prevState,
      [id]: checked ? true : false,
    }));
  };

  const handleSelection = (dropdown, value) => {
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    handleChange(syntheticEvent);
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };
      if (dropdown === "Action") {
        updatedFormData.Action = value.name;
        updatedFormData.App = value.app;
        updatedFormData.Data = value.data;
      }
      return updatedFormData;
    });
    setOpenDropdown(null);
  };

  const validateForm = (name, value) => {
    let valid = true;
    const newErrors = {};
    if (!value || !String(value).trim()) {
      newErrors[name] = `${t(name.replace(/_/g, " "))} ${t("is required")}`;
      valid = false;
    }
    if (mode === "add" || mode === "edit") {
      const { destination_number, range } = formData;
      if (!destination_number || !String(destination_number).trim()) {
        newErrors.destination_number = t("Destination number is required");
        valid = false;
      }

      const regex = ConstantConfig.PSTN.DESTINATION_NUM;
      if (destination_number && !regex.test(destination_number)) {
        newErrors.destination_number = t(
          "Only numbers and an optional plus sign at the start are allowed."
        );
        valid = false;
      } else if (
        destination_number.length < number_pool_minimum_length ||
        destination_number.length > number_pool_maximum_length
      ) {
        newErrors.destination_number = t(
          "Destination number must be between 3 and 15 digits long."
        );
        valid = false;
      }

      if (range && !regex.test(range)) {
        newErrors.destination_number = t("Range must be a valid number.");
        valid = false;
      } else if (
        range.length < number_pool_minimum_length ||
        range.length > number_pool_maximum_length
      ) {
        newErrors.destination_number = t("Range must be between 3 and 15 digits long.");
        valid = false;
      }

      const sanitizedDestinationNumber = destination_number.replace(/\D/g, "");
      const sanitizedRange = range.replace(/\D/g, "");

      const start = parseInt(sanitizedDestinationNumber, 10);
      const end = parseInt(sanitizedRange, 10);

      if (start && end) {
        const difference = Math.abs(end - start);
        if (
          destination_number.length < number_pool_minimum_length ||
          destination_number.length > number_pool_maximum_length
        ) {
          newErrors.destination_number = t("Range must be between 3 and 15 digits long.");
          valid = false;
        } else if (
          range.length < number_pool_minimum_length ||
          range.length > number_pool_maximum_length
        ) {
          newErrors.destination_number = t("Range must be between 3 and 15 digits long.");
          valid = false;
        } else if (difference >= 100) {
          newErrors.destination_number = t("The difference between numbers must be less than 100.");
          valid = false;
        } else if (destination_number >= range) {
          newErrors.destination_number = t(
            "The second number must always be greater than the first number."
          );
          valid = false;
        } else {
          newErrors.destination_number = "";
        }
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
        (key === "Number" && mode === "add") ||
        ((key === "destination_number" || key === "range") && mode === "edit")
      ) {
        continue;
      } else if (!validateForm(key, formData[key])) {
        isValid = false;
      }
    }
    if (isValid) {
      handlesavedata();
    }
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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
    let valid = true;
    const newErrors = {};
    if (!value || !String(value).trim()) {
      newErrors[name] = `${name.replace(/_/g, " ")} is required`;
      valid = false;
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
                borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
                padding: "0px 7px",
              }}
            >
              <Row className="mb-3">
                <Col lg={mode === "edit" ? 4 : 3}>
                  <Form.Label className="modal-head" style={{ marginLeft: "6px" }}>
                    {t("Provider")}
                    <CustomTooltipModal
                      tooltip={t("Select the Gateway to use with this outbound route.")}
                    />
                  </Form.Label>
                  <OutboundDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={formData.gateway_id}
                    openDropdown={openDropdown}
                    valueArray={data}
                    handleSelection={handleSelection}
                    name={"gateway_id"}
                    defaultValue={t("None selected")}
                    mapValue={ConstantConfig.OUTBOUND.TRUNK_SELECT.MAPVALUE}
                    storeValue={ConstantConfig.OUTBOUND.TRUNK_SELECT.STOREVALUE}
                    setOpenDropdown={setOpenDropdown}
                  />
                  {errors.gateway_id && (
                    <div className="text-danger error-ui">{errors.gateway_id}</div>
                  )}
                </Col>
                {mode === "edit" ? (
                  formData && formData.Number && formData.Number.includes("-") ? (
                    <Col lg={4}>
                      <Form.Label className="modal-head">
                        {t("Number pool")}
                        <CustomTooltipModal tooltip={t("Please enter PSTN number pool range")} />
                      </Form.Label>
                      <div className="d-flex align-items-center justify-content-between">
                        <Form.Control
                          className="input_padding search-bg"
                          name="destination_number"
                          value={formData.destination_number}
                          onChange={handleChange}
                          onKeyPress={handleKeyPress}
                        />
                        <div className="px-2">-</div>
                        <Form.Control
                          className="input_padding search-bg"
                          name="range"
                          value={formData.range}
                          onChange={handleChange}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      {errors.destination_number && (
                        <div className="text-danger error-ui">{errors.destination_number}</div>
                      )}
                    </Col>
                  ) : (
                    <Col lg={4}>
                      <Form.Label className="modal-head">{t("Number")}</Form.Label>
                      <Form.Control
                        className="input_padding search-bg"
                        name="Number"
                        value={formData.Number}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                      />
                      {errors.Number && <div className="text-danger error-ui">{errors.Number}</div>}
                    </Col>
                  )
                ) : (
                  <Col lg={6}>
                    <Form.Label className="modal-head">
                      {t("Number pool")}
                      <CustomTooltipModal tooltip={t("Please enter PSTN number pool range")} />
                    </Form.Label>
                    <div className="d-flex align-items-center justify-content-between">
                      <Form.Control
                        className="input_padding search-bg"
                        name="destination_number"
                        value={formData.destination_number}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                      />
                      <div className="px-2">-</div>
                      <Form.Control
                        className="input_padding search-bg"
                        name="range"
                        value={formData.range}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    {errors.destination_number && (
                      <div className="text-danger error-ui">{errors.destination_number}</div>
                    )}
                  </Col>
                )}
                <Col lg={mode == "edit" ? 4 : 3}>
                  <Form.Label className="modal-head" style={{ marginLeft: "6px" }}>
                    {t("Company")}
                  </Form.Label>
                  <CustomDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={formData.Domain}
                    openDropdown={openDropdown}
                    valueArray={companylist}
                    handleSelection={handleSelection}
                    name={"Domain"}
                    defaultValue={t("None selected")}
                    mapValue={"company_name"}
                    storeValue={"_id"}
                    setOpenDropdown={setOpenDropdown}
                    sorting={true}
                  />
                  {errors.Domain && <div className="text-danger error-ui">{errors.Domain}</div>}
                </Col>
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

export default PstnModal;
