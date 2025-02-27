import React, { useRef, useState, useEffect } from "react";
import { Col, ButtonGroup, Form, Nav, Tab, Table } from "react-bootstrap";
import up_arrow from "../../Assets/Icon/up-arrow.svg";
import down_arrow from "../../Assets/Icon/down-arrow.svg";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Call_logo } from "../../Assets/Icon/playrecording.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import Cookies from "js-cookie";
import Paginationall from "./Paginationall";
import { useDispatch } from "react-redux";
import { postapiAll } from "../../Redux/Reducers/ApiServices";
import config from "../../config";
import { useId } from "react";
import Callrecordingdashboard from "../Modal/Callrecordingdashboard";
import { useTranslation } from "react-i18next";
import Loader from "../Loader";
import { Category } from "../ConstantConfig";
import CustomDropDown from "../CustomDropDown";
import Utils from "../../utils";

function CallDetailDashboard({ activeKey, handleSort, tableHight, paginatedData, handleSelect, startdate, enddate, filter }) {
  let Role = Cookies.get("role");
  const { t } = useTranslation();
  const [fetchData, setFetchData] = useState([]);
  const token = Cookies.get("Token");
  const abortControllerRef = useRef(null);
  const dispatch = useDispatch();
  const formattedDate = startdate && new Date(startdate).toLocaleDateString("en-CA");
  const formattedEnddata = enddate && new Date(enddate).toLocaleDateString("en-CA");
  const [searchTerm, setSearchterm] = useState("");
  const [ascending, setAscending] = useState(false);
  const [select, setselect] = useState(10);
  const [sortedColumn, setSortedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listner, setListner] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [callerid, setcallerid] = useState("");
  const [callername, setcallername] = useState("");
  const [createdat, setcreatedat] = useState("");
  const [Extensiontype, setextensiontype] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [Direction, setDirection] = useState("");
  const [timezone, setTimezone] = useState();
  const [sortBy, setSortBy] = useState("start_stamp");

  const convertUtcToTimezone = (utcDate, timeZone) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(utcDate));
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };
  useEffect(() => {
    if (activeKey) {
      if (activeKey === "logsextension") {
        setextensiontype(3);
      } else if (activeKey === "logsgroup") {
        setextensiontype(2);
      } else if (activeKey === "logs") {
        setextensiontype(0);
      }
      setSearchterm("");
      setCurrentPage(1);
      setselect(10);
    }
  }, [activeKey]);
  const handlelistner = (val) => {
    const formattedDate = new Date(val?.start_stamp).toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setListner(true);
    setRecordingUrl(val?.recording_url);
    setcallerid(val?.caller_id_number);
    setcallername(val?.caller_id_name);
    setcreatedat(formattedDate);
  };
  const handleCloseListner = () => {
    setListner(false);
    setRecordingUrl("");
  };

  //new
  const [internalCalls, setInternalCalls] = useState(true);
  const handleInternalCalls = () => {
    setInternalCalls(!internalCalls);
  };

  const userid = Cookies.get("User_id");
  const [loading, setLoading] = useState(false);
  const [dashboartdata, setdashboartdata] = useState([]);

  const companyid = Cookies.get("Company_Id");
  useEffect(() => {
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const inputdata = {
      internal_calls: internalCalls, //new
      search: searchTerm,
      size: select,
      direction: Direction,
      start_date: formattedDate,
      end_date: formattedEnddata,
      page: currentPage,
      cid: companyid,
      select_type: Extensiontype,
      sort_by: sortBy,
      sort_order: ascending,
      ...(userid ? { extension_id: userid } : {}),
    };
    dispatch(
      postapiAll({
        inputData: inputdata,
        Api: config.CDR.CDR_DOMAIN_LIST_LIST,
        Token: token,
        urlof: config.CDR.CDR_DOMAIN_LIST_LIST,
        signal: abortController.signal,
      })
    ).then((response) => {
      if (response?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setLoading(false);
        const data = response?.payload?.response?.data;

        setFetchData(data);
        setdashboartdata(data?.cdr_list);
        setTimezone(data?.timezone);
      }
    });
  }, [
    searchTerm,
    internalCalls, // new
    select,
    currentPage,
    filter,
    Role,
    Extensiontype,
    Direction,
    ascending,
  ]);

  const convertToSeconds = (duration) => {
    if (typeof duration === "number") {
      return duration;
    } else if (/^\d+$/.test(duration)) {
      return parseInt(duration, 10);
    }
    return 0;
  };
  const sortingTable = (name) => {
    if (!dashboartdata) return;
    if (sortedColumn !== name) {
      setAscending(true);
    } else {
      setAscending(!ascending);
    }
    setSortBy(name);
    setSortedColumn(name);
  };
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    if (!newSearchTerm.trim()) {
      setSearchterm("");
    } else {
      setSearchterm(newSearchTerm);
      setCurrentPage(1);
    }
  };
  let startEntry = (currentPage - 1) * select + 1;
  if (fetchData?.total_record === 0) {
    startEntry = 0;
  }
  let endEntry = currentPage * select;
  if (endEntry > fetchData?.total_record) {
    endEntry = fetchData?.total_record;
  }
  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData("text/plain");
    if (!clipboardData.startsWith(" ")) {
      setSearchterm(clipboardData.trim());
    }
  };
  const arrowShow = (val) => {
    return (
      <div>
        <Uparrow
          width={10}
          height={20}
          style={{
            filter: sortedColumn === val && !ascending ? "opacity(0.5)" : "",
          }}
        />
        <Downarrow
          width={10}
          height={20}
          style={{
            filter: sortedColumn === val && ascending ? "opacity(0.5)" : "",
            marginLeft: "-4px",
          }}
        />
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDirection(value);
  };
  const handleSelection = (dropdown, value) => {
    const syntheticEvent = {
      target: {
        name: dropdown,
        value: value,
      },
    };
    handleChange(syntheticEvent);

    setOpenDropdown(null); // Close the dropdown after selection
  };
  const Tablelist = () => {
    return (
      <div>
        <Form.Group className="form-groups ">
          <Form.Group className="ml-2 mb-0">
            <div className="show">
              <h6>{t("Show")}</h6>
              <div className="select_entry">
                <Form.Select aria-label="Default select example" onChange={(e) => (setselect(e.target.value), setCurrentPage(1))} value={select}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Form.Select>
              </div>
              <h6>{t("entries")}</h6>
            </div>
          </Form.Group>
          <div style={{ display: "flex", alignItems: "center" }} className="formdasboard">
            {/* new */}
            <div className="internal-call-modal-head d-flex justify-content-around" style={{ width: "140%", marginRight: "20px" }}>
              {t("Hide internal calls")}
              <label className="internal-call-switch" style={{ marginLeft: "8px" }}>
                <input type="checkbox" checked={internalCalls} onChange={handleInternalCalls} />
                <span className="internal-call-slider"></span>
              </label>
            </div>
            <h6 style={{ fontWeight: "400" }}>{t("Category")}:</h6>
            <div className="ml-2" style={{ width: "auto" }}>
              <CustomDropDown
                toggleDropdown={toggleDropdown}
                showValue={Direction}
                openDropdown={openDropdown}
                valueArray={Category}
                handleSelection={handleSelection}
                name={"Direction"}
                defaultValue={t("All")}
                mapValue={"name"}
                storeValue={"value"}
                setOpenDropdown={setOpenDropdown}
              />
            </div>
            <h6 style={{ fontWeight: "400" }} className="ml-2">
              {t("Search")}:
            </h6>
            &nbsp;&nbsp;&nbsp;
            <Form.Control type="text" className="new-daata search-bg" onChange={handleSearchChange} value={searchTerm} onPaste={handlePaste} />
          </div>
        </Form.Group>
        <div className="table-container" style={{ overflowY: "auto" }}>
          <Table className="table-new border-space">
            <thead>
              <tr className="table-new d-flex ">
                <th className="table-new table-custom-body-td m-0" onClick={() => sortingTable("start_stamp")} style={{ width: "21%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Date")}</p>
                    {arrowShow("start_stamp")}
                  </div>
                </th>
                <th className="table-new table-custom-body-td m-0" onClick={() => sortingTable("caller_id_number")} style={{ width: "13.25%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Caller ID")}</p>
                    {arrowShow("caller_id_number")}
                  </div>
                </th>
                <th className="table-new table-custom-body-td m-0" onClick={() => sortingTable("caller_id_name")} style={{ width: "14.28%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Caller Name")}</p>
                    {arrowShow("caller_id_name")}
                  </div>
                </th>
                {/* <th className="table-new table-custom-body-td" onClick={() => handleSort("receiverID")} style={{ width: "15.5%" }}>
            <div className="d-flex align-items-center justify-content-between">
              <p className="mb-0">Receiver ID</p>
              <div>
                <Uparrow width={10} height={20} />
                <Downarrow width={10} height={20} style={{ marginLeft: "-4px" }} />
              </div>
            </div>
          </th> */}
                <th className="table-new table-custom-body-td m-0" onClick={() => sortingTable("destination_number")} style={{ width: "14.28%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Endpoint")}</p>
                    {arrowShow("destination_number")}
                  </div>
                </th>
                <th className="table-new table-custom-body-td m-0" onClick={() => sortingTable("duration")} style={{ width: "14.28%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Duration")}</p>
                    {arrowShow("duration")}
                  </div>
                </th>
                <th className="table-new table-custom-body-td m-0" onClick={() => sortingTable("direction")} style={{ width: "14.28%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Call Type")}</p>
                    {arrowShow("direction")}
                  </div>
                </th>
                <th className="table-new table-custom-body-td m-0" onClick={() => sortingTable("status")} style={{ width: "14.28%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Call Status")}</p>
                    {arrowShow("status")}
                  </div>
                </th>
                <th className="table-new table-custom-body-td m-0" style={{ width: "10%", fontWeight: "700" }}>
                  {t("Record")}
                </th>
              </tr>
            </thead>
            <tbody
              style={{
                overflowY: "auto",
                maxHeight: "250px",
                display: "block",
                width: "100%",
              }}
              className="dashboardtablescroll"
            >
              {/* {paginatedData} */}
              {loading ? (
                <div className="dashtableloading" style={{ height: "250px" }}>
                  {" "}
                  <Loader />
                </div>
              ) : (
                <>
                  {dashboartdata && dashboartdata.length > 0 ? (
                    <>
                      {dashboartdata
                        // .filter(
                        //   (item) => !item.destination_number.includes("*")
                        // )
                        .map((row, index) => {
                          {
                            console.log("dashboard", dashboartdata);
                          }
                          const formatTime = (seconds) =>
                            `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}:${String(seconds % 60).padStart(
                              2,
                              "0"
                            )}`;
                          const formattedTime = formatTime(row?.duration);
                          const date = new Date(row?.start_stamp);
                          console.log("date", date);

                          //new
                          // const formattedDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;

                          const formattedDate = Utils.dateDisplay(date);

                          function extractTimeFromDate(dateString, locale) {
                            const date = new Date(dateString);
                            return date.toLocaleTimeString(locale, {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              timeZone: timezone,
                              hourCycle: "h24",
                            });
                          }
                          return (
                            <>
                              <tr key={index} className="table-new new-data-table" style={{ marginBottom: "3px !important" }}>
                                {/* changed */}
                                <td
                                  className="table-new table-custom-body-td"
                                  style={{
                                    width: "21%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {formattedDate} {/* {Utils.timeDisplay(new Date(row?.start_stamp))} */}
                                  {extractTimeFromDate(row?.start_stamp)}
                                </td>

                                <td
                                  className="table-new table-custom-body-td"
                                  style={{
                                    width: "13%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="overflowdashboaard">
                                    {row.status == "answered" && row.leg == "b" ? row.source_number : row.caller_id_number}
                                    {/* {row.caller_id_number} */}
                                  </div>
                                </td>
                                <td
                                  className="table-new table-custom-body-td table-caller"
                                  style={{
                                    width: "14.28%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="overflowdashboaard">{row.caller_id_name}</div>
                                </td>
                                {/* <td
                                  className="table-new table-custom-body-td"
                                  style={{
                                    width: "15.5%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  4343
                                </td> */}
                                <td
                                  className="table-new table-custom-body-td"
                                  style={{
                                    width: "14.28%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="overflowdashboaard">{row.destination_number}</div>
                                </td>
                                <td
                                  className="table-new table-custom-body-td"
                                  style={{
                                    width: "14.28%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* CHANGED */}
                                  <div className="overflowdashboaard">
                                    {/* {formattedTime}{" "} */}
                                    {row.duration == undefined ? "00:00:00" : formattedTime}{" "}
                                  </div>
                                </td>
                                <td
                                  // className="table-new table-custom-body-td new-calltype"
                                  className="table-new table-custom-body-td"
                                  style={{
                                    width: "14.28%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="overflowdashboaard">{t(row.direction) == "local" ? t("internal") : t(row?.direction)}</div>
                                </td>

                                {/* new / remove it */}
                                <td
                                  // className="table-new table-custom-body-td new-calltype"
                                  className="table-new table-custom-body-td"
                                  style={{
                                    width: "14.28%",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="overflowdashboaard">{t(row?.status) != t("answered") ? t("missed") : t("answered")}</div>
                                </td>
                                <td className="table_edit2dash table-new table-custom-body-td" style={{ width: "9%" }}>
                                  <button
                                    disabled={!row.recording_url}
                                    style={{
                                      backgroundColor: !row.recording_url ? "var(--main-forgot-color)" : "var(--main-orange-color)",
                                      border: "none",
                                      opacity: !row.recording_url ? "0.5" : "",
                                    }}
                                    onClick={() => {
                                      handlelistner(row);
                                    }}
                                  >
                                    <Call_logo width={14} height={14} className="edithoverdash" />
                                  </button>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                    </>
                  ) : (
                    <div className="dashtableloading" style={{ height: "250px" }}>
                      {t("No data available in table")}
                    </div>
                  )}
                </>
              )}
            </tbody>
          </Table>
        </div>

        <div className="show show2 mt-2 mb-2 d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {fetchData?.total_record} {t("entries")}
          </h6>
          <div>
            <Paginationall totalPages={fetchData?.total_page} currentPage={currentPage} setcurrenPage={setCurrentPage} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="col-md-12 col-name p-0">
      <div className="card mb-4">
        <div className="call_metrics">
          <h2>{t("Call details")}</h2>
        </div>
        <Tab.Container activeKey={activeKey} onSelect={handleSelect}>
          <Nav variant="tabs" className="nav-tabs3">
            <Nav.Item>
              <Nav.Link eventKey="logs" className="nav-link2">
                {t("Call logs all")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="logsgroup" className="nav-link2">
                {t("Call logs ring group")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="logsextension" className="nav-link2">
                {t("Call logs extension")}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="mt-2">
            <Tab.Pane eventKey="logs">
              <div>{Tablelist()}</div>
            </Tab.Pane>
            <Tab.Pane eventKey="logsgroup">
              <div>{Tablelist()}</div>
            </Tab.Pane>
            <Tab.Pane eventKey="logsextension">
              <div>{Tablelist()}</div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
      {listner && (
        <Callrecordingdashboard show={listner} onHide={handleCloseListner} recordingUrl={recordingUrl} callerid={callerid} callername={callername} createdat={createdat} />
      )}
    </div>
  );
}

export default CallDetailDashboard;
