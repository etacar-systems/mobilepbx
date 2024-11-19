import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js";
import { Blackcolor, Whitecolor, Dark, Gridlinedarkcolor, Girdlinelightcolor } from "../ConstantConfig";

const MultiLineChart = ({ data, Theme, theme }) => {
  const chartRef = useRef(null);
  const Textcolor = Theme === Dark || theme === Dark ? Whitecolor : Blackcolor;
  const gridlinecolor = Theme === Dark || theme === Dark ? Gridlinedarkcolor : Girdlinelightcolor ;

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

            // maxWidth: "100px"
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
              drawOnChartArea: false, // only want the grid lines for one axis to show up
              color: gridlinecolor,
            },
            border: {
              color: gridlinecolor, // Set only the main x-axis line to red
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
              drawOnChartArea: false,
              color:gridlinecolor,
            },
            border: {
              color: gridlinecolor, 
            },
            min: 8,
            max: 24,
            ticks: {
              stepSize: 2, // Set the step size or interval between ticks
            },
            display: true,
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

            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
            min: 8,
            max: 24,
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
