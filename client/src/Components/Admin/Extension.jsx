import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import ExtensionModal from "../Modal/ExtensionModal";
import { toast } from "react-toastify";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import DeleteModal from "../Modal/DeleteModal";
import Cookies from "js-cookie";
import {
  deleteapiAll,
  getapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import config from "../../config";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";
import { Usertype, Usertype_Admin, Usertype_User } from "../ConstantConfig";

export default function Extension() {
  const { t } = useTranslation();
  const abortControllerRef = useRef(null);

  let Token = Cookies.get("Token");
  const dispatch = useDispatch();
  const extensioList = useSelector(
    (state) => state.postapiAll.postapiall.Extension.usersData
  );
  const count = useSelector(
    (state) => state.postapiAll.postapiall.Extension.company_total_counts
  );
  const countdata = useSelector(
    (state) => state.postapiAll.postapiall.Extension.total_page_count
  );
  const clearSearch = () => {
    setSearchterm("");
  };
  const [extensionData, setExtensionData] = useState();
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchterm] = useState("");
  const [select, setselect] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [savedata, setsavedata] = useState(false);
  const [formData, setFormData] = useState({
    Extension_number: "",
    First_name: "",
    Last_name: "",
    Password: "",
    Email: "",
    Mobile: "",
    Country: "",
    Pstn_number: "",
    user_record: false,
    User_type: "",
  });
  const [saveloading, setsaveLoading] = useState(false);
  const [mode, setmode] = useState("");
  const [EditId, seteditid] = useState();
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");
  const [pstndestination, setpstndestination] = useState("");
  const [getPstnNumber, setPstneNumber] = useState([]);
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
        Api: config.EXTENSION.LIST,
        Token: Token,
        urlof: config.EXTENSION_KEY.LIST,
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
  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.PSTN_NUMBER.EXTENSION_LIST,
        Token: Token,
        urlof: config.PSTN_NUMBER_KEY.EXTENSION_LIST,
      })
    ).then((res) => {
      if (res && res.payload && res.payload.response) {
        setPstneNumber(res.payload.response.PstnList);
      }
    });
  }, [show, savedata]);
  useEffect(() => {
    setExtensionData(extensioList);
  }, [extensioList]);
  let extionnumber;
  const handleEdit = (id) => {
    setpstndestination("");
    extionnumber = true;
    seteditid(id);
    setmode("edit");
    setShow(true);
    setHeader(t("Edit extension"));
    if (id) {
      setsaveLoading(true);
      const data = {
        uid: id,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.EXTENSION.VALUE,
          Token: Token,
          urlof: config.EXTENSION_KEY.VALUE,
        })
      ).then((response) => {
        setsaveLoading(false);
        const editsvalues = response?.payload?.response?.data;
        setpstndestination(editsvalues?.pstn_number?.destination);
        setFormData({
          Extension_number: editsvalues?.user_extension,
          First_name: editsvalues?.first_name,
          Last_name: editsvalues?.last_name,
          Password: editsvalues?.password,
          Email: editsvalues?.user_email,
          Mobile: editsvalues?.mobile,
          Country: editsvalues?.country,
          Pstn_number: editsvalues?.pstn_number?._id,
          user_record: false,
          User_type: editsvalues?.role?.type == 1 ? "User" : "Admin",
        });
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
    setDeleteLoading(false);
    setDeletemodal(false);
  };

  const DeleteItem = () => {
    setDeleteLoading(true);
    const data = {
      uid: deleteId,
    };
    dispatch(
      postapiAll({
        inputData: data,
        Api: config.EXTENSION.DELETE,
        Token: Token,
        urlof: config.EXTENSION_KEY.DELETE,
      })
    ).then((res) => {
      if (res.payload.response) {
        setDeleteLoading(false);
        handleCloseDelete();
        setCurrentPage(1);
        setsavedata(!savedata);
        setSearchterm("");
        console.log("errorlog", res);
        toast.success(t(res?.payload?.response?.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      } else {
        console.log("errorlog", res);
        setDeleteLoading(false);
        toast.error(t(res?.error?.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
      }
    });
  };

  const openModal = () => {
    setpstndestination("");
    setmode("add");
    setShow(true);
    setHeader(t("Add new extension"));
  };

  const handleClose = () => {
    setsaveLoading(false);
    setShow(false);
    setFormData({
      Extension_number: "",
      First_name: "",
      Last_name: "",
      Password: "",
      Email: "",
      Mobile: "",
      Country: "",
      Pstn_number: "",
      user_record: false,
      User_type: "",
    });
  };

  const handlesavedata = () => {
    //   pstn_number: String;
    //   first_name: String;setLoading(false)
    //   last_name: String;
    //   password: String;
    //   user_extension: String;
    //   user_email: String;
    //   role: Number;
    //   mobile: String;
    //   country: String;

    //   user_image: String;
    //   user_custom_msg: String;
    const listvalues = {
      ...(formData.User_type == Usertype_User
        ? { user_extension: formData.Extension_number }
        : {}),
      first_name: formData.First_name,
      last_name: formData.Last_name,
      password: formData.Password,
      user_email: formData.Email,
      mobile: formData.Mobile,
      country: formData.Country,
      user_image: "",
      user_custom_msg: "",
      ...(formData.Pstn_number ? { pstn_number: formData.Pstn_number } : {}),
      user_record: false,
      user_type: formData.User_type == Usertype_Admin ? 4 : 1,
    };
    if (mode === "add") {
      setsaveLoading(true);
      const data = listvalues;
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.EXTENSION.ADD,
          Token: Token,
          urlof: config.EXTENSION_KEY.ADD,
        })
      ).then((res) => {
        if (res?.payload?.response) {
          setsaveLoading(false);
          handleClose();
          setsavedata(!savedata);
          setCurrentPage(1);
          setSearchterm("");
          setFormData("");
          toast.success(t(res?.payload?.response?.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        } else {
          if (res?.payload?.error) {
            setsaveLoading(false);
            toast.error(t(res?.payload?.error?.response?.data?.message), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
          }
        }
      });
    }
    if (mode === "edit") {
      setsaveLoading(true);
      let data = {
        uid: EditId,
        ...listvalues,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.EXTENSION.UPDATE,
          Token: Token,
          urlof: config.EXTENSION_KEY.UPDATE,
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
          toast.error(t(res?.payload?.error?.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          setsaveLoading(false);
        }
      });
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
    if (!extensioList) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const isNumber = (value) => !isNaN(value);

    const sortData = [...extensionData]?.sort((a, b) => {
      const getDestination = (item) =>
        item?.pstn_number?.destination
          ? item.pstn_number.destination
          : "Not Assigned";
      if (name == "type") {
        const TypeA = a?.role?.type;
        const TypeB = b?.role?.type;
        if (isNumber(TypeA) && isNumber(TypeB)) {
          return newAscending ? TypeA - TypeB : TypeB - TypeA;
        } else {
          return newAscending
            ? TypeA.localeCompare(TypeB)
            : TypeB.localeCompare(TypeA);
        }
      }
      if (name === "destination") {
        const destA = getDestination(a);
        const destB = getDestination(b);

        // Check if it's numeric
        if (isNumber(destA) && isNumber(destB)) {
          return newAscending ? destA - destB : destB - destA;
        } else {
          return newAscending
            ? destA.localeCompare(destB)
            : destB.localeCompare(destA);
        }
      } else if (isNumber(a[name])) {
        // Fallback for other numeric values
        return newAscending ? a[name] - b[name] : b[name] - a[name];
      } else {
        // Fallback for other string values
        return newAscending
          ? a[name].localeCompare(b[name])
          : b[name].localeCompare(a[name]);
      }
    });

    setSortedColumn(name);
    setAscending(!newAscending);
    setExtensionData(sortData);
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
      <AdminHeader openModal={openModal} pathname={t("Extensions")} />
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
              className="Search-bg new-search-add"
              onChange={handleSearchChange}
              onPaste={handlePaste}
              value={searchTerm}
            />
            {searchTerm && <ClearSearch clearSearch={clearSearch} />}
          </div>
        </div>
        <div
          style={{ overflowY: "auto", height: dynamicHeight, width: "100%" }}
          className="sidebar_scroll"
        >
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("first_name")}
                  >
                    <p className="mb-0">{t("User")}</p>
                    {arrowShow("first_name")}
                  </div>
                </th>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("user_extension")}
                  >
                    <p className="mb-0">{t("Extension")}</p>
                    {arrowShow("user_extension")}
                  </div>
                </th>
                <th style={{ width: "21%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("destination")}
                  >
                    <p className="mb-0">{t("Phone Number")}</p>
                    {arrowShow("destination")}
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
                <th style={{ width: "10%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("type")}
                  >
                    <p className="mb-0">{t("User type")}</p>
                    {arrowShow("type")}
                  </div>
                </th>
                <th style={{ width: "12%" }}>{t("Action")}</th>
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
                  {extensionData && extensionData.length > 0 ? (
                    [...extensionData]
                      ?.sort((a, b) => {
                        if (a?.user_extension < b?.user_extension) {
                          return -1; // a comes before b
                        }
                        if (a?.user_extension > b?.user_extension) {
                          return 1; // b comes before a
                        }
                        return 0; // a and b are equal
                      })
                      ?.map((val, index) => {
                        const username = val?.first_name + " " + val?.last_name;
                        const date = new Date(val?.createdAt);
                        const formattedDate = new Date(date)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, ".");
                        return (
                          <>
                            <tr className="table_body" key={val?._id}>
                              <td>{username}</td>
                              <td>{val?.user_extension}</td>
                              <td>
                                {val?.pstn_number?.destination
                                  ? val?.pstn_number?.destination
                                  : t("Not Assigned")}
                              </td>
                              <td>{formattedDate}</td>
                              <td>
                                {val?.role.type == 1 ? t("User") : t("Admin")}
                              </td>
                              {/* <td>{val.user_type == 1 ? "User" : "Admin"}</td> */}
                              <td className="table_edit">
                                <button onClick={() => handleEdit(val?._id)}>
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
        <ExtensionModal
          handleClose={handleClose}
          show={show}
          header={header}
          formData={formData}
          setFormData={setFormData}
          loader={saveloading}
          handlesavedata={handlesavedata}
          mode={mode}
          pstndestination={pstndestination}
          getPstnNumber={getPstnNumber}
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
