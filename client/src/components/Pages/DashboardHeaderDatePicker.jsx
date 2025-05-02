import React, { useCallback, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";

import DatePickerComponent from "../Admin/DatePickercomponent";
registerLocale("en-GB", enGB);
export const DashboardHeaderDatePicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    start: startDate,
    end: endDate,
  });

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (event.target.start.value) {
        const dateParts = event.target.start.value.toString().split("/");
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);

        setStartDate(new Date(year, month, day));
      }

      if (event.target.end.value) {
        const dateParts = event.target.end.value.toString().split("/");
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);

        setEndDate(new Date(year, month, day));
      }
    },
    [setStartDate, setEndDate]
  );
  return (
    <div className="col-12 col-name p-0">
      <Form onSubmit={onSubmit} className="card" action="" method="post">
        <div className="body date_picker_container">
          <Row>
            <Col lg={6} md={12} className="col-name">
              <Form.Label className="modal-head">{t("Date Picker")}</Form.Label>
              <Row>
                <Col lg={8} md={12} className="col-name">
                  <div className="input-group">
                    <div
                      className="input-daterange input-group"
                      data-provide="datepicker"
                    >
                      <DatePickerComponent
                        name="start"
                        selected={state.start || startDate}
                        startDate={startDate}
                        Setselected={(data) =>
                          setState((prev) => ({ ...prev, start: data }))
                        }
                        endDate={endDate}
                        Borderclass="emailforminput2"
                      />
                      <span className="range">-</span>
                      <DatePickerComponent
                        name="end"
                        selected={state.end || endDate}
                        Setselected={(data) =>
                          setState((prev) => ({ ...prev, end: data }))
                        }
                        startDate={startDate}
                        endDate={endDate}
                        Borderclass="emailforminput"
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={4} md={12} className="filter_btn mt-2  mt-lg-0">
                  <Button
                    type="submit"
                    style={{ backgroundColor: "white", width: "100%" }}
                    // onClick={handledatefilter}
                  >
                    {t("Search")}
                  </Button>
                </Col>
              </Row>
            </Col>
            <div className="d-none col-md-6 col-sm-12 col-name text-right mt-4 hidden-xs">
              <a className="p-1 text-blue pdffont" href="#">
                <i className="fa fa-envelope mr-1"></i>
                {t("Send to Email")}
              </a>
            </div>
          </Row>
        </div>
      </Form>
    </div>
  );
};
