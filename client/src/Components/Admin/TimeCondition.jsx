import React, { useEffect, useRef, useState } from "react";
import {AdminHeader} from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import TimeConditionModal from "../Modal/TImeConditionModal";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import DeleteModal from "../Modal/DeleteModal";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { deleteapiAll, postapiAll } from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";
import yes_logo from "../../Assets/Icon/check.svg";
import close_logo from "../../Assets/Icon/assinnpn.svg";

export default function TimeCondition() {
  const { t } = useTranslation();
  const abortControllerRef = useRef(null);
  let Token = Cookies.get("Token");
  let type = Cookies.get("role");
  const [deleteid, setdeleteid] = useState("");
  const [saveloading, setsaveLoading] = useState(false);
  const [sortedColumn, setSortedColumn] = useState("");
  const [ascending, setAscending] = useState(true);
  const [timeConditionData, setTimeConditionData] = useState([]);
  const [formData, setFormData] = useState({
    timename: "",
    timedesc: "",
    timedescnot: "",
    extension: "",
    timecondition_data: [
      {
        dialplan_detail_tag: "condition",
        dialplan_detail_type: "",
        dialplan_detail_data: "",
      },
    ],
    TimeList: "",
    description: "",
    selectFilter: "",
    selectFilter1: "",
    Range: "",
    Value: "",
  });

  const dispatch = useDispatch();

  const tabeleObj = useSelector(
    (state) => state.postapiAll.postapiall?.timecondition?.data
  );

  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [select, setselect] = useState(10);
  const [searchTerm, setSearchterm] = useState("");
  const [mode, setMode] = useState("");
  const [editId, seteditId] = useState("");

  const [savedata, setsavedata] = useState("");
  const clearSearch = () => {
    setSearchterm("");
  };
  useEffect(() => {
    if (tabeleObj) {
      setTimeConditionData(tabeleObj?.TimeCondition);
    }
  }, [tabeleObj]);
  const handleEdit = (val) => {
    seteditId(val);
    setShow(true);
    setHeader(t("Edit time condition"));
    setMode("edit");

    setsaveLoading(true);
    const data = {
      id: val,
    };
    dispatch(
      postapiAll({
        inputData: data,
        Api: config.TIME_CONDITION.DETAIL,
        Token: Token,
        urlof: config.TIME_CONDITION_KEY.DETAIL,
      })
    ).then((response) => {
      setsaveLoading(false);
      const editsvalues = response?.payload?.response?.data;

      setFormData({
        timename: editsvalues.name,
        extension: editsvalues.extension,
        description: editsvalues.description,
        selectFilter: editsvalues.dialplan_action,
        selectFilter1: editsvalues.dialplan_anti_action,
        timecondition_data: editsvalues.timecondition_data,
        selectApp: editsvalues.dialplan_action.split(":")[0], // First part before the colon
        selectData: editsvalues.dialplan_action.split(":")[1],
        selectApp1: editsvalues.dialplan_anti_action.split(":")[0], // First part before the colon
        selectData1: editsvalues.dialplan_anti_action.split(":")[1],
      });
    });
    // }
  };

  const handleDelete = () => {
    setDeleteLoading(true);

    const data = { id: deleteid };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.TIME_CONDITION.DELETE,
        Token: Token,
        urlof: config.TIME_CONDITION.DELETE,
      })
    ).then((response) => {
      if (response.payload.response) {
        setDeleteLoading(false);
        handleCloseDelete();
        setCurrentPage(1);
        setsavedata(!savedata);
        setSearchterm("");
        toast.success(t(response.payload.response.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      } else {
        toast.error(t(response.payload.error.response.data.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      }
    });
  };

  const openDelete = (id) => {
    setDeletemodal(true);
    setdeleteid(id);
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
  const handleCloseDelete = () => {
    setDeletemodal(false);
  };

  const openModal = () => {
    setFormData({
      timename: "",
      timedesc: "",
      timedescnot: "",
      extension: "",
      timecondition_data: [
        {
          dialplan_detail_tag: "condition",
          dialplan_detail_type: "",
          dialplan_detail_data: "",
        },
      ],
      TimeList: "",
      description: "",
      selectFilter: "",
      selectFilter1: "",
      Range: "",
      Value: "",
    });
    setShow(true);
    setHeader(t("Add time condition"));
    setMode("add");
  };

  const handleClose = () => {
    setShow(false);
    seteditId("");
    setFormData({
      timename: "",
      timedesc: "",
      timedescnot: "",
      extension: "",
      timecondition_data: [
        {
          dialplan_detail_tag: "condition",
          dialplan_detail_type: "",
          dialplan_detail_data: "",
        },
      ],
      TimeList: "",
      description: "",
      selectFilter: "",
      selectFilter1: "",
      Range: "",
      Value: "",
    });
  };
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
  let startEntry = (currentPage - 1) * select + 1;
  if (tabeleObj?.conference_total === 0) {
    startEntry = 0;
  }
  let endEntry = currentPage * select;
  if (endEntry > tabeleObj?.conference_total) {
    endEntry = tabeleObj?.conference_total;
  }
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
      type:type
    };
    dispatch(
      postapiAll({
        inputData: inputData,
        Api: config.TIME_CONDITION.LIST,
        Token: Token,
        urlof: config.TIME_CONDITION_KEY.LIST,
        signal: abortController.signal,
      })
    ).then((res) => {
      if (res?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });
  }, [currentPage, select, searchTerm, savedata]);

  const sortingTable = (name) => {
    if (!timeConditionData) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const sortData = [...timeConditionData].sort((a, b) => {
      const valueA = a[name];
      const valueB = b[name];
      const strA = String(valueA);
      const strB = String(valueB);
      return newAscending ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
    setSortedColumn(name);
    setAscending(!newAscending);
    setTimeConditionData(sortData);
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
      <AdminHeader
        openModal={openModal}
        btnName={t("Add time condition")}
      />
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
            />
            {searchTerm && <ClearSearch clearSearch={clearSearch} />}
          </div>
        </div>
        <div
          style={{ overflowX: "auto", height: dynamicHeight }}
          className="sidebar_scroll"
        >
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "23%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("name")}
                  >
                    <p className="mb-0">{t("Name")}</p>
                    {arrowShow("name")}
                  </div>
                </th>
                <th style={{ width: "22%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("extension")}
                  >
                    <p className="mb-0">{t("Extension")}</p>
                    {arrowShow("extension")}
                  </div>
                </th>
                <th style={{ width: "10%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Enabled")}</p>
                  </div>
                </th>
                <th style={{ width: "23%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("description")}
                  >
                    <p className="mb-0">{t("Description")}</p>
                    {arrowShow("description")}
                  </div>
                </th>
                <th style={{ width: "12%" }}> {t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    <Loader />
                  </td>
                </tr>
              ) : timeConditionData.length > 0 ? (
                timeConditionData?.map((val, index) => {
                  let enableString = JSON.stringify(val.timecondition_enabled);
                  return (
                    <tr key={val._id} className="table_body">
                      <td>{val.name}</td>
                      <td>{val.extension}</td>
                      <td>
                        {enableString ? (
                          <img src={yes_logo} alt="" width={15} />
                        ) : (
                          <img src={close_logo} alt="" width={15} />
                        )}
                      </td>
                      <td>{val.description}</td>
                      <td className="table_edit">
                        <button onClick={() => handleEdit(val._id)}>
                          <Edit_logo
                            width={14}
                            height={14}
                            className="edithover"
                          />
                        </button>
                        <button
                          className="ms-1"
                          onClick={() => openDelete(val._id)}
                        >
                          <Delete_logo
                            width={14}
                            height={14}
                            className="edithover"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td
                    style={{ width: "100%", textAlign: "center" }}
                    colSpan="6"
                  >
                    {t("No data found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="show show2 mt-2  d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")}{" "}
            {tabeleObj?.conference_total} {t("entries")}
          </h6>
          <div>
            <Paginationall
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
              totalPages={tabeleObj?.total_page_count}
            />
          </div>
        </div>
      </div>
      {show && (
        <TimeConditionModal
          handleClose={handleClose}
          show={show}
          header={header}
          mode={mode}
          setFormData={setFormData}
          formData={formData}
          loader={saveloading}
          editId={editId}
          setsaveLoading={setsaveLoading}
          setCurrentPage={setCurrentPage}
          setsavedata={setsavedata}
          savedata={savedata}
        />
      )}
      {deletemodal && (
        <DeleteModal
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={handleDelete}
          loader={deleteLoading}
        />
      )}
    </div>
  );
}
