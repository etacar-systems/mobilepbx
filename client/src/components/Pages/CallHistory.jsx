import React, { useEffect, useState, useRef } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import yes_logo from "../../Assets/Icon/yes.svg";
import edit_logo from "../../Assets/Icon/edit.svg";
import delete_logo from "../../Assets/Icon/delete.svg";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import NumberModal from "../Modal/NumberModal";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import { ReactComponent as Up_arrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Down_arrow } from "../../Assets/Icon/down-arrow.svg";
import DeleteModal from "../Modal/DeleteModal";
import { ReactComponent as Call } from "../../Assets/Icon/call.svg";
import PhonebookModal from "../Modal/PhonebookModal";
import Paginationall from "./Paginationall";
import { getapiAll, postapiAll } from "../../Redux/Reducers/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import config from "../../config";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";
export default function CallHistory() {
  // const changeOrangeToRed = () => {
  //   document.documentElement.style.setProperty('--main-orange-color','rgb(255, 0, 0)');
  // };
  const userid = Cookies.get("User_id");
  const companyid = Cookies.get("Company_Id");
  const abortControllerRef = useRef(null);
  const { t } = useTranslation();
  const [numberData, setNumberData] = useState([]);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);
  const [select, setselect] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchterm] = useState("");
  const [sortedColumn, setSortedColumn] = useState("");
  const call_function = useSelector(
    (state) => state.calling_function.calling_function
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const inputdata = {
      search: searchTerm,
      size: select,
      page: currentPage,
      cid: companyid,
      extension_id: userid,
    };
    dispatch(
      postapiAll({
        inputData: inputdata,
        Api: config.CDR.CDR_DOMAIN_LIST,
        Token: Cookies.get("Token"),
        urlof: config.CDR_KEY.CDR_DOMAIN_LIST,
        signal: abortController.signal,
      })
    ).then((response) => {
      if (response?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setSortedColumn("");
        setLoading(false);
        const data = response?.payload?.response?.data;
        setFetchData(data);
        setNumberData(data?.list);
      }
    });
  }, [searchTerm, select, currentPage]);

  // useEffect(() => {
  //   setNumberData(fetchData.list);
  // }, [fetchData.list]);

  const openModal = () => {
    setShow(true);
    setHeader(t("Add new contact"));
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
  };

  const handleDelete = () => {
    setDeletemodal(false);
  };

  const openDelete = () => {
    setDeletemodal(true);
  };

  const handleEdit = () => {
    setShow(true);
    setHeader(t("Edit contact"));
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
    console.log(name, "namecheck");
    if (!numberData) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const sortData = [...numberData].sort((a, b) => {
      if (name === "duration") {
        console.log(a, b, "checkvalue");
        const durationA = convertToSeconds(a[name]);
        const durationB = convertToSeconds(b[name]);
        return ascending ? durationA - durationB : durationB - durationA;
      } else {
        const valueA = a[name];
        const valueB = b[name];
        const strA = String(valueA);
        const strB = String(valueB);
        return newAscending
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      }
    });

    setSortedColumn(name);
    setAscending(!newAscending);
    setNumberData(sortData);
  };

  // const handleSearch = (e) => {
  //   const search = e.target.value.toLowerCase();

  //   const fieldsToInclude = [
  //     "domain_name",
  //     "direction",
  //     "caller_id_name",
  //     "caller_id_number",
  //     "destination_number",
  //     "start_stamp",
  //     "duration",
  //     "record_name",
  //     "status",
  //     "hangup_cause",
  //   ];

  //   setNumberData(
  //     fetchData.filter((data) => {
  //       return Object.entries(data)
  //         .filter(([key]) => fieldsToInclude.includes(key))
  //         .some(([, value]) =>
  //           value?.toString().toLowerCase().includes(search)
  //         );
  //     })
  //   );

  //   setCurrentPage(1);
  // };

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
  let startEntry = (currentPage - 1) * select + 1;
  if (fetchData?.total_record === 0) {
    startEntry = 0;
  }
  let endEntry = currentPage * select;
  if (endEntry > fetchData?.total_record) {
    endEntry = fetchData?.total_record;
  }
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 300;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);
  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData.getData("text/plain");
    if (!clipboardData.startsWith(" ")) {
      setSearchterm(clipboardData.trim());
    }
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
  const clearSearch = () => {
    setSearchterm("");
  };
  const makeCall = (val) => {
    const flag = 1;
    const number = val?.caller_id_number;
    const name = val?.caller_id_name;
    if (number) {
      call_function(number, name, flag);
    }
  };
  return (
    <div className="tablespadding">
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ marginBottom: "24px", marginTop: "5px" }}
      >
        <span className="dashboardtext">{t("Call History")}</span>
      </div>
      <div className="num_table">
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => (setselect(e.target.value), setCurrentPage(1))}
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
                <th
                  style={{ width: "17%" }}
                  onClick={() => {
                    sortingTable("caller_id_name");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Name")}</p>
                    {arrowShow("caller_id_name")}
                  </div>
                </th>
                <th
                  style={{ width: "13%" }}
                  onClick={() => {
                    sortingTable("caller_id_number");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Number")}</p>
                    {arrowShow("caller_id_number")}
                  </div>
                </th>
                <th
                  style={{ width: "12%" }}
                  onClick={() => {
                    sortingTable("destination_number");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Destination Number")}</p>
                    {arrowShow("destination_number")}
                  </div>
                </th>
                <th
                  style={{ width: "21%" }}
                  onClick={() => {
                    sortingTable("start_stamp");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Date")}</p>
                    {arrowShow("start_stamp")}
                  </div>
                </th>
                <th
                  style={{ width: "12%" }}
                  onClick={() => {
                    sortingTable("duration");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Duration")}</p>
                    {arrowShow("duration")}
                  </div>
                </th>
                <th
                  style={{ width: "13%" }}
                  onClick={() => {
                    sortingTable("status");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Status")}</p>
                    {arrowShow("status")}
                  </div>
                </th>
                <th
                  style={{ width: "10%" }}
                  onClick={() => {
                    sortingTable("status");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Action")}</p>
                    {/* {arrowShow("status")} */}
                  </div>
                </th>
                {/* <th  style={{width:"10%"}}> {t("Action")}</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    <Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {numberData && numberData.length > 0 ? (
                    numberData?.map((val, index) => {
                      const formatTime = (seconds) =>
                        `${String(Math.floor(seconds / 3600)).padStart(
                          2,
                          "0"
                        )}:${String(Math.floor(seconds / 60) % 60).padStart(
                          2,
                          "0"
                        )}:${String(seconds % 60).padStart(2, "0")}`;
                      const formattedTime = formatTime(val?.duration);
                      const formattedDate = new Date(val?.start_stamp)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".");
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
                              {val.caller_id_name}
                            </td>
                            <td style={{ padding: "22px" }}>
                              {val.caller_id_number}
                            </td>
                            <td style={{ padding: "22px" }}>
                              {val.destination_number}
                            </td>
                            <td style={{ padding: "22px" }}>
                              {formattedDate}
                              {"  "}
                              {"  "}
                              {extractTimeFromDate(val?.start_stamp)}
                            </td>
                            <td style={{ padding: "22px" }}>
                              {val.duration == null
                                ? "00:00:00"
                                : formattedTime}{" "}
                            </td>
                            <td style={{ padding: "22px" }}>
                              {t(val?.status) != t("answered")
                                ? t("missed")
                                : t("answered")}
                            </td>
                            <td className="table_edit3">
                              <button onClick={() => makeCall(val)}>
                                <Call
                                  width={15}
                                  height={15}
                                  className="edithover"
                                />
                              </button>
                            </td>
                            {/* <td>{val.hangup_cause}</td> */}
                            {/* <td className="table_edit">
                            <div>
                              <Edit_logo width={14} height={14} className='edithover' onClick={handleEdit} />
                            </div>
                            <button className="ms-1" onClick={openDelete}>
                              <Delete_logo
                                width={14}
                                height={14}
                                className="edithover"
                               
                              />
                            </button>
                          </td> */}
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <tr style={{ height: dynamicHeight - 50 }}>
                      <td
                        style={{ width: "100%", textAlign: "center" }}
                        colSpan="8"
                      >
                        {t("No data found")}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
            {/* <tbody>
              {}
            </tbody> */}
          </table>
        </div>
        <div className="show  show2 mt-2  d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")}{" "}
            {fetchData?.total_record} {t("entries")}
          </h6>
          {/* <button onClick={changeOrangeToRed}>Change Orange to Red</button> */}
          <div>
            <Paginationall
              totalPages={fetchData?.total_page}
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
      {show && (
        <PhonebookModal handleClose={handleClose} show={show} header={header} />
      )}

      {deletemodal && (
        <DeleteModal
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
