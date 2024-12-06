import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";
import CustomTooltipModal from "../CustomTooltipModal";
import { useDispatch } from "react-redux";
import config from "../../config";
import { getapiAll, postapiAll, putapiall } from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import { TypeInnumber } from "../ConstantConfig";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

function NumberModal({
  handleClose,
  show,
  header,
  mode,
  setsaveLoading,
  setsavedata,
  setCurrentPage,
  savedata,
  editsvalues,
  loader,
  editId,
}) {
  const { t } = useTranslation();
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const Token = Cookies.get("Token");
  const Domainname = Cookies.get("domain_name");
  const [getPstnNumber, setPstneNumber] = useState([]);
  const [apidropdown, setApidropdown] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState({});
  const [filteredList, setFilteredList] = useState([]);
  const [selectType, setSelectType] = useState({});
  const [selectExtension, setSelectExtension] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [errors, setErrors] = useState({});

  const handleNumberClick = (number) => {
    setSelectedNumber((prevState) => ({
      ...prevState,
      id: number._id,
      display: number.destination,
    }));
    setOpenDropdown(null);
    setErrors((prev) => ({ ...prev, number: "" }));
  };

  const handleSelectType = (number) => {
    setSelectType((prevState) => ({
      ...prevState,
      id: number.value,
      display: number.type,
    }));
    setOpenDropdown(null);
    setSelectExtension({});
    setErrors((prev) => ({ ...prev, Type: "" }));
  };

  const handleSelectExtension = (number) => {
    const numbersdata = number.extension + " " + "XML" + " " + Domainname;
    setSelectExtension((prevState) => ({
      ...prevState,
      id: number.data || numbersdata,
      display: number.extension || number.name,
      uuid: number.uuid,
      app: number.app,
    }));
    setOpenDropdown(null);
    setErrors((prev) => ({ ...prev, Destination: "" }));
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

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  useEffect(() => {
    if (mode === "edit" && editsvalues) {
      setSelectedNumber({
        id: editsvalues._id,
        display: editsvalues.destination,
      });
      setSelectType({
        id: editsvalues.select_type?.toString(),
        display: TypeInnumber.find((t) => t.value == editsvalues.select_type)?.type || "",
      });

      if (Array.isArray(editsvalues.destination_action) && editsvalues.destination_action[0]) {
        setSelectExtension({
          id: editsvalues?.destination_action[0]?.destination_data,
          display:
            editsvalues?.select_type == 5
              ? editsvalues?.select_type_data?.select_name
              : editsvalues?.select_type_data?.select_extension,
          uuid: editsvalues?.select_type_uuid,
          app: editsvalues?.destination_action[0]?.destination_app,
        });
      }
    } else if (mode == "add" && editsvalues) {
      setSelectedNumber({
        id: editsvalues?._id,
        display: editsvalues?.destination,
      });
    }
  }, [mode, editsvalues]);

  useEffect(() => {
    setsaveLoading(true);
    dispatch(
      getapiAll({
        Api: config.PSTN_NUMBER.EXTENSION_LIST,
        Token: Token,
        urlof: config.PSTN_NUMBER_KEY.EXTENSION_LIST,
      })
    ).then((res) => {
      if (res && res.payload && res.payload.response) {
        setsaveLoading(false);
        setPstneNumber(res.payload.response.PstnList);
      }
    });
  }, [dispatch, Token]);

  useEffect(() => {
    if (selectType?.id) {
      setsaveLoading(true);
      const data = {
        select_type: selectType?.id,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.NUMBERSDROPDOWN,
          Token: Token,
          urlof: config.NUMBERSDROPDOWNKEY,
        })
      ).then((res) => {
        if (res) {
          setFilteredList(res?.payload?.response?.data);
          setsaveLoading(false);
        }
      });
    }
  }, [selectType]);
  useEffect(() => {
    switch (selectType.id) {
      case "1": // IVR
        setFilteredList(apidropdown?.ivr_menus);
        break;
      case "2": // Ring groups
        setFilteredList(apidropdown?.ring_groups);
        break;
      case "3": // Extension
        setFilteredList(apidropdown?.extensions);
        break;
      case "4": // Conferences
        setFilteredList(apidropdown?.conference);
        break;
      case "5": // System recordings
        setFilteredList(apidropdown?.recordings);
        break;
      case "6": // Time Condition
        setFilteredList(apidropdown?.timeconditions);
        break;
      default:
        setFilteredList([]); // Default case, empty the list or handle as needed
        break;
    }
    if (mode == "add") {
      setSelectExtension("");
    }
  }, [selectType, apidropdown]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!selectedNumber?.id) {
      newErrors.number = t("Number is required");
      valid = false;
    }
    if (!selectType?.id) {
      newErrors.Type = t("Type is required");
      valid = false;
    }
    if (!selectExtension.id) {
      newErrors.Destination = t("Destination is required");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validateForm()) {
      const listvalues = {
        destination_action: [
          {
            destination_app: "transfer",
            destination_data: selectExtension.id,
          },
        ],
        pstn_id: selectedNumber.id,
        select_type_uuid: selectExtension.uuid,
        select_type: +selectType.id,
        ...(mode == "edit" && { number_id: editId }),
      };
      if (mode == "add") {
        setsaveLoading(true);
        dispatch(
          postapiAll({
            inputData: listvalues,
            Api: config.NUMBER.ADD,
            Token: Token,
            urlof: config.NUMBER_KEY.ADD,
          })
        ).then((res) => {
          if (res?.payload?.response) {
            setsaveLoading(false);
            handleClose();
            setsavedata(!savedata);
            setCurrentPage(1);
            toast.success(t(res.payload.response.message), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
          } else {
            if (res?.payload?.error) {
              toast.error(t(res.payload.error.response.data.message), {
                autoClose: config.TOST_AUTO_CLOSE,
              });
              setsaveLoading(false);
            }
          }
        });
      }
      if (mode === "edit") {
        setsaveLoading(true);
        dispatch(
          putapiall({
            inputData: listvalues,
            Api: config.NUMBER.UPDATE,
            Token: Token,
            urlof: config.NUMBER_KEY.UPDATE,
          })
        ).then((res) => {
          if (res?.payload?.response) {
            setsaveLoading(false);
            handleClose();
            setsavedata(!savedata);
            setCurrentPage(1);
            toast.success(t(res.payload.response.message), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
          } else {
            if (res?.payload?.error) {
              toast.error(t(res.payload.error.response.data.message), {
                autoClose: config.TOST_AUTO_CLOSE,
              });
              setsaveLoading(false);
            }
          }
        });
      }
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
              }}
            >
              <Row style={{ marginBottom: "30px" }} ref={dropdownRef}>
                <Col lg={4}>
                  <Form.Label className="modal-head">{t("Select number")}</Form.Label>
                  <div className="Selfmade-dropdown">
                    <div className="Selfmadedropdown-btn" onClick={() => toggleDropdown("number")}>
                      {selectedNumber.display || t("None selected")}
                      <div>
                        <Dropdownicon />
                      </div>
                    </div>
                    {openDropdown === "number" && (
                      <div className="Selfmadedropdown-content">
                        {getPstnNumber && getPstnNumber.length > 0 ? (
                          <>
                            {[...getPstnNumber]
                              .sort((a, b) => a.destination - b.destination)
                              .map((number) => (
                                <a key={number} onClick={() => handleNumberClick(number)}>
                                  {number.destination}
                                </a>
                              ))}
                          </>
                        ) : (
                          <div>{t("No Record")}</div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.number && <p className="text-danger error-ui">{errors.number}</p>}
                </Col>

                <Col lg={4}>
                  <Form.Label className="modal-head">
                    {t("Select type")}
                    <CustomTooltipModal tooltip={t("Select the type")} />
                  </Form.Label>
                  <div className="Selfmade-dropdown">
                    <div className="Selfmadedropdown-btn" onClick={() => toggleDropdown("type")}>
                      {t(selectType.display) || t("None selected")}
                      <div>
                        <Dropdownicon />
                      </div>
                    </div>
                    {openDropdown === "type" && (
                      <div className="Selfmadedropdown-content">
                        {TypeInnumber && TypeInnumber.length > 0 ? (
                          <>
                            {" "}
                            {TypeInnumber.sort((a, b) => a.type.localeCompare(b.type)).map(
                              (type) => (
                                <a key={type} onClick={() => handleSelectType(type)}>
                                  {/* {type.value == "3" ? "" : type.type} */}
                                  {t(type.type)}
                                </a>
                              )
                            )}
                          </>
                        ) : (
                          <div>{t("No Record")}</div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.Type && <p className="text-danger error-ui">{errors.Type}</p>}
                </Col>

                <Col lg={4}>
                  <Form.Label className="modal-head">{t("Select destination")}</Form.Label>
                  <div className="Selfmade-dropdown">
                    <div
                      className="Selfmadedropdown-btn"
                      onClick={() => toggleDropdown("destination")}
                    >
                      {selectExtension.display || t("None selected")}
                      <div>
                        <Dropdownicon />
                      </div>
                    </div>
                    {openDropdown === "destination" && (
                      <div className="Selfmadedropdown-content">
                        {editsvalues.select_type == selectType.id && filteredList && (
                          <a
                            onClick={() =>
                              handleSelectExtension({
                                _id: editsvalues.select_type_data.select_id,
                                extension:
                                  editsvalues?.select_type == 5
                                    ? editsvalues.select_type_data.select_name
                                    : editsvalues.select_type_data.select_extension,
                                uuid: editsvalues?.select_type_uuid,
                                name: editsvalues.select_type_data.select_name,
                              })
                            }
                          >
                            {editsvalues?.select_type == 5
                              ? editsvalues?.select_type_data?.select_name
                              : editsvalues?.select_type_data?.select_extension}
                          </a>
                        )}
                        {filteredList && filteredList.length > 0 ? (
                          <>
                            {" "}
                            {filteredList
                              ?.sort((a, b) => a.name.localeCompare(b.name))
                              .map((destination) => {
                                return (
                                  <a onClick={() => handleSelectExtension(destination)}>
                                    {destination?.extension || destination?.name}
                                  </a>
                                );
                              })}
                          </>
                        ) : (
                          <div>
                            {" "}
                            {mode == "edit" && editsvalues.select_type == selectType.id && !loader
                              ? ""
                              : t("No Record")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.Destination && (
                    <p className="text-danger error-ui">{errors.Destination}</p>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
          <div
            className="d-flex justify-content-end "
            style={{ marginBottom: "37px", marginRight: "33px" }}
          >
            <button className="btn_cancel me-2" onClick={handleClose}>
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

export default NumberModal;
