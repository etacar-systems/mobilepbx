import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ReactComponent as Pdf } from "../../Assets/Icon/pdf.svg";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import DatePickerComponent from "../Admin/DatePickercomponent";
registerLocale("en-GB", enGB);
function DashboardHeaderDatePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handledatefilter,
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="col-12 col-name p-0">
        <Form className="card" action="" method="post">
          <div className="body date_picker_container">
            <Row>
              <Col lg={6} md={12} className="col-name">
                <Form.Label className="modal-head">
                  {t("Date Picker")}
                </Form.Label>
                <Row>
                  <Col lg={8} md={12} className="col-name">
                    <div className="input-group">
                      <div
                        className="input-daterange input-group"
                        data-provide="datepicker"
                      >
                        <DatePickerComponent
                          selected={startDate}
                          Setselected={setStartDate}
                          startDate={startDate}
                          endDate={endDate}
                          Borderclass="emailforminput2"
                        />
                        <span className="range">-</span>
                        <DatePickerComponent
                          selected={endDate}
                          Setselected={setEndDate}
                          startDate={startDate}
                          endDate={endDate}
                          Borderclass="emailforminput"
                        />
                      </div>
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
