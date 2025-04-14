import React, { useEffect, useId, useRef, useState } from "react";
import {AdminHeader} from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import OutboundModal from "../Modal/OutboundModal";
import DeleteModal from "../Modal/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteapiAll, postapiAll, putapiall } from "../../Redux/Reducers/ApiServices";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import config from "../../config";
import Loader from "../Loader";
import cross from "../../Assets/Icon/cross_for_search.svg";
import { ClearSearch } from "../ClearSearch";
export default function Outbound() {
  const { t } = useTranslation();
  const abortControllerRef = useRef(null);
  const Token = Cookies.get("Token");
  const dispatch = useDispatch();
  const dataaa = useSelector((state) => state.postapiAll.postapiall.outbound.data);
  const count = useSelector(
    (state) => state.postapiAll.postapiall.outbound.outbound_route_total_counts
  );
  const totalpagecount = useSelector(
    (state) => state.postapiAll.postapiall.outbound.total_page_count
  );
  const [Row, setRow] = useState([]);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [header, setHeader] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [searchTerm, setSearchterm] = useState("");
  const [EditId, seteditid] = useState(0);
  const [select, setselect] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");
  const [saveloading, setsaveLoading] = useState(false);
  const [deleteid, setdeleteid] = useState("");
  const [mode, setmode] = useState("");
  const [savedata, setsavedata] = useState("");
  const [formData, setFormData] = useState({
    prefix: "",
    gateway_id: "",
    gateway_2: null,
    gateway_3: null,
    expression_detail: "",
    description: "",
    dialplanoutbound_enabled: false,
    order: "",
    outbound_name: "",
    prepend: "",
  });
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    if (!newSearchTerm.trim()) {
      setSearchterm("");
    } else {
      setSearchterm(newSearchTerm);
      setCurrentPage(1);
    }
  };
  const startEntry = (currentPage - 1) * select + 1;
  let endEntry = currentPage * select;
  if (endEntry > count) {
    endEntry = count;
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
    };
    dispatch(
      postapiAll({
        inputData: inputData,
        Api: config.OUTBOUND.LIST,
        Token: Token,
        urlof: config.OUTBOUND_KEY.LIST,
        signal: abortController.signal,
      })
    ).then((res) => {
      if (res?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });
  }, [currentPage, searchTerm, select, savedata]);
  useEffect(() => {
    setRow(dataaa);
  }, [dataaa]);
  const handleEdit = (id) => {
    setShow(true);
    setHeader(t("Edit Outbound route"));
    setmode("edit");
    seteditid(id);

    if (id) {
      setsaveLoading(true);
      const data = {
        outbound_id: id,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.OUTBOUND.DETAIL,
          Token: Token,
          urlof: config.OUTBOUND_KEY.DETAIL,
        })
      ).then((response) => {
        setsaveLoading(false);
        const edivalues = response.payload.response.OutboundRouteDetail;
        const match = edivalues?.expression_detail.match(/\{(\d+)\}/);

        const digitLength = match ? parseInt(match[1], 10) : null;
        console.log(digitLength, "digitLengthcheck");
        const xString = digitLength ? "x".repeat(digitLength) : "";
        console.log(xString, "xStringCheck");
        setFormData({
          prefix: edivalues?.prefix,
          gateway_id: edivalues?.gateway_id,
          gateway_2: edivalues?.gateway_2,
          gateway_3: edivalues?.gateway_3,
          expression_detail: xString,
          description: edivalues?.description,
          dialplanoutbound_enabled: edivalues?.dialplanoutbound_enabled,
          order: edivalues?.order,
          outbound_name: edivalues?.outbound_name,
          prepend: edivalues?.outbound_name,
        });
      });
    }
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    const data = { outbound_id: deleteid };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.OUTBOUND.DELETE,
        Token: Token,
        urlof: config.OUTBOUND_KEY.DELETE,
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

  const handlesavedata = () => {
    const datavalues = {
      prefix: formData?.prefix,
      cid: formData?.cid,
      gateway_id: formData?.gateway_id,
      gateway_2: formData?.gateway_2 || null,
      gateway_3: formData?.gateway_3 || null,
      expression_detail: `^\\\\+?(\\\\d{${formData?.expression_detail.length}})$`,
      description: formData?.description,
      dialplanoutbound_enabled: true,
      order: "100",
      outbound_name: formData?.prepend,
      prepend: formData?.prepend,
    };
    if (mode === "add") {
      setsaveLoading(true);
      const data = datavalues;
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.OUTBOUND.ADD,
          Token: Token,
          urlof: config.OUTBOUND_KEY.ADD,
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
        outbound_id: EditId,
        ...datavalues,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.OUTBOUND.UPDATE,
          Token: Token,
          urlof: config.OUTBOUND_KEY.UPDATE,
        })
      ).then((res) => {
        if (res?.payload?.response) {
          setsaveLoading(false);
          handleClose();
          setsavedata(!savedata);
          setCurrentPage(1);
          setFormData("");
          setSearchterm("");
          toast.success(t(res.payload?.response?.message), {
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
  const openDelete = (id) => {
    setDeletemodal(true);
    setdeleteid(id);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
    setdeleteid("");
  };

  const openModal = () => {
    setShow(true);
    setHeader(t("Add new Outbound route"));
    setmode("add");
  };
  const clearSearch = () => {
    setSearchterm("");
  };

  const handleClose = () => {
    setShow(false);
    setFormData({
      prefix: "",
      cid: "",
      gateway_id: "",
      gateway_2: null,
      gateway_3: null,
      expression_detail: "",
      description: "",
      dialplanoutbound_enabled: false,
      order: "",
      outbound_name: "",
      prepend: "",
    });
    seteditid("");
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

  const sortingTable = (name) => {
    if (!Row) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const sortData = [...Row].sort((a, b) => {
      if (newAscending) {
        return a[name].localeCompare(b[name]);
      } else {
        return b[name].localeCompare(a[name]);
      }
    });
    setSortedColumn(name);
    setAscending(!newAscending);
    setRow(sortData);
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
  return (
    <div className="tablespadding">
      <AdminHeader openModal={openModal} addBtn={false} />
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
              value={searchTerm}
            />
            {searchTerm && <ClearSearch clearSearch={clearSearch} />}
          </div>
        </div>
        <div style={{ overflowX: "auto", height: dynamicHeight }} className="sidebar_scroll">
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "16.66%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("outbound_name")}
                  >
                    <p className="mb-0">{t("prepend")}</p>
                    {adduisortingui("outbound_name")}
                  </div>
                </th>
                <th style={{ width: "13%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("prefix")}
                  >
                    <p className="mb-0">{t("Prefix")} </p>
                    {adduisortingui("prefix")}
                  </div>
                </th>
                <th style={{ width: "20%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("expression_detail")}
                  >
                    <p className="mb-0">{t("Match pattern")}</p>
                    {adduisortingui("expression_detail")}
                  </div>
                </th>
                <th style={{ width: "20%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("trunk_name")}
                  >
                    <p className="mb-0">{t("Trunk name")}</p>
                    {adduisortingui("trunk_name")}
                  </div>
                </th>
                <th style={{ width: "12%" }}>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td style={{ width: "100%", textAlign: "center" }} colSpan="6">
                    <Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {Row && Row.length > 0 ? (
                    Row?.map((val, index) => {
                      return (
                        <>
                          <tr className="table_body">
                            <td>{val.outbound_name}</td>
                            <td>{val.prefix}</td>
                            <td>{val.expression_detail}</td>
                            <td>{val.trunk_name}</td>
                            <td className="table_edit">
                              <button className="ms-1" onClick={() => handleEdit(val._id)}>
                                <Edit_logo width={14} height={14} className="edithover" />
                              </button>
                              <button className="ms-1" onClick={() => openDelete(val._id)}>
                                <Delete_logo width={14} height={14} className="edithover" />
                              </button>
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
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {count} {t("entries")}
          </h6>
          <div>
            <Paginationall
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
              totalPages={totalpagecount}
            />
          </div>
        </div>
      </div>
      {show && (
        <OutboundModal
          handleClose={handleClose}
          show={show}
          header={header}
          handedatasave={handlesavedata}
          formData={formData}
          setFormData={setFormData}
          loader={saveloading}
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
