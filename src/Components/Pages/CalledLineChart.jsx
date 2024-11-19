import React, { useEffect, useRef, memo } from "react";
import Chart from "chart.js/auto"; // Normal import of Chart.js
import {
  Backgroundcolor,
  bordercolor,
  CalledLineChartData,
  CalledLineChartLables,
  Tooltipdata,
} from "../ConstantConfig";

const CalledLineChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;
    chartRef.current.width = chartRef.current.offsetWidth * devicePixelRatio;
    chartRef.current.height = chartRef.current.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: CalledLineChartLables,
        datasets: [
          {
            data: CalledLineChartData,
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

// Memoize the component to avoid unnecessary re-renders
export default memo(CalledLineChart);
