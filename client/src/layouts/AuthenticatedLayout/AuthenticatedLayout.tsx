import React, {
  MouseEventHandler,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Badge } from "react-bootstrap";

import { ReactComponent as Menu } from "../../Assets/Image/menu.svg";
import SipConnection from "../../components/Call/SipConnection";
import SocketConfig, { AllEmit } from "../../components/Chat/SocketConfig";
import Whatsappsocketconfig from "../../components/Whatsapp/Whatsappsocketconfig";
import Supports from "../../components/Chat/Supports";
import { company_Features } from "../../components/ConstantConfig";
import LanguageSelect from "../../components/Modal/LanguageSelect";
import CustomDropDown from "../../components/CustomDropDown";
import { ActionBar, Logo } from "./components";
import {
  adminMenuConfig,
  agentMenuConfig,
  superAdminMenuConfig,
} from "./pathsConfigs";
import { DropDown, ISyntheticEvent } from "../../components/shared";
import { useAgentStatuses } from "../../requests/queries";

import classNames from "./layout.module.scss";
import { useMeContext } from "../../contexts/MeContext";
import { useUpdateUserStatus } from "../../requests/mutations";

export const AuthenticatedLayout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const { me } = useMeContext();

  // @ts-ignore
  const sipRegister = useSelector((state) => state.sipconnect.sipconnect);
  const sip = Cookies.get("Sip_number");

  const fileBaseUrl = process.env.REACT_APP_FILE_BASE_URL;
  // @ts-ignore
  const localurl = useSelector((state) => state.getapiall.getapiall.profileurl);
  // @ts-ignore
  const unread_count = useSelector((state) => state.getapiall.unreadCount);
  const [count, setCount] = useState("");

  useEffect(() => {
    setCount(unread_count);
  }, [unread_count]);

  // @ts-ignore
  const allListeners = useSelector((state) => state.allListeners.allListeners);

  useEffect(() => {
    const uid = Cookies.get("User_id");
    if (allListeners.name === "receive_message") {
      AllEmit("unread_message_count", { uid: uid });
    }
    if (allListeners.name == "ack_unread_message_count") {
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
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const role: 1 | 2 | 3 | 4 = (Number(Cookies.get("role") || 0) ||
    undefined) as 1 | 2 | 3 | 4;
  const navigate = useNavigate();
  let profile_url = Cookies.get("profile_url");

  let sidebrObj = useMemo<
    Array<{
      name: string;
      icon?: React.FunctionComponent<React.SVGAttributes<SVGAElement>>;
      to: string;
    }>
  >(() => {
    const companyDetails = Cookies.get("company_features");

    const companyFeatures =
      !companyDetails || companyDetails === "undefined"
        ? null
        : JSON.parse(companyDetails);

    if (role === 1) {
      return agentMenuConfig(company_Features, companyFeatures);
    } else if (role === 2 || role === 4) {
      return adminMenuConfig(company_Features, companyFeatures);
    } else if (role === 3) {
      return superAdminMenuConfig;
    } else {
      Cookies.remove("Token");
      Cookies.remove("Company_Id");
      Cookies.remove("RefreshToken");
      Cookies.remove("User_id");
      Cookies.remove("user_email");
      Cookies.remove("username");
      Cookies.remove("company_features");
      Cookies.remove("profile_url");
      navigate("/");
      return [];
    }
  }, [role, navigate]);

  const [dynamicHeight2, setDynamicHeight2] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sideRef = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight2 = window.innerHeight - 65;
      setDynamicHeight2(windowHeight2);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);

    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideRef.current && !sideRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const sideMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setIsSidebarOpen(true);
    event.stopPropagation();
  };

  useEffect(() => {
    var userget = Cookies.get("username");
    if (!userget) {
      navigate("/");
    }
  }, [navigate]);

  const openModal2 = () => {
    setShow2(true);
  };

  let path1 = window.location.pathname;

  const { statuses } = useAgentStatuses();

  const options = useMemo(() => {
    return (
      statuses?.map((status) => ({
        value: status,
        label: `user_status.${status}`,
      })) || []
    );
  }, [statuses]);

  const { updateUserStatus } = useUpdateUserStatus();

  const onUserStatusChange = (event: ISyntheticEvent) => {
    updateUserStatus({ status: event.target.value });
  };

  return (
    <>
      <div className=" d-flex h-100">
        <div
          data-open={isSidebarOpen}
          className={["side_bar", classNames.sidebar].join(" ")}
        >
          <Logo />

          {role && (
            <div
              // style={{ maxHeight: dynamicHeight, overflow: "auto" }}
              className={classNames.sidebar__tabWrapper}
            >
              <ActionBar
                localurl={localurl}
                profile_url={profile_url}
                fileBaseUrl={fileBaseUrl}
                role={role}
                ref={sideRef}
              />

              <div className="mt-3">
                {sidebrObj?.map((val, index) => {
                  return (
                    <div key={val.name}>
                      {!val.icon ? (
                        <h6 className="superadmin">{t(val.name)}</h6>
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
                              width={18}
                              height={18}
                            />
                          </div>
                          <h6 className="m-0 ms-2 side_name">{t(val.name)}</h6>
                          {val.name === "Chat" && Number(count) !== 0 && (
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
          )}
        </div>

        {/** main section */}
        <div
          style={{
            width:
              // sidebarWidth ? "100% - 21%" :
              "100%",
          }}
        >
          <div className={classNames.header}>
            <div
              className="d-flex align-items-center justify-content-between px-3 nav_header"
              style={{ height: "63px" }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <button
                  onClick={sideMenuOpen}
                  className={[
                    classNames.sidebar__open,
                    classNames.sidebar__open_button,
                  ].join(" ")}
                >
                  <Menu
                    style={{ marginRight: "20px" }}
                    height={25}
                    width={25}
                  />
                </button>
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
              <div className="d-flex align-items-center gap-3">
                {role === 1 && (
                  <div
                    className="d-flex align-items-center"
                    style={{ height: "100%" }}
                  >
                    <span
                      style={{ color: "var(--main-adminnumberheader-color)" }}
                      className="siptext"
                    >
                      {sip}{" "}
                      {sipRegister === true ? (
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
                  <>
                    <div className={[classNames.userStatus, classNames.userStatus_badge, classNames[`userStatus_${me.status}`]].join(" ")}></div>
                    <DropDown
                      labelKey={"label"}
                      valueKey={"value"}
                      value={me.status}
                      style={{ minWidth: "100px", textTransform: "capitalize" }}
                      onChange={onUserStatusChange}
                      options={options}
                      translateLabels
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              padding:
                path1 === "/chat" ||
                path1 === "/whatsappChat" ||
                path1 === "/dashboard"
                  ? "0px 0px"
                  : "11px 15px",
              background: "var(--main-grey-color)",
              overflowX: path1 === "/chat" ? undefined : "hidden",

              height: path1 === "/chat" ? "" : dynamicHeight2,
            }}
            className={path1 === "/chat" ? "mainforoverchat" : ""}
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
    </>
  );
};
