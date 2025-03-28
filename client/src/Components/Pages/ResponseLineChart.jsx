import React, { useEffect, useRef, memo } from "react";
import { Chart } from "chart.js/auto"; // Importing Chart from 'chart.js/auto'
import {
  Backgroundcolor,
  bordercolor,
  ResponseLineChartData,
  ResponseLineChartLables,
  Tooltipdata,
} from "../ConstantConfig";
import Utils from "../../utils";

const ResponseLineChart = ({ responseLineValue }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const hoursMatch = responseLineValue.match(/(\d+)h/);
  const minutesMatch = responseLineValue.match(/(\d+)m/);
  const secondsMatch = responseLineValue.match(/(\d+)s/);

  // Extract values or assign 0 if not found
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;

  // Convert to seconds
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const dynamicMax =
    responseLineValue <= 60 ? responseLineValue : Math.ceil(totalSeconds / 1.5);
  const dynamicMin = 0;
  const responseChartValue = Utils.generateArray(totalSeconds);
  const responseChartLabels = responseChartValue?.map((val) =>
    Utils.formatDuration(val)
  );

  console.log(
    responseLineValue,
    "totalhourss",
    hours,
    "totalmins",
    minutes,
    "totalSeconds",
    totalSeconds,
    dynamicMax,
    responseChartValue,
    responseChartLabels
  );

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

    // Adjust canvas size to account for pixel ratio
    chartRef.current.width = chartRef.current.offsetWidth * devicePixelRatio;
    chartRef.current.height = chartRef.current.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: responseChartLabels,
        // labels: ResponseLineChartLables,
        datasets: [
          {
            data: responseChartValue,
            // data: ResponseLineChartData,
            borderColor: bordercolor.ResponseLineChart,
            backgroundColor: bordercolor.ResponseLineChart,
            borderWidth: 1,
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
  }, [responseLineValue]);

  return <canvas ref={chartRef} className="manage-chart-height" />;
};

export default memo(ResponseLineChart);
