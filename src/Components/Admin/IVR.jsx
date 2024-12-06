import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import IVRModal from "../Modal/IVRModal";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import DeleteModal from "../Modal/DeleteModal";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { deleteapiAll, getapiAll, postapiAll, putapiall } from "../../Redux/Reducers/ApiServices";
import config from "../../config";
import { toast } from "react-toastify";
import Loader1 from "../Loader";
import { ClearSearch } from "../ClearSearch";

const initialState = {
  name: "",
  extension: "",
  greet_long: "",
  greet_short: "",
  description: "",
  ivr_enabled: "true",
  ivr_menu_parent_id: "",
  ivr_menu_timeout: "3000",
  ivr_menu_exit_app: "",
  ivr_menu_exit_data: "",
  ivr_menu_direct_dial: "",
  ivr_menu_ringback: "local_stream://default",
  ivr_menu_invalid_sound: "",
  // ivr_menu_exit_sound:"",
  ivr_menu_cid_prefix: "Demo",
  ivr_menu_pin_number: "NULL",
  ivr_menu_confirm_macro: "NULL",
  ivr_menu_confirm_key: "NULL",
  ivr_menu_tts_engine: "flite",
  ivr_menu_tts_voice: "rms",
  ivr_menu_confirm_attempts: "1",
  ivr_menu_inter_digit_timeout: "2000",
  ivr_menu_max_failures: "",
  ivr_menu_max_timeouts: "1",
  ivr_menu_digit_len: "5",
  ivr_uuid: "",
  ivr_menu_option: [
    {
      menu_digit: "",
      select_type: "",
      menu_option: "menu-exec-app",
      menu_param: "",
      menu_order: 102,
      ivr_menu_option_enabled: 1,
    },
  ],
};

export default function IVR() {
  let Token = Cookies.get("Token");
  const abortControllerRef = useRef(null);
  const { t } = useTranslation();
  const IVRList = useSelector((state) => state?.postapiAll?.postapiall?.Ivrdata?.data?.IVR);
  const [Row, setRow] = useState([]);
  const count = useSelector((state) => state.postapiAll.postapiall.Ivrdata?.data?.conference_total);
  const countdata = useSelector(
    (state) => state.postapiAll.postapiall.Ivrdata?.data?.total_page_count
  );
  const [searchTerm, setSearchterm] = useState("");
  const [select, setselect] = useState(10);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [editId, setEditId] = useState(0);
  const [mode, setMode] = useState("");
  const [Loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveloading, setsaveLoading] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");
  const [savedata, setsavedata] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [allDropdown, setAllDropDown] = useState({});
  const [soundDropdown, setSoundDropDown] = useState({});
  const [ringDropdown, setRingDropDown] = useState({});
  const [formData, setFormData] = useState(initialState);

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
    dispatch(
      getapiAll({
        Api: config.DROPDOWN.URL.SOUND,
        Token: Token,
        urlof: config.DROPDOWN.KEY.SOUND,
      })
    ).then((response) => {
      setSoundDropDown(response?.payload?.response?.data || {});
    });
  }, []);
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
        Api: config.IVR.URL.LIST,
        Token: Token,
        urlof: config.IVR.KEY.LIST,
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
  const clearSearch = () => {
    setSearchterm("");
  };

  const saveData = () => {
    const payloadData = formData;
    payloadData.ivr_enabled = "true";
    payloadData.greet_short = payloadData.greet_long;
    payloadData.ivr_menu_direct_dial = "true";
    payloadData.ivr_menu_option = payloadData.ivr_menu_option.map((i) => ({
      ...i,
      ivr_menu_option_enabled: i.ivr_menu_option_enabled ? "true" : "false",
      menu_option: "menu-exec-app",
      menu_param:
        mode === "Edit" && i.menu_param.startsWith("transfer")
          ? i.menu_param
          : mode === "Add" && i.menu_param.startsWith("transfer")
          ? i.menu_param
          : "transfer " + i.menu_param,
    }));
    if (mode === "Edit") {
      setsaveLoading(true);
      dispatch(
        putapiall({
          inputData: {
            ...payloadData,
            ivr_id: editId,
            ivr_menu_exit_sound: formData.ivr_menu_invalid_sound,
          },
          Api: config.IVR.URL.UPDATE,
          Token: Token,
          urlof: config.IVR.KEY.UPDATE,
        })
      ).then((response) => {
        if (response.payload.response) {
          setLoader(false);
          setsaveLoading(false);
          setsavedata(!savedata);
          setCurrentPage(1);
          setSearchterm("");
          setFormData(initialState);
          setMode("");
          toast.success(t(response.payload?.response?.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
          handleClose();
        } else {
          setsaveLoading(false);
          toast.error(t(response.payload.error.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      });
    } else {
      setsaveLoading(true);
      dispatch(
        postapiAll({
          inputData: {
            ...payloadData,
            ivr_menu_exit_sound: formData.ivr_menu_invalid_sound,
          },
          Api: config.IVR.URL.ADD,
          Token: Token,
          urlof: config.IVR.KEY.ADD,
        })
      )
        .then((response) => {
          if (response.payload.response) {
            setsaveLoading(false);
            setsavedata(!savedata);
            setCurrentPage(1);
            setSearchterm("");
            setMode("");
            toast.success(t(response.payload?.response?.message), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
            handleClose();
            setFormData(initialState);
          } else {
            setsaveLoading(false);

            toast.error(t(response.payload?.error?.response?.data?.message), {
              autoClose: config.TOST_AUTO_CLOSE,
            });
          }
        })
        .catch((error) => {});
    }
  };

  const handleEdit = (id) => {
    setShow(true);
    setMode("Edit");
    setEditId(id);
    setHeader(t("Edit iVR"));
  };

  const DeleteItem = () => {
    setDeleteLoading(true);
    const data = { id: deleteId };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.IVR.URL.DELETE,
        Token: Token,
        urlof: config.IVR.KEY.DELETE,
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
  const openDelete = (id) => {
    setDeleteId(id);
    setDeletemodal(true);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
  };

  const openModal = () => {
    setFormData({
      name: "",
      extension: "",
      greet_long: "",
      greet_short: "",
      description: "",
      ivr_enabled: "true",
      ivr_menu_parent_id: "",
      ivr_menu_timeout: "3000",
      ivr_menu_exit_app: "",
      ivr_menu_exit_data: "",
      ivr_menu_direct_dial: "",
      ivr_menu_ringback: "local_stream://default",
      ivr_menu_invalid_sound: "",
      // ivr_menu_exit_sound: ivr_menu_invalid_sound,
      ivr_menu_cid_prefix: "Demo",
      ivr_menu_pin_number: "NULL",
      ivr_menu_confirm_macro: "NULL",
      ivr_menu_confirm_key: "NULL",
      ivr_menu_tts_engine: "flite",
      ivr_menu_tts_voice: "rms",
      ivr_menu_confirm_attempts: "1",
      ivr_menu_inter_digit_timeout: "2000",
      ivr_menu_max_failures: "",
      ivr_menu_max_timeouts: "1",
      ivr_menu_digit_len: "5",
      ivr_uuid: "",
      ivr_menu_option: [
        {
          menu_digit: "",
          select_type: "",
          menu_option: "menu-exec-app",
          menu_param: "",
          menu_order: 102,
          ivr_menu_option_enabled: 1,
        },
      ],
    });

    setShow(true);
    setMode("Add");
    setHeader(t("Add new iVR"));
  };

  const handleClose = () => {
    setShow(false);
    setFormData({
      name: "",
      extension: "",
      greet_long: "",
      // greet_short: "",
      description: "",
      ivr_enabled: "true",
      // ivr_menu_parent_id: "",
      // ivr_menu_timeout: "",
      ivr_menu_exit_app: "",
      ivr_menu_exit_data: "",
      // ivr_menu_direct_dial: "",
      // ivr_menu_ringback: "",
      ivr_menu_invalid_sound: "",
      // ivr_menu_exit_sound: "",
      // ivr_menu_cid_prefix: "",
      // ivr_menu_pin_number: "",
      // ivr_menu_confirm_macro: "",
      // ivr_menu_confirm_key: "",
      // ivr_menu_tts_engine: "",
      // ivr_menu_tts_voice: "",
      // ivr_menu_confirm_attempts: "",
      // ivr_menu_inter_digit_timeout: "",
      ivr_menu_max_failures: "",
      // ivr_menu_max_timeouts: "",
      // ivr_menu_digit_len: "",
      ivr_uuid: "",
      ivr_menu_option: [
        {
          menu_digit: "",
          select_type: "",
          menu_option: "",
          menu_param: "",
          menu_order: 102,
          ivr_menu_option_enabled: 1,
        },
      ],
    });
    setMode("");
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

  useEffect(() => {
    setRow(IVRList);
  }, [IVRList]);

  useEffect(() => {
    if (mode === "Edit" && editId) {
      setHeader(t("Edit iVR"));
      setsaveLoading(true);
      const data = { id: editId };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.IVR.URL.DETAILS,
          Token: Token,
          urlof: config.IVR.KEY.DETAILS,
        })
      ).then((response) => {
        setsaveLoading(false);
        const values = response?.payload?.response?.data;
        const updatedMenuOption = values.ivr_menu_option.map((option) => ({
          ...option,
          menu_param: option.menu_param.startsWith("transfer")
            ? option.menu_param.replace(/^transfer\s/, "")
            : option.menu_param,
        }));
        setFormData({
          // ivr_uuid:values.ivr_uuid,
          domain_id: values.domain_id,
          context: values.context,
          name: values.name,
          extension: values.extension,
          greet_long: values.greet_long,
          greet_short: values.greet_long,
          description: values.description,
          ivr_enabled: "true",
          // ivr_menu_parent_id: values.ivr_menu_parent_id,
          ivr_menu_timeout: values.ivr_menu_timeout,
          ivr_menu_exit_app: values.ivr_menu_exit_app,
          ivr_menu_exit_data: values.ivr_menu_exit_data,
          ivr_menu_direct_dial: "true",
          ivr_menu_ringback: values.ivr_menu_ringback,
          ivr_menu_invalid_sound: values.ivr_menu_invalid_sound,
          // ivr_menu_exit_sound: values.ivr_menu_invalid_sound,
          ivr_menu_cid_prefix: values.ivr_menu_cid_prefix,
          ivr_menu_pin_number: values.ivr_menu_pin_number,
          ivr_menu_confirm_macro: values.ivr_menu_confirm_macro,
          ivr_menu_confirm_key: values.ivr_menu_confirm_key,
          ivr_menu_tts_engine: values.ivr_menu_tts_engine,
          ivr_menu_tts_voice: values.ivr_menu_tts_voice,
          ivr_menu_confirm_attempts: values.ivr_menu_confirm_attempts,
          ivr_menu_inter_digit_timeout: values.ivr_menu_inter_digit_timeout,
          ivr_menu_max_failures: values.ivr_menu_max_failures,
          ivr_menu_max_timeouts: values.ivr_menu_max_timeouts,
          ivr_menu_digit_len: values.ivr_menu_digit_len,
          ivr_menu_option: updatedMenuOption,
          ivr_uuid: values.ivr_uuid,
        });
      });
    }
  }, [mode]);
  let startEntry = (currentPage - 1) * select + 1;
  if (count === 0) {
    startEntry = 0;
  }
  let endEntry = currentPage * select;
  if (endEntry > count) {
    endEntry = count;
  }
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
  const sortingTable = (name) => {
    if (!Row) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const sortData = [...Row].sort((a, b) => {
      const valueA = a[name];
      const valueB = b[name];
      if (name === "ring_group_phone_number" || name === "ring_group_duration") {
        const stra = parseInt(valueA);
        const strb = parseInt(valueB);
        return newAscending ? stra - strb : strb - stra;
      } else {
        const strA = String(valueA);
        const strB = String(valueB);
        return newAscending ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }
    });
    setSortedColumn(name);
    setAscending(!newAscending);
    setRow(sortData);
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
      <AdminHeader openModal={openModal} pathname={t("IVR")} />
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
                <th style={{ width: "18%" }}>
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
                    onClick={() => sortingTable("description")}
                  >
                    <p className="mb-0">{t("Description")}</p>
                    {arrowShow("description")}
                  </div>
                </th>
                <th style={{ width: "18%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("assign_pstn_number")}
                  >
                    <p className="mb-0">{t("Phone number")}</p>
                    {arrowShow("assign_pstn_number")}
                  </div>
                </th>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("extension")}
                  >
                    <p className="mb-0">{t("Extension")}</p>
                    {arrowShow("extension")}
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
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    <Loader1 />
                  </td>
                </tr>
              ) : (
                <>
                  {Row && Row.length > 0 ? (
                    Row.map((val, index) => {
                      const date = new Date(val?.createdAt);
                      const formattedDate = new Date(date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".");
                      return (
                        <tr className="table_body">
                          <td>{val?.name}</td>
                          <td>{val?.description}</td>
                          <td>
                            {val.assign_pstn_number ? val.assign_pstn_number : t("Not Assigned")}
                          </td>
                          <td>{val?.extension}</td>
                          <td>{formattedDate}</td>
                          <td className="table_edit">
                            <button onClick={() => handleEdit(val?._id)}>
                              <Edit_logo width={14} height={14} className="edithover" />
                            </button>
                            <button className="ms-1" onClick={() => openDelete(val?._id)}>
                              <Delete_logo width={14} height={14} className="edithover" />
                            </button>
                          </td>
                        </tr>
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
        <div className="show show2 mt-2  d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {count} {t("entries")}
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
        <IVRModal
          allDropdown={allDropdown}
          soundDropdown={soundDropdown}
          handleClose={handleClose}
          show={show}
          header={header}
          formData={formData}
          setFormData={setFormData}
          saveData={saveData}
          IVRList={IVRList}
          loader={saveloading}
          ringDropdown={ringDropdown}
          initialState={initialState}
          mode={mode}
        />
      )}
      {deletemodal && (
        <DeleteModal
          loader={deleteLoading}
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={DeleteItem}
        />
      )}
    </div>
  );
}
