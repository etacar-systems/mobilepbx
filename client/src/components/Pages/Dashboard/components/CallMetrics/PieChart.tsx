import React, { useRef, useEffect, useMemo } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  Picharbgcolors,
  Piechartlabels,
  Piechartsbordercolor,
  Piedarkbordercolor,
  Blackcolor,
  Whitecolor,
  Dark,
} from "../../../../ConstantConfig";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface IPieChartProps {
  data: Array<number>;
}

export const PieChart = ({ data }: IPieChartProps) => {
  const { t } = useTranslation();
  // @ts-ignore
  const Theme = useSelector((state) => state?.Theme?.Theme);
  const theme = Cookies.get("Theme");

  const borderColor = useMemo(() => {
    return Theme === Dark || theme === Dark
      ? Piedarkbordercolor
      : Piechartsbordercolor;
  }, [theme, Theme]);

  const isDataEmpty = useMemo(() => {
    return data.every((value: any) => value === 0);
  }, [data]);

  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const myChart = new Chart(chartRef.current, {
      type: "doughnut", // Changed to doughnut
      data: {
        labels: Piechartlabels.map((label) => t(label)),
        datasets: [
          {
            hoverOffset: 6,
            data: data,
            backgroundColor: Picharbgcolors,
            borderColor: borderColor,
            borderWidth: 1,
            hoverBackgroundColor: function (context: any) {
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
                (color: string) => {
                  const [r, g, b] = color.match(/\d+/g) as unknown as [
                    number,
                    number,
                    number
                  ];
                  return `rgb(${Math.min(r * lightenFactor, 255)}, ${Math.min(
                    g * lightenFactor,
                    255
                  )}, ${Math.min(b * lightenFactor, 255)})`;
                }
              );

              return lightenedColors.map((color: string, i: number) =>
                i === index ? darkenedColor : color
              );
            },
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "55%", // Adjusts the inner radius for doughnut effect
        plugins: {
          legend: {
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              color: Theme === Dark || theme === Dark ? Whitecolor : Blackcolor,
              font: {
                size: 15,
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
  }, [data, borderColor, theme, Theme]);

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
