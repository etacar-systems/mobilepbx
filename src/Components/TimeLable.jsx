import moment from "moment/moment";
import React from "react";
import { useEffect, useState } from "react";
import Utils from "../utils";

const TimeLable = ({ timeFormate, lastMessageTime, todaytoTime, message }) => {
  const formattedDate = timeFormate;
  const dateFormate = "Do MMM YYYY";

  const [TimeFormate, setTimeFormatted] = useState();
  const now = new Date(lastMessageTime);
  const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = now.getMinutes();
  const amPm = now.getHours() >= 12 ? "pm" : "am";
  const showingtime = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${amPm}`;

  useEffect(() => {
    if (lastMessageTime != null) {
      // if (formattedDate) {
      const isToday = moment(formattedDate, dateFormate).isSame(
        moment(),
        "day"
      );
      const isYesterday = moment(formattedDate, dateFormate).isSame(
        moment().subtract(1, "days"),
        "day"
      );
      const isCurrentYear = moment(formattedDate, dateFormate).isSame(
        moment(),
        "year"
      );
      if (isToday) {
        setTimeFormatted(Utils.timeDisplay(now));
      } else if (isYesterday) {
        setTimeFormatted("Yesterday");
      } else if (isCurrentYear) {
        setTimeFormatted(moment(formattedDate, dateFormate).format("D MMM"));
      } else {
        setTimeFormatted(
          moment(formattedDate, dateFormate).format("D MMM YYYY")
        );
      }
    } else {
      setTimeFormatted("");
    }
  }, [timeFormate, lastMessageTime]);

  return (
    <div>
      <div>{TimeFormate}</div>
    </div>
  );
};

export default TimeLable;
