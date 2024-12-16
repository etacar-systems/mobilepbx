import React, { useRef, useEffect } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Picharbgcolors,
  Piechartlabels,
  Piechartsbordercolor,
  Piedarkbordercolor,
  Light,
  Blackcolor,
  Whitecolor,
  Dark,
} from "../ConstantConfig";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const PieChartDash = ({ theme, Theme, Piechartdata }) => {
  const { t } = useTranslation();
  const Bordercolor =
    Theme === Dark || theme === Dark
      ? Piedarkbordercolor
      : Piechartsbordercolor;
  const Textcolor = Theme === Dark || theme === Dark ? Whitecolor : Blackcolor;
  const isDataEmpty = Piechartdata.every((value) => value === 0);
  const data = {
    labels: Piechartlabels.map(label=>t(label)),
    datasets: [
      {
        hoverOffset: 6,
        data: Piechartdata,
        backgroundColor: Picharbgcolors,
        borderColor: Bordercolor,
        borderWidth: 1,
        hoverBackgroundColor: function (context) {
          const index = context.dataIndex;
          const backgroundColor = context.dataset.backgroundColor[index];
          const [r, g, b] = backgroundColor.match(/\d+/g);

          const darkenFactor = 0.8;
          const darkenedColor = `rgb(${Math.min(
            r * darkenFactor,
            255
          )}, ${Math.min(g * darkenFactor, 255)}, ${Math.min(
            b * darkenFactor,
            255
          )})`;

          const lightenFactor = 1.2;
          const lightenedColors = context.dataset.backgroundColor.map(
            (color) => {
              const [r, g, b] = color.match(/\d+/g);
              return `rgb(${Math.min(r * lightenFactor, 255)}, ${Math.min(
                g * lightenFactor,
                255
              )}, ${Math.min(b * lightenFactor, 255)})`;
            }
          );

          return lightenedColors.map((color, i) =>
            i === index ? darkenedColor : color
          );
        },
      },
    ],
  };
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: "doughnut", // Changed to doughnut
      data: data,
      options: {
        responsive: true,
        cutout: "55%", // Adjusts the inner radius for doughnut effect
        plugins: {
          legend: {
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              color: Textcolor,
              font: {
                size: "15px",
              },
            },
            position: "bottom",

            // maxHeight:253,
            // maxWidth:300,
          },
          title: {
            display: true,
          },
        },
      },
    });

    return () => {
      myChart.destroy(); // Cleanup chart on component unmount
    };
  }, [data,Textcolor]);

  return (
    <div className="chart-container">
      {isDataEmpty ? (
        <p className="Piechartpra callback">{t("No data found")}</p>
      ) : (
        <canvas ref={chartRef} className="chart-canvas" />
      )}
    </div>
  );
};

export default PieChartDash;
