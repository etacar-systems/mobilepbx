import React, { useEffect, useRef, useState } from "react";
import {AdminHeader} from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import { ReactComponent as Call_logo } from "../../Assets/Icon/call_logo.svg";
import paypal from "../../Assets/Image/paypal.png";
import mastercard from "../../Assets/Image/mastercard.png";
import { Nav, Tab } from "react-bootstrap";
import FirewallModal from "../Modal/FirewallModal";
import DeleteModal from "../Modal/DeleteModal";
import { toast } from "react-toastify";
import {
  deleteapiAll,
  getapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
import config from "../../config";
import axios from "axios";
import Loader from "../Loader";
import cross from "../../Assets/Icon/cross_for_search.svg";
import { ClearSearch } from "../ClearSearch";
export default function Firewall() {
  const { t } = useTranslation();
  const Token = Cookies.get("Token");
  const abortControllerRef = useRef(null);
  const voip_username = process.env.REACT_APP_VOIP_USERNAME;
  const voip_password = process.env.REACT_APP_VOIP_PASSWORD;
  const [values, setvalues] = useState([]);
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
  const [Diaplydate, setDate] = useState("");
  const [formData, setFormData] = useState({
    // access_control_name: "",
    // access_control_default: "",
    Description: "",
    Assigned_Zone: "",
    Network_Host: "",
    // node_description: "",
    cid: "",
  });
  const firewalldata = useSelector(
    (state) => state.postapiAll.postapiall.Firewall.firewallsData
  );
  const count = useSelector(
    (state) => state.postapiAll.postapiall.Firewall.firewall_total_counts
  );
  const totalpagecount = useSelector(
    (state) => state.postapiAll.postapiall.Firewall.total_page_count
  );
  const dispatch = useDispatch();
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
        Api: config.FIREWALL.LIST,
        Token: Token,
        urlof: config.FIREWALL_KEY.LIST,
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
    setvalues(firewalldata);
  }, [firewalldata]);

  const startEntry = (currentPage - 1) * select + 1;
  let endEntry = currentPage * select;
  if (endEntry > count) {
    endEntry = count;
  }

  const sortingTable = (name) => {
    if (!values) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }
    const isNumber = (value) => !isNaN(value);
    const sortData = [...values].sort((a, b) => {
      const valueA = a[name];
      const valueB = b[name];
      const getDestination = (item) => {
        return item?.access_control_nodes[0].node_cidr;
      };
      if (name === "node_cidr") {
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
    setvalues(sortData);
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
  const handleEdit = (id) => {
    setDate("");
    setShow(true);
    seteditid(id);
    setHeader(t("Edit network"));
    setmode("edit");
    if (id) {
      setsaveLoading(true);
      const data = {
        firewall_id: id,
      };
      dispatch(
        postapiAll({
          inputData: data,
          Api: config.FIREWALL.DETAIL,
          Token: Token,
          urlof: config.FIREWALL_KEY.DETAIL,
        })
      ).then((response) => {
        setsaveLoading(false);
        const edivalues = response.payload.response.firewallDetail;
        const date = new Date(edivalues.createdAt);
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}.${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}.${date.getFullYear()}`;
        console.log("editsvalue", formattedDate);
        setDate(formattedDate);
        setFormData({
          Description: edivalues?.access_control_description,
          Assigned_Zone: edivalues?.add_assign_zone,
          Network: edivalues.access_control_nodes[0].node_cidr,
          cid: edivalues?.cid,
        });
      });
    }
  };
  const handlesavedata = () => {
    const datavalues = {
      access_control_name: "",
      access_control_default: "allow",
      access_control_description: formData?.Description,
      add_assign_zone: formData?.Assigned_Zone,
      cid: formData?.cid,
      access_control_nodes: [
        {
          // node_type: formData.node_type,
          node_type: "allow",
          node_cidr: formData.Network + "/32",
          node_description: "mob",
        },
      ],
    };
    if (mode === "add") {
      setsaveLoading(true);
      let configRequest = {
        method: "post",
        maxBodyLength: Infinity,
        url: config.FIREWALL.ADD_PHP,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: voip_username,
          password: voip_password,
        },
        data: datavalues,
      };
      dispatch(
        postapiAll({
          inputData: datavalues,
          Api: config.FIREWALL.ADD,
          Token: Token,
          urlof: config.FIREWALL.ADD_PHP,
        })
      ).then((res) => {
        if (res.payload.response) {
          setsaveLoading(false);
          handleClose();
          setsavedata(!savedata);
          setCurrentPage(1);
          setSearchterm("");
          setFormData("");
          toast.success(t(res.payload?.response.message), {
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
        firewall_id: EditId,
        ...datavalues,
      };
      dispatch(
        putapiall({
          inputData: data,
          Api: config.FIREWALL.UPDATE,
          Token: Token,
          urlof: config.FIREWALL_KEY.UPDATE,
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
          toast.error(t(res.payload.error.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      });
    }
  };
  const handleDelete = () => {
    setDeleteLoading(true);
    const data = { firewall_id: deleteid };
    dispatch(
      deleteapiAll({
        inputData: data,
        Api: config.FIREWALL.DELETE,
        Token: Token,
        urlof: config.FIREWALL_KEY.DELETE,
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

  const handleCloseDelete = () => {
    setDeletemodal(false);
    setdeleteid("");
  };

  const openModal = () => {
    setShow(true);
    setHeader(t("Add new network"));
    setmode("add");
    setDate("");
  };

  const handleClose = () => {
    setDate("");
    setShow(false);
    setFormData({
      access_control_description: "",
      node_type: "None selected",
      node_cidr: "",
      cid: "",
    });
  };
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 340;
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
      <AdminHeader
        openModal={openModal}
        addBtn={false}
        btnName={t("Add new network")}
      />
      <Tab.Container defaultActiveKey="/home">
        <Row>
          <Col sm={12}>
            <Nav variant="pills" className="flex-row tabs_border">
              <Nav.Item>
                <Nav.Link eventKey="/home" className="nav-link2">
                  {t("Networks")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="link-1" className="nav-link2">
                  {t("Detection")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="link-2" className="nav-link2">
                  {t("Registered Endpoints")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="link-3" className="nav-link2">
                  {t("Blocked Attackers")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="link-4" className="nav-link2">
                  {t("Rate Limited Hosts")}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey="/home">
                <div className="num_table ">
                  <div className="table_header">
                    <div className="show">
                      <h6>{t("Show")}</h6>
                      <div className="select_entry">
                        <Form.Select
                          aria-label="Default select example"
                          className="modal-select"
                          onChange={(e) => (
                            setselect(e.target.value), setCurrentPage(1)
                          )}
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
                  <div
                    style={{ overflowX: "auto", height: dynamicHeight }}
                    className="sidebar_scroll"
                  >
                    <table className="responshive">
                      <thead className="Tablehead">
                        <tr>
                          <th style={{ width: "18%" }}>
                            <div
                              className="d-flex align-items-center justify-content-between"
                              onClick={() => sortingTable("node_cidr")}
                            >
                              <p className="mb-0">{t("Network/Host")}</p>
                              {adduisortingui("node_cidr")}
                            </div>
                          </th>
                          <th style={{ width: "16%" }}>
                            <div
                              className="d-flex align-items-center justify-content-between"
                              onClick={() => sortingTable("add_assign_zone")}
                            >
                              <p className="mb-0">{t("Assigned Zone")} </p>
                              {adduisortingui("add_assign_zone")}
                            </div>
                          </th>
                          <th style={{ width: "21%" }}>
                            <div
                              className="d-flex align-items-center justify-content-between"
                              onClick={() =>
                                sortingTable("access_control_name")
                              }
                            >
                              <p className="mb-0">{t("Select Company")}</p>
                              {adduisortingui("access_control_name")}
                            </div>
                          </th>
                          <th style={{ width: "24%" }}>
                            <div
                              className="d-flex align-items-center justify-content-between"
                              onClick={() =>
                                sortingTable("access_control_description")
                              }
                            >
                              <p className="mb-0">{t("Description")}</p>
                              {adduisortingui("access_control_description")}
                            </div>
                          </th>
                          <th style={{ width: "13%" }}>
                            <div
                              className="d-flex align-items-center justify-content-between"
                              onClick={() => sortingTable("createdAt")}
                            >
                              <p className="mb-0">{t("Date")}</p>
                              {adduisortingui("createdAt")}
                            </div>
                          </th>
                          <th style={{ width: "12%" }}>{t("Actions")}</th>
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
                            {values && values.length > 0 ? (
                              <>
                                {values?.map((ele) => {
                                  const date = new Date(ele.createdAt);
                                  const formattedDate = `${String(
                                    date.getDate()
                                  ).padStart(2, "0")}.${String(
                                    date.getMonth() + 1
                                  ).padStart(2, "0")}.${date.getFullYear()}`;
                                  return (
                                    <tr className="table_body">
                                      <td>
                                        {ele?.access_control_nodes[0].node_cidr}
                                      </td>
                                      <td>
                                        <div className="select_entry1">
                                          {ele?.add_assign_zone}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="select_entry1">
                                          {ele?.access_control_name}
                                        </div>
                                      </td>
                                      <td>{ele?.access_control_description}</td>
                                      <td>{formattedDate}</td>
                                      <td className="table_edit">
                                        <button
                                          className="ms-1"
                                          onClick={() => handleEdit(ele?._id)}
                                        >
                                          <Edit_logo
                                            width={14}
                                            height={14}
                                            className="edithover"
                                          />
                                        </button>
                                        <button
                                          className="ms-1"
                                          onClick={() => openDelete(ele?._id)}
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
                                })}
                              </>
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
                  <div className="show show2 mt-2 d-flex align-items-center justify-content-between">
                    <h6>
                      {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")}{" "}
                      {count} {t("entries")}
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
              </Tab.Pane>
              <Tab.Pane eventKey="link-1">
                <div className="num_table ">
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span className="modal-head">
                      {t("Intrusion Detection")}
                    </span>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="link-2">
                <div className="num_table ">
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span className="modal-head">
                      {t("Registered Endpoints")}
                    </span>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="link-3">
                <div className="num_table ">
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span className="modal-head">{t("Blocked Attackers")}</span>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="link-4">
                <div className="num_table ">
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span className="modal-head">
                      {t("Rate Limited Hosts")}
                    </span>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      {show && (
        <FirewallModal
          handleClose={handleClose}
          show={show}
          header={header}
          handledatasave={handlesavedata}
          formData={formData}
          setFormData={setFormData}
          loader={saveloading}
          mode={mode}
          Diaplydate={Diaplydate}
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
