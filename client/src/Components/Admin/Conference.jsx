import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import ConferenceModal from "../Modal/ConferenceModal";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import DeleteModal from "../Modal/DeleteModal";
import Paginationall from "../Pages/Paginationall";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  deleteapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";
import config from "../../config";

export default function Conference() {
  const { t } = useTranslation();
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);

  const getConferenceListAPi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/conference/list`;
  const EditGetDetailConference = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/conference/detail`;
  const EditConference = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/conference/edit`;
  const AddConference = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/conference/add`;
  const DeleteConference = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/conference/delete`;
  const conferenceProfile = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}/conference/profile`;
  const abortControllerRef = useRef(null);

  let Token = Cookies.get("Token");
  const dispatch = useDispatch();
  const conferenceData = useSelector(
    (state) => state.postapiAll.postapiall.conferenceList.userData
  );
  const count = useSelector(
    (state) => state.postapiAll.postapiall.conferenceList.conference_total
  );
  const countdata = useSelector(
    (state) => state.postapiAll.postapiall.conferenceList.total_page_count
  );

  const [conferenceList, setConferenceList] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchterm] = useState("");
  const [select, setselect] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [savedata, setsavedata] = useState(false);
  const [formData, setFormData] = useState({
    conference_name: "",
    conference_description: "",
    conference_pin: "",
    extension_number: "",
    conference_record: false,
    conference_flags: false,
  });
  const [saveloading, setsaveLoading] = useState(false);
  const [mode, setmode] = useState("");
  const [EditId, seteditid] = useState();
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");

  useEffect(() => {
    if (conferenceData) {
      setConferenceList(conferenceData);
    }
  }, [conferenceData]);

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
    };
    dispatch(
      postapiAll({
        inputData: inputData,
        Api: getConferenceListAPi,
        Token: Token,
        urlof: "conference",
        signal: abortController.signal,
      })
    ).then((response) => {
      if (response?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setLoading(false);
      }
      setSortedColumn("");
    });
  }, [savedata, searchTerm, select, currentPage, Token]);

  const handleEdit = (id) => {
    seteditid(id);
    setmode("edit");
    setShow(true);
    setHeader(t("Edit conference"));
    if (id) {
      setsaveLoading(true);
      const data = {
        conference_id: id,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: EditGetDetailConference,
          Token: Token,
          urlof: "trunkeditvalues",
        })
      ).then((response) => {
        setsaveLoading(false);
        const editsvalues = response?.payload?.response?.conferenceDetail;
        setFormData({
          conference_name: editsvalues?.conference_name,
          conference_description: editsvalues?.conference_description,
          conference_pin: editsvalues?.conference_pin,
          conference_record: editsvalues?.conference_record ,
          extension_number: editsvalues?.extension_number,
          conference_flags:
            editsvalues?.conference_flags === "true" ? true : false,
        });
      });
    }
  };

  const handlesavedata = () => {
    const listvalues = {
      conference_name: formData.conference_name,
      conference_description: formData.conference_description,
      conference_pin: formData.conference_pin,
      conference_record: formData.conference_record == true ? "true":"false",
      extension_number: formData.extension_number,
      conference_flags: formData.conference_flags == true ? "true" : "false",
      conference_profile: "default",
    };
    if (mode === "add") {
      setsaveLoading(true);
      const data = listvalues;
      dispatch(
        postapiAll({
          inputData: data,
          Api: AddConference,
          Token: Token,
          urlof: "AddConference",
        })
      ).then((res) => {
        if (res?.payload?.response) {
          setsaveLoading(false);
          handleClose();
          setsavedata(!savedata);
          setCurrentPage(1);
          setSearchterm("");
          setFormData("");
          toast.success(t(res.payload.response.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        } else {
          if (res?.payload?.error) {
            toast.error(t(res.payload.error.response.data.message), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
            setsaveLoading(false);
          }
        }
      });
    }
    if (mode === "edit") {
      setsaveLoading(true);
      let data = {
        conference_id: EditId,
        ...listvalues,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: EditConference,
          Token: Token,
          urlof: "EditConference",
        })
      ).then((res) => {
        if (res?.payload?.response) {
          setsaveLoading(false);
          handleClose();
          setsavedata(!savedata);
          setCurrentPage(1);
          setFormData("");
          setSearchterm("");
          toast.success(t(res?.payload?.response?.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        } else {
          toast.error(t(res.payload.error.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          setsaveLoading(false);
        }
      });
    }
  };

  const handleDelete = () => {
    setDeletemodal(false);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setDeletemodal(true);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
  };

  const openModal = () => {
    setmode("add");
    setShow(true);
    setHeader(t("Add new conference"));
  };

  const handleClose = () => {
    setShow(false);
    setFormData({
      conference_name: "",
      conference_description: "",
      conference_pin: "",
      extension_number: "",
      conference_record: false,
      conference_flags: false,
    });
  };

  const DeleteItem = () => {
    setDeleteLoading(true);
    const data = {
      conference_id: deleteId,
    };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: DeleteConference,
        Token: Token,
        urlof: "delete",
      })
    ).then((res) => {
      if (res?.payload?.response) {
        setDeleteLoading(false);
        handleCloseDelete();
        setCurrentPage(1);
        setsavedata(!savedata);
        setSearchterm("");
        toast.success(t(res?.payload?.response?.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      } else {
        setDeleteLoading(false);
        toast.error(t(res?.payload?.error?.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      }
    });
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
  const clearSearch = () => {
    setSearchterm("");
  };
  const startEntry = (currentPage - 1) * select + 1;
  let endEntry = currentPage * select;
  if (endEntry > count) {
    endEntry = count;
  }

  const sortingTable = (name) => {
    if (!conferenceList) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }
    const isNumber = (value) => !isNaN(value);

    const sortData = [...conferenceList]?.sort((a, b) => {
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
    setConferenceList(sortData);
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

  return (
    <div className="tablespadding">
      <AdminHeader openModal={openModal} pathname={t("Conference")} />
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
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("conference_name")}
                  >
                    <p className="mb-0">{t("Name")}</p>
                    {arrowShow("conference_name")}
                  </div>
                </th>
                <th style={{ width: "21%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("conference_description")}
                  >
                    <p className="mb-0">{t("Description")}</p>
                    {arrowShow("conference_description")}
                  </div>
                </th>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("assign_pstn_number")}
                  >
                    <p className="mb-0">{t("Phone Number")}</p>
                    {arrowShow("assign_pstn_number")}
                  </div>
                </th>
                <th style={{ width: "18%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("extension_number")}
                  >
                    <p className="mb-0">{t("Extension")}</p>
                    {arrowShow("extension_number")}
                  </div>
                </th>
                <th style={{ width: "12%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("createdAt")}
                  >
                    <p className="mb-0">{t("Date")}</p>
                    {arrowShow("createdAt")}
                  </div>
                </th>
                <th style={{ width: "12%" }}> {t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td
                    style={{ width: "100%", textAlign: "center" }}
                    colSpan="6"
                  >
                    <Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {conferenceList && conferenceList?.length > 0 ? (
                    conferenceList?.map((val, index) => {
                      const date = new Date(val?.createdAt);
                      const formattedDate = new Date(date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".");
                      return (
                        <>
                          <tr className="table_body" key={val?._id}>
                            <td>{val?.conference_name}</td>
                            <td>{val.conference_description}</td>
                            <td>
                              {val.assign_pstn_number
                                ? val.assign_pstn_number
                                : t("Not Assigned")}
                            </td>
                            <td>{val.extension_number}</td>
                            <td>{formattedDate}</td>
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
                        </>
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
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="show show2 mt-2  d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {count}{" "}
            {t("entries")}
          </h6>
          <div>
            <Paginationall
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
              totalPages={countdata}
            />
          </div>
        </div>
      </div>
      {show && (
        <ConferenceModal
          handleClose={handleClose}
          show={show}
          header={header}
          formData={formData}
          setFormData={setFormData}
          loader={saveloading}
          handlesavedata={handlesavedata}
          mode={mode}
          conferenceProfile={conferenceProfile}
        />
      )}
      {deletemodal && (
        <DeleteModal
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={DeleteItem}
          loader={deleteLoading}
        />
      )}
    </div>
  );
}
