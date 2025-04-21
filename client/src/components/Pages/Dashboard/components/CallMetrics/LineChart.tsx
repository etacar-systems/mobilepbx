import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import {
  Dark,
  Girdlinelightcolor,
  Linechartdash,
  Piechartsbordercolor,
  Piedarkbordercolor,
  Gridlinedarkcolor,
} from "../../../../ConstantConfig";

interface ILineChartProps {
  labels: Array<string>
  answeredCallsData: Array<number>;
  missedCallsData: Array<number>;
  localCallsData: Array<number>;
}

export const LineChart = ({
  labels,
  answeredCallsData,
  missedCallsData,
  localCallsData,
}: ILineChartProps) => {
  const { t } = useTranslation();
  // @ts-ignore
  const Theme = useSelector((state) => state?.Theme?.Theme);
  const theme = Cookies.get("Theme");

  const Textcolor =
    Theme === Dark || theme === Dark
      ? Piechartsbordercolor
      : Piedarkbordercolor;
  const gridlinecolor =
    Theme === Dark || theme === Dark ? Gridlinedarkcolor : Girdlinelightcolor;

  const maxValue = useMemo(() => {
    const allData = [...answeredCallsData,
      ...missedCallsData,
      ...localCallsData];

    return Math.max(...allData);
  }, [answeredCallsData,
    missedCallsData,
    localCallsData]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: t("Answered"),
        data: answeredCallsData,
        backgroundColor: Linechartdash.databgcolor1,
        borderColor: Linechartdash.bordercolor1,
        borderWidth: 2,
        fill: true,
      },
      {
        label: t("Called"),
        data: localCallsData,
        backgroundColor: Linechartdash.databgcolor2,
        borderColor: Linechartdash.bordercolor2,
        borderWidth: 2,
        fill: true,
      },
      {
        label: t("Missed"),
        data: missedCallsData,
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
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        display: true,
        min: 0,
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
