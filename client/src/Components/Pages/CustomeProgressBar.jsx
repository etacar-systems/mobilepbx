import React from "react";
import { ProgressBar } from "react-bootstrap";

const CustomProgressBar = ({ value, bgColor, fgColor }) => {
  return (
    <ProgressBar
      now={value}
      style={{
        backgroundColor: bgColor,
        height: "1.5rem",
        borderRadius: "0.25rem",
      }}
      className="mb-0 mt-4"
    >
      <ProgressBar
        variant="custom-color-blue"
        now={value}
        style={{
          backgroundColor: fgColor,
          borderRadius: "0.25rem",
        }}
      />
    </ProgressBar>
  );
};

export default CustomProgressBar;
