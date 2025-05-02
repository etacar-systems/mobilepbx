import React, { useState } from "react";
import "./CustomeChartCss.css";

const ProgressCircle = ({
  classNames,
  pragressLable,
  passWholeProgress,
  completedColor,
  bgcolor,
  Totalcall,
  Answeredcall,
  Title1,
  Title2,
  mode
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const radius = 40; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Calculate circumference
  const totalUnits = Totalcall;
  const completedUnits = Answeredcall;
  // Calculate the percent for completed units out of the total
  const completedPercent = (completedUnits / totalUnits) * 100;
  const formatPercent = (value) => {
    return value > 0 ? parseFloat(value.toFixed(2)) : 0;
  };
  return (
    <div
      className={passWholeProgress}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <svg className={classNames} viewBox="0 0 100 100">
        <circle
          className="progress-circle__background"
          cx="50"
          cy="50"
          r={radius}
          style={{ stroke: bgcolor }}
        />
        <circle
          className="progress-circle__bar"
          cx="50"
          cy="50"
          r={radius}
          style={{
            stroke: completedColor,
            strokeDasharray: circumference,
            strokeDashoffset:
              circumference - (completedPercent / 100) * circumference,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
       {mode ? (
        <div
          className="progress-circle__label1 chart-value"
          style={{
            display: "inline-flex",
            flexDirection: "row",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          <p
            style={{
              color: bgcolor || "var(--main-red-color)",
              margin: 0,
            }}
          >
            {totalUnits - Answeredcall === 0
              ? Answeredcall || 0
              : totalUnits - Answeredcall || 0}
          </p>{" "}
          /{" "}
          <p
            style={{
              color: "var(--main-green-color)",
              margin: 0,
            }}
          >
            {Answeredcall || 0}
          </p>
        </div>
      ) : (
        <div
          className="progress-circle__label1 chart-value"
          style={{
            color:
              totalUnits - Answeredcall > 0
                ? "var(--main-red-color)"
                : "var(--main-green-color)",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          {totalUnits - Answeredcall === 0
            ? Answeredcall || 0
            : totalUnits - Answeredcall || 0}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="tooltipert">
          {Title1}: {formatPercent(completedPercent)}% <br />
          {Title2}: {formatPercent(100 - completedPercent)}%
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;
