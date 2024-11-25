import React, { useState } from "react";
import { Button, Col, Form, Row, InputGroup, FormControl } from "react-bootstrap";
import { ReactComponent as Pdf } from "../../Assets/Icon/pdf.svg";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import DatePickerComponent from "../Admin/DatePickercomponent";
import { addDays, format, startOfDay } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

registerLocale("en-GB", enGB);
function DashboardHeaderDatePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handledatefilter,
}) {
  console.log("startDate", startDate);
  console.log("endDate", endDate);
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [state, setState] = useState([
    {
      startDate: startDate ? new Date(startDate) : startOfDay(new Date()),
      endDate: endDate ? new Date(endDate) : startOfDay(addDays(new Date(), 7)),
      key: "selection",
    },
  ]);
  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  // const onClickDone = () => {
  //      onSubmit(selectedDateRange);
  //      setShow(true);
  // };

  const onClickClear = () => {
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setShowPicker(false);
  };
  const handleDateChange = (item) => {
    const { startDate, endDate } = item.selection;
    setState([item.selection]);
    setStartDate(startDate); // Update the parent state
    setEndDate(endDate); // Update the parent state
  };
  return (
    <>
      <div className="col-12 col-name p-0">
        <Form className="card" action="" method="post">
          <div className="body date_picker_container">
            <Row>
              <Col lg={6} md={12} className="col-name">
                <Form.Label className="modal-head">{t("")}</Form.Label>
                <Row>
                  <Col lg={8} md={12} className="col-name">
                    <div className="input-group">
                      <Row>
                        <Col xs={6}>
                          <InputGroup>
                            <FormControl
                              placeholder="Start Date"
                              value={format(state[0].startDate, "dd/MM/yyyy")} // Display the selected start date
                              readOnly
                              onClick={() => togglePicker()} // Open the date picker when clicked
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </InputGroup>
                        </Col>

                        <Col xs={6}>
                          <InputGroup>
                            <FormControl
                              placeholder="End Date"
                              value={format(state[0].endDate, "dd/MM/yyyy")} // Display the selected end date
                              readOnly
                              onClick={() => togglePicker()} // Open the date picker when clicked
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                      {showPicker && (
                        <div
                          className="p-2"
                          style={{
                            position: "absolute",
                            top: "60px", // Adjust the position below the input fields
                            zIndex: 1000,
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <DateRangePicker
                            date={new Date()}
                            locale={enGB}
                            onChange={handleDateChange}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={1}
                            ranges={state}
                            direction="horizontal"
                          />

                          <div className="text-right position-relative rdr-buttons-position mt-2 mr-3">
                            <button
                              className="btn btn-transparent text-primary rounded-0 px-4 mr-2"
                              onClick={(e) => {
                                e.preventDefault();
                                handledatefilter();
                                setShowPicker(false);
                              }}
                            >
                              Done
                            </button>
                            <button
                              className="btn btn-transparent text-danger rounded-0 px-4"
                              onClick={onClickClear}
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={12} className="filter_btn mt-2  mt-lg-0">
                    <Button
                      style={{ backgroundColor: "white", width: "100%" }}
                      onClick={handledatefilter}
                    >
                      {t("Search")}
                    </Button>
                  </Col>
                </Row>
              </Col>

              <div className="col-md-6 col-sm-12 col-name text-right mt-4 hidden-xs">
                <a className="p-1 text-blue pdffont" href="#">
                  <i className="fa fa-envelope mr-1"></i>
                  {t("Send to Email")}
                </a>
              </div>
            </Row>
          </div>
        </Form>
      </div>
    </>
  );
}

export default DashboardHeaderDatePicker;
