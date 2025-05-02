import moment from "moment/moment";
import React, { useMemo } from "react";
import Utils from "../utils";
import { useTranslation } from "react-i18next";

const TimeLable = ({ timeFormate, lastMessageTime, todaytoTime, message }) => {
  const { t } = useTranslation();

  const dateFormate = "Do MMM YYYY";

  const TimeFormate = useMemo(() => {
    const now = new Date(lastMessageTime);

    if (lastMessageTime != null) {
      // if (formattedDate) {
      const isToday = moment(timeFormate, dateFormate).isSame(
        moment(),
        "day"
      );
      const isYesterday = moment(timeFormate, dateFormate).isSame(
        moment().subtract(1, "days"),
        "day"
      );
      
      if (isToday) {
        return (Utils.timeDisplay(now));
      } else if (isYesterday) {
        return (t("Yesterday"));
      } else {
        return (moment(timeFormate, dateFormate).format("DD.MM.YYYY"));
      }
    } else {
      return ("");
    }
  }, [t, lastMessageTime, dateFormate, timeFormate]);

  return (
    <div>
      <div>{TimeFormate}</div>
    </div>
  );
};

export default TimeLable;
