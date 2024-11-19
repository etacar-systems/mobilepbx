import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import yes_logo from "../../Assets/Icon/check.svg";
import close_logo from "../../Assets/Icon/assinnpn.svg";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import NumberModal from "../Modal/NumberModal";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import DeleteModal from "../Modal/DeleteModal";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import { deleteapiAll, postapiAll } from "../../Redux/Reducers/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import config from "../../config";
import Cookies from "js-cookie";
import CustomDropDown from "../CustomDropDown";
import { TypeInnumber } from "../ConstantConfig";
import { toast } from "react-toastify";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";

export default function Numbers() {
  const Token = Cookies.get("Token");
  const pstnlist = useSelector(
    (state) => state.postapiAll.postapiall.Numberslist.data
  );
  const count = useSelector(
    (state) => state.postapiAll.postapiall.Numberslist.pstn_total_counts
  );
  const totalpagecount = useSelector(
    (state) => state.postapiAll.postapiall.Numberslist.total_page_count
  );
  const [Row, setRow] = useState([]);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [header, setHeader] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const [searchTerm, setSearchterm] = useState("");
  const [editId, seteditId] = useState("");
  const [select, setselect] = useState(10);
  const [deleteid, setdeleteid] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [savedata, setsavedata] = useState("");
  const [saveloading, setsaveLoading] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [mode, setMode] = useState("");
  const [editsvalues, setEditsvalues] = useState({});
  const [sortedColumn, setSortedColumn] = useState("");
  const [assign, setassign] = useState(3);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);
  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const handleSelection = (dropdown, value) => {
    setassign(value);
    setOpenDropdown(null);
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
      isassigned: assign,
    };
    dispatch(
      postapiAll({
        inputData: inputData,
        Api: config.COMPANYWISE_PSTNLIST,
        Token: Token,
        urlof: config.COMPANYWISE_KEY,
        signal: abortController.signal,
      })
    ).then((res) => {
      if (res?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });
  }, [currentPage, savedata, searchTerm, select, assign]);

  useEffect(() => {
    setRow(pstnlist);
  }, [pstnlist]);

  const openModal = (val) => {
    setShow(true);
    setHeader(t("Add new number"));
    setMode("add");
    setEditsvalues({ _id: val?._id, destination: val?.destination });
  };

  const handleClose = () => {
    setShow(false);
    setEditsvalues("");
  };
  const clearSearch = () => {
    setSearchterm("");
  };
  const handleCloseDelete = () => {
    setDeleteLoading("");
    setDeletemodal(false);
  };

  const handleDelete = () => {
    setDeleteLoading(true);

    const data = { pstn_id: deleteid };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.NUMBER.DELETE,
        Token: Token,
        urlof: config.NUMBER.DELETE,
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
        setDeleteLoading(false);
      }
    });
  };

  const openDelete = (id) => {
    setDeletemodal(true);
    setdeleteid(id);
  };

  const sortingTable = (name) => {
    if (!Row) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }
    const isNumber = (value) => !isNaN(value);
    const sortData = [...Row].sort((a, b) => {
      const getDestination = (item) => {
        return (
          (item?.select_type !== 5
            ? item?.select_type_data?.select_extension
            : item?.select_type_data?.select_name) || "Not Assigned"
        );
      };
      const valueA = a[name];
      const valueB = b[name];
      if (name === "select_extension") {
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
      } else if (name === "number_pool" || name === "destination") {
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

  const { t } = useTranslation();
  const handleEdit = (val) => {
    seteditId(val);
    setShow(true);
    setHeader(t("Edit Number"));
    setMode("edit");

    setsaveLoading(true);
    const data = {
      number_id: val,
    };
    dispatch(
      postapiAll({
        inputData: data,
        Api: config.NUMBER.DETAIL,
        Token: Token,
        urlof: config.NUMBER_KEY.DETAIL,
      })
    ).then((response) => {
      setsaveLoading(false);
      setEditsvalues(response?.payload?.response?.data);
    });
  };

  return (
    <div className="tablespadding">
      <AdminHeader openModal={() => openModal()} pathname={t("Numbers")} />
      <div className="num_table">
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry ">
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

          <div className="table_search searchwidth ">
            <h6>{t("Search")}:</h6>
            <Form.Control
              type="text"
              height={38}
              onPaste={handlePaste}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bg new-search-add"
            />
            {searchTerm && (
              <ClearSearch clearSearch={clearSearch} number={true} />
            )}
            <div style={{ width: "70%", paddingLeft: "30px" }}>
              <CustomDropDown
                toggleDropdown={toggleDropdown}
                showValue={assign}
                openDropdown={openDropdown}
                valueArray={[
                  { value: 3, item: "All" },
                  { value: 1, item: "Assigned" },
                  { value: 0, item: "Unassigned" },
                ]}
                handleSelection={handleSelection}
                name={"assign"}
                defaultValue={t("All")}
                mapValue={"item"}
                storeValue={"value"}
                setOpenDropdown={setOpenDropdown}
                bgcolor="var(--main-white-color)"
                sorting={false}
              />
            </div>
          </div>
        </div>
        <div
          style={{ overflowY: "auto", height: dynamicHeight, width: "100%" }}
          className="sidebar_scroll"
        >
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th
                  style={{ width: "19%" }}
                  onClick={() => {
                    sortingTable("destination");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Number")}</p>
                    {arrowShow("destination")}
                  </div>
                </th>
                <th
                  style={{ width: "10%" }}
                  onClick={() => {
                    sortingTable("isassigned");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Assigned")}</p>
                    {arrowShow("isassigned")}
                  </div>
                </th>
                <th
                  style={{ width: "18%" }}
                  onClick={() => {
                    sortingTable("select_type");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Routed to")}</p>
                    {arrowShow("select_type")}
                  </div>
                </th>
                <th
                  style={{ width: "21%" }}
                  onClick={() => {
                    sortingTable("select_extension");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    {<p className="mb-0">{t("Extension")}</p>}
                    {arrowShow("select_extension")}
                  </div>
                </th>
                <th
                  style={{ width: "12%" }}
                  onClick={() => {
                    sortingTable("updatedAt");
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    {<p className="mb-0">{t("Date")}</p>}
                    {arrowShow("updatedAt")}
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
              ) : (
                <>
                  {Row && Row.length > 0 ? (
                    [...Row]
                      ?.sort((a, b) => a.destination - b.destination)
                      ?.map((val, index) => {
                        const date = new Date(val.updatedAt);
                        const formattedDate = `${String(
                          date.getDate()
                        ).padStart(2, "0")}.${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}.${date.getFullYear()}`;

                        return (
                          <>
                            <tr className="table_body">
                              <td>{val.destination}</td>
                              <td>
                                {val.isassigned == 0 ? (
                                  <img src={close_logo} alt="" width={20} />
                                ) : (
                                  <img src={yes_logo} alt="" width={15} />
                                )}
                              </td>
                              <td>
                                {val.select_type
                                  ? t(
                                      TypeInnumber.find(
                                        (item) => item.value == val.select_type
                                      )?.type
                                    ) || t("Not Assigned")
                                  : t("Not Assigned")}
                              </td>

                              <td>
                                <div>
                                  {(val?.select_type !== 5
                                    ? val?.select_type_data?.select_extension
                                    : val?.select_type_data?.select_name) ||
                                    t("Not Assigned")}
                                </div>
                                {/* <div>
                                {val?.select_type_data?.select_name ||
                                  t("Not Assigned")}
                              </div> */}
                              </td>
                              <td>{formattedDate}</td>
                              <td className="table_edit">
                                <span className="d-inline-block">
                                  {val.isassigned == 0 ? (
                                    <Button onClick={() => openModal(val)}>
                                      <Edit_logo
                                        width={14}
                                        height={14}
                                        className="edithover"
                                      />
                                    </Button>
                                  ) : (
                                    <Button onClick={() => handleEdit(val._id)}>
                                      <Edit_logo
                                        width={14}
                                        height={14}
                                        className="edithover"
                                      />
                                    </Button>
                                  )}
                                </span>
                                {/* {val.select_type === 3 ? (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-edit-${val._id}`}>
                                      {t("Extensions are not editable")}
                                    </Tooltip>
                                  }
                                >
                                  <span className="d-inline-block">
                                    <Button className="disabled-button">
                                      <Edit_logo
                                        width={14}
                                        height={14}
                                        className="edithover disabled-icon"
                                      />
                                    </Button>
                                  </span>
                                </OverlayTrigger>
                              ) : (
                                <span className="d-inline-block">
                                  {val.isassigned == 0 ? (
                                    <Button onClick={() => openModal(val)}>
                                      <Edit_logo
                                        width={14}
                                        height={14}
                                        className="edithover"
                                      />
                                    </Button>
                                  ) : (
                                    <Button onClick={() => handleEdit(val._id)}>
                                      <Edit_logo
                                        width={14}
                                        height={14}
                                        className="edithover"
                                      />
                                    </Button>
                                  )}
                                </span>
                              )} */}

                                {val.isassigned === 0 ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-delete-${val._id}`}>
                                        {val.isassigned === 0
                                          ? t(
                                              "Number is not assigned, so you can't delete."
                                            )
                                          : "Extension are not deletable"}
                                      </Tooltip>
                                    }
                                  >
                                    <span className="d-inline-block ms-1">
                                      <Button className="disabled-button numbersdelete">
                                        <Delete_logo
                                          width={14}
                                          height={14}
                                          className="edithover disabled-icon deletelogo "
                                        />
                                      </Button>
                                    </span>
                                  </OverlayTrigger>
                                ) : (
                                  <span className="d-inline-block ms-1">
                                    <Button
                                      onClick={() => openDelete(val._id)}
                                      className="numbersdelete"
                                    >
                                      <Delete_logo
                                        width={14}
                                        height={14}
                                        className="edithover deletelogo"
                                      />
                                    </Button>
                                  </span>
                                )}
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
        <div className="show2 show mt-2 d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")} {count}{" "}
            {t("entries")}
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
        <NumberModal
          handleClose={handleClose}
          show={show}
          header={header}
          mode={mode}
          setsaveLoading={setsaveLoading}
          loader={saveloading}
          setCurrentPage={setCurrentPage}
          setsavedata={setsavedata}
          savedata={savedata}
          editsvalues={editsvalues}
          editId={editId}
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
