import React, {
  Suspense,
  lazy,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

import { dummyData } from "../DummyData";
import config from "../../../config";
import { getapiAll } from "../../../Redux/Reducers/ApiServices";
import RingGroupModal from "../../Modal/RingGroupModal";
import { useDashboardStatistic } from "../../../requests/queries";
import {
  ChartCard,
  DashboardCardDetails,
  InfoCard,
  CallMetrics,
  MissedCalls,
  ExtensionsDetails,
  CallsDetails,
} from "./components";
import { useQueryParams } from "../../../hooks";

import "./DashboardCss.css";
import "./CustomeChartCss.css";
import "react-datepicker/dist/react-datepicker.css";

import { ReactComponent as Call_logo } from "../../../Assets/Icon/call_logo.svg";

// Immediately loaded components
const DashboardHeaderDatePicker = lazy(
  () => import("../DashboardHeaderDatePicker")
);

export default function DashboardDesign() {
  let Token = Cookies.get("Token");

  const { t } = useTranslation();

  const [tableHight, setTableHight] = useState(window.innerHeight - 500);
  const [show, setShow] = useState(false);
  const formatDate = (date: Date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  const [formData, setFormData] = useState({
    ringgroup: "",
    ringgroupdesc: "",
    ringgroupphno: "",
    ringgroupstgy: 0,
    ringgroupremote: 0,
    ringgroupendpnt: 0,
  });
  const [sliderValue, setSliderValue] = useState(0);
  const [ringDropdown, setRingDropDown] = useState([]);

  const [selectType, setSelectType] = useState({
    id: "",
    display: "",
  });

  const { start, end, tab, search } = useQueryParams(
    [
      { key: "start" as const },
      { key: "end" as const },
      { key: "search" as const },
      { key: "tab" as const, allowedValues: ["logs", "logsgroup", "logsextension"] as const },

      { key: "call_metrics" as const },
      { key: "missed_calls" as const },
    ],
    {
      start: formatDate(new Date()),
      end: formatDate(new Date()),
      tab: "logs",
      call_metrics: "today",
      missed_calls: "today",
    }
  );

  const { data } = useDashboardStatistic({
    startDate: start.value as string,
    endDate: end.value as string,
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

  useEffect(() => {
    // @ts-ignore
    dispatch(
      // @ts-ignore
      getapiAll({
        Api: config.DROPDOWN.URL.ALL_GET,
        Token: Token,
        urlof: config.DROPDOWN.KEY.ALL_GET,
      })
    ).then((response: any) => {
      setAllDropDown(response?.payload?.response?.data || {});
    });
  }, []);
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 400;
      setTableHight(windowHeight);
    };
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, tableHight]);

  const targetRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState<number>();
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

  const paginatedData = dummyData.map((row, index) => (
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

  const handleClose = () => {
    setShow(false);
  };

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
              startDate={start.value}
              setStartDate={(date: Date) => start.set(formatDate(date))}
              endDate={end.value}
              setEndDate={(date: Date) => end.set(formatDate(date))}
            />
          </div>

          <div className="row clearfix">
            <ChartCard
              totalAnswered={data?.total_counts?.total_answered || 0}
              totalMissed={data?.total_counts?.total_missed || 0}
              totalCalls={data?.total_counts?.total_calls || 0}
              responseTime={data?.total_counts?.avg_response_sec || 0}
            />
          </div>

          <div className="row clearfix">
            <DashboardCardDetails valuedata={data?.total_counts} />
          </div>

          <div className="row clearfix">
            <InfoCard data={data?.total_counts} />
          </div>

          <CallMetrics
          />

          <MissedCalls />

          <ExtensionsDetails ringGroups={data?.ring_group || []} extensions={data?.data || []} />

          <div className="row clearfix">
            <CallsDetails
              activeKey={tab.value}
              handleSelect={tab.set}
              search={search.value}
              setSearch={search.set}
              tableHight={tableHight}
              paginatedData={paginatedData}
              startdate={start.value}
              enddate={end.value}
            />
          </div>
        </div>
      </Suspense>
      {show && (
        // @ts-ignore
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
