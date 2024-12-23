import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Blackcolor,
  Dark,
  Girdlinelightcolor,
  Linechartdash,
  Multilinechart,
  Piechartsbordercolor,
  Piedarkbordercolor,
  Whitecolor,
  Gridlinedarkcolor,
} from "../ConstantConfig";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const LineChart = ({
  Theme,
  theme,
  Linechartlabels,
  answeredData,
  MissedData,
  localData,
}) => {
  const { t } = useTranslation();

  const Textcolor =
    Theme === Dark || theme === Dark
      ? Piechartsbordercolor
      : Piedarkbordercolor;
  const gridlinecolor =
    Theme === Dark || theme === Dark ? Gridlinedarkcolor : Girdlinelightcolor;
  let minValue = 0;
  let maxValue = 100;
  let allData = [...answeredData, ...localData, ...MissedData]
  minValue = Math.min( ...allData);
  maxValue = Math.max( ...allData);
  maxValue =  ( Math.round(maxValue/10) + 1 ) * 10; // for better view, convert number to the next multiple of 10

  const chartData = {
    labels: Linechartlabels,
    datasets: [
      {
        label: t("Answered"),
        data: answeredData,
        backgroundColor: Linechartdash.databgcolor1,
        borderColor: Linechartdash.bordercolor1,
        borderWidth: 2,
        fill: true,
      },
      {
        label: t("Called"),
        data: localData,
        backgroundColor: Linechartdash.databgcolor2,
        borderColor: Linechartdash.bordercolor2,
        borderWidth: 2,
        fill: true,
      },
      {
        label: t("Missed"),
        data: MissedData,
        backgroundColor: Linechartdash.databgcolor3,
        borderColor: Linechartdash.bordercolor3,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    stacked: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        display: true,
        min: minValue,
        max: maxValue,
        ticks: {
          color: Textcolor,
          font: {
            family: "Courier New, monospace", // Set the font family of the y-axis labels
            size: 10, // Set the font size of the y-axis labels to 10px
            weight: 300,
          },
        },
        grid: {
          color: gridlinecolor, // Set grid line color for the y-axis
        },
      },
      x: {
        display: true,
        ticks: {
          color: Textcolor,
          font: {
            family: "Courier New, monospace", // Set the font family of the x-axis labels
            size: 10, // Set the font size of the x-axis labels to 10px
            weight: 300,
          },
        },
        grid: {
          color: gridlinecolor, // Set grid line color for the x-axis
        },
      },
    },
    layout: {
      padding: {
        top: 60,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
  };

  return (
    <Line
      data={chartData}
      options={options}
      style={{ height: "400px !important" }}
      className="linechatwidth"
    />
  );
};

export default LineChart;
