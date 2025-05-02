import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Blackcolor,
  Whitecolor,
  Dark,
  Gridlinedarkcolor,
  Girdlinelightcolor,
  Multilinechart,
} from "../../../../ConstantConfig";
import Utils from "../../../../../utils";

export const MultiLineChart = ({ data }: any) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  // @ts-ignore
  const Theme = useSelector((state) => state?.Theme?.Theme);
  const theme = Cookies.get("Theme");

  const dataValues = data.datasets.flatMap(
    (dataset: { data: Array<number> }) => dataset.data
  );
  const calculatedMax = Math.max(...dataValues);

  const dynamicMin = 0;
  const dynamicMax = calculatedMax;

  useEffect(() => {
    if (!chartRef.current) return;

    const textColor =
      Theme === Dark || theme === Dark ? Whitecolor : Blackcolor;
    const gridLineColor =
      Theme === Dark || theme === Dark ? Gridlinedarkcolor : Girdlinelightcolor;

    const determineStepSize = (maxValue: number) => {
      if (maxValue <= 10) {
        return 1;
      } else if (maxValue <= 50) {
        return 5;
      } else if (maxValue <= 100) {
        return 10;
      } else if (maxValue <= 150) {
        return 15;
      } else if (maxValue <= 200) {
        return 20;
      } else if (maxValue <= 300) {
        return 30;
      } else if (maxValue <= 400) {
        return 40;
      } else if (maxValue <= 700) {
        return 50;
      } else if (maxValue <= 1000) {
        return 100;
      } else if (maxValue <= 10000) {
        return 1000;
      } else if (maxValue <= 50000) {
        return 10000;
      } else if (maxValue <= 100000) {
        return 15000;
      } else {
        return 20000;
      }
    };

    const adjustedMax = Math.ceil(dynamicMax / 10) * 10;
    const stepSize = determineStepSize(adjustedMax);

    const myChart = new Chart(chartRef.current, {
      type: "line",
      data: data,
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              color: textColor,
              font: {
                size: 15,
                weight: 300,
              },
            },
            position: "bottom",
          },
          title: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem.dataset.label || "";
                const value =
                  tooltipItem.datasetIndex === 1
                    ? Utils.formatDuration(tooltipItem.raw)
                    : tooltipItem.raw;
                return `${label}: ${value}`;
              },
            },
          },
          datalabels: {
            color: (context) => {
              const datasetIndex = context.datasetIndex;
              return datasetIndex === 0
                ? Multilinechart.dataset1color
                : Multilinechart.dataset2color;
            },
            font: {
              size: 10,
              weight: "bold",
            },
            padding: 4,
            align: "top",
            offset: 2,
            clamp: true,
            formatter: (value) => value,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
            },
            grid: {
              drawOnChartArea: true,
              color: gridLineColor,
              lineWidth: 1,
            },
            border: {
              color: gridLineColor,
            },
            ticks: {
              stepSize: 1,
              color: textColor,
              font: {
                family: "Courier New, monospace",
                size: 10,
                weight: 300,
              },
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            grid: {
              drawOnChartArea: true,
              color: gridLineColor,
              lineWidth: 1,
            },
            border: {
              color: gridLineColor,
            },
            min: 0,
            max: adjustedMax,
            ticks: {
              stepSize: stepSize,
              color: textColor,
              font: {
                family: "Courier New, monospace",
                size: 12,
                weight: 300,
              },
              callback: function (value) {
                return value.toLocaleString();
              },
            },
          },
          y1: {
            type: "linear",
            display: false,
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
            min: 0,
            max: adjustedMax,
            ticks: {
              stepSize: stepSize,
              color: textColor,
              font: {
                family: "Courier New, monospace",
                size: 12,
                weight: 300,
              },
              callback: function (value) {
                return value.toLocaleString();
              },
              padding: 10,
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [data, dynamicMax, dynamicMin, Theme, theme]);

  return (
    <div>
      <canvas ref={chartRef} className="chart-canvas2" />
    </div>
  );
};
