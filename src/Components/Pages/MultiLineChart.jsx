import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Blackcolor,
  Whitecolor,
  Dark,
  Gridlinedarkcolor,
  Girdlinelightcolor,
  Multilinechart,
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
  const padding = 0; // Adjust the padding as needed
  const dynamicMin = calculatedMin - padding < 0 ? 0 : calculatedMin - padding;
  const dynamicMax = calculatedMax + padding;

  // useEffect(() => {
  //   const myChart = new Chart(chartRef.current, {
  //     type: "line",
  //     data: data,
  //     options: {
  //       responsive: true,
  //       interaction: {
  //         mode: "index",
  //         intersect: false,
  //       },
  //       plugins: {
  //         legend: {
  //           labels: {
  //             boxWidth: 10,
  //             boxHeight: 10,
  //             color: Textcolor,
  //             font: {
  //               size: 15,
  //               weight: 300,
  //             },
  //           },
  //           position: "bottom",
  //         },
  //         title: {
  //           display: true,
  //         },
  //       },
  //       stacked: false,
  //       scales: {
  //         x: {
  //           display: true,
  //           title: {
  //             display: true,
  //             position: "bottom", // Position the label at the bottom
  //           },
  //           grid: {
  //             drawOnChartArea: true, // This will draw grid lines on the chart area
  //             color: gridlinecolor, // Set the grid line color
  //             lineWidth: 1, // Set the grid line width
  //           },
  //           border: {
  //             color: gridlinecolor, // Set only the main x-axis line to the grid line color
  //           },
  //           ticks: {
  //             color: Textcolor,
  //             font: {
  //               family: "Courier New, monospace", // Set the font family of the x-axis labels
  //               size: 12, // Set the font size of the x-axis labels
  //               weight: 300,
  //             },
  //           },
  //         },
  //         y: {
  //           type: "linear",
  //           display: true,
  //           position: "left",
  //           grid: {
  //             drawOnChartArea: true, // This will draw grid lines on the chart area
  //             color: gridlinecolor, // Set the grid line color
  //             lineWidth: 1, // Set the grid line width
  //           },
  //           border: {
  //             color: gridlinecolor, // Set the main y-axis line color
  //           },
  //           min: dynamicMin,
  //           max: dynamicMax,
  //           ticks: {
  //             stepSize: 2, // Set the step size or interval between ticks
  //           },
  //           ticks: {
  //             color: Textcolor, // Set the color of the x-axis labels
  //             font: {
  //               family: "Courier New, monospace", // Set the font family of the x-axis labels
  //               size: 12, // Set the font size of the x-axis labels
  //               weight: 300,
  //             },
  //           },
  //         },
  //         y1: {
  //           type: "linear",
  //           display: false,
  //           position: "right",
  //           grid: {
  //             drawOnChartArea: true, // This will draw grid lines on the chart area
  //           },
  //           min: dynamicMin,
  //           max: dynamicMax,
  //           ticks: {
  //             stepSize: 2, // Set the step size or interval between ticks
  //           },
  //         },
  //       },
  //     },
  //   });

  //   return () => {
  //     myChart.destroy(); // Cleanup chart on component unmount
  //   };
  // }, [data, Textcolor]);

  useEffect(() => {
    const getNextMultiple = (value, multiple) => {
      return Math.ceil(value / multiple) * multiple;
    };

    const determineStepSize = (maxValue) => {
      // if (maxValue <= 10) {
      //   return 1;
      // } else if (maxValue <= 50) {
      //   return 5;
      // }else if (maxValue <= 100) {
      //   return 10;
      // }else if (maxValue <= 200) {
      //   return 20;
      // } else {
      //   return 100;
      // }

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

    const adjustedMax =
      dynamicMax < 10
        ? 10
        : dynamicMax < 100
        ? 100
        : getNextMultiple(dynamicMax, 100);
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
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem.dataset.label || "";
                const value = tooltipItem.raw;
                return `${label}: ${value}`;
              },
            },
          },
          datalabels: {
            color: (context) => {
              // Use different colors for different datasets
              const datasetIndex = context.datasetIndex;
              return datasetIndex === 0
                ? Multilinechart.dataset1color // Color for "missed"
                : Multilinechart.dataset2color; // Color for "waiting time"
            },
            // backgroundColor: Theme === Dark || theme === Dark ? Whitecolor : "lightgrey";
            // borderRadius: 3,
            // borderColor: "#000",
            // borderWidth: 1,
            font: {
              size: 10,
              weight: "bold",
            },
            padding: 4,
            align: "top",
            offset: 2,
            // offset: (context) => {
            //   const datasetIndex = context.datasetIndex;
            //   const value = context.raw; // Current value
            //   const datasetLength = context.chart.data.datasets.length;
            //   const baseOffset = 1;

            //   // Adjust the offset dynamically
            //   if (datasetIndex === 0) {
            //     // "Missed" labels
            //     return baseOffset + (value / datasetLength) * 1.1; // Scale offset by value
            //   } else {
            //     // "Waiting time" labels
            //     return baseOffset + (value / datasetLength) * 1.3; // Slightly larger offset
            //   }
            // },
            clamp: true,
            formatter: (value) => value,
          },
          // datalabels: {
          //   color: Multilinechart.data,
          //   backgroundColor: "#fff",
          //   borderRadius: 3,
          //   borderColor: "#000",
          //   borderWidth: 1,
          //   font: {
          //     size: 10,
          //     weight: "bold",
          //   },
          //   padding: 4,
          //   align: "top",
          //   offset: 8,
          //   clamp: true,
          //   formatter: (value) => value,
          // },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              position: "bottom",
            },
            grid: {
              drawOnChartArea: true,
              color: gridlinecolor,
              lineWidth: 1,
            },
            border: {
              color: gridlinecolor,
            },
            ticks: {
              stepSize: 1,
              color: Textcolor,
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
              color: gridlinecolor,
              lineWidth: 1,
            },
            border: {
              color: gridlinecolor,
            },
            min: dynamicMin < 0 ? 0 : Math.min(dynamicMin, 0),
            max: adjustedMax,
            ticks: {
              stepSize: stepSize,
              color: Textcolor,
              font: {
                family: "Courier New, monospace",
                size: 12,
                weight: 300,
              },
              callback: function (value) {
                return value.toLocaleString(); // Format labels to prevent overlap
              },
            },
          },
          y1: {
            type: "linear",
            display: false,
            position: "right",
            grid: {
              drawOnChartArea: false, // Hide grid lines for the secondary axis
            },
            min: dynamicMin < 0 ? 0 : Math.min(dynamicMin, 0),
            max: adjustedMax,
            ticks: {
              stepSize: stepSize,
              color: Textcolor,
              font: {
                family: "Courier New, monospace",
                size: 12,
                weight: 300,
              },
              callback: function (value) {
                return value.toLocaleString(); // Format labels
              },
              padding: 10, // Add extra padding to prevent overlap
            },
          },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [data, Textcolor, gridlinecolor]);

  return (
    <div>
      <canvas ref={chartRef} className="chart-canvas2" />
    </div>
  );
};

export default MultiLineChart;
