import React, { useEffect, useState } from "react";
import AdminHeader from "../Admin/AdminHeader";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import {
  getapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import config from "../../config";
import { toast } from "react-toastify";
import SmtpModal from "../Modal/SmtpModal";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import Loader from "../Loader";
import EmailEdit from "../Modal/EmailEdit";

const Smtp = () => {
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");
  const dispatch = useDispatch();
  const Token = Cookies.get("Token");
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const email_list = useSelector(
    (state) => state.getapiall.getapiall.email_list
  );
  const [email_modal_show, set_Email_Show] = useState(false);
  const handleOpen = () => {
    set_Email_Show(true);
  };
  const handleClose = () => {
    set_Email_Show(false);
    setShowPassword(false);
  };
  const [email_modal_edit, set_email_modal_edit] = useState(false);
  const [edit_id, setEdit_id] = useState("");
  const [smtpData, setSmtpData] = useState({
    provider: "",
    username: "",
    password: "",
    smtpServer: "",
    smtpPort: "",
    sendgrid_auth: "",
    sendgrid_token: "",
  });
  const [email_temp, setEmail_temp] = useState({
    sender_name: "",
    from: "",
    replay_to: "",
    subject: "",
    message: "",
  });
  useEffect(() => {
    setLoading(true);
    dispatch(
      getapiAll({
        Api: config.EMAIL_TEMPLET.EMAIL_LIST,
        Token: Token,
        urlof: config.EMAIL_TEMPLET_KEY.EMAIL_LIST,
      })
    ).then((response) => {
      setLoading(false);
    });
  }, []);
  const handleEditData = (id) => {
    
      dispatch(
        getapiAll({
          Api: config.EMAIL_TEMPLET.EMAIL_LIST + "/" + id,
          Token: Token,
        })
      ).then((response) => {
        const data = response?.payload?.response?.emaildata;
        setEmail_temp({
          sender_name: data.sender_name,
          from: data.from,
          replay_to: data.replay_to,
          subject: data.subject,
          message: data.message,
        });
      });
    
  };
  useEffect(() => {
    if (email_modal_show) {
      setLoader(true);
      dispatch(
        getapiAll({
          Api: config.SMTP.DETAIL,
          Token: Token,
          urlof: config.SMTP_KEY.DETAIL,
        })
      ).then((res) => {
        setLoader(false);
        const data = res?.payload?.response?.SMTPDetail;
        setSmtpData({
          provider: data.provider,
          username: data.user_name,
          password: data.password,
          smtpServer: data.smtp_server,
          smtpPort: data.smtp_port,
          sendgrid_auth: data.sendgrid_auth,
          sendgrid_token: data.sendgrid_token,
        });
      });
    }
  }, [email_modal_show]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "sendgrid_auth") {
      setSmtpData((prevData) => ({
        ...prevData,
        [name]: e.target.checked ? 1 : 0,
      }));
      if (!e.target.checked) {
        setSmtpData((prevData) => ({
          ...prevData,
          ["sendgrid_token"]: "",
        }));
      }
    } else {
      setSmtpData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleChangeEmail = (e) => {
    const { name, value } = e.target;
    setEmail_temp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlesavedata = () => {
    setLoader(true);
    const datavalues = {
      provider: smtpData.provider,
      smtp_server: smtpData.smtpServer,
      user_name: smtpData.username,
      password: smtpData.password,
      smtp_port: smtpData.smtpPort,
      sendgrid_auth: smtpData.sendgrid_auth,
      sendgrid_token: smtpData.sendgrid_token,
    };
    dispatch(
      putapiall({
        inputData: datavalues,
        Api: config.SMTP.ADD,
        Token: Token,
        urlof: config.SMTP.ADD,
      })
    ).then((res) => {
      setLoader(false);
      setShowPassword(false);
      if (res.payload.response) {
        toast.success(res.payload?.response.message, { autoClose: 2000 });
        set_Email_Show(false);
      } else {
        toast.error(res?.payload?.error?.message, {
          autoClose: 2000,
        });
      }
    });
  };
  const handleEditSave = () => {
    setLoader(true);
    dispatch(
      putapiall({
        inputData: email_temp,
        Api: config.EMAIL_TEMPLET.EMAIL_LIST + "/" + edit_id,
        Token: Token,
      })
    ).then((response) => {
      toast.success(response.payload.response.message, { autoClose: 2000 });
      set_email_modal_edit(false);
      setLoader(false);
      setLoading(true);
      dispatch(
        getapiAll({
          Api: config.EMAIL_TEMPLET.EMAIL_LIST,
          Token: Token,
          urlof: config.EMAIL_TEMPLET_KEY.EMAIL_LIST,
        })
      ).then((response) => {
        setLoading(false);
      });
    });
  };
  const sortingTable = () => {};
  const handleEdit = (id) => {
    set_email_modal_edit(true);
    setEdit_id(id);
    handleEditData(id)
  };
  const handleEdit_close = () => {
    set_email_modal_edit(false);
    setEmail_temp({
      sender_name: "",
      from: "",
      replay_to: "",
      subject: "",
      message: "",
    });
  };

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 200;
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
        pathname={t("SMTP settings")}
        addBtn={false}
        btnName={t("Configure SMTP")}
        openModal={handleOpen}
      />
      <div
        style={{
          overflowY: "auto",
          height: dynamicHeight,
          width: "100%",
          background: "var(--main-tabledarkbackground-color)",
        }}
        className="sidebar_scroll"
      >
        <table className="responshive">
          <thead className="Tablehead" style={{ marginTop: "10px" }}>
            <tr className="head_color">
              <th style={{ width: "19%" }}>
                <p className="mb-0">{t("From")}</p>
              </th>
              <th style={{ width: "19%" }}>
                <p className="mb-0">{t("Subject")}</p>
              </th>
              <th style={{ width: "18%" }}>
                <p className="mb-0">{t("Message")}</p>
              </th>
              <th style={{ width: "15%" }}>
                <p className="mb-0">{t("Created Date")}</p>
              </th>
              <th style={{ width: "15%" }}>
                <p className="mb-0">{t("Edited")}</p>
              </th>
              <th style={{ width: "10%" }}> {t("Action")}</th>
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
                {email_list && email_list.length > 0 ? (
                  email_list?.map((val, index) => {
                    const username = val?.first_name + " " + val?.last_name;
                    const date = new Date(val?.createdAt);
                    const formattedDate = new Date(date)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, ".");
                    const date1 = new Date(val?.updatedAt);
                    const formattedDate1 = new Date(date1)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, ".");
                    return (
                      <>
                        <tr className="table_body" key={val?._id}>
                          <td>{val.from}</td>
                          <td>{val?.subject}</td>
                          <td>{val?.message}</td>
                          <td>{formattedDate}</td>
                          <td>{formattedDate1}</td>

                          {/* <td>{val.user_type == 1 ? "User" : "Admin"}</td> */}
                          <td className="table_edit">
                            <button
                              onClick={() => {
                                handleEdit(val._id);
                              }}
                            >
                              <Edit_logo
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
      <SmtpModal
        email_modal_show={email_modal_show}
        handleClose={handleClose}
        loader={loader}
        handleInputChange={handleInputChange}
        handlesavedata={handlesavedata}
        smtpData={smtpData}
        setShowPassword={setShowPassword}
        showPassword={showPassword}
      />
      <EmailEdit
        email_temp={email_temp}
        email_modal_edit={email_modal_edit}
        handleClose={handleEdit_close}
        handlesavedata={handleEditSave}
        handleInputChange={handleChangeEmail}
        loader={loader}
      />
    </div>
  );
};

export default Smtp;
