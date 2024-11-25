import { useSelector } from "react-redux";
import { format } from "date-fns";
const ChartDataComponent = () => {
  const data = useSelector((state) => state.getapiall.getapiall.dashboardData);
  console.log(data, "datacheckdummy");
  let valuedata = data?.DashboardDetail?.reports_counts;
  console.log(valuedata, "valuedatacheck");
  const chartData = [
    {
      id: "chart-bg-users-1",
      names: { data1: "Called" },
      columns: [["data1", 30, 40, 10, 40, 12, 22, 40]],
      colors: ["#467fcf"],
      title: "Called",
      value: valuedata?.total_calls,
    },
    {
      id: "chart-bg-users-2",
      names: { data1: "Answered" },
      columns: [["data1", 12, 21, 17, 40, 19, 22, 13]],
      colors: ["#e74c3c"],
      title: "Answered",
      value: valuedata?.total_answered,
    },
    {
      id: "chart-bg-users-3",
      names: { data1: "Missed" },
      columns: [["data1", 22, 14, 45, 28, 18, 27, 40]],
      colors: ["#5eba00"],
      title: "Missed",
      value: valuedata?.total_missed,
    },
    {
      id: "chart-bg-users-4",
      names: { data1: "Response time" },
      columns: [["data1", 30, 40, 10, 40, 12, 22, 40]],
      colors: ["#f1c40f"],
      title: "Response time",
      value: `${Math.floor((valuedata?.avg_response_sec * 100).toFixed(0) / 60)
        .toString()
        .padStart(2, "0")}:${((valuedata?.avg_response_sec * 100).toFixed(0) % 60)
        .toString()
        .padStart(2, "0")}`,
    },
  ];

  return chartData;
};

export default ChartDataComponent;

export const dummyData = [
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "301",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "Sales",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "301",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "Sales",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "301",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "Sales",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "301",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "Sales",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "301",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "Sales",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "301",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  {
    createdDate: "11:20AM 17 Nov 2018",
    callerID: "+358449876543",
    callerName: "John Smith",
    receiverID: "+358398546731",
    endpoint: "Sales",
    duration: "8 min 11 sec",
    callType: "Inbound",
  },
  // Add more dummy data here
];
