import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js";
import {
  Blackcolor,
  Whitecolor,
  Dark,
  Gridlinedarkcolor,
  Girdlinelightcolor,
} from "../ConstantConfig";

const MultiLineChart = ({ data, Theme, theme }) => {
  const chartRef = useRef(null);
  const Textcolor = Theme === Dark || theme === Dark ? Whitecolor : Blackcolor;
  const gridlinecolor =
    Theme === Dark || theme === Dark ? Gridlinedarkcolor : Girdlinelightcolor;
  // console.log("MultiLineChartMultiLineChart", data);

  const dataValues = data.datasets.flatMap((dataset) => dataset.data); // Flatten all y-values from the datasets
  const calculatedMin = Math.min(...dataValues);
  const calculatedMax = Math.max(...dataValues);

  // Add padding to min and max for better visualization
  const padding = 5; // Adjust the padding as needed
  const dynamicMin = calculatedMin - padding < 0 ? 0 : calculatedMin - padding;
  const dynamicMax = calculatedMax + padding;

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              color: Textcolor,
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
        },
        stacked: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              position: "bottom", // Position the label at the bottom
            },
            grid: {
              drawOnChartArea: true, // This will draw grid lines on the chart area
              color: gridlinecolor, // Set the grid line color
              lineWidth: 1, // Set the grid line width
            },
            border: {
              color: gridlinecolor, // Set only the main x-axis line to the grid line color
            },
            ticks: {
              color: Textcolor,
              font: {
                family: "Courier New, monospace", // Set the font family of the x-axis labels
                size: 12, // Set the font size of the x-axis labels
                weight: 300,
              },
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            grid: {
              drawOnChartArea: true, // This will draw grid lines on the chart area
              color: gridlinecolor, // Set the grid line color
              lineWidth: 1, // Set the grid line width
            },
            border: {
              color: gridlinecolor, // Set the main y-axis line color
            },
            min: dynamicMin,
            max: dynamicMax,
            ticks: {
              stepSize: 2, // Set the step size or interval between ticks
            },
            ticks: {
              color: Textcolor, // Set the color of the x-axis labels
              font: {
                family: "Courier New, monospace", // Set the font family of the x-axis labels
                size: 12, // Set the font size of the x-axis labels
                weight: 300,
              },
            },
          },
          y1: {
            type: "linear",
            display: false,
            position: "right",
            grid: {
              drawOnChartArea: true, // This will draw grid lines on the chart area
            },
            min: dynamicMin,
            max: dynamicMax,
            ticks: {
              stepSize: 2, // Set the step size or interval between ticks
            },
          },
        },
      },
    });
    

    return () => {
      myChart.destroy(); // Cleanup chart on component unmount
    };
  }, [data, Textcolor]);

  return (
    <div>
      <canvas ref={chartRef} className="chart-canvas2" />
    </div>
  );
};

export default MultiLineChart;
