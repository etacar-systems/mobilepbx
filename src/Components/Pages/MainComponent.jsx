import React, { useEffect, useRef, useState } from "react";
import logo from "../../Assets/Image/logo_icon.png";
import img_logo from "../../Assets/Image/logo_txt.png";
import user from "../../Assets/Icon/profile_default.svg";
import Dropdown from "react-bootstrap/Dropdown";
import { ReactComponent as Setting } from "../../Assets/Image/setting.svg";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Menu } from "../../Assets/Image/menu.svg";
import { ReactComponent as Logout_icon } from "../../Assets/Icon/logout.svg";
import { ReactComponent as Lightversion } from "../../Assets/Icon/light-theme.svg";
import { ReactComponent as Darkversion } from "../../Assets/Icon/dark-theme.svg";
import { ReactComponent as Icon16 } from "../../Assets/Icon/logout.svg";
import { ReactComponent as Icon1 } from "../../Assets/Icon/dash_logo.svg";
import { ReactComponent as Icon2 } from "../../Assets/Icon/number_logo.svg";
import { ReactComponent as Icon3 } from "../../Assets/Icon/extension_logo.svg";
import { ReactComponent as Icon4 } from "../../Assets/Icon/group_logo.svg";
import { ReactComponent as Icon5 } from "../../Assets/Icon/conference_logo.svg";
import { ReactComponent as Icon6 } from "../../Assets/Icon/ivr_logo.svg";
import { ReactComponent as Icon7 } from "../../Assets/Icon/time_logo.svg";
import { ReactComponent as Icon8 } from "../../Assets/Icon/call_logo.svg";
import { ReactComponent as Icon9 } from "../../Assets/Icon/system_logo.svg";
import { ReactComponent as Icon10 } from "../../Assets/Icon/report_logo.svg";
import { ReactComponent as Icon11 } from "../../Assets/Icon/customer.svg";
import { ReactComponent as Icon12 } from "../../Assets/Icon/invoices.svg";
import { ReactComponent as Icon13 } from "../../Assets/Icon/pstn.svg";
import { ReactComponent as Icon14 } from "../../Assets/Icon/outbound.svg";
import { ReactComponent as Icon21 } from "../../Assets/Icon/calendarr.svg";
import { ReactComponent as Icon15 } from "../../Assets/Icon/firewall.svg";
import { ReactComponent as Icon17 } from "../../Assets/Icon/call-end.svg";
import { ReactComponent as Icon18 } from "../../Assets/Icon/chat.svg";
import { ReactComponent as Icon19 } from "../../Assets/Icon/phonebook.svg";
import { ReactComponent as Whtasapp } from "../../Assets/Icon/whatsapp-svgrepo-com.svg";
import { ReactComponent as Icon20 } from "../../Assets/Icon/call-history-svgrepo-com.svg";
import { ReactComponent as Icon22 } from "../../Assets/Icon/smtp.svg";
import { ReactComponent as Icon23 } from "../../Assets/Icon/integration-icon.svg";
import { ReactComponent as Icon24 } from "../../Assets/Icon/video_upload.svg";
import socketIoClient from "socket.io-client";
import Cookies from "js-cookie";
import SipConnection from "../Call/SipConnection";
import { useDispatch, useSelector } from "react-redux";
import SocketConfig, { AllEmit } from "../Chat/SocketConfig";
import ConfirmationModal from "../Chat/ConfirmationModal";
import Whatsappsocketconfig from "../Whatsapp/Whatsappsocketconfig";
import Supports from "../Chat/Supports";
import { useTranslation } from "react-i18next";
import { company_Features } from "../ConstantConfig";
import LanguageSelect from "../Modal/LanguageSelect";
import { settheme } from "../../Redux/Reducers/DataServices";
import { Badge } from "react-bootstrap";
import CustomDropDown from "../CustomDropDown";

import { SELECTSTATUS } from "../ConstantConfig";

function MainComponent({ children }) {
  const { t } = useTranslation();

  const sipRegister = useSelector((state) => state.sipconnect.sipconnect);
  const sip = Cookies.get("Sip_number");

  const fileBaseUrl = process.env.REACT_APP_FILE_BASE_URL;
  const localurl = useSelector((state) => state.getapiall.getapiall.profileurl);
  const unread_count = useSelector((state) => state.getapiall.unreadCount);
  console.log(unread_count, "unread_count");
  const [count, setCount] = useState("");
  useEffect(() => {
    setCount(unread_count);
  }, [unread_count]);
  const uid = Cookies.get("User_id");
  const allListeners = useSelector((state) => state.allListeners.allListeners);
  console.log(allListeners.name, "allListenersallListeners");
  useEffect(() => {
    if (allListeners.name === "receive_message") {
      AllEmit("unread_message_count", { uid: uid });
    }
    if (allListeners.name == "ack_unread_message_count") {
      console.log(allListeners.listener_params, "allListeners.listener_params");
      setCount(allListeners.listener_params.unread_msg_count);
    }
  }, [allListeners]);
  useEffect(() => {
    const uid = Cookies.get("User_id");
    const domain_name = Cookies.get("domain_name");
    const data = {
      uid: uid,
      company_domain: domain_name,
    };
    const intervalId = setInterval(() => {
      AllEmit("register_extantions", data);
      console.log("Socket event emitted");
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const sideRef = useRef(null);
  const role = Cookies.get("role");
  const navigate = useNavigate();
  const settingUpdateStatus = useSelector(
    (state) => state.settingUpdateStatus.settingUpdateStatus
  );
  let profile_url = Cookies.get("profile_url");

  const getDetail = Cookies.get("company_features");
  const hex_code = Cookies.get("hex_code");
  const companyFeatures =
    getDetail == "undefined" ? null : JSON.parse(getDetail);
  if (hex_code && role !== "3") {
    document.documentElement.style.setProperty("--main-orange-color", hex_code);
    document.documentElement.setAttribute(
      "style",
      `--main-orange-color: ${hex_code}`
    );
    document.documentElement.style.cssText = `--main-orange-color: ${hex_code}`;
  } else {
    // If hex_code is not provided or role is "3", reset to default color
    document.documentElement.style.removeProperty("--main-orange-color");
  }
  const isFeatureEnabled = (feature) => companyFeatures?.[feature] !== false;

  const sidebrObj = [];
  if (role == 1) {
    const agentSidebar = [
      { name: t("Agent"), icon: "", to: "" },
      {
        name: t("Webphone"),
        icon: Icon17,
        to: "/webphone",
        feature: company_Features?.phone_in_browser,
      },
      { name: t("Chat"), icon: Icon18, to: "/chat" },
      { name: t("Phonebook"), icon: Icon19, to: "/phonebook" },
      {
        name: t("Call History"),
        icon: Icon20,
        to: "/callhistory",
        feature: company_Features?.callhistory,
        name_2: "Call History",
      },
      {
        name: t("Calendar"),
        icon: Icon21,
        to: "/calendar",
        feature: company_Features?.calendar_integration,
      },
      {
        name: t("Whatsapp"),
        icon: Whtasapp,
        to: "/whatsappChat",
        feature: company_Features?.whatsapp,
      },
      { name: t("Dashboard"), icon: Icon1, to: "/dashboard" },
    ];

    agentSidebar.forEach((item) => {
      if (!item.feature || isFeatureEnabled(item.feature)) {
        sidebrObj.push(item);
      }
    });
  } else if (role == 2 || role == 4) {
    const adminSidebar = [
      { name: t("Admin"), icon: "", to: "" },
      { name: t("Dashboard"), icon: Icon1, to: "/dashboard" },
      { name: t("Numbers"), icon: Icon2, to: "/number" },
      {
        name: t("Extensions"),
        icon: Icon3,
        to: "/extension",
        feature: company_Features?.extension,
      },
      {
        name: t("Ring groups"),
        icon: Icon4,
        to: "/ring",
        feature: company_Features?.ring_group,
      },
      {
        name: t("Conferences"),
        icon: Icon5,
        to: "/conferences",
        feature: company_Features?.conference,
      },
      { name: t("IVR"), icon: Icon6, to: "/ivr", feature: "ivr" },
      {
        name: t("Time Condition"),
        icon: Icon7,
        to: "/time",
        feature: company_Features?.time_controls,
      },
      {
        name: t("Call recordings"),
        icon: Icon8,
        to: "/call",
        feature: company_Features.callhistory,
      },
      {
        name: t("System recordings"),
        icon: Icon9,
        to: "/system",
      },
      {
        name: t("Reports"),
        icon: Icon10,
        to: "/reports",
        feature: company_Features?.reportage,
      },
      {
        name: t("Integrations"),
        icon: Icon23,
        to: "/integration",
      },
    ];

    adminSidebar.forEach((item) => {
      if (!item.feature || isFeatureEnabled(item.feature)) {
        sidebrObj.push(item);
      }
    });
  } else if (role == 3) {
    sidebrObj.push(
      {
        name: t("SuperAdmin"),
        icon: "",
        to: "",
      },
      {
        name: t("Customers"),
        icon: Icon11,
        to: "/customers",
      },
      {
        name: t("Invoices"),
        icon: Icon12,
        to: "/invoices",
      },
      {
        name: t("PSTN numbers"),
        icon: Icon13,
        to: "/pstn",
      },
      {
        name: t("Trunks"),
        icon: Icon6,
        to: "/trunk",
      },
      {
        name: t("Outbound routes"),
        icon: Icon14,
        to: "/outbound",
      },
      {
        name: t("Firewall"),
        icon: Icon15,
        to: "/firewall",
      },
      {
        name: t("SMTP"),
        icon: Icon22,
        to: "/smtp",
      },
      {
        name: t("Video upload"),
        icon: Icon24,
        to: "/video",
      }
    );
  } else {
    navigate("/");
    Cookies.remove("Token");
    Cookies.remove("Company_Id");
    Cookies.remove("RefreshToken");
    Cookies.remove("User_id");
    Cookies.remove("user_email");
    Cookies.remove("username");
    Cookies.remove("company_features");
    Cookies.remove("profile_url");
  }
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [dynamicHeight2, setDynamicHeight2] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [theme, setTheme] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [show2, setShow2] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [company_name, setCompanyName] = useState("");

  useEffect(() => {
    const fname = Cookies.get("firstname");
    const lname = Cookies.get("lastname");
    const cname = Cookies.get("company_name");

    if (fname) setFirstname(fname);
    if (lname) setLastname(lname);
    if (cname) setCompanyName(cname);
  }, [settingUpdateStatus]);

  const contentRef = useRef(null);
  const [toggleWidth, setToggleWidth] = useState("100%"); // Default width, adjust as needed

  useEffect(() => {
    if (contentRef.current) {
      const contentWidth = contentRef.current.offsetWidth;
      setToggleWidth(`${contentWidth}px`); // Set width based on content width
    }
  }, []);
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 80;
      const windowHeight2 = window.innerHeight - 65;
      setDynamicHeight(windowHeight);
      setDynamicHeight2(windowHeight2);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);

    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight, dynamicHeight2]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideRef.current && !sideRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const sideMenuOpen = (event) => {
    setIsDrawerOpen(true);
    event.stopPropagation();
  };

  const logout = () => {
    setConfirmationModal(true);
  };
  const Logout = () => {
    navigate("/");
    Cookies.remove("Token");
    Cookies.remove("Company_Id");
    Cookies.remove("RefreshToken");
    Cookies.remove("User_id");
    Cookies.remove("user_email");
    Cookies.remove("username");
    Cookies.remove("Sip_number");
    Cookies.remove("company_name");
    Cookies.remove("conversation_id");
    Cookies.remove("domain_name");
    Cookies.remove("domain_uuid");
    Cookies.remove("firstname");
    Cookies.remove("lastname");
    Cookies.remove("role");
    Cookies.remove("sip_password");
    Cookies.remove("sip_username");
    Cookies.remove("company_features");
    Cookies.remove("user_extension");
    window.location.reload();
  };

  const screensize = window.innerWidth < 1200;

  useEffect(() => {
    var userget = Cookies.get("username");
    if (!userget) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    var path = window.location.pathname;
    if (path != "/dashboard") {
      setScrollPercentage("0");
    }
  }, [navigate]);

  // useEffect(() => {
  //     const mainContent = document.getElementById('main-content');
  //     const handleScroll = () => {
  //         const scrollTop = mainContent.scrollTop;
  //         const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
  //         const scrolled = (scrollTop / scrollHeight) * 100;
  //         var path = window.location.pathname;
  //         if (path === "/dashboard") {
  //             setScrollPercentage(scrolled);
  //         }
  //     };

  //     if (mainContent) {
  //         mainContent.addEventListener('scroll', handleScroll);
  //     }

  //     return () => {
  //         if (mainContent) {
  //             mainContent.removeEventListener('scroll', handleScroll);
  //         }
  //     };
  // }, []);

  const handletheme = () => {
    const newTheme = !theme;
    setTheme(newTheme);
    const newThemeName = newTheme ? "Dark" : "light";
    document.querySelector("body").setAttribute("data-theme", newThemeName);
    Cookies.set("Theme", newThemeName);
    dispatch(settheme(newThemeName));
  };

  const handleChangesetting = () => {
    navigate("/setting");
  };

  const Themee = Cookies.get("Theme");
  useEffect(() => {
    if (Themee) {
      setTheme(Themee === "Dark");
      document.querySelector("body").setAttribute("data-theme", Themee);
    } else {
      Cookies.set("Theme", "light");
    }
  }, [Themee]);

  const openModal = () => {
    setShow(true);
  };
  const openModal2 = () => {
    setShow2(true);
  };

  let path1 = window.location.pathname;

  const [isClick, setIsClick] = useState(false);
  const iconRef = useRef(null);
  const dropdownRef = useRef(null);

  let display_small_logo = logo;
  let display_logo_text = img_logo;

  if (!theme) {
    display_small_logo = companyFeatures?.small_logo
      ? `${fileBaseUrl}${companyFeatures?.small_logo}`
      : logo;
    display_logo_text = companyFeatures?.logo_text
      ? `${fileBaseUrl}${companyFeatures?.logo_text}`
      : img_logo;
  } else {
    display_small_logo = companyFeatures?.dark_small_logo
      ? `${fileBaseUrl}${companyFeatures?.dark_small_logo}`
      : logo;
    display_logo_text = companyFeatures?.dark_logo_text
      ? `${fileBaseUrl}${companyFeatures?.dark_logo_text}`
      : img_logo;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the dropdown if the click is outside the dropdown and icon
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsClick(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguage = () => {
    setIsClick(!isClick);
  };

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  return (
    <>
      <div className=" d-flex h-100">
        {!screensize && (
          <div className="side_bar">
            <div className="sidebar_logo">
              <img
                src={display_small_logo}
                alt="logo icon"
                style={{ marginTop: "12px" }}
              />
              <img
                src={display_logo_text}
                alt="logo"
                style={{
                  maxHeight: "35px",
                  maxWidth: "180px",
                  marginTop: "12px",
                }}
              />
            </div>

            <div
              style={{ maxHeight: dynamicHeight, overflow: "auto" }}
              className="sidebar_scroll"
            >
              <div className="user-full d-flex align-items-center mt-3 ">
                {localurl ? (
                  <img
                    src={`${fileBaseUrl}${localurl}`}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded"
                  />
                ) : profile_url ? (
                  <img
                    src={`${fileBaseUrl}${profile_url}`}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: "var(--main-orange-color)" }}
                    className="rounded"
                  >
                    <img
                      src={user}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  </div>
                )}

                <div className="ms-3">
                  <h5 className="m-0 welcome">{t("Welcome,")}</h5>

                  <Dropdown
                    className="custome-dropdown "
                    style={{
                      border: "none",
                      borderRadius: "10px",
                      marginTop: "-2px",
                    }}
                  >
                    <Dropdown.Toggle
                      variant="default"
                      className="helloooo"
                      id="dropdown-basic"
                      style={{
                        border: "none",
                        padding: "5px 0 0 0",
                        fontWeight: "700",
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "130px",
                          display: "inline-block",
                          verticalAlign: "middle",
                          color: "var(--main-adminheaderpage-color)",
                        }}
                      >
                        {(company_name !== "undefined" && role == 2) ||
                        role == 4 ? (
                          company_name
                        ) : (
                          <>
                            <span style={{ marginRight: "4px" }}>
                              {firstname}
                            </span>
                            <span>{lastname}</span>
                          </>
                        )}
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="bttt"
                      style={{
                        border: "none !important",
                        borderRadius: "10px",
                        boxShadow:
                          "var(--main-boxshadowdropdown-color) 0px 2px 20px 0px",
                      }}
                    >
                      <Dropdown.Item
                        className="d-flex align-items-center  setting_tag user-link-logout"
                        onClick={handleChangesetting}
                      >
                        <div className="setting_tag">
                          <Setting
                            width={16}
                            height={16}
                            // style={{
                            //   fill: "var(--main-adminnumberheader-color)",
                            //   stroke: "var(--main-adminnumberheader-color)",
                            // }}
                          />
                          <p className="m-0 ms-2">{t("Settings")}</p>
                        </div>
                      </Dropdown.Item>

                      <Dropdown.Item
                        className="d-flex align-items-center  user-link-logout"
                        onClick={handletheme}
                      >
                        <Link to="" className="setting_tag">
                          {!theme ? (
                            <>
                              <Darkversion width={18} height={18} />
                              <p className="m-0 ms-2">{t("Dark Version")}</p>
                            </>
                          ) : (
                            <>
                              <Darkversion width={18} height={18} />
                              <p className="m-0 ms-2">{t("Light Version")}</p>
                            </>
                          )}
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="d-flex align-items-center user-link-logout"
                        onClick={logout}
                      >
                        <Icon16
                          className="icontest1"
                          style={{ width: "16px", height: "100%" }}
                        />
                        <p className="m-0 ms-2">{t("Logout")}</p>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="mt-3">
                {sidebrObj?.map((val, index) => {
                  return (
                    <div key={val.name}>
                      {val.icon == "" ? (
                        <h6 className="superadmin">{val.name}</h6>
                      ) : (
                        <Link
                          to={val.to}
                          className={`d-flex align-items-center py-2 ${
                            window.location.pathname === val.to
                              ? "active_bg"
                              : "active_color"
                          }`}
                        >
                          <div
                            className={`sideimg_manage ${
                              window.location.pathname === val.to
                                ? "sideimg_bg"
                                : "sideimg_manage"
                            }`}
                          >
                            <val.icon
                              className="icontest"
                              width={
                                val.name ==
                                  ("Call History" || "Puheluhistoria") ||
                                val.name_2 == "Call History"
                                  ? 28
                                  : 18
                              }
                              height={
                                val.name ==
                                  ("Call History" || "Puheluhistoria") ||
                                val.name_2 == "Call History"
                                  ? 28
                                  : 18
                              }
                            />
                          </div>
                          <h6 className="m-0 ms-2 side_name">{val.name}</h6>
                          {val.name == "Chat" && count !== 0 && (
                            <div className="ms-auto">
                              <Badge pill className=" rounded orange-badge">
                                {count}
                              </Badge>
                            </div>
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {isDrawerOpen && (
          <div
            className={`drawer ${isDrawerOpen == true ? "open" : ""}`}
            ref={sideRef}
          >
            <div className="">
              <div className="sidebar_logo">
                <img src={display_small_logo} alt="" />
                <img
                  src={display_logo_text}
                  alt=""
                  style={{ maxHeight: "30px", maxWidth: "170px" }}
                />
              </div>
              <hr className="m-1 horizontal_border" />
              <div
                style={{ maxHeight: dynamicHeight, overflow: "auto" }}
                className="sidebar_scroll"
              >
                <div className="d-flex align-items-center mt-2 ">
                  {localurl ? (
                    <img
                      src={`${fileBaseUrl}${localurl}`}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  ) : profile_url ? (
                    <img
                      src={`${fileBaseUrl}${profile_url}`}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: "var(--main-orange-color)" }}
                      className="rounded"
                    >
                      <img
                        src={user}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                    </div>
                  )}

                  <div className="ms-3">
                    <h5 className="m-0 welcome">{t("Welcome")}</h5>

                    <Dropdown className="custome-dropdown">
                      <Dropdown.Toggle
                        variant="default"
                        className="helloooo"
                        id="dropdown-basic"
                        style={{
                          border: "none",
                          padding: "5px 0 0 0",
                          fontWeight: "700",
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "130px",
                            display: "inline-block",
                            verticalAlign: "middle",
                            color: "var(--main-adminnumberheader-color)",
                          }}
                        >
                          {(company_name !== "undefined" && role == 2) ||
                          role == 4 ? (
                            company_name
                          ) : (
                            <>
                              <span style={{ marginRight: "4px" }}>
                                {firstname}
                              </span>
                              <span>{lastname}</span>
                            </>
                          )}
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        style={{
                          left: "0", // Ensure the menu opens from the left side
                          transform: "translateX(-50%)",
                        }}
                      >
                        {role != 3 && (
                          <Dropdown.Item
                            href="#/action-1"
                            className="d-flex align-items-center user-link-logout"
                          >
                            <Link to="/setting" className="setting_tag">
                              <Setting
                                width={16}
                                height={16}
                                style={{
                                  fill: "(--main-adminnumberheader-color)",
                                  stroke: "(--main-adminnumberheader-color)",
                                }}
                              />
                              <p className="m-0 ms-2">{t("Settings")}</p>
                            </Link>
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          className="d-flex align-items-center user-link-logout"
                          onClick={handletheme}
                        >
                          <Link to="" className="setting_tag">
                            {!theme ? (
                              <>
                                <Darkversion width={18} height={18} />
                                <p className="m-0 ms-2">{t("Dark Version")}</p>
                              </>
                            ) : (
                              <>
                                <Darkversion width={18} height={18} />
                                <p className="m-0 ms-2">{t("Light Version")}</p>
                              </>
                            )}
                          </Link>
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="d-flex align-items-center user-link-logout"
                          onClick={logout}
                        >
                          <Icon16
                            className="icontest1"
                            style={{ width: "16px", height: "100%" }}
                          />
                          <p className="m-0 ms-2">{t("Logout")}</p>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="mt-3">
                  {sidebrObj?.map((val, index) => {
                    return (
                      <>
                        {val.icon == "" ? (
                          <h6 key={index} className="superadmin">
                            {val.name}
                          </h6>
                        ) : (
                          <Link
                            to={val.to}
                            onClick={() => setIsDrawerOpen(false)}
                            key={index}
                            className={`d-flex align-items-center py-2 ${
                              window.location.pathname === val.to
                                ? "active_bg"
                                : "active_color"
                            }`}
                          >
                            <div
                              className={`sideimg_manage ${
                                window.location.pathname === val.to
                                  ? "sideimg_bg"
                                  : "sideimg_manage"
                              }`}
                            >
                              <val.icon
                                className="icontest"
                                width={
                                  val.name ==
                                    ("Call History" || "Puheluhistoria") ||
                                  val.name_2 == "Call History"
                                    ? 28
                                    : 18
                                }
                                height={
                                  val.name ==
                                    ("Call History" || "Puheluhistoria") ||
                                  val.name_2 == "Call History"
                                    ? 28
                                    : 18
                                }
                              />
                            </div>

                            <h6 className="m-0 ms-2 side_name">{val.name}</h6>
                          </Link>
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ width: sidebarWidth ? "100% - 21%" : "100%" }}>
          <div>
            <div
              className="d-flex align-items-center justify-content-between px-3 nav_header"
              style={{ height: "63px" }}
            >
              <div className="d-flex align-items-center justify-content-between">
                {screensize && (
                  <Menu
                    onClick={sideMenuOpen}
                    style={{ marginRight: "20px" }}
                    height={25}
                    width={25}
                  />
                )}
                <LanguageSelect main={true} />
                <div className="support-head" onClick={openModal2}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="var(--main-orange-color)"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m7.46 7.12l-2.78 1.15a4.982 4.982 0 0 0-2.95-2.94l1.15-2.78c2.1.8 3.77 2.47 4.58 4.57M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3M9.13 4.54l1.17 2.78a5 5 0 0 0-2.98 2.97L4.54 9.13a7.984 7.984 0 0 1 4.59-4.59M4.54 14.87l2.78-1.15a4.968 4.968 0 0 0 2.97 2.96l-1.17 2.78a7.996 7.996 0 0 1-4.58-4.59m10.34 4.59l-1.15-2.78a4.978 4.978 0 0 0 2.95-2.97l2.78 1.17a8.007 8.007 0 0 1-4.58 4.58"
                    />
                  </svg>{" "}
                  {t("Support")}
                </div>
              </div>
              <div
                style={{ cursor: "pointer", height: "100%" }}
                className="d-flex align-items-center gap-3"
              >
                {role == 1 && (
                  <div
                    className="d-flex align-items-center"
                    onClick={openModal}
                    style={{ height: "100%" }}
                  >
                    <span
                      style={{ color: "var(--main-adminnumberheader-color)" }}
                      className="siptext"
                    >
                      {sip}{" "}
                      {sipRegister == true ? (
                        <span className="conlist">{t("Connected")}</span>
                      ) : (
                        <span className="conlist">
                          {t("Registration Failed")}
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {window.location.pathname === "/webphone" && (
                  <CustomDropDown
                    toggleDropdown={toggleDropdown}
                    // showValue={formData.selectstatus}
                    openDropdown={openDropdown}
                    valueArray={SELECTSTATUS}
                    handleSelection={() => {}}
                    name={"selectstatus"}
                    defaultValue={t("Available")}
                    mapValue={"item"}
                    storeValue={"item"}
                    setOpenDropdown={setOpenDropdown}
                    sorting={true}
                  />
                )}

                <Icon16
                  className="icontest1"
                  style={{ width: "16px", height: "100%" }}
                  onClick={logout}
                />
              </div>
            </div>
            <div
              className="progress"
              style={{
                height: "1px",
                background: "var(--main-bordermodaldashboard-color)",
              }}
            >
              <div
                className="progress-bar progress-bar-success"
                role="progressbar"
                style={{
                  width: `${scrollPercentage}%`,
                  height: "1px",
                  background: "red",
                }}
              ></div>
            </div>
          </div>
          <div
            style={{
              padding:
                path1 == "/chat" ||
                path1 == "/whatsappChat" ||
                path1 == "/dashboard"
                  ? "0px 0px"
                  : "11px 15px",
              background: "var(--main-grey-color)",
              overflowX: path1 == "/chat" ? "" : "hidden ",

              height: path1 == "/chat" ? "" : dynamicHeight2,
            }}
            className={path1 == "/chat" ? "mainforoverchat" : ""}
            id="main-content"
          >
            {children}
          </div>
        </div>
      </div>
      <Supports show={show2} setShow={setShow2} />
      <SipConnection setShow={setShow} show={show} />
      <SocketConfig />
      <Whatsappsocketconfig />
      {confirmationModal == true && (
        <ConfirmationModal
          title={t("Logout")}
          body={t("Are you sure you want to Logout?")}
          button1={t("Logout")}
          button2={t("Cancel")}
          cancelcss={true}
          confirmationModal={confirmationModal}
          setConfirmationModal={setConfirmationModal}
          button1function={Logout}
          button2function={setConfirmationModal}
        />
      )}
    </>
  );
}

export default MainComponent;
