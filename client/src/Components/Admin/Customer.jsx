import React, { useEffect, useRef, useState } from "react";
import {AdminHeader} from "./AdminHeader";
import Form from "react-bootstrap/Form";
import { ReactComponent as Uparrow } from "../../Assets/Icon/up-arrow.svg";
import { ReactComponent as Downarrow } from "../../Assets/Icon/down-arrow.svg";
import CustomerModal from "../Modal/CustomerModal";
import { ReactComponent as Edit_logo } from "../../Assets/Icon/edit.svg";
import { ReactComponent as Delete_logo } from "../../Assets/Icon/delete.svg";
import paypal from "../../Assets/Image/paypal.png";
import DeleteModal from "../Modal/DeleteModal";
import cross from "../../Assets/Icon/cross_for_search.svg";
import {
  deleteapiAll,
  postapiAll,
  putapiall,
} from "../../Redux/Reducers/ApiServices";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import Pagination from "../Pages/Paginationall";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import config from "../../config";
import ConstantConfig from "../ConstantConfig";
import Loader from "../Loader";
import { ClearSearch } from "../ClearSearch";

export default function Customer() {
  const { t } = useTranslation();
  //Api Config //
  // const getCompanyListAPi = ;
  const getCompanyListAPi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_COMPANY_LIST}`;

  const EditGetDetailCompany = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_GET_COMPANY_DETAIL}`;
  const EditCompany = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_EDIT_COMPANY}`;
  const AddCompany = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_ADD_COMPANY}`;
  const DeleteCompany = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_DELETE_COMPANY}`;
  let Token = Cookies.get("Token");
  const abortControllerRef = useRef(null);

  ///
  const companyId = useRef(null);
  const dispatch = useDispatch();
  const tabeleObj = useSelector(
    (state) => state.postapiAll.postapiall.CompanyList
  );
  const EditFillData = useSelector(
    (state) => state.postapiAll.postapiall.EditGetDetailCompany
  );
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [deletemodal, setDeletemodal] = useState(false);
  const [savedata, setsavedata] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [select, setselect] = useState(10);
  const [ascending, setAscending] = useState(true);
  const [sortedColumn, setSortedColumn] = useState("");
  const [customerData, setCustomerData] = useState();
  const [searchTerm, setSearchterm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveloading, setsaveLoading] = useState(false);
  const [error, seterror] = useState();
  const [activeTab, setActiveTab] = useState("General");
  const [mode, setMode] = useState(false);
  const [editValue, setEditValues] = useState([]);
  const [colors, setColors] = useState("");
  const [logo, setLogo] = useState({
    small_logo: "",
    logo_text: "",
    dark_small_logo: "",
    dark_logo_text: "",
  });
  const [logoDisplay, setLogoDisplay] = useState({
    small_logo: "",
    logo_text: "",
    dark_small_logo: "",
    dark_logo_text: "",
  });
  const [formData, setFormData] = useState({
    Company_name: "",
    Street_address: "",
    ZIP: "",
    City: "",
    Country: "",
    Vat: "",
    Contact_person: "",
    Email: "",
    Phone_number: "",
    Password: "",
    Domain: "",
  });
  const [errors, setErrors] = useState({
    Company_name: "",
    Street_address: "",
    ZIP: "",
    City: "",
    Country: "",
    Vat: "",
    Contact_person: "",
    Email: "",
    Phone_number: "",
    Password: "",
    Domain: "",
  });

  useEffect(() => {
    setColors(ConstantConfig.CUSTOMER.modalColor);
  }, []);

  const [Nexttab, setnexttab] = useState("");
  const [featuresData, setFeaturesData] = useState({
    PBX: { checked: true, text: 1, disabled: true },
    Extensions: { checked: true, text: "", disabled: false },
    Ring_Groups: { checked: true, text: "", disabled: false },
    Conference_call: { checked: true, text: "", disabled: false },
    Video_calls: { checked: true, text: 1, disabled: true },
    IVR: { checked: true, text: "", disabled: false },
    Speech_to_text: { checked: true, text: 1, disabled: true },
    Phone_in_the_browser: { checked: true, text: 1, disabled: true },
    Voicemail: { checked: true, text: 1, disabled: true },
    Callback: { checked: true, text: 1, disabled: true },
    Record_calls: { checked: true, text: 1, disabled: true },
    Reportage: { checked: true, text: "", disabled: false },
    Monitoring: { checked: true, text: 1, disabled: true },
    Caller_ID: { checked: true, text: 1, disabled: true },
    Time_controls: { checked: true, text: 1, disabled: true },
    WhatsApp: { checked: true, text: "", disabled: false },
    Calendar_integration: { checked: true, text: 1, disabled: true },
    Text_to_speech: { checked: true, text: 1, disabled: true },
    A_virtual_assistant: { checked: true, text: 1, disabled: true },
  });
  useEffect(() => {
    setColors(ConstantConfig.CUSTOMER.modalColor);
  }, []);

  const openModal = () => {
    setLogoDisplay("");
    setLogo("");
    seterror("");
    setMode("add");
    setShow(true);
    setHeader(t("Add new customer"));
  };

  useEffect(() => {
    setEditValues(EditFillData.CompanyDatil);
  }, [EditFillData]);

  const handleEdit = (val) => {
    setFeaturesData("");
    setFormData("");
    seterror("");
    setMode("edit");
    setsaveLoading(true);
    companyId.current = val;
    setEditValues("");

    const inputData = {
      cid: val,
    };

    setShow(true);
    setHeader(t("Edit Customer"));
    dispatch(
      postapiAll({
        inputData: inputData,
        Api: EditGetDetailCompany,
        Token: Token,
        urlof: "EditGetDetailCompany",
      })
    ).then((res) => {
      setsaveLoading(false);
      const data = res.payload.response.CompanyDatil;
      setFormData({
        Company_name: data.company_name,
        Street_address: data.company_street_address,
        ZIP: data.company_zipcode,
        City: data.company_city,
        Country: data.company_country,
        Vat: data.company_vat,
        Contact_person: data.company_contact_person,
        Email: data.company_email,
        Phone_number: data.company_phone_number,
        Password: data.company_password,
        Domain: data.domain_name,
      });
      setFeaturesData({
        PBX: { checked: data.pbx, text: data.pbx_count, disabled: true },
        Extensions: {
          checked: data.extension,
          text: data.extension_count,
          disabled: false,
        },
        Ring_Groups: {
          checked: data.ring_group,
          text: data.ring_group_count,
          disabled: false,
        },
        Conference_call: {
          checked: data.conference,
          text: data.conference_count,
          disabled: false,
        },
        Video_calls: {
          checked: data.video_call,
          text: data.video_call_count,
          disabled: true,
        },
        IVR: { checked: data.ivr, text: data.ivr_count },
        Speech_to_text: {
          checked: data.speech_to_text,
          text: data.speech_to_text_count,
          disabled: true,
        },
        Phone_in_the_browser: {
          checked: data.phone_in_browser,
          text: data.phone_in_browser_count,
          disabled: true,
        },
        Voicemail: {
          checked: data.voicemail,
          text: data.voicemail_count,
          disabled: true,
        },
        Callback: {
          checked: data.callback,
          text: data.callback_count,
          disabled: true,
        },
        Record_calls: {
          checked: data.record_calls,
          text: data.record_calls_count,
          disabled: true,
        },
        Reportage: {
          checked: data.reportage,
          text: data.reportage_count,
          disabled: false,
        },
        Monitoring: {
          checked: data.monitoring,
          text: data.monitoring_count,
          disabled: true,
        },
        Caller_ID: {
          checked: data.caller_id,
          text: data.caller_id_count,
          disabled: true,
        },
        Time_controls: {
          checked: data.time_controls,
          text: data.time_controls_count,
          disabled: true,
        },
        WhatsApp: {
          checked: data.whatsapp,
          text: data.whatsapp_count,
          disabled: false,
        },
        Calendar_integration: {
          checked: data.calendar_integration,
          text: data.calendar_integration_count,
          disabled: true,
        },
        Text_to_speech: {
          checked: data.text_to_speech,
          text: data.text_to_speech_count,
          disabled: true,
        },
        A_virtual_assistant: {
          checked: data.virtual_assistant,
          text: data.virtual_assistant_count,
          disabled: true,
        },
      });

      setColors(data?.hex_code);
      setLogoDisplay({
        small_logo: data.small_logo,
        logo_text: data.logo_text,
        dark_small_logo: data.dark_small_logo,
        dark_logo_text: data.dark_logo_text,
      });
      setLogo({
        small_logo: data.small_logo,
        logo_text: data.logo_text,
        dark_small_logo: data.dark_small_logo,
        dark_logo_text: data.dark_logo_text,
      });
    });
  };

  const handleClose = () => {
    setColors("");
    seterror("");
    setActiveTab("General");
    setEditValues("");
    setShow(false);
    setFormData({
      Company_name: "",
      Street_address: "",
      ZIP: "",
      City: "",
      Country: "",
      Vat: "",
      Contact_person: "",
      Email: "",
      Phone_number: "",
      Password: "",
      Domain: "",
    });
    setErrors({
      Company_name: "",
      Street_address: "",
      ZIP: "",
      City: "",
      Country: "",
      Vat: "",
      Contact_person: "",
      Email: "",
      Phone_number: "",
      Password: "",
      Domain: "",
    });
    setFeaturesData({
      PBX: { checked: true, text: 1, disabled: true },
      Extensions: { checked: true, text: "", disabled: false },
      Ring_Groups: { checked: true, text: "", disabled: false },
      Conference_call: { checked: true, text: "", disabled: false },
      Video_calls: { checked: true, text: 1, disabled: true },
      IVR: { checked: true, text: "", disabled: false },
      Speech_to_text: { checked: true, text: 1, disabled: true },
      Phone_in_the_browser: { checked: true, text: 1, disabled: true },
      Voicemail: { checked: true, text: 1, disabled: true },
      Callback: { checked: true, text: 1, disabled: true },
      Record_calls: { checked: true, text: 1, disabled: true },
      Reportage: { checked: true, text: "", disabled: false },
      Monitoring: { checked: true, text: 1, disabled: true },
      Caller_ID: { checked: true, text: 1, disabled: true },
      Time_controls: { checked: true, text: 1, disabled: true },
      WhatsApp: { checked: true, text: "", disabled: false },
      Calendar_integration: { checked: true, text: 1, disabled: true },
      Text_to_speech: { checked: true, text: 1, disabled: true },
      A_virtual_assistant: { checked: true, text: 1, disabled: true },
    });
    setLogoDisplay({
      small_logo: "",
      logo_text: "",
      dark_small_logo: "",
      dark_logo_text: "",
    });
    setLogo({
      small_logo: "",
      logo_text: "",
      dark_small_logo: "",
      dark_logo_text: "",
    });
  };
  const startEntry = (currentPage - 1) * select + 1;
  let endEntry = currentPage * select;
  if (endEntry > tabeleObj.company_total_counts) {
    endEntry = tabeleObj.company_total_counts;
  }
  const handleDelete = (val) => {
    companyId.current = val._id;
    setDeletemodal(true);
  };

  const handleCloseDelete = () => {
    setDeletemodal(false);
  };
  const clearSearch = () => {
    setSearchterm("");
  };

  const handleModalDelete = () => {
    setDeleteLoading(true);

    const inputData = {
      cid: companyId.current,
    };

    dispatch(
      deleteapiAll({
        inputData: inputData,
        Api: DeleteCompany,
        Token: Token,
        urlof: "DeleteCompany",
      })
    ).then((res) => {
      if (res?.payload?.response) {
        setDeleteLoading(false);
        handleCloseDelete();
        toast.success(t(res.payload.response.message), {
          autoClose: config.TOST_AUTO_CLOSE,
        });
        setsavedata(!savedata);
      } else {
        if (res?.payload?.error) {
          setDeleteLoading(false);
          handleCloseDelete();
          toast.error(t(res.payload.error.response.data.message), {
            autoClose: config.TOST_AUTO_CLOSE,
          });
        }
      }
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
        Api: getCompanyListAPi,
        Token: Token,
        urlof: config.COMPANY_LIST_KEY,
        signal: abortController.signal,
      })
    ).then((res) => {
      if (res?.error?.message == "Rejected") {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });
  }, [currentPage, select, searchTerm, savedata]);

  useEffect(() => {
    const inputData = {
      page: currentPage,
      size: select,
      search: searchTerm.toLowerCase(),
    };
    if (saveloading == true) {
      dispatch(
        postapiAll({
          inputData: inputData,
          Api: getCompanyListAPi,
          Token: Token,
          urlof: config.COMPANY_LIST_KEY,
        })
      ).then((res) => {});
    }
  }, [saveloading]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    if (!newSearchTerm.trim()) {
      setSearchterm("");
    } else {
      setSearchterm(newSearchTerm);
      setCurrentPage(1);
    }
  };

  const checkAllFields = () => {
    let hasErrors = false;

    const regexPatterns = {
      Email: ConstantConfig.CUSTOMER.Email,
      Domain: ConstantConfig.CUSTOMER.Domain,
      Password: ConstantConfig.EXTENSION.VALIDATION.Password,
      // Contact_person: ConstantConfig.CUSTOMER.Phone_number,
    };

    Object.keys(formData).forEach((name) => {
      const value = formData[name];

      if (
        (typeof value === "string" || value instanceof String) &&
        name !== "Phone_number"
      ) {
        if (!value?.trim()) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: `${t(name.replace(/_/g, " "))} ${t("is required")}`,
          }));
          hasErrors = true;
        } else if (regexPatterns[name] && !value.match(regexPatterns[name])) {
          if (name === "Password") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [name]: `${t(
                "please choose a strong password try a mix of letters numbers and symbols"
              )}`,
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [name]: `${name} ${"is invalid"}`,
            }));
          }
          hasErrors = true;
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
        }
      }
    });
    return hasErrors;
  };
  const handleSave = () => {
    const formData1 = new FormData();
    // Manually append each key-value pair to formData
    formData1.append("company_name", formData.Company_name);
    formData1.append("company_street_address", formData.Street_address);
    formData1.append("company_zipcode", formData.ZIP);
    formData1.append("company_city", formData.City);
    formData1.append("company_country", formData.Country);
    formData1.append("company_vat", formData.Vat);
    formData1.append("company_contact_person", formData.Contact_person);
    formData1.append("company_password", formData.Password);
    formData1.append("company_email", formData.Email);
    formData1.append("company_phone_number", formData.Phone_number);
    formData1.append("domain_name", formData.Domain.toLowerCase());
    formData1.append("hex_code", colors);
    formData1.append("pbx", featuresData.PBX.checked);
    formData1.append("extension", featuresData.Extensions.checked);
    formData1.append("ring_group", featuresData.Ring_Groups.checked);
    formData1.append("conference", featuresData.Conference_call.checked);
    formData1.append("video_call", featuresData.Video_calls.checked);
    formData1.append("ivr", featuresData.IVR.checked);
    formData1.append("speech_to_text", featuresData.Speech_to_text.checked);
    formData1.append(
      "phone_in_browser",
      featuresData.Phone_in_the_browser.checked
    );
    formData1.append("voicemail", featuresData.Voicemail.checked);
    formData1.append("callback", featuresData.Callback.checked);
    formData1.append("record_calls", featuresData.Record_calls.checked);
    formData1.append("reportage", featuresData.Reportage.checked);
    formData1.append("monitoring", featuresData.Monitoring.checked);
    formData1.append("caller_id", featuresData.Caller_ID.checked);
    formData1.append("time_controls", featuresData.Time_controls.checked);
    formData1.append("whatsapp", featuresData.WhatsApp.checked);
    formData1.append(
      "calendar_integration",
      featuresData.Calendar_integration.checked
    );
    formData1.append("text_to_speech", featuresData.Text_to_speech.checked);
    formData1.append(
      "virtual_assistant",
      featuresData.A_virtual_assistant.checked
    );

    formData1.append("small_logo", logo.small_logo);
    formData1.append("dark_small_logo", logo.dark_small_logo);
    formData1.append("logo_text", logo.logo_text);
    formData1.append("dark_logo_text", logo.dark_logo_text);
    formData1.append("pbx_count", featuresData.PBX.text);
    formData1.append(
      "extension_count",
      featuresData.Extensions.text ? featuresData.Extensions.text : 0
    );
    formData1.append(
      "ring_group_count",
      featuresData.Ring_Groups.text ? featuresData.Ring_Groups.text : 0
    );
    formData1.append(
      "conference_count",
      featuresData.Conference_call.text ? featuresData.Conference_call.text : 0
    );
    formData1.append("video_call_count", featuresData.Video_calls.text);
    formData1.append(
      "ivr_count",
      featuresData.IVR.text ? featuresData.IVR.text : 0
    );
    formData1.append("speech_to_text_count", featuresData.Speech_to_text.text);
    formData1.append(
      "phone_in_browser_count",
      featuresData.Phone_in_the_browser.text
    );
    formData1.append("voicemail_count", featuresData.Voicemail.text);
    formData1.append("callback_count", featuresData.Callback.text);
    formData1.append("record_calls_count", featuresData.Record_calls.text);
    formData1.append(
      "reportage_count",
      featuresData.Reportage.text ? featuresData.Reportage.text : 0
    );
    formData1.append("monitoring_count", featuresData.Monitoring.text);
    formData1.append("caller_id_count", featuresData.Caller_ID.text);
    formData1.append("time_controls_count", featuresData.Time_controls.text);
    formData1.append(
      "whatsapp_count",
      featuresData.WhatsApp.text ? featuresData.WhatsApp.text : 0
    );
    formData1.append(
      "calendar_integration_count",
      featuresData.Calendar_integration.text
    );
    formData1.append("text_to_speech_count", featuresData.Text_to_speech.text);
    formData1.append(
      "virtual_assistant_count",
      featuresData.A_virtual_assistant.text
    );

    const hasErrors = checkAllFields();
    const hexColorRegex = ConstantConfig.CUSTOMER.color;
    if (hasErrors) {
      setActiveTab("General");
    } else if (!hexColorRegex.test(colors) && colors) {
      setActiveTab("customize");
    } else if (!hasErrors) {
      if (
        formData.Company_name &&
        formData.Street_address &&
        formData.ZIP &&
        formData.City &&
        formData.Country &&
        formData.Vat &&
        formData.Contact_person &&
        formData.Email
      ) {
        if (mode == "edit" && hexColorRegex.test(colors)) {
          formData1.append("cid", companyId.current);

          const data = {
            cid: companyId.current,
            formData1,
          };
          setsaveLoading(true);
          dispatch(
            putapiall({
              inputData: formData1,
              Api: EditCompany,
              Token: Token,
              urlof: "EditCompany",
            })
          ).then((res) => {
            if (res?.payload?.response) {
              setsaveLoading(false);
              handleClose();
              toast.success(t(res?.payload?.response.message), {
                autoClose: config.TOST_AUTO_CLOSE,
              });
              setsavedata(!savedata);
              setLogo({
                small_logo: "",
                logo_text: "",
                dark_small_logo: "",
                dark_logo_text: "",
              });
            } else {
              if (res?.payload?.error) {
                setsaveLoading(false);
                toast.error(t(res?.payload?.error?.message), {
                  autoClose: config.TOST_AUTO_CLOSE,
                });
              }
            }
          });
        } else if (mode == "add" && hexColorRegex.test(colors)) {
          setsaveLoading(true);
          dispatch(
            postapiAll({
              inputData: formData1,
              Api: AddCompany,
              Token: Token,
              urlof: "AddCompany",
            })
          ).then((res) => {
            if (res?.payload?.response) {
              setsaveLoading(false);
              handleClose();
              toast.success(t(res?.payload?.response.message), {
                autoClose: config.TOST_AUTO_CLOSE,
              });
              setsavedata(!savedata);
              setLogo({
                small_logo: "",
                logo_text: "",
                dark_small_logo: "",
                dark_logo_text: "",
              });
            } else {
              if (res?.payload?.error) {
                setsaveLoading(false);
                toast.error(t(res?.payload?.error?.response?.data?.message || res?.payload?.error?.message), {
                  autoClose: config.TOST_AUTO_CLOSE,
                });
              }
            }
          });
        }
      }
    }
  };
  useEffect(() => {
    setCustomerData(tabeleObj?.usersData);
  }, [tabeleObj]);

  const sortingTable = (name) => {
    if (!customerData) return;
    let newAscending = ascending;

    if (sortedColumn !== name) {
      newAscending = true;
    }
    const isNumber = (value) => !isNaN(value);
    const sortData = [...customerData]?.sort((a, b) => {
      const getDestination = (item) => {
        return item?.company_phone_number || "";
      };
      const valueA = a[name];
      const valueB = b[name];
      if (name === "company_phone_number") {
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
        if (newAscending) {
          return a[name] - b[name];
        } else {
          return b[name] - a[name];
        }
      } else {
        if (newAscending) {
          return a[name].localeCompare(b[name]);
        } else {
          return b[name].localeCompare(a[name]);
        }
      }
    });
    setSortedColumn(name);
    setAscending(!newAscending);
    setCustomerData(sortData);
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
              onChange={handleSearchChange}
              height={38}
              className="search-bg new-search-add"
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
                <th style={{ width: "21%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("company_phone_number")}
                  >
                    <p className="mb-0">{t("Customer Number")}</p>
                    {arrowShow("company_phone_number")}
                  </div>
                </th>
                <th style={{ width: "23%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("company_name")}
                  >
                    <p className="mb-0">{t("Customer")}</p>
                    {arrowShow("company_name")}
                  </div>
                </th>
                <th style={{ width: "13%" }}>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => sortingTable("createdAt")}
                  >
                    <p className="mb-0">{t("Date")}</p>
                    {arrowShow("createdAt")}
                  </div>
                </th>
                <th style={{ width: "10%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Type")}</p>
                  </div>
                </th>
                <th style={{ width: "12%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Status")}</p>
                  </div>
                </th>
                <th style={{ width: "12%" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0">{t("Amount")}</p>
                  </div>
                </th>
                <th style={{ width: "14%" }}>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ height: dynamicHeight - 50 }}>
                  <td
                    style={{ width: "100%", textAlign: "center" }}
                    colSpan="8"
                  >
                    <Loader />
                  </td>
                </tr>
              ) : customerData?.length > 0 ? (
                customerData?.map((val, index) => {
                  const date = new Date(val?.createdAt);
                  const formattedDate = new Date(date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, ".");
                  return (
                    <>
                      <tr className="table_body">
                        {/* <td>{val.company_phone_number}</td> */}
                        <td></td>
                        <td>{val.company_name}</td>
                        {/* <td>{val.domain_name}</td> */}
                        <td>{formattedDate}</td>
                        <td>
                          <img src={paypal} alt="" width={40} />
                        </td>
                        <td>
                          <span
                            className={
                              val.status == "Approved" ? "pending" : "approved"
                            }
                          >
                            {t("Pending")}
                          </span>
                        </td>
                        <td>{"$2000"}</td>
                        <td className="table_edit">
                          <button
                            className="ms-1"
                            onClick={() => handleEdit(val._id)}
                          >
                            <Edit_logo
                              width={14}
                              height={14}
                              className="edithover"
                            />
                          </button>
                          <button
                            className="ms-1"
                            onClick={() => handleDelete(val)}
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
                    colSpan="8"
                  >
                    {t("No data found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="show show2  mt-2 d-flex align-items-center justify-content-between">
          <h6>
            {t("Showing")} {startEntry} {t("to")} {endEntry} {t("of")}{" "}
            {tabeleObj.company_total_counts} {t("entries")}
          </h6>
          <div>
            <Pagination
              currentPage={currentPage}
              setcurrenPage={setCurrentPage}
              totalPages={tabeleObj?.total_page_count}
            />
          </div>
        </div>
      </div>
      {show && (
        <CustomerModal
          handleClose={handleClose}
          show={show}
          header={header}
          loader={saveloading}
          editValue={editValue}
          setEditValues={setEditValues}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
          errors={errors}
          setErrors={setErrors}
          featuresData={featuresData}
          setFeaturesData={setFeaturesData}
          setMode={setMode}
          mode={mode}
          colors={colors}
          setColors={setColors}
          error={error}
          seterror={seterror}
          setLogo={setLogo}
          logo={logo}
          logoDisplay={logoDisplay}
          setLogoDisplay={setLogoDisplay}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      {deletemodal && (
        <DeleteModal
          show={deletemodal}
          handleClose={handleCloseDelete}
          onDelete={handleModalDelete}
          loader={deleteLoading}
        />
      )}
    </div>
  );
}
