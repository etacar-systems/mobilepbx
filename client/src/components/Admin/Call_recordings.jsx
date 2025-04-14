import React, { useEffect, useRef, useState } from "react";
import {AdminHeader} from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import DatePickers from "./DatePickers";
// import { ReactComponent as EditLogo } from "../../Assets/Icon/edit.svg";
// import { ReactComponent as DeleteLogo } from "../../Assets/Icon/delete.svg";
import { ReactComponent as CallLogo } from "../../Assets/Icon/call_logo.svg";
// import DeleteModal from "../Modal/DeleteModal";
import ListenRecordingModal from "../Modal/ListnerRecord";
// import EditRecording from "../Modal/EditRecording";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { postapiAll } from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import config from "../../config";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";

export default function Call_recordings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [listData, setListData] = useState([]);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [listner, setListner] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchterm] = useState("");
  const [select, setselect] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const abortControllerRef = useRef(null);
  const [count, setCount] = useState(0);
  const [countData, setCountData] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [Date1, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  let Token = Cookies.get("Token");
  const [filter, setfilter] = useState(false);
  const formattedStartDate = startDate && new Date(startDate).toLocaleDateString("en-CA");
  const formattedEnddata = endDate && new Date(endDate).toLocaleDateString("en-CA");
  // const [deletemodal, setDeletemodal] = useState(false);
  // const [editListner, setEditListner] = useState(false);

  // const handleEditListner = () => {
  //   setEditListner(true);
  // };

  // const handleDelete = () => {
  //   setDeletemodal(false);
  // };

  // const openDelete = () => {
  //   setDeletemodal(true);
  // };

  // const handleCloseEditListner = () => {
  //   setEditListner(false);
  // };

  // const handleCloseDelete = () => {
  //   setDeletemodal(false);
  // };
  const handlefilter = () => {
    if (startDate || endDate) {
      setfilter(!filter);
    }
  };

  const handlefilter2 = () => {
    if (startDate || endDate) {
      setStartDate("");
      setEndDate("");
      setfilter(!filter);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const inputData = {
      page: currentPage,
      size: select,
      search: searchTerm.toLowerCase(),
      direction: "",
      start_date: formattedStartDate,
      end_date: formattedEnddata,
      cid: Cookies.get("Company_Id"),
      // extension_id: ""
    };
    dispatch(
      postapiAll({
        inputData: inputData,
        Api: config.RECORDING.URL.GET,
        Token: Token,
        urlof: config.RECORDING.KEY.GET,
        signal: abortController.signal,
      })
    ).then((response) => {
      if (response?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setLoading(false);
        setListData(response?.payload?.response?.data?.list || []);
        setCount(response?.payload?.response?.data?.total_page || 0);
        setCountData(response?.payload?.response?.data?.total_record || 0);
      }
      setSortedColumn("");
    });
  }, [searchTerm, select, currentPage, Token, filter]);
  const handlelistner = (URL, date) => {
    setDate(date);
    setAudioURL(URL);
    setListner(true);
  };

  const handleCloseListner = () => {
    setListner(false);
  };

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 445;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);

  // const handlefilter = (startDate, endDate, _) => {
  //   if (startDate && endDate) {
  //     const formattedStartDate = new Date(+startDate).toISOString().slice(0, 10);
  //     const formattedEndDate = new Date(+endDate).toISOString().slice(0, 10);
  //     setStartDate(formattedStartDate);
  //     setEndDate(formattedEndDate);
  //   }
  // };

  // const clearFilter = () => {};

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

  const startEntry = (currentPage - 1) * select + 1;
  let endEntry = currentPage * select;
  if (endEntry > count) {
    endEntry = count;
  }

  const sortingTable = (name) => {
    if (!listData) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }
    const isNumber = (value) => !isNaN(value);

    const sortData = [...listData]?.sort((a, b) => {
      if (isNumber(a[name])) {
        if (newAscending) {
          return a[name] - b[name];
        } else {
          return b[name] - a[name];
        }
      } else {
        if (newAscending) {
          return a[name].localeCompare(b[name]);
        } else {
          return b[name].localeCompare(a[name]);
        }
      }
    });
    setSortedColumn(name);
    setAscending(!newAscending);
    setListData(sortData);
  };
  const clearSearch = () => {
    setSearchterm("");
  };

  const arrowShow = (val) => {
    return (
      <div>
        <Uparrow
          width={10}
          height={20}
          style={{
            filter: sortedColumn === val && ascending ? "opacity(0.5)" : "",
          }}
        />
        <Downarrow
          width={10}
          height={20}
          style={{
            filter: sortedColumn === val && !ascending ? "opacity(0.5)" : "",
            marginLeft: "-4px",
          }}
        />
      </div>
    );
  };

  return (
    <div className="tablespadding">
      <AdminHeader addBtn={true} />
      <DatePickers
        clear={true}
        date_picker={true}
        btn_name={t("Search")}
        fontwidth="500"
        marginb="mb-0"
        bgcolor="white"
        handlefilter={handlefilter}
        // handlefilter={handlefilter}
        handlefilter2={handlefilter2}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDate={startDate}
        endDate={endDate}
        lg={2}
        width="100%"
      />
      <div className="num_table">
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => {
                  setselect(e.target.value);
                  setCurrentPage(1);
                }}
                value={select}
              >
                <option>10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Form.Select>
            </div>
            <h6>{t("entries")}</h6>
          </div>
          <div className="table_search">
            <h6>{t("Search")}:</h6>
            <Form.Control
              type="text"
              height={38}
              className="search-bg new-search-add"
              onChange={handleSearchChange}
              onPaste={handlePaste}
              value={searchTerm}
            />
            {searchTerm && <ClearSearch clearSearch={clearSearch} />}
          </div>
        </div>
        <div
          style={{ overflowX: "auto", height: dynamicHeight, width: "100%" }}
          className="sidebar_scroll"
        >
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "20%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("start_stamp")}
                  >
                    <p className="mb-0">{t("Date")}</p>
                    <div>{arrowShow("start_stamp")}</div>
                  </div>
                </th>
                <th style={{ width: "15%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("caller_id_number")}
                  >
                    <p className="mb-0">{t("Caller ID")} </p>
                    <div>{arrowShow("caller_id_number")}</div>
                  </div>
                </th>
                <th style={{ width: "18%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("caller_id_name")}
                  >
                    <p className="mb-0">{t("Caller Name")} </p>
                    <div>{arrowShow("caller_id_name")}</div>
                  </div>
                </th>
                <th style={{ width: "10%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("destination_number")}
                  >
                    <p className="mb-0">{t("Endpoint")} </p>
                    <div>{arrowShow("destination_number")}</div>
                  </div>
                </th>
                <th style={{ width: "12%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("duration")}
                  >
                    <p className="mb-0">{t("Duration")}</p>
                    <div>{arrowShow("duration")}</div>
                  </div>
                </th>
                <th style={{ width: "12%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("status")}
                  >
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
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    <Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {listData && listData.length > 0 ? (
                    listData?.map((val, index) => {
                      const formatTime = (seconds) =>
                        `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(
                          Math.floor(seconds / 60) % 60
                        ).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
                      const Duration = formatTime(val?.duration);
                      const formattedDate = new Date(val.start_stamp)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".");
                      function extractTimeFromDate(dateString, locale) {
                        const date = new Date(dateString);
                        return date.toLocaleTimeString(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        });
                      }

                      return (
                        <>
                          <tr className="table_body">
                            <td>
                              {formattedDate}
                              {"  "}
                              {"  "}
                              {extractTimeFromDate(val?.start_stamp)}
                            </td>
                            <td>{val.caller_id_number}</td>
                            <td>{val.caller_id_name}</td>
                            <td>{val.destination_number}</td>
                            <td>{Duration}</td>
                            <td>{t(val.direction)}</td>
                            <td className="table_edit2">
                              <button
                                disabled={!val.recording_url}
                                style={{
                                  backgroundColor: !val.recording_url
                                    ? "var(--main-forgot-color)"
                                    : "var(--main-orange-color)",
                                  border: "none",
                                  opacity: !val.recording_url ? "0.5" : "",
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
                      <td style={{ width: "100%", textAlign: "center" }} colSpan="7">
                        {t("No data found")}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="show show2 mt-2  d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {count} {t("entries")}
          </h6>
          <div>
            <Paginationall
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
              totalPages={count}
            />
          </div>
        </div>
      </div>
      {/* {deletemodal && (
        <DeleteModal
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={handleDelete}
        />
      )} */}
      {listner && (
        <ListenRecordingModal
          recordingUrl={audioURL}
          show={listner}
          onHide={handleCloseListner}
          recordDate={Date1}
        />
      )}
      {/* {editListner && (
        <EditRecording show={editListner} onHide={handleCloseEditListner} />
      )} */}
    </div>
  );
}
