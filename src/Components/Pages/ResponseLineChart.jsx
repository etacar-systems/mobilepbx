import React, { useEffect, useRef, memo } from "react";
import { Chart } from "chart.js/auto"; // Importing Chart from 'chart.js/auto'
import {
  Backgroundcolor,
  bordercolor,
  ResponseLineChartData,
  ResponseLineChartLables,
  Tooltipdata,
} from "../ConstantConfig";

const ResponseLineChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Adjust canvas size to account for pixel ratio
    chartRef.current.width = chartRef.current.offsetWidth * devicePixelRatio;
    chartRef.current.height = chartRef.current.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ResponseLineChartLables,
        datasets: [
          {
            data: ResponseLineChartData,
            borderColor: bordercolor.ResponseLineChart,
            backgroundColor: Backgroundcolor.ResponseLineChart,
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
            min: 5,
            max: 50,
            ticks: {
              stepSize: 10,
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
  }, []);

  return <canvas ref={chartRef} className="manage-chart-height" />;
};

export default memo(ResponseLineChart);
