import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { toast } from "react-toastify";
import PstnModal from "../Modal/PstnModal";
import DeleteModal from "../Modal/DeleteModal";
import { deleteapiAll, getapiAll, postapiAll, putapiall } from "../../Redux/Reducers/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import config from "../../config";
import cross from "../../Assets/Icon/cross_for_search.svg";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";
import CustomDropDown from "../CustomDropDown";
import ConstantConfig from "../ConstantConfig";

const SuccessModal = ({ data, showSuccessModal, setShowSuccessModal }) => {
  const { t } = useTranslation();
  return (
    <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
      <Modal.Header style={{ backgroundColor: "var(--main-white-color)" }}>
        <Modal.Title
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            color: "var(--main-sidebarfont-color)",
          }}
        >
          {t("PSTN Numbers")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "var(--main-white-color)",
        }}
      >
        {data && data.message && data.message.created_number.length !== 0 && (
          <div>
            <p style={{ fontSize: "16px", color: "var(--main-orange-color)" }}>
              {data.message.created_number.length} {t("numbers were successfully created.")}
            </p>
          </div>
        )}
        {data && data.message && data.message.duplicate_numbers.length !== 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "16px", color: "var(--main-error-color)" }}>
              {t("These")} {data.message.duplicate_numbers.length}
              {t(" numbers are duplicates and were ignored:")}
            </p>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                border: "1px solid var(--main-error-color)",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "var(--main-error-bg-color)",
              }}
            >
              {data.message.duplicate_numbers.map((item, index) => (
                <span
                  key={index}
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: "14px",
                    color: "var(--main-error-color)",
                  }}
                >
                  {item}
                  {index < data.message.duplicate_numbers.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          justifyContent: "center",
          backgroundColor: "var(--main-white-color)",
        }}
      >
        <Button
          variant="secondary"
          onClick={() => setShowSuccessModal(false)}
          style={{
            padding: "7px 18px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor: "var(--main-orange-color)",
          }}
        >
          {t("Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default function PstnNumber() {
  const { t } = useTranslation();
  const Token = Cookies.get("Token");
  const pstnlist = useSelector((state) => state.postapiAll.postapiall.Pstnnumber.data);
  const abortControllerRef = useRef(null);

  const count = useSelector((state) => state.postapiAll.postapiall.Pstnnumber.pstn_total_counts);
  const [allDropdown, setAllDropDown] = useState({});
  const [valueid, setvalueid] = useState("");

  const totalpagecount = useSelector(
    (state) => state.postapiAll.postapiall.Pstnnumber.total_page_count
  );
  const dispatch = useDispatch();
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [companylist, setcompanylist] = useState([]);
  const [Company, setCompany] = useState("");
  const [formData, setFormData] = useState({
    destination_number: "",
    Domain: "",
    range: "",
    gateway_id: "",
    Number: "",
  });
  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.COMPANY_LIST,
        Token: Token,
        urlof: config.COMPANY_LIST_KEY,
      })
    ).then((res) => {
      if (res.payload.response) {
        setcompanylist(res?.payload?.response?.comnayNameList);
      }
    });
  }, [Token]);
  const [checkboxStates, setCheckboxStates] = useState({
    Enabled: false,
  });
  const clearSearch = () => {
    setSearchterm("");
  };
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const handleSelection = (dropdown, value) => {
    setCurrentPage(1);
    setCompany(value);
    setOpenDropdown(null);
  };
  useEffect(() => {
    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const PstnApi = `${config.PSTN_NUMBER.LIST}/company?${
      Company ? `cid=${Company}&` : ""
    }page=${currentPage}&size=${select}&search=${searchTerm}`;
    console.log("pstnlistincomop", PstnApi);
    dispatch(
      getapiAll({
        Api: PstnApi,
        Token: Token,
        urlof: config.PSTN_NUMBER_KEY.LIST,
        signal: abortController.signal,
      })
    ).then((response) => {
      console.log("responsepstn", response);
      if (response?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });
  }, [currentPage, searchTerm, select, savedata, Company]);

  useEffect(() => {
    setRow(pstnlist);
  }, [pstnlist]);

  const openDelete = (dataid) => {
    setdeleteid(dataid);
    setDeletemodal(true);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
  };
  const handleEdit = (id) => {
    setmode("edit");
    seteditid(id);
    setShow(true);
    setHeader(t("Edit PSTN"));
    if (id) {
      setsaveLoading(true);
      const data = {
        trunk_id: id,
      };
      const Pstndetailapi = `${config.PSTN_NUMBER.DETAIL}/get?pstn_number_id=${id}`;
      dispatch(
        getapiAll({
          Api: Pstndetailapi,
          Token: Token,
          urlof: config.PSTN_NUMBER_KEY.DETAIL,
        })
      ).then((response) => {
        setsaveLoading(false);
        const editsvalues = response?.payload?.response?.PstnNumberDetail;
        console.log("responwsedetail", editsvalues);
        setFormData({
          Domain: editsvalues?.cid,
          gateway_id: editsvalues?.gateway_id,
          Number: editsvalues?.destination,
          ...((editsvalues?.destination).includes("-")
            ? {
                destination_number: editsvalues?.destination.split("-")[1],
                range: editsvalues?.destination.split("-")[0],
              }
            : { Number: editsvalues?.destination }),
        });
      });
    }
  };
  const DeleteItem = () => {
    setDeleteLoading(true);
    const data = { pstn_id: deleteid };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.PSTN_NUMBER.DELETE,
        Token: Token,
        urlof: config.PSTN_NUMBER_KEY.DELETE,
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

  const openModal = () => {
    setmode("add");
    setShow(true);
    setHeader(t("Add new PSTN pool"));
  };

  const handleClose = () => {
    setShow(false);
    setFormData({
      destination_number: "",
      Domain: "",
      range: "",
      gateway_id: "",
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

  const handlesavedata = () => {
    const datavalues = {
      type: "inbound",
      caller_id_name: "",
      caller_id_number: "",
      destination_condition: "",
      cid: formData.Domain,
      user: "",
      description: "",
      destination_enabled: true,
      gateway_id: formData?.gateway_id,
    };

    if (mode === "add") {
      setsaveLoading(true);
      const data = {
        ...datavalues,
        destination: `${formData.destination_number}-${formData.range}`,
        create_range: 0,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.PSTN_NUMBER.ADD,
          Token: Token,
          urlof: config.PSTN_NUMBER_KEY.ADD,
        })
      ).then((res) => {
        if (res.payload.response) {
          setsaveLoading(false);
          setModalData(res.payload.response);
          setShowSuccessModal(true);
          handleClose();
          setsavedata(!savedata);
          setCurrentPage(1);
          setSearchterm("");
        } else {
          setsaveLoading(false);
          toast.error(t(res.payload.error.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      });
    } else {
      setsaveLoading(true);
      const data = {
        ...datavalues,
        destination: `${formData.destination_number}-${formData.range}`,
        pstn_id: EditId,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.PSTN_NUMBER.EDIT,
          Token: Token,
          urlof: config.PSTN_NUMBER_KEY.EDIT,
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
  const sortingTable = (name) => {
    if (!Row) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }

    const sortData = [...Row].sort((a, b) => {
      const valueA = a[name];
      const valueB = b[name];
      if (name === "number_pool") {
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

  return (
    <div className="tablespadding">
      <AdminHeader openModal={openModal} pathname={t("PSTN-numbers")} addBtn={false} />
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
          <div className="table_search searchwidth pstnnumber" style={{ width: "55%" }}>
            <h6>{t("Search")}:</h6>
            <Form.Control
              type="text"
              height={38}
              onPaste={handlePaste}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bg new-search-add"
            />
            {searchTerm && <ClearSearch clearSearch={clearSearch} number={true} />}

            <div className="companyfilter">
              <h6 style={{ width: "120px", marginLeft: "15px" }}>{t("Select company")}:</h6>
              <div style={{ width: "140px" }}>
                <CustomDropDown
                  toggleDropdown={toggleDropdown}
                  showValue={Company}
                  openDropdown={openDropdown}
                  valueArray={companylist ? [{ company_name: "All", _id: "" }, ...companylist] : []}
                  handleSelection={handleSelection}
                  name={"Company"}
                  defaultValue={t("All")}
                  mapValue={ConstantConfig.TRUNKS.COMPANY_SELECT.MAPVALUE}
                  storeValue={ConstantConfig.TRUNKS.COMPANY_SELECT.STOREVALUE}
                  setOpenDropdown={setOpenDropdown}
                  bgcolor="var(--main-white-color)"
                  sorting={false}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ overflow: "auto", height: dynamicHeight }} className="sidebar_scroll">
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "23%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("trunk_name")}
                  >
                    <p className="mb-0">{t("Provider")}</p>
                    <div>{arrowShow("trunk_name")}</div>
                  </div>
                </th>
                <th style={{ width: "23%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("destination")}
                  >
                    <p className="mb-0">{t("Destination")}</p>
                    <div>{arrowShow("destination")}</div>
                  </div>
                </th>
                <th style={{ width: "24%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("company_name")}
                  >
                    <p className="mb-0">{t("Customer")}</p>
                    <div>{arrowShow("company_name")}</div>
                  </div>
                </th>
                <th style={{ width: "15%" }}>{t("Actions")}</th>
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
                    Row.map((val, index) => (
                      <tr className="table_body" key={val._id}>
                        <td>{val?.trunk_name}</td>

                        <td>{val?.destination}</td>
                        <td>{val?.company_name}</td>
                        <td className="table_edit">
                          <button onClick={() => handleEdit(val?._id)}>
                            <Edit_logo width={14} height={14} className="edithover" />
                          </button>
                          <button className="ms-1" onClick={() => openDelete(val?._id)}>
                            <Delete_logo width={14} height={14} className="edithover" />
                          </button>
                        </td>
                      </tr>
                    ))
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
        <div className="show  show2 mt-2  d-flex align-items-center justify-content-between ">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {count} {t("entries")}
          </h6>
          <div>
            <Paginationall
              totalPages={totalpagecount}
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
      {show && (
        <PstnModal
          allDropdown={allDropdown}
          handleClose={handleClose}
          show={show}
          header={header}
          handlesavedata={handlesavedata}
          formData={formData}
          setFormData={setFormData}
          loader={saveloading}
          checkboxStates={checkboxStates}
          setCheckboxStates={setCheckboxStates}
          setvalueid={setvalueid}
          mode={mode}
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
      {showSuccessModal && (
        <SuccessModal
          data={modalData}
          showSuccessModal={showSuccessModal}
          setShowSuccessModal={setShowSuccessModal}
        />
      )}
    </div>
  );
}
