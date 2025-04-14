import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { enUS } from "date-fns/locale";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateRangePickerInput = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    setShowPicker(false);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Select Date Range"
          value={`${dateRange[0].startDate.toDateString()} - ${dateRange[0].endDate.toDateString()}`}
          readOnly
          onClick={togglePicker}
          style={{
            cursor: "pointer",
          }}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={togglePicker}>
            <i className="fas fa-calendar-alt"></i>
          </Button>
        </InputGroup.Append>
      </InputGroup>

      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            zIndex: 1000,
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <DateRangePicker ranges={dateRange} onChange={handleSelect} locale={enUS} />
        </div>
      )}
    </div>
  );
};

export default DateRangePickerInput;
