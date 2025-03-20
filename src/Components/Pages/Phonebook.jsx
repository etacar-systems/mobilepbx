import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import { ReactComponent as Call } from "../../Assets/Icon/call.svg";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import DeleteModal from "../Modal/DeleteModal";
import AdminHeader from "../Admin/AdminHeader";
import { ReactComponent as Calling } from "../../Assets/Icon/call_com.svg";
import PhonebookModal from "../Modal/PhonebookModal";
import { toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import Paginationall from "./Paginationall";
import { useTranslation } from "react-i18next";
import config from "../../config";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";

export default function Phonebook() {
  const { t } = useTranslation();
  let Token = Cookies.get("Token");
  const abortControllerRef = useRef(null);

  const count = useSelector(
    (state) => state.postapiAll.postapiall.phonebooklist.phonebook_total_counts
  );
  const countdata = useSelector(
    (state) => state.postapiAll.postapiall.phonebooklist.total_page_count
  );
  const phonebbok = useSelector(
    (state) => state.postapiAll.postapiall.phonebooklist.PhonebooksData
  );
  const dispatch = useDispatch();
  const [Row, setRow] = useState([]);
  const [searchTerm, setSearchterm] = useState("");
  const [select, setselect] = useState(10);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [EditId, seteditid] = useState(0);
  const [mode, setmode] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveloading, setsaveLoading] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");
  const [savedata, setsavedata] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const call_function = useSelector(
    (state) => state.calling_function.calling_function
  );
  const [formData, setFormData] = useState({
    Firstname: "",
    Lastname: "",
    Phonenumber: "",
    Mobilenumber: "",
    Company: "",
    Position: "",
  });

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdownId(null);
    }
  };
  useEffect(() => {
    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

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
        Api: config.PHONEBOOK.LIST,
        Token: Token,
        urlof: config.PHONEBOOK_KEY.LIST,
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
  }, [dispatch, searchTerm, select, currentPage, Token, savedata]);
  useEffect(() => {
    setRow(phonebbok);
  }, [phonebbok]);

  let startEntry = (currentPage - 1) * select + 1;
  if (count === 0) {
    startEntry = 0;
  }
  let endEntry = currentPage * select;
  if (endEntry > count) {
    endEntry = count;
  }
  const openModal = () => {
    setShow(true);
    setHeader(t("Add new contact"));
    setmode("add");
  };

  const handleClose = () => {
    setShow(false);
    setFormData("");
    seteditid("");
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
    setDeleteId("");
  };

  const openDelete = (id) => {
    setDeletemodal(true);
    setDeleteId(id);
  };

  const DeleteItem = () => {
    setDeleteLoading(true);
    const data = { phonebook_id: deleteId };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.PHONEBOOK.DELETE,
        Token: Token,
        urlof: config.PHONEBOOK_KEY.DELETE,
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
        setDeleteLoading(false);
        toast.error(t(response.payload.error.response.data.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      }
    });
  };

  const handleEdit = (id) => {
    setmode("edit");
    seteditid(id);
    setShow(true);
    setHeader(t("Edit contact"));
    if (id) {
      setsaveLoading(true);
      const data = {
        phonebook_id: id,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.PHONEBOOK.DETAIL,
          Token: Token,
          urlof: config.PHONEBOOK_KEY.DETAIL,
        })
      ).then((response) => {
        setsaveLoading(false);
        const reponsedata = response?.payload?.response?.PhonebookDetail;
        setFormData({
          Firstname: reponsedata?.first_name,
          Lastname: reponsedata?.last_name,
          Phonenumber: reponsedata?.phone_number,
          Mobilenumber: reponsedata?.mobile_number,
          Company: reponsedata?.company,
          Position: reponsedata?.position,
        });
      });
    }
  };

  const sortingTable = (name) => {
    if (!Row) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const sortData = [...Row].sort((a, b) => {
      const valueA = a[name];
      const valueB = b[name];
      if (name === "phone_number" || name === "mobile_number") {
        const stra = parseInt(valueA);
        const strb = parseInt(valueB);
        return newAscending ? stra - strb : strb - stra;
      } else {
        const strA = String(valueA);
        const strB = String(valueB);
        return newAscending
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      }
    });

    setSortedColumn(name);
    setAscending(!newAscending);
    setRow(sortData);
  };
  const clearSearch = () => {
    setSearchterm("");
  };

  const handleToggleDropdown = (dropdownId) => {
    if (openDropdownId === dropdownId) {
      setOpenDropdownId(null); // Close if clicked again
    } else {
      setOpenDropdownId(dropdownId); // Open the clicked one
    }
  };

  const handleCall = (dropdownId) => {
    handleToggleDropdown(dropdownId); // Open the specific dropdown
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
  const adduisortingui = (val) => {
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
  const handlesavedata = () => {
    const datavalues = {
      first_name: formData.Firstname,
      last_name: formData.Lastname,
      phone_number: formData.Phonenumber,
      mobile_number: formData.Mobilenumber,
      company: formData.Company,
      position: formData.Position,
    };

    if (mode === "add") {
      setsaveLoading(true);
      const data = datavalues;
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.PHONEBOOK.ADD,
          Token: Token,
          urlof: config.PHONEBOOK_KEY.ADD,
        })
      ).then((res) => {
        if (res.payload.response) {
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
          setsaveLoading(false);
          toast.error(t(res.payload.error.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      });
    }
    if (mode === "edit") {
      setsaveLoading(true);
      const data = {
        phonebook_id: EditId,
        ...datavalues,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.PHONEBOOK.UPDATE,
          Token: Token,
          urlof: config.PHONEBOOK_KEY.UPDATE,
        })
      ).then((res) => {
        if (res.payload.response) {
          setsaveLoading(false);
          handleClose();
          setsavedata(!savedata);
          setCurrentPage(1);
          setFormData("");
          setSearchterm("");
          toast.success(t(res.payload.response.message), { autoClose: 2000 });
        } else {
          setsaveLoading(false);
          toast.error(t(res.payload.error.message), { autoClose: 2000 });
        }
      });
    }
  };
  const makeCall = ({ name, number }) => {
    const flag = 1;
    if (number) {
      call_function(number, name, flag);
    }
    setOpenDropdownId("");
  };
  return (
    <div className="tablespadding">
      <AdminHeader openModal={openModal} pathname={t("Phonebook")} />
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
          style={{ overflowX: "auto", height: dynamicHeight }}
          className="sidebar_scroll"
        >
          <table className="responshive">
            <thead className="Tablehead Tablehead_color">
              <tr className="Tablehead_color">
                <th style={{ width: "20%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => {
                      sortingTable("first_name");
                    }}
                  >
                    <p className="mb-0">{t("Name")}</p>
                    <div>{adduisortingui("first_name")}</div>
                  </div>
                </th>
                <th style={{ width: "20%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => {
                      sortingTable("phone_number");
                    }}
                  >
                    <p className="mb-0">{t("Phone Number")}</p>
                    <div>{adduisortingui("phone_number")}</div>
                  </div>
                </th>
                <th style={{ width: "20%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => {
                      sortingTable("mobile_number");
                    }}
                  >
                    <p className="mb-0">{t("Mobile number")}</p>
                    <div>{adduisortingui("mobile_number")}</div>
                  </div>
                </th>
                <th style={{ width: "16.66%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => {
                      sortingTable("company");
                    }}
                  >
                    <p className="mb-0">{t("Company")}</p>
                    <div>{adduisortingui("company")}</div>
                  </div>
                </th>
                <th style={{ width: "14%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => {
                      sortingTable("position");
                    }}
                  >
                    <p className="mb-0">{t("Position")}</p>
                    <div>{adduisortingui("position")}</div>
                  </div>
                </th>
                <th style={{ width: "15%" }}> {t("Action")}</th>
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
                  {Row && Row.length > 0 ? (
                    Row.map((val, index) => (
                      <tr
                        className="table_body"
                        style={{ position: "relative" }}
                      >
                        <td>
                          {val.first_name} {val.last_name}
                        </td>
                        <td>{val.phone_number}</td>
                        <td>{val.mobile_number}</td>
                        <td>{val.company}</td>
                        <td>{val.position}</td>
                        <td className="table_edit3 d-flex">
                          <button onClick={() => handleCall(index)}>
                            <Call
                              width={15}
                              height={15}
                              className="edithover"
                            />
                          </button>
                          <div
                            style={{
                              position: "absolute",
                              bottom: "-25px",
                            }}
                            className="phonebook_call_model"
                          >
                            <Dropdown show={openDropdownId === index}>
                              <Dropdown.Menu
                                style={{
                                  border: "1px solid var(--main-orange-color)",
                                }}
                                ref={dropdownRef}
                              >
                                <Dropdown.Item
                                  style={{
                                    backgroundColor: "transparent",
                                  }}
                                  ref={dropdownRef}
                                  className="no-hover-change"
                                  onClick={() => {
                                    makeCall({
                                      number: val?.phone_number,
                                      name:
                                        val?.first_name + " " + val?.last_name,
                                    });
                                  }}
                                >
                                  <div className="row">
                                    <div className="col-12 Numberlength">
                                      {val.phone_number}{" "}
                                    </div>
                                  </div>
                                </Dropdown.Item>

                                {val.mobile_number && (
                                  <>
                                    <hr style={{ margin: "0px" }} />
                                    <Dropdown.Item
                                      style={{
                                        backgroundColor: "transparent",
                                      }}
                                      ref={dropdownRef}
                                      onClick={() => {
                                        makeCall({
                                          number: val?.mobile_number,
                                          name:
                                            val?.first_name +
                                            " " +
                                            val?.last_name,
                                        });
                                      }}
                                    >
                                      <div className="row">
                                        <div className="col-9 Numberlength">
                                          {val.mobile_number}
                                        </div>
                                        <div className="col-3">
                                          <Calling
                                            width={25}
                                            height={25}
                                            style={{
                                              color:
                                                "var(--main-sidebarfont-color)",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                  </>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                          <button
                            className="ms-1"
                            onClick={() => handleEdit(val?._id)}
                          >
                            <Edit_logo
                              width={14}
                              height={14}
                              className="edithover"
                            />
                          </button>
                          <button
                            className="ms-1"
                            onClick={() => openDelete(val?._id)}
                          >
                            <Delete_logo
                              width={14}
                              height={14}
                              className="edithover"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
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
          </table>{" "}
        </div>
        <div className="show show2 mt-2 d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {count}{" "}
            {t("entries")}
          </h6>
          <div>
            <Paginationall
              totalPages={countdata}
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {show && (
        <PhonebookModal
          handleClose={handleClose}
          show={show}
          handledaatasave={handlesavedata}
          header={header}
          formData={formData}
          setFormData={setFormData}
          loader={saveloading}
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
