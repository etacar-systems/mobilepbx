import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import { Tooltipdata } from "../../../../ConstantConfig";
import Utils from "../../../../../utils";

const colors = {
  green: "rgb(115, 195, 32)", // AnswerLineChart
  yellow: "rgb(255,215,0)", // ResponseLineChart
  blue: "rgb(70, 127, 207)", // CalledLineChart
  red: "rgb(235, 105, 92)", // MissedLineChart
} as const;

interface ILineChartProps {
  value: number;
  color: keyof typeof colors;
  label: string;
  inLineLabels?: boolean;
}

export const LineChart = ({
  value,
  color,
  label,
  inLineLabels,
}: ILineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const dynamicMin = 0;

  const getNextMultiple = (value: number, multiple: number) => {
    return Math.ceil(value / multiple) * multiple;
  };

  const determineStepSize = (maxValue: number) => {
    if (maxValue <= 10) {
      return 1;
    } else if (maxValue <= 100) {
      return 10;
    } else {
      return 100;
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const dynamicMax = value <= 7 ? value : Math.ceil(value / 1.5);
    const data = Utils.generateArray(value);

    const adjustedMax = dynamicMax > 10 ? getNextMultiple(dynamicMax, 100) : 10;

    const stepSize = determineStepSize(adjustedMax);

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    const devicePixelRatio = window.devicePixelRatio || 1;

    chartRef.current.width = chartRef.current.offsetWidth * devicePixelRatio;
    chartRef.current.height = chartRef.current.offsetHeight * devicePixelRatio;

    ctx.scale(devicePixelRatio, devicePixelRatio);
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((val) => (inLineLabels ? val + label : label)),
        datasets: [
          {
            data,
            borderColor: colors[color],
            backgroundColor: colors[color],
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
  }, [value]);

  return <canvas ref={chartRef} className="manage-chart-height" />;
};
