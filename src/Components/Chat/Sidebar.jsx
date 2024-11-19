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
import "./chat.css";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { ReactComponent as Search } from "../../Assets/Icon/search.svg";
import { ReactComponent as Chatnew } from "../../Assets/Icon/new_chat.svg";
import { useDispatch, useSelector } from "react-redux";
import TimeLable from "../TimeLable";
import moment from "moment";
import Cookies from "js-cookie";
import { getapiAll, msgUnreadCount } from "../../Redux/Reducers/ApiServices";
import { openChat, openSidebar } from "../../Redux/Reducers/DataServices";
import Spinner from "react-bootstrap/Spinner";
import MediaType from "./MediaType";
import CreateGroup from "./CreateGroup";
import { AllEmit } from "./SocketConfig";
import { useTranslation } from "react-i18next";

export default function Sidebar({
  setSidebarobjget,
  setChatLoder,
  setSelectOpen,
  setGetReply,
  setSideClick,
  setAllMessage,
  setLoader,
  loader,
  setCurrentPage,
  setadmincanmsg,
  currentPage,
}) {
  const { t } = useTranslation();

  ///Api Config //
  const Conversation_Api = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_CONVERSATION_API}`;
  const NewConversation = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_NEW_CONVERSATION}`;
  const Sidebarapi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_MOBIILILINJA_SIDEBAR}`;
  let Token = Cookies.get("Token");

  ///// ////

  const dispatch = useDispatch();
  const Sidebar = useSelector((state) => state.getapiall.getapiall.Sidebar);
  const sortedSidebar = [...Sidebar].sort(
    (a, b) => new Date(b.last_message_time) - new Date(a.last_message_time)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const cid = Cookies.get("Company_Id");
  const uid = Cookies.get("User_id");

  const NewConversationdata = useSelector(
    (state) => state.getapiall.getapiall.NewConversation
  );
  const [activeRow, setActiveRow] = useState(null);
  const [newChatshow, setNewChatshow] = useState(false);
  const screensize = window.innerWidth > 991;
  const [groupOpen, setGroupOpen] = useState(false);
  const [dynamicNew, setDynamicNew] = useState(0);
  const [dynamicHeight, setDynamicHeight] = useState(0);

  const activeConversationId = Cookies.get("conversation_id");
  const abortControllerRef = useRef(null);
  const abortControllerRef_user = useRef(null);
  useEffect(() => {
    setActiveRow(activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 992) {
        Cookies.remove("conversation_id");
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 992) {
        Cookies.remove("conversation_id");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleRowClick = (index, user) => {
    setadmincanmsg(false);
    setCurrentPage(1);
    if (user._id == activeConversationId) return;

    const data = {
      receiver_id: user._id,
      uid: uid,
      cid: user.cid,
    };
    if (user?.isGroup == "0") {
      AllEmit("user_online_status", data);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setSideClick(true);
    setChatLoder(true);
    const isgroup = user.isGroup == 1 ? "group" : "user";
    Cookies.set("isGroup", user.isGroup == 1 ? 1 : 0);
    const addedParamConversation = `${Conversation_Api}/${isgroup}/${user._id}?page=1&size=20`;
    dispatch(msgUnreadCount({ _id: user._id, count: 0, key: 1 }));
    setSelectOpen(false);
    setGetReply("");

    const readAllMsg = {
      uid: uid,
      recevier_id: user._id,
      isgroup: user.isGroup,
      cid: cid,
    };
    AllEmit("read_all_delivered_message", readAllMsg);

    dispatch(
      getapiAll({
        Api: addedParamConversation,
        Token: Token,
        urlof: "Conversation",
        signal: abortController.signal,
      })
    )
      .then((res) => {
        if (res) {
          if (res.error.message == "canceled") {
            setChatLoder(true);
          } else {
            setChatLoder(false);
          }
          const MessageDeleveryStatus =
            res?.payload?.response?.conversationsData;
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
        } else {
          setChatLoder(false);
        }
      });

    Cookies.set("conversation_id", user?._id);
    if (screensize) {
      setSidebarobjget(user);
    } else {
      setSidebarobjget(user);
      dispatch(openChat(true));
      dispatch(openSidebar(false));
    }
    setActiveRow(user?._id);
  };
  useEffect(() => {
    setActiveRow(activeConversationId);
  }, [activeConversationId]);
  const userID = Cookies.get("User_id");
  const handleNewRowClick = (index, user) => {
    Cookies.set("new_chat", JSON.stringify(user));
    const user_detail = {
      cid: user.cid,
      receiver_id: user._id,
      uid: userID,
    };
    AllEmit("user_online_status", user_detail);
    setNewChatshow(false);
    Cookies.set("isGroup", user.isGroup == 1 ? 1 : 0);

    setChatLoder(true);
    const addedParamConversation = `${Conversation_Api}/user/${user._id}?page=1&size=20`;
    dispatch(
      getapiAll({
        Api: addedParamConversation,
        Token: Token,
        urlof: "Conversation",
      })
    )
      .then((res) => {
        if (res) return setChatLoder(false);
      })
      .catch((err) => {
        return setChatLoder(true);
      });
    Cookies.set("conversation_id", user?._id);

    if (screensize) {
      setSidebarobjget(user);
    } else {
      setSidebarobjget(user);
      dispatch(openChat(true));
      dispatch(openSidebar(false));
    }
  };

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

  const Draweropen = () => {
    if (abortControllerRef_user.current) {
      abortControllerRef_user.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef_user.current = abortController;
    setNewChatshow(true);
    setLoader(true);
    dispatch(
      getapiAll({
        Api: NewConversation,
        Token: Token,
        urlof: "NewConversation",
        signal: abortController.signal,
      })
    )
      .then((res) => {
        if (res) return setLoader(false);
      })
      .catch((err) => {
        return setLoader(true);
      });
  };

  const Drawerclose = () => {
    setNewChatshow(false);
    setGroupOpen(false);
  };

  const ceateGroup = () => {
    setNewChatshow(false);
    setGroupOpen(true);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSidebarData = useMemo(() => {
    if (!searchQuery) return sortedSidebar;
    return sortedSidebar.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sortedSidebar]);
  const filteredSidebarData1 = useMemo(() => {
    if (!searchQuery) return NewConversationdata;
    return NewConversationdata.filter((item) =>
      item.first_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, NewConversationdata]);

  return (
    <Container
      style={{
        width: "100%",
        border: "0px solid",
        overflow: "hidden",
        backgroundColor: "var(--main-white-color)",
      }}
      fluid
    >
      <Row className="upercomponent ">
        <Col xs={10} className="parentforover">
          <InputGroup>
            <InputGroup.Text id="basic-addon1">
              <Search className="searchIcon" />
            </InputGroup.Text>
            <Form.Control
              placeholder={t("Search Conversation")}
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={handleSearchChange}
              className="emailforminput"
            />
          </InputGroup>
        </Col>
        <Col xs={2} className="text-center">
          {newChatshow == true || groupOpen == true ? (
            <Closeicon width={25} onClick={Drawerclose} height={25} />
          ) : (
            <Chatnew className="messageicon" onClick={Draweropen} />
          )}
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
        ) : Sidebar && newChatshow == false && groupOpen == false ? (
          <div style={{ height: dynamicHeight }} className="sidebarscroll">
            {Sidebar &&
              filteredSidebarData?.map((user, index) => {
                let imageshowpath = `${process.env.REACT_APP_FILE_BASE_URL}/${
                  user.image || user.user_image
                }`;
                var formattedTime = moment(user.last_message_time).format(
                  "Do MMM YYYY"
                );
                return (
                  <Row
                    key={user._id}
                    className={
                      user._id === activeRow ? "active-row" : "parentrow"
                    }
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "70px",
                      cursor: "pointer",
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
                        {user.image || user.user_image ? (
                          <Image
                            src={imageshowpath}
                            style={{ width: "40px", height: "40px" }}
                            alt=""
                            roundedCircle
                          />
                        ) : (
                          <div className="datedisplayname">
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
                            fontSize: "13px",
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
                        <TimeLable
                          lastMessageTime={user.last_message_time}
                          timeFormate={formattedTime}
                          message={user}
                        />
                        {user.unread_msg_count !== 0 && (
                          <Badge pill className=" rounded-pill orange-badge">
                            {user?.unread_msg_count}
                          </Badge>
                        )}
                      </div>
                    </Col>
                  </Row>
                );
              })}
          </div>
        ) : newChatshow == true && groupOpen == false ? (
          <div className="">
            <div className="my-3 mx-4 ">
              <Button className="create-group-btn" onClick={ceateGroup}>
                {t("Create Group")}
              </Button>
            </div>
            <div
              style={{ height: dynamicNew, overflow: "auto", width: "100%" }}
            >
              {NewConversationdata &&
                filteredSidebarData1?.map((user, index) => {
                  let imageshowpath = `${process.env.REACT_APP_FILE_BASE_URL}/${user.user_image}`;
                  // var formattedTime = moment(user.lastMessageTime).format('Do MMM YYYY');
                  const fullname = user?.first_name + " " + user?.last_name;

                  return (
                    <Row
                      key={user._id}
                      className={`parentrow ${
                        index === activeRow ? "active-row" : ""
                      }`}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleNewRowClick(index, user)}
                    >
                      <Col xs={3}>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {user.user_image || user.image ? (
                            <Image
                              src={imageshowpath}
                              style={{ width: "40px", height: "40px" }}
                              alt=""
                              roundedCircle
                            />
                          ) : (
                            <div
                              style={{
                                width: "30px",
                                height: "30px",
                                background: "var(--main-orange-color)",
                                borderRadius: "50px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                              }}
                            >
                              {user.first_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col xs={9}>
                        <div style={{ width: "100%" }}>
                          <div
                            style={{
                              fontSize: "15px",
                              color: "var(--main-adminnumberheader-color)",
                              fontWeight: "600",
                              fontFamily: "krub",
                              textTransform: "capitalize",
                            }}
                          >
                            {fullname}
                          </div>
                          <div
                            className="forelipsislastmessage"
                            style={{
                              fontSize: "13px",
                              color: "var(--main-forwardmodal-color)",
                              fontWeight: "600",
                              fontFamily: "krub",
                            }}
                          >
                            {user.last_message}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  );
                })}
            </div>
          </div>
        ) : (
          <CreateGroup Drawerclose={Drawerclose} />
        )}
      </div>
    </Container>
  );
}
