import React, {
  Suspense,
  lazy,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { Row, Col } from "react-bootstrap";
import "./DashboardCss.css";
import "./CustomeChartCss.css";
import "react-datepicker/dist/react-datepicker.css";
import { Badge, Card, ProgressBar } from "react-bootstrap";
import { ReactComponent as Call_logo } from "../../Assets/Icon/call_logo.svg";
import ChartDataComponent, { dummyData } from "./DummyData";
import { chartData } from "./DummyData";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import RingGroupModal from "../Modal/RingGroupModal";
import {
  Todaylables,
  Weeklables,
  Yearlables,
  defaultactiveKeyname,
  Multilinechart,
} from "../ConstantConfig";
// import CallDetailByIdPage from "./CallDetailsByIdPage"

// Immediately loaded components
const DashboardHeaderDatePicker = lazy(() =>
  import("./DashboardHeaderDatePicker")
);
const ChartCardDashboard = lazy(() => import("./ChartCardDashboard"));
const DashboardCardDetails = lazy(() => import("./DashboardCardDetails"));
const CardsDashboard = lazy(() => import("./CardsDashboard"));
const CallMetricsDashboard = lazy(() => import("./CallMetricsDashboard"));

// Lazy loaded components
// const RingGroupModal = lazy(() => import("../Modal/RingGroupModal"));
const CallDetailDashboard = lazy(() => import("./CallDetailDashboard"));
const RingsGroupDashboard = lazy(() => import("./RingsGroupDashboard"));
const NoticeBoardDashboard = lazy(() => import("./NoticeBoardDashboard"));
const MissedCallDashboard = lazy(() => import("./MissedCallDashboard"));

function DashboardDesign() {
  let Role = Cookies.get("role");
  let Token = Cookies.get("Token");
  const theme = Cookies.get("Theme");
  const Theme = useSelector((state) => state?.Theme?.Theme);
  const { t } = useTranslation();
  const [progress, setProgress] = useState(20);
  const [progress1, setProgress1] = useState(86);
  const [activeKey, setActiveKey] = useState(defaultactiveKeyname);
  const [search, setSearch] = useState(""); // Search query
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [activeTabs, setActiveTabs] = useState("today");
  const [activeTabs2, setActiveTabs2] = useState("today");
  const [tableHight, setTableHight] = useState(window.innerHeight - 500);
  const [show, setShow] = useState(false);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const data = useSelector((state) => state.getapiall.getapiall.dashboardData);
  console.log(data, "datacheckfinaldone");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const [formData, setFormData] = useState({
    ringgroup: "",
    ringgroupdesc: "",
    ringgroupphno: "",
    ringgroupstgy: 0,
    ringgroupremote: 0,
    ringgroupendpnt: 0,
  });
  const [sliderValue, setSliderValue] = useState(0);
  const [startDate, setStartDate] = useState(formatDate(startOfDay));
  const [endDate, setEndDate] = useState(formatDate(endOfDay));
  const [ringDropdown, setRingDropDown] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  // console.log(dashboardData, "dashboardDatacheck");
  const [selectType, setSelectType] = useState({
    id: "",
    display: "",
  });
  const [checkboxStates, setCheckboxStates] = useState({
    musicOnHold: 0,
    skipBusyAgent: 0,
    remoteCallPickup: 0,
  });
  const [selectExtension, setSelectExtension] = useState({
    app: "",
    data: "",
    display: "",
  });
  const [selectedValuesSecond, setSelectedValuesSecond] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedValuesFirst, setSelectedValuesFirst] = useState([]);
  const [allDropdown, setAllDropDown] = useState({});
  const dispatch = useDispatch();

  const [filter, setfilter] = useState(false);
  const handledatefilter = () => {
    if (startDate && endDate) {
      setfilter(!filter);
    }
  };
  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.DROPDOWN.URL.RING,
        Token: Token,
        urlof: config.DROPDOWN.KEY.RING,
      })
    ).then((response) => {
      setRingDropDown(response?.payload?.response?.data || {});
    });
  }, []);

  useEffect(() => {
    const formattedDate = formatDate(new Date(startDate));
    const formattedEndDate = formatDate(new Date(endDate));
    dispatch(
      getapiAll({
        Api: `${config.DASHBOARD.GET}?start_date=${encodeURIComponent(
          formattedDate
        )}&end_date=${encodeURIComponent(
          formattedEndDate
        )}&call_matrics_type=${activeTabs}&call_matrics_type2=${activeTabs2}`,
        Token: Token,
        urlof: config.DASHBOARD_KEY.GET,
      })
    ).then((response) => {
      console.log("responsecheck", response);
      setDashboardData(response?.payload?.response?.data || {});
    });
  }, [dispatch, activeTabs, activeTabs2, filter]);

  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.DROPDOWN.URL.ALL_GET,
        Token: Token,
        urlof: config.DROPDOWN.KEY.ALL_GET,
      })
    ).then((response) => {
      setAllDropDown(response?.payload?.response?.data || {});
    });
  }, []);
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 400;
      setTableHight(windowHeight);
    };
    // calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, tableHight]);

  const handleSelect = (key) => {
    setActiveKey(key);
  };
  const targetRef = useRef(null);
  const [timelineHeight, setTimelineHeight] = useState("");
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);

  const updateHeight = () => {
    if (targetRef.current) {
      const targetHeight = targetRef.current.offsetHeight;
      setTimelineHeight(targetHeight);
    }
  };

  useLayoutEffect(() => {
    if (isComponentLoaded) {
      updateHeight();
    }
    window.addEventListener("resize", updateHeight);
    window.addEventListener("load", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("load", updateHeight);
    };
  }, [isComponentLoaded]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = sortColumn
    ? dummyData.sort((a, b) => {
        const columnA = a[sortColumn];
        const columnB = b[sortColumn];
        if (columnA < columnB) return sortDirection === "asc" ? -1 : 1;
        if (columnA > columnB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : dummyData;

  const paginatedData = sortedData.map((row, index) => (
    <tr
      key={index}
      className="table-new new-data-table"
      style={{ marginBottom: "3px !important" }}
    >
      <td
        className="table-new table-custom-body-td"
        style={{ width: "17.5%", display: "flex", alignItems: "center" }}
      >
        {row.createdDate}
      </td>
      <td
        className="table-new table-custom-body-td"
        style={{ width: "13.5%", display: "flex", alignItems: "center" }}
      >
        {row.callerID}
      </td>
      <td
        className="table-new table-custom-body-td table-caller"
        style={{ width: "13.5%", display: "flex", alignItems: "center" }}
      >
        {row.callerName}
      </td>
      <td
        className="table-new table-custom-body-td"
        style={{ width: "15.5%", display: "flex", alignItems: "center" }}
      >
        {row.receiverID}
      </td>
      <td
        className="table-new table-custom-body-td"
        style={{ width: "9%", display: "flex", alignItems: "center" }}
      >
        {row.endpoint}
      </td>
      <td
        className="table-new table-custom-body-td"
        style={{ width: "12.5%", display: "flex", alignItems: "center" }}
      >
        {row.duration}
      </td>
      <td
        className="table-new table-custom-body-td new-calltype"
        style={{ width: "12.5%", display: "flex", alignItems: "center" }}
      >
        {row.callType}
      </td>
      <td
        className="table_edit2dash table-new table-custom-body-td"
        style={{ width: "7.5%" }}
      >
        <button>
          <Call_logo width={14} height={14} className="edithoverdash" />
        </button>
      </td>
    </tr>
  ));

  const handleProgressClick = (newPercent) => {
    setProgress(newPercent);
  };

  const handleProgressClick1 = (newPercent) => {
    setProgress1(newPercent);
  };

  const handleSelects = (key) => {
    setActiveTabs(key);
  };

  const handleSelects2 = (key) => {
    setActiveTabs2(key);
  };

  let totalMissedCalled = 0;
  let totalCalled = 0;
  let totalAvgWaitTime = 0;
  // Iterate missed call data and set for graph
  const missedCalledData = data?.DashboardDetail?.missed_call_new?.map(
    (item) => {
      totalMissedCalled += item.count;
      totalCalled += item.total_count;
      totalAvgWaitTime += Math.round(item.total_waiting_time);
      return item;
    }
  );
  console.log(
    "missedCall",
    missedCalledData,
    totalMissedCalled,
    totalAvgWaitTime,
    totalCalled
  );

  const Monthlables = Array.from(
    { length: data?.DashboardDetail?.missed_call_new?.length || 0 },
    (_, index) => `${index + 1}`
  );
  console.log("momty", Monthlables);

  const [Linechartlabels, setLinechartlabels] = useState([]);
  useEffect(() => {
    if (data && activeTabs2) {
      if (activeTabs2 === "today") {
        setLinechartlabels(Todaylables);
      } else if (activeTabs2 === "week") {
        setLinechartlabels(Weeklables);
      } else if (activeTabs2 === "month") {
        setLinechartlabels(Monthlables);
      } else {
        setLinechartlabels(Yearlables);
      }
    }
  }, [activeTabs2, data]);

  const multilinechart = {
    labels: Linechartlabels.map((val) => t(val)), //changed
    // labels: missedCalledData?.map((item) => item.key.replaceAll("/", ".")),
    datasets: [
      {
        label: t("Missed"),
        data: missedCalledData?.map((item) => item.count),
        // data: [0, 0, 0, 0, 10, 0, 0],
        borderColor: Multilinechart.dataset1color,
        backgroundColor: Multilinechart.dataset1color,
        borderWidth: 2,
        yAxisID: "y",
        pointLabel: {
          display: true, // Show the labels on the data points
          formatter: function (value, index) {
            return value; // Display the data value as the label
          },
        },
      },
      {
        label: t("Average waiting time"),
        data: missedCalledData?.map((item) => Math.round(item.total_waiting_time)),
        // data: [15, 18, 14, 15, 17, 16, 14, 17, 16, 14],
        borderColor: Multilinechart.dataset2color,
        backgroundColor: Multilinechart.dataset2color,
        borderWidth: 2,
        yAxisID: "y1",
        pointLabel: {
          display: true, // Show the labels on the data points
          formatter: function (value, index) {
            return value;
          },
        },
      },
    ],
  };

  // const headersData = {
  //   missedcall: data?.DashboardDetail?.reports_counts_updated?.sla ?? 0,
  // };
  const openModal = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const screensize = window.innerWidth < 992;
  const extentiondata = [
    { id: 1, border: "5px solid var(--main-grey-color)" },
    { id: 2, border: "5px solid var(--main-grey-color)" },
    { id: 3, border: "5px solid var(--main-grey-color)" },
    { id: 4, border: "5px solid var(--main-grey-color)" },
    { id: 5, border: "5px solid var(--main-grey-color)" },
    { id: 6, border: "5px solid var(--main-grey-color)" },
    { id: 7, border: "0px solid var(--main-grey-color)" },
  ];

  const handleComponentLoad = () => {
    setIsComponentLoaded(true);
  };

  return (
    <div id="main-content" style={{ padding: "11px 9px" }}>
      <Suspense fallback={<div></div>}>
        <div className="container-fluid" onLoad={handleComponentLoad}>
          <div className="block-header">
            <div className="row clearfix">
              <div
                className="col-md-6 col-sm-12 col-name"
                style={{ marginLeft: "4px" }}
              >
                <span className="dashboardtext">{t("Dashboard")}</span>
              </div>
            </div>
          </div>

          <div className="row clearfix" style={{ marginBottom: "30px" }}>
            <DashboardHeaderDatePicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handledatefilter={handledatefilter}
            />
          </div>

          <div className="row clearfix">
            <Suspense fallback={<div></div>}>
              <ChartCardDashboard chartData={ChartDataComponent()} />
            </Suspense>
          </div>

          <div className="row clearfix">
            <DashboardCardDetails />
          </div>

          <div className="row clearfix">
            <CardsDashboard
              progress={progress}
              handleProgressClick={handleProgressClick}
              progress1={progress1}
              handleProgressClick1={handleProgressClick1}
            />
          </div>

          <div style={{ height: screensize ? "900px" : "470px" }}>
            <CallMetricsDashboard
              activeTabs={activeTabs}
              handleSelects={handleSelects}
              screensize={screensize}
              Theme={Theme}
              theme={theme}
            />
          </div>

          <Row className="clearfix mt-3">
            <Col lg={8} className="p-0">
              <div className="multilinechart">
                <MissedCallDashboard
                  activeTabs2={activeTabs2}
                  handleSelects2={handleSelects2}
                  multilinechart={multilinechart}
                  totalMissedCalled={totalMissedCalled}
                  totalCalled={totalCalled}
                  totalAvgWaitTime={totalAvgWaitTime}
                  targetRef={targetRef}
                  Theme={Theme}
                  theme={theme}
                  missedCalledData={missedCalledData}
                  // headersData={headersData}
                />
              </div>
            </Col>

            <Col lg={4} className="p-0 noticeboardchart">
              <NoticeBoardDashboard timelineHeight={timelineHeight} />
            </Col>
          </Row>

          <div className="row clearfix">
            <Col lg={4} md={12} sm={12} className="col-name p-0">
              <RingsGroupDashboard
                openModal={openModal}
                progress1={progress1}
                handleProgressClick1={handleProgressClick1}
              />
            </Col>

            <Col lg={8} md={12} className="col-name p-0">
              <Card className="dear-card" style={{ height: "100%" }}>
                <Card.Header className="call_metrics">
                  <h2 style={{ marginBottom: "20px" }}>{t("Extensions")}</h2>
                </Card.Header>
                <div className="table-container3 dashboardtablescroll">
                  <div className="table-responsive new-table-responsive">
                    <table className=" table-news table m-0 ">
                      {console.log(data, "try and test")}
                      <tbody>
                        {data?.DashboardDetail?.extensions_detail?.extension_list?.map(
                          (val) => {
                            if (val) {
                              const localCalls = Number(val?.local_calls) || 0;
                              const answered = Number(val?.answered) || 0;
                              const missed = Number(val?.missed) || 0;

                              const total = localCalls + answered + missed;

                              const localCallsPercent =
                                total > 0
                                  ? ((localCalls / total) * 100).toFixed(0)
                                  : 0;
                              const answeredPercent =
                                total > 0
                                  ? ((answered / total) * 100).toFixed(0)
                                  : 0;
                              const missedPercent =
                                total > 0
                                  ? ((missed / total) * 100).toFixed(0)
                                  : 0;
                              console.log(
                                localCallsPercent,
                                answeredPercent,
                                missedPercent,
                                "missedPercentcheck"
                              );
                              return (
                                <tr
                                  className="table-custom-body-trs"
                                  style={{
                                    borderBottom:
                                      "5px solid var(--main-grey-color)",
                                    padding: "20px",
                                  }}
                                  // key={val.user_extension} // Add a unique key
                                  key={val?.userDetails.user_extension} // Add a unique key
                                >
                                  <td
                                    className="table-custom-body-td"
                                    style={{ padding: "0.5rem" }}
                                  >
                                    <a href="#" className="name-atag">
                                      {/* {val?.first_name}{" "}
                                      {val?.last_name}  */}
                                      {val?.userDetails?.first_name}{" "}
                                      {val?.userDetails?.last_name}
                                    </a>
                                    <p className="mb-0 text-muted text-size">
                                      {t("Status")}:{" "}
                                      <Badge
                                        variant="success"
                                        className="but-badge"
                                        // style={ {color: val?.is_online === 0 ? "var(--main-orangecustomermodal-color)" : "var(--main-green-color)"} }
                                        style={{
                                          color:
                                            val?.userDetails?.is_online === 0
                                              ? "var(--main-orangecustomermodal-color)"
                                              : "var(--main-green-color)",
                                        }}
                                      >
                                        {/* {val?.is_online === 0 */}
                                        {val?.userDetails?.is_online === 0
                                          ? t("Offline")
                                          : t("Online")}
                                      </Badge>
                                    </p>
                                  </td>
                                  <td
                                    className="text-right table-custom-body-td"
                                    style={{ padding: "0.5rem" }}
                                  >
                                    <h6 className="font-14 mb-0 text-size small-cusnum">
                                      {/* {val?.user_extension} */}
                                      {val?.userDetails.user_extension}
                                    </h6>
                                    <span className="text-muted text-size">
                                      {t("Extension")}
                                    </span>
                                  </td>
                                  <td
                                    className="w250 table-custom-body-td"
                                    style={{
                                      width: "45%",
                                      padding: "0.5rem",
                                      paddingLeft: "calc( 0.5rem + 10px )",
                                    }}
                                  >
                                    <ProgressBar className="progress-height">
                                      <ProgressBar
                                        now={Number(localCallsPercent)}
                                        style={{
                                          background:
                                            "var(--main-borderblue-color)",
                                        }}
                                      />
                                      <ProgressBar
                                        variant="green"
                                        now={Number(answeredPercent)}
                                      />
                                      <ProgressBar
                                        variant="red"
                                        now={Number(missedPercent)}
                                      />
                                    </ProgressBar>
                                    <div className="d-flex bd-highlight mt-2 justify-content-start">
                                      <div className="flex-fill bd-highlight">
                                        <small className="per-size">
                                          <i
                                            className="fa fa-phone-square text-blue"
                                            style={{ fontSize: "14px" }}
                                          ></i>{" "}
                                          {localCallsPercent}% {t("Called")}
                                        </small>
                                      </div>
                                      <div className="flex-fill bd-highlight">
                                        <small className="per-size">
                                          <i
                                            className="fa fa-phone-square text-green"
                                            style={{ fontSize: "14px" }}
                                          ></i>{" "}
                                          {answeredPercent}% {t("Answered")}
                                        </small>
                                      </div>
                                      <div className="flex-fill bd-highlight">
                                        <small className="per-size">
                                          <i
                                            className="fa fa-phone-square text-danger"
                                            style={{ fontSize: "14px" }}
                                          ></i>{" "}
                                          {missedPercent}% {t("Missed")}
                                        </small>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </Col>
          </div>

          <div className="row clearfix">
            <CallDetailDashboard
              activeKey={activeKey}
              handleSelect={handleSelect}
              search={search}
              setSearch={setSearch}
              handleSort={handleSort}
              tableHight={tableHight}
              paginatedData={paginatedData}
              startdate={startDate}
              filter={filter}
              enddate={endDate}
            />
          </div>
        </div>
      </Suspense>
      {show && (
        <RingGroupModal
          ringDropdown={ringDropdown}
          apidropdown={allDropdown}
          handleClosee={handleClose}
          show={show}
          header={t("Ring group modal")}
          formData={formData}
          setFormData={setFormData}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          selectedValuesFirst={selectedValuesFirst}
          setSelectedValuesFirst={setSelectedValuesFirst}
          // checkboxStates={checkboxStates}
          // setCheckboxStates={setCheckboxStates}
          selectedValuesSecond={selectedValuesSecond}
          setSelectedValuesSecond={setSelectedValuesSecond}
          loader=""
          loader2=""
          selectType={selectType}
          setSelectType={setSelectType}
          setSelectExtension={setSelectExtension}
          selectExtension={setSelectExtension}
          filteredList={filteredList}
          setFilteredList={setFilteredList}
        />
      )}
      {/* <CallDetailByIdPage /> */}
    </div>
  );
}

export default DashboardDesign;
