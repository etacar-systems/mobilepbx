import React, { useEffect, useRef, memo } from "react";
import Chart from "chart.js/auto"; // Normal import of Chart.js
import {
  Backgroundcolor,
  bordercolor,
  CalledLineChartData,
  CalledLineChartLables,
  Tooltipdata,
} from "../ConstantConfig";
import Utils from "../../utils";

const CalledLineChart = ({ calledValue }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const dynamicMin = 0;
  const dynamicMax = calledValue <= 7 ? calledValue : Math.ceil(calledValue / 1.5);
  useEffect(() => {
    const getNextMultiple = (value, multiple) => {
      return Math.ceil(value / multiple) * multiple;
    };

    const determineStepSize = (maxValue) => {
      if (maxValue <= 10) {
        return 1;
      } else if (maxValue <= 100) {
        return 10;
      } else {
        return 100;
      }
    };

    const adjustedMax = dynamicMax > 10 ? getNextMultiple(dynamicMax, 100) : 10;
    const stepSize = determineStepSize(adjustedMax);

    const ctx = chartRef.current.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;
    chartRef.current.width = chartRef.current.offsetWidth * devicePixelRatio;
    chartRef.current.height = chartRef.current.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        // labels: Utils.generateArray(calledValue),
        labels: CalledLineChartLables,
        datasets: [
          {
            data: Utils.generateArray(calledValue),
            // data: CalledLineChartData,
            borderColor: bordercolor.CalledLineChart,
            backgroundColor: Backgroundcolor.CalledLineChart,
            borderWidth: 1.5,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
            bodyAlign: "center",
            boxWidth: Tooltipdata.Boxsize,
            boxHeight: Tooltipdata.Boxsize,
            titleFont: {
              size: Tooltipdata.Titlesize,
            },
            bodyFont: {
              size: Tooltipdata.Bodysize,
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
            min: dynamicMin,
            max: dynamicMax,
            ticks: {
              stepSize: stepSize,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [calledValue]);

  return <canvas ref={chartRef} className="manage-chart-height" />;
};

// Memoize the component to avoid unnecessary re-renders
export default memo(CalledLineChart);
