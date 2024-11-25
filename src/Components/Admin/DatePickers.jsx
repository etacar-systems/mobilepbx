import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import fi from "date-fns/locale/fi"; // Finnish locale
import Cookies from "js-cookie";
import DatePickerComponent from "./DatePickercomponent";
import { Report_fiter, Category, Reportstype } from "../ConstantConfig";
import { useDispatch } from "react-redux";
import config from "../../config";
import { getapiAll, postapiAll } from "../../Redux/Reducers/ApiServices";
import CustomDropDown from "../CustomDropDown";

// Register Finnish locale
registerLocale("fi", fi);
registerLocale("en-GB", enGB);

export default function DatePickers({
  date_picker,
  btn_name,
  btn_name_2,
  fontwidth,
  marginb,
  bgcolor,
  handlefilter,
  handlefilter2,
  // clearFilter,
  // clearFlag,
  Direction,
  setDirection,
  startDate,
  setStartDate,
  setEndDate,
  endDate,
  extension,
  selectextension,
  setselectextension,
  clear,
  setextension,
  width,
  lg,
}) {
  const { t } = useTranslation();
  const [filteredList, setFilteredList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const Token = Cookies.get("Token");
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectextension) {
      const data = {
        select_type: selectextension,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.REPORTS_DROPDOWN,
          Token: Token,
          urlof: config.REPORTS_KEY,
        })
      ).then((res) => {
        if (res) {
          setFilteredList(res?.payload?.response?.data);
        }
      });
    }
  }, [selectextension]);
  const handleDirectionChange = (e) => {
    const value = e.target.value;
    setDirection(value);
  };
  const language = Cookies.get("language");
  useEffect(() => {
    if (selectextension) {
      setFilteredList([]);
      setextension("");
    }
  }, [selectextension]);
  const clear_Filter = () => {
    if (setextension) {
      setextension("");
      setFilteredList([]);
    }
    handlefilter2();
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "selectextension") {
      setselectextension(value);
    } else if (name == "extension") {
      setextension(value);
    } else {
      setDirection(value);
    }
  };
  return (
    <>
      <div className="report_form">
        <Form>
          <Row style={{ justifyContent: !date_picker ? "end" : "" }} className={marginb}>
            {!date_picker && (
              <>
                <Col lg={2} md={4} sm={6}>
                  <Form.Label className="modal-head">{t("Select")}</Form.Label>
                  <CustomDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={selectextension}
                    openDropdown={openDropdown}
                    valueArray={Reportstype}
                    handleSelection={handleSelection}
                    name={"selectextension"}
                    defaultValue={t("None selected")}
                    mapValue={"type"}
                    storeValue={"value"}
                    setOpenDropdown={setOpenDropdown}
                    sorting={true}
                  />
                  {/* <div className="select_entry1">

                    <Form.Select
                      aria-label="Default select example"
                      className="selected-data modal-select"
                      onChange={(e) => setselectextension(e.target.value)}
                      value={selectextension || ""}
                    >
                      <option value="" disabled>
                        {t("Select")}
                      </option>
                      {Report_fiter?.map((val) => {
                        return (
                          <option value={val?.value}>{t(val?.type)}</option>
                        );
                      })}
                    </Form.Select>
                  </div> */}
                </Col>
                <Col lg={2} md={4} sm={6}>
                  <Form.Label className="modal-head">{t("Select extension")}</Form.Label>
                  <CustomDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={extension}
                    openDropdown={openDropdown}
                    valueArray={filteredList}
                    handleSelection={handleSelection}
                    name={"extension"}
                    defaultValue={t("None selected")}
                    mapValue={"extension"}
                    storeValue={"_id"}
                    setOpenDropdown={setOpenDropdown}
                    sorting={true}
                  />
                  {/* <div className="select_entry1">
                    <Form.Select
                      aria-label="Default select example"
                      className="selected-data modal-select"
                      onChange={(e) => setextension(e.target.value)}
                      value={extension || ""}
                    >
                      <option value="" disabled>
                        {t("Select")}
                      </option>
                      {filteredList?.map((val) => {
                        console.log(val, "1232132313232312323123");
                        return (
                          <option value={val?._id}>{val?.extension}</option>
                        );
                      })}
                    </Form.Select>
                  </div> */}
                </Col>
                <Col lg={2} md={4} sm={6} className="mt-2 mt-lg-0 mt-md-0">
                  <Form.Label className="modal-head">{t("Category")}</Form.Label>
                  <CustomDropDown
                    toggleDropdown={toggleDropdown}
                    showValue={Direction}
                    openDropdown={openDropdown}
                    valueArray={Category}
                    handleSelection={handleSelection}
                    name={"Direction"}
                    defaultValue={t("All")}
                    mapValue={"name"}
                    storeValue={"value"}
                    setOpenDropdown={setOpenDropdown}
                  />
                </Col>
              </>
            )}

            <Col lg={4} md={8} sm={12} className="mt-2  mt-lg-0">
              <Form.Label className="modal-head">{t("Date Picker")}</Form.Label>
              <div className="input-group">
                <div className="input-daterange input-group flex-nowrap" id="datepicker">
                  <DatePickerComponent
                    startDate={startDate}
                    selected={startDate}
                    endDate={endDate}
                    Setselected={setStartDate}
                    Borderclass="emailforminput2"
                  />
                  <span className="range">-</span>
                  <DatePickerComponent
                    startDate={endDate}
                    selected={endDate}
                    endDate={endDate}
                    Setselected={setEndDate}
                    minDate={startDate}
                    Borderclass="emailforminput"
                  />
                </div>
              </div>
            </Col>
            <Col lg={lg} md={4} sm={6} className="filter_btn mt-2  mt-lg-0">
              <Button
                style={{
                  fontWeight: fontwidth,
                  background: bgcolor,
                  width: width,
                }}
                onClick={handlefilter}
              >
                {btn_name}
              </Button>
            </Col>
            {(!date_picker || clear) && (
              <Col lg={lg} md={4} sm={6} className="filter_btn2 mt-2  mt-lg-0">
                <Button style={{ fontWeight: fontwidth, width: width }} onClick={clear_Filter}>
                  {t("Clear")}
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      </div>
    </>
  );
}
