export const Numeric = {
  TLS: 1,
  TCP: 2,
  WSS: 3,
};
export const regex_pssword = /^[A-Za-z0-9!@#$%^&*()_+{}|;:'",.<>?/\\[\]\-=`~]{4,15}$/;
export const regex_email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default {
  TRUNKS: {
    COMPANY_SELECT: {
      MAPVALUE: "company_name",
      STOREVALUE: "_id",
    },
    GT_TYPE: {
      MAPVALUE: "gt_type",
      STOREVALUE: "_id",
    },
    VALIDATION: {
      PROXY:
        /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?$|^(?=.{1,253}$)(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)*[A-Za-z0-9-]{1,63}\.[A-Za-z]{2,63}(?::\d{1,5})?$/,
      EXPIRE_SECOND: /^[0-9]*$/,
    },
  },
  RINGGROUP: {
    VALIDATION: {
      EXTENSIONVAL: /^\d+$/,
    },
  },
  CUSTOMER: {
    Email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    Phone_number: /^\+?\d{10,14}$/,
    Domain: /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/,
    errormessage: "Company Feature Added Successfully",
    color: /^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{5}|[a-fA-F0-9]{6})$/,
    modalColor: "#FE700A",
  },
  PHONEBOOK: {},
  IVR: {
    VALIDATION: {
      ENTRIES: /^[1-9*#]$/,
    },
  },
  CONFERENCE: {
    VALIDATION: {},
  },
  PSTN: {
    PROVIDER: {
      MAPVALUE: "gateway_name",
      STOREVALUE: "_id",
    },
    DESTINATION_NUM: /^\+?[0-9]+$/,
  },
  EXTENSION: {
    VALIDATION: {
      // Extension_number: /^\d{3,15}$/,
      Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;'\"<>,.?/~`[\]\\\-]).{6,}$/,
      Email: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
  },
  OUTBOUND: {
    COMPANY_SELECT: {
      MAPVALUE: "company_name",
      STOREVALUE: "_id",
    },
    TRUNK_SELECT: {
      MAPVALUE: "gateway_name",
      STOREVALUE: "_id",
    },
  },
};
export const SELECTSTATUS = [
  { item: "Available" },
  { item: "Away" },
  { item: "Busy" },
  { item: "Lunch" },
  { item: "Vacation" },
  { item: "Other" },
];
export const TRANSFERCALL = [
  { item: "No transfer" },
  { item: "Extension" },
  { item: "Group" },
  { item: "Operator" },
  { item: "Other" },
];
export const TimeconditionDropArray = [
  "Year",
  "Month",
  "Day of Month",
  "Day of Week",
  "Week of Year",
  "Hours of Day",
  // "Time of Day",
  // "Date & Time",
];

export const AllVoipModules = [
  "Extension",
  "Conference",
  "IVR",
  "Recording",
  "Ring Group",
  // "Timeconditions",
];
export const AnsweLineChartLables = [
  "Answered",
  "Answered",
  "Answered",
  "Answered",
  "Answered",
  "Answered",
  "Answered",
];
export const AnsweLineChartData = [22, 14, 45, 28, 18, 27, 40];
export const Timeout_retries = [1, 2, 3, 4, 5];
export const ResponseLineChartLables = [
  "Response",
  "Response",
  "Response",
  "Response",
  "Response",
  "Response",
  "Response",
];
export const ResponseLineChartData = [30, 40, 10, 40, 12, 22, 40];
export const CalledLineChartLables = [
  "called",
  "called",
  "called",
  "called",
  "called",
  "called",
  "called",
];
export const CalledLineChartData = [30, 40, 15, 40, 12, 22, 30];
export const MissedLineChartLables = [
  "Missed",
  "Missed",
  "Missed",
  "Missed",
  "Missed",
  "Missed",
  "Missed",
];
export const MissedLineChartData = [22, 14, 45, 28, 18, 27, 40];
export const bordercolor = {
  AnsweLineChart: "rgb(115, 195, 32)",
  ResponseLineChart: "rgb(255,215,0)",
  CalledLineChart: "rgb(70, 127, 207)",
  MissedLineChart: "rgb(235, 105, 92)",
};
export const Backgroundcolor = {
  AnsweLineChart: "rgb(92, 182, 95,0.1)",
  ResponseLineChart: "rgb(255,215,0,0.1)",
  CalledLineChart: "rgba(70, 127, 207, 0.1)",
  MissedLineChart: "rgb(255,0,0,0.1)",
};
export const Tooltipdata = {
  Titlesize: 12,
  Boxsize: 8,
  Bodysize: 10,
};
export const Linechartdash = {
  databgcolor1: "rgba(92, 182, 95, 0.2)",
  databgcolor2: "rgba(0, 127, 255, 0.2)",
  databgcolor3: "rgba(225, 88, 88, 0.2)",
  bordercolor1: "#5cb65f",
  bordercolor2: "#007fff",
  bordercolor3: "#e15858",
  tikscolor: "#343a40",
};
export const isassignlist = [{ name: "Internet" }, { name: "Local" }, { name: "Trusted" }];
export const TypeInnumber = [
  { type: "Extension", value: "3" },
  { type: "Ring groups", value: "2" },
  { type: "IVR", value: "1" },
  { type: "Conferences", value: "4" },
  { type: "System recordings", value: "5" },
  { type: "Time Condition", value: "6" },
];
export const Report_fiter = [
  { type: "Conferences", value: "4" },
  { type: "Extension", value: "3" },
  { type: "IVR", value: "1" },
  { type: "Ring groups", value: "2" },
  { type: "Time Condition", value: "6" },
];
export const Reportstype = [
  { type: "Extension", value: "3" },
  { type: "Ring groups", value: "2" },
];
export const company_Features = {
  phone_in_browser: "phone_in_browser",
  callhistory: "record_calls",
  calendar_integration: "calendar_integration",
  whatsapp: "whatsapp",
  extension: "extension",
  ring_group: "ring_group",
  conference: "conference",
  time_controls: "time_controls",
  reportage: "reportage",
};

export const RingStrategy = ["Hunt", "Ring all"];
export const trunkTransport = ["UDP", "TCP", "TLS"];
export const Multilinechart = {
  tikccolor: "rgb(165, 168, 173)",
  dataset1color: "#E15858",
  dataset2color: "#F5C10A",
};
export const Picharbgcolors = ["rgb(92, 182, 95)", "rgb(0, 127, 255)", "rgb(225, 88, 88)"];
export const Piechartsbordercolor = ["#ffffff", "#ffffff", "#ffffff"];
export const Piedarkbordercolor = ["rgb(40, 43, 47)", "rgb(40, 43, 47)", "rgb(40, 43, 47)"];
export const Piechartdata = [52.9, 37.0, 10.1];
export const Piechartlabels = ["Answered", "Called", "Missed"];
export const Light = "light";
export const Dark = "Dark";
export const Whitecolor = "rgb(255, 255, 255)";
export const Blackcolor = "rgb(23, 25, 28)";
export const Calendar = [
  { type: "1", value: "1" },
  { type: "2", value: "2" },
  { type: "3", value: "3" },
  { type: "4", value: "4" },
];
export const image_type = ["jpg", "jpeg", "png", "gif", "svg"];
export const Usertype = [{ item: "User" }, { item: "Admin" }];
export const Usertype_Admin = "Admin";
export const Usertype_User = "User";
export const EXTENSIONVALALL = /^\d{3,15}$/;
export const Fi = "fi";
export const Password = "Password";
export const new_Password = "new_password";
export const voicemailNumber = "*98";
export const Girdlinelightcolor = "rgba(225, 232, 237, 0.967)";
export const Gridlinedarkcolor = "rgba(255, 255, 255, 0.09)";
export const defaultactiveKeyname = "logs";
export const Todaylables = Array.from(
  { length: 24 },
  (_, index) => `${String(index).padStart(2, "0")}`
);
export const Weeklables = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const Monthlables = Array.from({ length: 31 }, (_, index) => `${index + 1}`);
export const Yearlables = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const Category = [
  { value: "", name: "All" },
  { value: "outbound", name: "Outbound" },
  { value: "inbound", name: "Inbound" },
  { value: "local", name: "Internal" },
];
