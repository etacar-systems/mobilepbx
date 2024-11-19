import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { ReactComponent as Search } from "../../Assets/Icon/search.svg";
import { ReactComponent as Chatnew } from "../../Assets/Icon/chatnew.svg";
import { useDispatch, useSelector } from "react-redux";
import TimeLable from "../TimeLable";
import moment from "moment";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Cookies from "js-cookie";
import { getapiAll, msgUnreadCount } from "../../Redux/Reducers/ApiServices";
import {
  chatHeaderInfo,
  openChat,
  openSidebar,
} from "../../Redux/Reducers/DataServices";
import Spinner from "react-bootstrap/Spinner";
import MediaType from "../Chat/MediaType";
import { ReactComponent as Plus } from "../../Assets/Icon/Plus.svg";
import { ReactComponent as DotsThreeVertical } from "../../Assets/Icon/DotsThreeVertical.svg";
import { AllWhatsappEmit } from "./Whatsappsocketconfig";
import { useTranslation } from "react-i18next";
import config from "../../config";

export default function WpSidebar({
  setSidebarobjget,
  setSideClick,
  sidebarobjget,
  setRefreshState,
  setChatLoder,
  setLoader,
  loader,
  currentPage,
  setAssignNumber,
}) {
  ///Api Config //
  const Conversation_Api = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_WhatsappConversation}`;
  const NewConversation = ``;
  //  const Sidebarapi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_MOBIILILINJA_SIDEBAR}`
  let Token = Cookies.get("Token");

  ///// ////
  const Sidebar = useSelector(
    (state) => state.getapiall.getapiall.wpsidebarlist
  );
  const SidebarCompany = useSelector(
    (state) => state.getapiall.getapiall.wpsidebarCompanydetail
  );
  const company_name = SidebarCompany?.CompanyDetail?.company_name;
  const company_number = SidebarCompany?.CompanyDetail?.whatsapp_number;
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const cid = Cookies.get("Company_Id");
  const uid = Cookies.get("User_id");
  const NewConversationdata = useSelector(
    (state) => state.getapiall.getapiall.NewConversation
  );
  const [activeRow, setActiveRow] = useState(null);
  const [newChatshow, setNewChatshow] = useState(false);
  const [active, setactive] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [dynamicNew, setDynamicNew] = useState(0);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const screensize = window.innerWidth > 991;
  const activeConversationId = Cookies.get("conversation_id");
  const abortControllerRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownState, setDropdownState] = useState("");
  const [assignList, setassignList] = useState("All");

  const handleToggle2 = (isOpen, id) => {
    setDropdownState(isOpen ? id : "");
  };

  const handleToggle = (isOpen) => {
    setShowDropdown(isOpen);
  };

  useEffect(() => {
    if (company_number) {
      Cookies.set("company_number", company_number);
    }
  }, [company_number]);

  const data = useSelector(
    (state) => state.getapiall.getapiall.complist.usersData
  );
  useEffect(() => {
    setLoader(true);
    dispatch(
      getapiAll({
        Api: config.COMPANY_USER_LIST,
        Token: Token,
        urlof: config.COMPANY_USER_LIST_KEY,
      })
    );
    Cookies.set("conversation_id", "");
  }, []);

  const handleRowClick = (index, user) => {
    if (user._id == activeConversationId) return;
    setRefreshState((state) => !state);
    setChatLoder(true);
    setactive(true);
    setSideClick(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    dispatch(msgUnreadCount({ _id: user._id, count: 0, key: 0 }));

    Cookies.set("conversation_id", user?._id);
    if (screensize) {
      setSidebarobjget(user);
    } else {
      setSidebarobjget(user);
      dispatch(openChat(true));
      dispatch(openSidebar(false));
    }
    setActiveRow(user?._id);

    const readAllMsg = {
      sender_id: company_number,
      receiver_id: user._id,
      cid: cid,
    };
    AllWhatsappEmit("read_all_message", readAllMsg);
    const addedParamConversation = `${Conversation_Api}/${user._id}?page=${currentPage}&size=20`;
    dispatch(
      getapiAll({
        Api: addedParamConversation,
        Token: Token,
        urlof: "WConversation",
        signal: abortController.signal,
      })
    ).then((res) => {
      if (res?.error?.message == "canceled") {
        setChatLoder(true);
      } else {
        setChatLoder(false);
        setSideClick(false);
      }
    });
  };

  const handleAssign = (number, name) => {
    setAssignNumber(number);
    setassignList(name);
  };

  useEffect(() => {
    setActiveRow(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 120;
      const windowHeight1 = window.innerHeight - 198;
      setDynamicHeight(windowHeight);
      setDynamicNew(windowHeight1);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight, dynamicNew]);

  const handleDropdownClick = (event) => {
    event.stopPropagation(); // Stop event from bubbling up to parent elements
  };
  const sortedSidebar = [...Sidebar].sort(
    (a, b) => new Date(b.last_message_time) - new Date(a.last_message_time)
  );
  const { t } = useTranslation();
  return (
    <Container
      style={{
        width: "100%",
        border: "0px solid",
        overflow: "hidden",
        backgroundColor: "var(--main-white-color)",
        paddingLeft: "0px",
        paddingRight: "0px",
      }}
      fluid
    >
      <Row
        className="upercomponent "
        style={{
          marginLeft: "0px",
          marginRight: "0px",
          paddingLeft: "10px",
          paddingRight: "0px",
        }}
      >
        <Col xs={10} className="parentforover">
          <span className="ellipsis-text">
            {t("Assign")} : {t(assignList)}
          </span>
        </Col>
        <Col xs={2} className="text-center">
          <DropdownButton
            align="start"
            id="dropdown-menu-align-end"
            show={showDropdown}
            className="custom-dropdown-button"
            onToggle={handleToggle}
            style={{ display: "flow-root" }}
            title={<DotsThreeVertical style={{ cursor: "pointer" }} />}
          >
            <Dropdown.Item
              onClick={() => {
                handleAssign(1, "All");
              }}
            >
              {t("All")}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleAssign(2, "Assign to me");
              }}
            >
              {t("Assign to me")}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleAssign(3, "Unassigned");
              }}
            >
              {t("Unassigned")}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleAssign(4, "Assigned");
              }}
            >
              {t("Assigned")}
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      <div className="borderend2" style={{ height: dynamicHeight }}>
        {loader == true ? (
          <div className="loader1">
            <Spinner
              animation="border"
              role="status"
              style={{ color: "var(--main-orange-color)" }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div style={{ height: dynamicHeight }} className="sidebarscroll">
            {sortedSidebar?.map((user, index) => {
              let imageshowpath = `${process.env.REACT_APP_FILE_BASE_URL}/${user.image}`;
              var formattedTime = moment(user.last_message_time).format(
                "Do MMM YYYY"
              );
              return (
                <Row
                  key={user._id}
                  className={
                    user._id === activeRow && active
                      ? "active-row"
                      : "parentrow"
                  }
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "10vh",
                    cursor: "pointer",
                    paddingLeft: "20px",
                  }}
                  onClick={() => handleRowClick(index, user)}
                >
                  <Col xs={2}>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {user.image ? (
                        <Image
                          src={imageshowpath}
                          style={{ width: "30px", height: "30px" }}
                          alt=""
                          roundedCircle
                        />
                      ) : (
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            background: "var(--main-orange-color)",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                          }}
                        >
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={7}>
                    <div style={{ width: "100%" }}>
                      <div className="siderbarnametext">{user.name}</div>
                      <div
                        className="forelipsislastmessage"
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          fontFamily: "krub",
                        }}
                      >
                        {/* {user.last_message} */}
                        <MediaType
                          message={user?.last_message}
                          media_type={user?.last_media_type}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col xs={3} className=" text-end">
                    <div className="text-end-style">
                      {user.unread_msg_count !== 0 ? (
                        <Badge pill className=" rounded-pill orange-badge">
                          {user?.unread_msg_count}
                        </Badge>
                      ) : (
                        <div style={{ margin: "22px 0" }}></div>
                      )}
                      <div>
                        <TimeLable
                          lastMessageTime={user.last_message_time}
                          timeFormate={formattedTime}
                          message={user}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
