import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enGB, fi } from "date-fns/locale";
import Cookies from "js-cookie";
import { Fi } from "../ConstantConfig";
// Register Finnish locale
registerLocale("fi", fi);
registerLocale("en-GB", enGB);
export default function DatePickerComponent({
  startDate,
  selected,
  endDate,
  Setselected,
  minDate,
  Borderclass,
}) {
  const language = Cookies.get("language");
  return (
    <>
      <DatePicker
        selected={selected}
        onChange={(date) => Setselected(date)}
        selectsStart
        startDate={startDate}
        locale={language == Fi ? Fi : enGB}
        dateFormat="dd/MM/yyyy"
        endDate={endDate}
        minDate={minDate}
        className={`form-control search-bg ${Borderclass}`}
      />
    </>
  );  
}
