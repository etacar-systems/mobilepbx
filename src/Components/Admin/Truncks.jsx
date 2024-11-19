import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import { ReactComponent as Yes_logo } from "../../Assets/Icon/check.svg";
import close_logo from "../../Assets/Icon/assinnpn.svg";
import TrunkModal from "../Modal/TrunkModal";
import DeleteModal from "../Modal/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  deleteapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Pagination from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import config from "../../config";
import Loader from "../Loader";
import cross from "../../Assets/Icon/cross_for_search.svg";
import { ClearSearch } from "../ClearSearch";

export default function Truncks() {
  const { t } = useTranslation();
  let Token = Cookies.get("Token");
  const abortControllerRef = useRef(null);

  // DISPATCH THE DATA
  const dispatch = useDispatch();
  const count = useSelector(
    (state) => state.postapiAll.postapiall.Trunks.company_total_counts
  );
  const countdata = useSelector(
    (state) => state.postapiAll.postapiall.Trunks.total_page_count
  );
  const trunksdata = useSelector(
    (state) => state.postapiAll.postapiall.Trunks.data
  );
  // STATE
  const [Trunksdata, setTrunksdata] = useState([]);
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
  const [formData, setFormData] = useState({
    gateway_name: "",
    cid: "",
    username: "",
    password: "",
    realm: "",
    from_user: "",
    proxy: "",
    description: "",
    transport: "",
  });
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
        Api: config.TRUNK.LIST,
        Token: Token,
        urlof: config.TRUNK_KEY.LIST,
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
  useEffect(() => {
    setTrunksdata(trunksdata);
  }, [trunksdata]);

  const sortingTable = (name) => {
    if (!Trunksdata) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const sortData = [...Trunksdata].sort((a, b) => {
      const valueA = a[name];
      const valueB = b[name];
      if (name === "sip_server_port") {
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
    setTrunksdata(sortData);
  };

  const DeleteItem = () => {
    setDeleteLoading(true);
    const data = { trunk_id: deleteId };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.TRUNK.DELETE,
        Token: Token,
        urlof: config.TRUNK_KEY.DELETE,
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

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    if (!newSearchTerm.trim()) {
      setSearchterm("");
    } else {
      setSearchterm(newSearchTerm);
      setCurrentPage(1);
    }
  };

  const handleEdit = (id) => {
    setmode("edit");
    seteditid(id);
    setShow(true);
    setHeader(t("Edit Trunks"));
    if (id) {
      setsaveLoading(true);
      const data = {
        trunk_id: id,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.TRUNK.DETAIL,
          Token: Token,
          urlof: config.TRUNK_KEY.DETAIL,
        })
      ).then((response) => {
        setsaveLoading(false);
        const editsvalues = response?.payload?.response?.TrunkDetail;
        setFormData({
          gateway_name: editsvalues?.gateway_name,
          cid: editsvalues?.cid,
          Secret: editsvalues?.username,
          password: editsvalues?.password,
          realm: editsvalues?.realm,
          from_user: editsvalues?.from_user,
          proxy: editsvalues?.proxy,
          description: editsvalues?.description,
          transport: editsvalues?.transport,
        });
      });
    }
  };
  const openDelete = (id) => {
    setDeleteId(id);
    setDeletemodal(true);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
  };

  const openModal = () => {
    setShow(true);
    setHeader(t("Add new trunk"));
    setmode("add");
  };
  const handleClose = () => {
    setShow(false);
    seteditid("");
    setFormData("");
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

  const startEntry = (currentPage - 1) * select + 1;
  let endEntry = currentPage * select;
  if (endEntry > count) {
    endEntry = count;
  }
  const handlesavedata = () => {
    const datavalues = {
      gateway_name: formData?.gateway_name,
      cid: formData?.cid,
      username: formData?.Secret,
      password: formData?.password,
      realm: formData?.realm,
      from_user: formData?.from_user,
      proxy: formData?.proxy,
      expire_seconds: "800",
      retry_seconds: "30",
      register: true,
      gateway_enabled: true,
      description: formData?.description,
      transport: formData?.transport,
    };

    if (mode === "add") {
      setsaveLoading(true);
      const data = datavalues;
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.TRUNK.ADD,
          Token: Token,
          urlof: config.TRUNK_KEY.ADD,
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
          toast.error(t(res?.payload?.error?.response?.data?.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      });
    }
    if (mode === "edit") {
      setsaveLoading(true);
      const data = {
        trunk_id: EditId,
        ...datavalues,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.TRUNK.UPDATE,
          Token: Token,
          urlof: config.TRUNK_KEY.UPDATE,
        })
      ).then((res) => {
        if (res.payload.response) {
          setsaveLoading(false);
          handleClose();
          setsavedata(!savedata);
          setCurrentPage(1);
          setFormData("");
          setSearchterm("");
          toast.success(t(res.payload.response.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        } else {
          setsaveLoading(false);
          toast.error(t(res?.payload?.error?.response?.data?.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      });
    }
  };
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
        pathname={t("Trunks")}
        addBtn={false}
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
                <option value="10">10</option>
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
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "18%" }}>
                  <div
                    div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("gateway_name")}
                  >
                    <span>{t("Name")}</span>
                    {arrowShow("gateway_name")}
                  </div>
                </th>
                <th style={{ width: "19%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("description")}
                  >
                    <span className="mb-0">{t("Description")}</span>
                    {arrowShow("description")}
                  </div>
                </th>
                <th style={{ width: "17%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("username")}
                  >
                    <span className="mb-0">{t("Secret")}</span>
                    {arrowShow("username")}
                  </div>
                </th>
                <th style={{ width: "17%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("proxy")}
                  >
                    <span className="mb-0">{t("SIP Server")}</span>
                    {arrowShow("proxy")}
                  </div>
                </th>
                <th style={{ width: "10%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("register")}
                  >
                    <span className="mb-0">{t("Register")}</span>
                    {arrowShow("register")}
                  </div>
                </th>
                <th style={{ width: "12%" }}>{t("Actions")}</th>
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
                  {Trunksdata && Trunksdata.length > 0 ? (
                    Trunksdata.map((val, index) => (
                      <tr className="table_body">
                        <td>{val?.gateway_name}</td>
                        <td>{val?.description}</td>
                        <td>{val?.username}</td>
                        <td>{val?.proxy}</td>
                        <td>
                          {" "}
                          <td>
                            {!val.register ? (
                              <img src={close_logo} alt="" width={20} />
                            ) : (
                              <Yes_logo width={15} />
                            )}
                          </td>
                        </td>
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
          </table>
        </div>
        <div className="show show2 mt-2  d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {count}{" "}
            {t("entries")}
          </h6>
          <div>
            <Pagination
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
              totalPages={countdata}
            />
          </div>
        </div>
      </div>
      {show && (
        <TrunkModal
          show={show}
          header={header}
          handlesavedata={handlesavedata}
          formData={formData}
          setFormData={setFormData}
          loader={saveloading}
          handleClose={handleClose}
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
