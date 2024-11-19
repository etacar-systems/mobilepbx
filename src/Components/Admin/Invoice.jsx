import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import paypal from "../../Assets/Image/paypal.png";
import mastercard from "../../Assets/Image/mastercard.png";
import network from "../../Assets/Image/network_invoice.png";
import InvoiceModal from "../Modal/InvoiceModal";
import DeleteModal from "../Modal/DeleteModal";
import Paginationall from "../Pages/Paginationall";
import { useTranslation } from "react-i18next";
export default function Invoice() {
  const { t } = useTranslation();
  const [Nexttab, setnexttab] = useState("");
  const [featuresData, setFeaturesData] = useState({
    pbx: true,
    extension: true,
    ring_group: true,
    conference: true,
    video_call: true,
    ivr: true,
    speech_to_text: true,
    phone_in_browser: true,
    voicemail: true,
    callback: true,
    record_calls: true,
    reportage: true,
    monitoring: true,
    caller_id: true,
    time_controls: true,
    whatsapp: true,
    calendar_integration: true,
    text_to_speech: true,
    virtual_assistant: true,
  });
  const tabeleObj = [
    {
      customer_number: "#LA-0222",
      customer: "More Infoweb Pvt.",
      date: "12 July, 2018",
      type: network,
      status: "Paid",
      amount: "$2000",
    },
    {
      customer_number: "#LA-0222",
      customer: "More Infoweb Pvt.",
      date: "12 July, 2018",
      type: paypal,
      status: "Approved",
      amount: "$2000",
    },
    {
      customer_number: "#LA-0222",
      customer: "More Infoweb Pvt.",
      date: "12 July, 2018",
      type: mastercard,
      status: "Closed",
      amount: "$2000",
    },
    {
      customer_number: "#LA-0222",
      customer: "More Infoweb Pvt.",
      date: "12 July, 2018",
      type: paypal,
      status: "Pending",
      amount: "$2000",
    },
  ];
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);

  const handleEdit = () => {
    setShow(true);
    setHeader(t("Edit invoice"));
  };

  const handleDelete = () => {
    setDeletemodal(false);
  };

  const openDelete = () => {
    setDeletemodal(true);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
  };

  const openModal = () => {
    setShow(true);
    setHeader(t("Add new invoice"));
  };

  const handleClose = () => {
    setShow(false);
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
      <AdminHeader
        openModal={openModal}
        pathname={t("Invoices")}
        addBtn={false}
      />
      <div className="num_table">
        <div className="table_header">
          <div className="show">
            <h6>{t("Show")}</h6>
            <div className="select_entry">
              <Form.Select aria-label="Default select example">
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
            />
          </div>
        </div>
        <div
          style={{ width: "100%", height: dynamicHeight, overflowX: "auto" }}
          className="sidebar_scroll"
        >
          <table className="responshive">
            <thead className="Tablehead">
              <tr>
                <th style={{ width: "16.66%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Customer Number")}</p>
                    <div>
                      <Uparrow width={10} height={20} />
                      <Downarrow
                        width={10}
                        height={20}
                        style={{ marginLeft: "-4px" }}
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "16.66%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Customer")} </p>
                    <div>
                      <Uparrow width={10} height={20} />
                      <Downarrow
                        width={10}
                        height={20}
                        style={{ marginLeft: "-4px" }}
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "16.66%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Date")}</p>
                    <div>
                      <Uparrow width={10} height={20} />
                      <Downarrow
                        width={10}
                        height={20}
                        style={{ marginLeft: "-4px" }}
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "16.66%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Type")}</p>
                    <div>
                      <Uparrow width={10} height={20} />
                      <Downarrow
                        width={10}
                        height={20}
                        style={{ marginLeft: "-4px" }}
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "16.66%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">Status</p>
                    <div>
                      <Uparrow width={10} height={20} />
                      <Downarrow
                        width={10}
                        height={20}
                        style={{ marginLeft: "-4px" }}
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "16.66%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Amount")}</p>
                    <div>
                      <Uparrow width={10} height={20} />
                      <Downarrow
                        width={10}
                        height={20}
                        style={{ marginLeft: "-4px" }}
                      />
                    </div>
                  </div>
                </th>
                <th style={{ width: "16.66%" }}>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {tabeleObj?.map((val, index) => {
                return (
                  <>
                    <tr className="table_body">
                      <td>{val.customer_number}</td>
                      <td>{val.customer}</td>
                      <td>{val.date}</td>
                      <td>
                        <img src={val.type} alt="" width={40} />
                      </td>
                      <td>
                        <span
                          className={
                            val.status == "Approved" || val.status == "Paid"
                              ? "pending"
                              : "approved"
                          }
                        >
                          {val.status}
                        </span>
                      </td>
                      <td>{val.amount}</td>
                      <td className="table_edit">
                        <button className="ms-1" onClick={handleEdit}>
                          <Edit_logo
                            width={14}
                            height={14}
                            className="edithover"
                          />
                        </button>
                        <button className="ms-1" onClick={openDelete}>
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
              })}
            </tbody>
          </table>
        </div>
        <div className="show mt-2  d-flex align-items-center justify-content-between">
          <h6>{t("Showing 1 to 2 of 2 entries")}</h6>
          <div>
            <Paginationall totalPages={1} currentPage={1} setcurrenPage={1} />
          </div>
        </div>
      </div>
      {show && (
        <InvoiceModal
          handleClose={handleClose}
          show={show}
          header={header}
          featuresData={featuresData}
          setFeaturesData={setFeaturesData}
          Nexttab={Nexttab}
        />
      )}
      {deletemodal && (
        <DeleteModal
          handleClose={handleCloseDelete}
          show={deletemodal}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
