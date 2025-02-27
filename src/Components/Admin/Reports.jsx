import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import yes_logo from "../../Assets/Icon/yes.svg";
import edit_logo from "../../Assets/Icon/edit.svg";
import delete_logo from "../../Assets/Icon/delete.svg";
import { ReactComponent as CallLogo } from "../../Assets/Icon/call_logo.svg";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import NumberModal from "../Modal/NumberModal";
import DatePickers from "./DatePickers";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getapiAll, getapiAllWithBasicAuth, postapiAll } from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import config from "../../config";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";
import ListenRecordingModal from "../Modal/ListnerRecord";

export default function Reports() {
  const BASE_URL = process.env.REACT_APP_CRD_BY_UUID;
  const CDRList = useSelector((state) => state.getapiall.getapiall.crdlist);
  const [cdrFullList, setCdrFullList] = useState();
  const abortControllerRef = useRef(null);
  const [Row, setRow] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [searchTerm, setSearchterm] = useState("");
  const [ascending, setAscending] = useState(false);
  const [select, setselect] = useState(10);
  const [value, setvalue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedColumn, setSortedColumn] = useState("");
  const token = Cookies.get("Token");
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const companyid = Cookies.get("Company_Id");
  const [startDate, setStartDate] = useState(new Date());
  const [Direction, setDirection] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [extension, setextension] = useState([]);
  const [selectextension, setselectextension] = useState("");
  const [module, setModule] = useState("");
  const [Date1, setDate] = useState("");
  const [listner, setListner] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [filter, setfilter] = useState(false);
  const [sortBy, setSortBy] = useState("start_stamp");
  const formattedDate = startDate && new Date(startDate).toLocaleDateString("en-CA");
  const formattedEnddata = endDate && new Date(endDate).toLocaleDateString("en-CA");
  console.log("formattedEnddata", formattedDate);
  const clearSearch = () => {
    setSearchterm("");
  };
  const [internalCalls, setInternalCalls] = useState(true);
  const handleInternalCalls = () => {
    setInternalCalls(!internalCalls);
  };

  useEffect(() => {
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const inputdata = {
      search: searchTerm,
      internal_calls: internalCalls, //new
      size: select,
      direction: Direction,
      start_date: formattedDate,
      end_date: formattedEnddata,
      page: currentPage,
      cid: companyid,
      select_type: selectextension,
      sort_by: sortBy,
      sort_order: ascending,
      ...(extension ? { extension_id: extension } : {}),
    };
    //change
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
        // console.log("resssssssssssssssssssssssssssssss:",response)
        const data = response?.payload?.response?.data || [];
        setRow(data?.cdr_list);
        setFetchData(data);
        setLoading(false);
      }
    });
  }, [
    searchTerm,
    internalCalls, // new
    select,
    currentPage,
    filter,
    ascending,
  ]);
  const handlelistner = (URL, date) => {
    setDate(date);
    setAudioURL(URL);
    setListner(true);
  };

  const handleCloseListner = () => {
    setListner(false);
  };

  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const openModal = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 460;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  const handlefilter = () => {
    if (Direction !== null || startDate || endDate || selectextension) {
      setfilter(!filter);
      if (Direction === "") {
        setDirection(null);
      }
    }
  };

  const handlefilter2 = () => {
    if (Direction !== null || startDate || endDate || selectextension) {
      setDirection("");
      setStartDate("");
      setEndDate("");
      setselectextension("");
      setfilter(!filter);
    }
  };

  const convertToSeconds = (duration) => {
    if (typeof duration === "number") {
      return duration;
    } else if (/^\d+$/.test(duration)) {
      return parseInt(duration, 10);
    }
    return 0;
  };
  const sortingTable = (name) => {
    if (!Row) return;
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

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData("text/plain");
    if (!clipboardData.startsWith(" ")) {
      setSearchterm(clipboardData.trim());
    }
  };
  let startEntry = (currentPage - 1) * select + 1;
  if (fetchData?.total_record === 0) {
    startEntry = 0;
  }
  let endEntry = currentPage * select;
  if (endEntry > fetchData.total_record) {
    endEntry = fetchData.total_record;
  }
  const arrowShow = (val) => {
    return (
      <div>
        {listner && <ListenRecordingModal recordingUrl={audioURL} show={listner} onHide={handleCloseListner} recordDate={Date1} />}
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
  return (
    <div className="tablespadding">
      <AdminHeader openModal={openModal} pathname={t("Reports")} addBtn={true} />
      <DatePickers
        btn_name={t("Search")}
        fontwidth="300"
        marginb="mb-3"
        bgcolor="transparent"
        extension={extension}
        Direction={Direction}
        setDirection={setDirection}
        handlefilter={handlefilter}
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        handlefilter2={handlefilter2}
        selectextension={selectextension}
        setselectextension={setselectextension}
        setextension={setextension}
        lg={1}
      />
      <div className="num_table">
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry">
              <Form.Select aria-label="Default select example" onChange={(e) => (setselect(e.target.value), setCurrentPage(1))} value={select}>
                <option>10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Form.Select>
            </div>
            <h6>{t("entries")}</h6>
          </div>
          <div className="table_search" style={{ width: "450px" }}>
            <div className="internal-call-modal-head d-flex justify-content-between align-items-center" style={{ width: "580px", marginRight: "20px" }}>
              {t("Hide internal calls")}
              <label className="internal-call-switch" style={{ marginLeft: "8px" }}>
                <input type="checkbox" checked={internalCalls} onChange={handleInternalCalls} />
                <span className="internal-call-slider"></span>
              </label>
            </div>
            <h6>{t("Search")}:</h6>
            <Form.Control type="text" height={38} className="search-bg new-search-add" onChange={handleSearchChange} value={searchTerm} onPaste={handlePaste} />
            {searchTerm && <ClearSearch clearSearch={clearSearch} />}
          </div>
        </div>
        <div className="sidebar_scroll" style={{ overflowX: "auto", height: dynamicHeight, width: "100%" }}>
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "20%" }}>
                  <div className="d-flex align-items-center justify-content-between" onClick={() => sortingTable("start_stamp")}>
                    <p className="mb-0">{t("Date")}</p>
                    <div>{arrowShow("start_stamp")}</div>
                  </div>
                </th>
                <th style={{ width: "15%" }}>
                  <div className="d-flex align-items-center justify-content-between" onClick={() => sortingTable("caller_id_number")}>
                    <p className="mb-0">{t("Caller ID")} </p>
                    <div>{arrowShow("caller_id_number")}</div>
                  </div>
                </th>
                <th style={{ width: "18%" }}>
                  <div className="d-flex align-items-center justify-content-between" onClick={() => sortingTable("caller_id_name")}>
                    <p className="mb-0">{t("Caller Name")} </p>
                    <div>{arrowShow("caller_id_name")}</div>
                  </div>
                </th>
                <th style={{ width: "10%" }}>
                  <div className="d-flex align-items-center justify-content-between" onClick={() => sortingTable("destination_number")}>
                    <p className="mb-0">{t("Endpoint")} </p>
                    <div>{arrowShow("destination_number")}</div>
                  </div>
                </th>
                <th style={{ width: "12%" }}>
                  <div className="d-flex align-items-center justify-content-between" onClick={() => sortingTable("duration")}>
                    <p className="mb-0">{t("Duration")}</p>
                    <div>{arrowShow("duration")}</div>
                  </div>
                </th>
                <th style={{ width: "12%" }}>
                  <div className="d-flex align-items-center justify-content-between" onClick={() => sortingTable("status")}>
                    <p className="mb-0"> {t("Call type")}</p>
                    <div>{arrowShow("status")}</div>
                  </div>
                </th>
                <th style={{ width: "10%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Record")}</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    <Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {Row && Row.length > 0 ? (
                    Row?.filter((item) => !item.destination_number.includes("*")).map((val) => {
                      const formatTime = (seconds) =>
                        `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
                      const date = new Date(val?.start_stamp);
                      const formattedDate = new Date(date).toLocaleDateString("en-GB").replace(/\//g, ".");
                      const formattedTime = formatTime(val?.duration);
                      function extractTimeFromDate(dateString, locale) {
                        const date = new Date(dateString);
                        return date.toLocaleTimeString(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          // hourCycle: "h12",
                        });
                      }

                      return (
                        <>
                          <tr className="table_body">
                            <td style={{ padding: "22px" }}>
                              {formattedDate} {extractTimeFromDate(val?.start_stamp)}
                            </td>
                            <td style={{ padding: "22px" }}>{val.caller_id_number}</td>
                            <td style={{ padding: "22px" }}>{val.caller_id_name}</td>
                            <td style={{ padding: "22px" }}>{val.destination_number}</td>

                            <td style={{ padding: "22px" }}>{val.duration == null ? "00:00:00" : formattedTime} </td>
                            <td style={{ padding: "22px" }}> {t(val.direction)}</td>
                            <td className="table_edit2">
                              <button
                                disabled={!val.recording_url}
                                style={{
                                  backgroundColor: !val.recording_url ? "var(--main-searchGrey-color)" : "var(--main-orange-color)",
                                  border: "none",
                                  // opacity: !val.recording_url ? "0.5" : "",
                                }}
                                onClick={() => {
                                  handlelistner(val.recording_url, val.start_stamp);
                                }}
                              >
                                <CallLogo width={14} height={14} className="edithover" />
                              </button>
                              {/* <button className="ms-1"  onClick={handleEditListner}>
                              <EditLogo
                                width={14}
                                height={14}
                                className="edithover"
                              
                              />
                            </button>
                            <button className="ms-1" onClick={openDelete}>
                              <DeleteLogo
                                width={14}
                                height={14}
                                className="edithover"
                               
                              />
                            </button> */}
                            </td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <tr style={{ height: dynamicHeight - 50 }}>
                      <td style={{ width: "100%", textAlign: "center" }} colSpan="6">
                        {t("No data found")}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="show show2 mt-2 d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {fetchData.total_record} {t("entries")}
          </h6>
          <div>
            <Paginationall totalPages={fetchData.total_page} currentPage={currentPage} setcurrenPage={setCurrentPage} />
          </div>
        </div>
      </div>
      {show && <NumberModal handleClose={handleClose} show={show} />}
    </div>
  );
}
