import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import ImageComponent from "./ImageComponent";
import VideoComponent from "./VideoComponent";
import DocumentComponent from "./DocumentComponent";
import AudioComponent from "./AudioComponent";
import MessageContextMenu from "./MessageContextMenu";
import { toast } from "react-toastify";
import { AllEmit } from "./SocketConfig";
import ConfirmationModal from "./ConfirmationModal";
import ForwardModal from "./ForwardModal";
import { ReactComponent as SingleTick } from "../../Assets/Icon/check-yes.svg";
import { ReactComponent as DoubleTick } from "../../Assets/Icon/double-check.svg";
import { ReactComponent as Forwardicon } from "../../Assets/Icon/forwardicon.svg";
import { ReactComponent as DoubleTickBlue } from "../../Assets/Icon/double-check copy.svg";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import Googlemapimg from "../../Assets/Image/Googlemapimg.jpeg";
import { useTranslation } from "react-i18next";
import Utils from "../../utils";

function MessageShow({
  chatLoader,
  getwidth,
  allMessage,
  setAllMessage,
  selectOpen,
  setChatLoder,
  setSelectOpen,
  selectedMessages,
  setSelectedMessages,
  confirmationModal,
  setConfirmationModal,
  setDeleteGet,
  deleteGet,
  forwardModal,
  setForwardModal,
  setForwardMultiple,
  forwardMultiple,
  handleReply,
  setGetConverFull,
  replyOnclick,
  setSidebarobjget,
}) {
  const dispatch = useDispatch();
  const [DeletAllhidee, setDeletAllhidee] = useState([]);
  const getMessageobj = useRef("");
  const groupCheck = Cookies.get("isGroup");
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const user_id = Cookies.get("User_id");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [DeleteAllhide, setDeleteAllhide] = useState(false);
  let currentDate = null;
  const userID = Cookies.get("User_id");

  const handleMouseEnter = (id) => {
    setHoveredMessageId(id);
  };

  const handleMouseLeave = () => {
    setHoveredMessageId(null);
    handleToggleDropdown();
  };
  const handleIconClick = (e, message) => {
    if (user_id === message?.sender_id || user_id === message?.sender_id?._id) {
      setDeleteAllhide(true);
    } else {
      setDeleteAllhide(false);
    }
  };

  const handleDeleteMessage = (fullobject) => {
    getMessageobj.current = fullobject;
    setConfirmationModal(true);
  };
  const handleForwardMessage = (fullobject) => {
    getMessageobj.current = fullobject;
    setForwardModal(true);
  };

  useEffect(() => {
    var conversation_id = Cookies.get("conversation_id");
    if (getMessageobj.current && groupCheck == 0 && deleteGet != "") {
      setConfirmationModal(false);
      const data = {
        cid: getMessageobj.current.cid,
        isDeleteForMe: deleteGet,
        receiver_id:
          getMessageobj.current.receiver_id == conversation_id
            ? getMessageobj.current.receiver_id
            : getMessageobj.current.sender_id,
        sender_id:
          getMessageobj.current.receiver_id == conversation_id
            ? getMessageobj.current.sender_id
            : getMessageobj.current.receiver_id,
        message_ids:
          selectedMessages.length != 0
            ? selectedMessages
            : getMessageobj.current._id,
        group_id: null,
        isgroup: 0,
      };
      AllEmit("delete_message", data);
      getMessageobj.current = "";
      setDeleteGet("");
    } else if (getMessageobj.current && groupCheck == 1 && deleteGet != "") {
      setConfirmationModal(false);
      const loginuserid = Cookies.get("User_id");
      const data = {
        cid: getMessageobj.current.cid,
        isDeleteForMe: deleteGet,
        receiver_id: null,
        sender_id: loginuserid,
        message_ids:
          selectedMessages.length != 0
            ? selectedMessages
            : getMessageobj.current._id,
        group_id: getMessageobj.current.group_id,
        isgroup: 1,
      };
      AllEmit("delete_message", data);
      getMessageobj.current = "";
      setDeleteGet("");
    }
  }, [deleteGet, getMessageobj.current]);

  const renderMessages = (messages) => {
    const messageDate = new Date(messages.createdAt).toDateString();
    let dateHeader = null;

    if (messageDate !== currentDate) {
      dateHeader = getDateHeader(messageDate);

      currentDate = messageDate;
    }
    return dateHeader ? (
      <div className="text-center my-1">
        <span className="mideatypemesage">{dateHeader}</span>
      </div>
    ) : null;
  };

  const getDateHeader = (messageDate) => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate === today) {
      return t("Today");
    } else if (messageDate === yesterday.toDateString()) {
      return t("Yesterday");
    } else {
      const options = { month: "short", day: "numeric" };
      return new Date(messageDate).toLocaleDateString(undefined, options);
    }
  };
  const { t } = useTranslation();
  const handleCopyMessage = (fullobject) => {
    navigator.clipboard.writeText(fullobject.message);
    toast.success(t("Message copied!"), {
      autoClose: 2000,
    });
  };

  const handleToggleDropdown = (isOpen) => {
    setShowDropdown(isOpen);
  };

  const handleSelect = (fullobject) => {
    getMessageobj.current = fullobject;
    setSelectOpen(true);
  };

  useEffect(() => {
    if (selectOpen == true) {
      setSelectedMessages((prevSelectedMessages) => [
        ...prevSelectedMessages,
        getMessageobj.current._id,
      ]);
      setDeletAllhidee((prevSelectedMessages) => [
        ...prevSelectedMessages,
        getMessageobj.current,
      ]);
    }
  }, [selectOpen]);

  useEffect(() => {
    if (selectedMessages.length == 0 && selectOpen == true) {
      setSelectOpen(false);
      setSelectedMessages([]);
      setDeletAllhidee([]);
    }

    if (
      DeletAllhidee.length === 0 ||
      DeletAllhidee.every(
        (item) => item.sender_id === user_id || item.sender_id._id === user_id
      )
    ) {
      setDeleteAllhide(true);
    } else {
      setDeleteAllhide(false);
    }
  }, [selectedMessages]);

  const handleCheckboxChange = (val) => {
    if (
      selectOpen == true &&
      val.media_type != 8 &&
      val.media_type != 9 &&
      val.media_type != 10 &&
      val.media_type != 11 &&
      val.media_type != 12 &&
      val.media_type != 13 &&
      val.media_type != 14
    ) {
      setSelectedMessages((prevSelected) => {
        if (prevSelected.includes(val._id)) {
          var test = prevSelected.filter((messageId) => messageId !== val._id);
          return prevSelected.filter((messageId) => messageId !== val._id);
        } else {
          return [...prevSelected, val._id];
        }
      });
      setDeletAllhidee((prevSelected) => {
        if (prevSelected.includes(val)) {
          var test = prevSelected.filter((messageId) => messageId !== val._id);
          return prevSelected.filter((messageId) => messageId !== val);
        } else {
          return [...prevSelected, val];
        }
      });
    }
  };

  const extractedData = selectedUsers
    ? selectedUsers?.map((user) => ({
        receiver_id: user._id,
        isgroup: user.isGroup,
      }))
    : "";

  const ForwardMessage = () => {
    const loginuserid = Cookies.get("User_id");
    var item = getMessageobj.current;
    setForwardModal(false);
    const data = {
      sender_id: loginuserid,
      cid: item.cid,
      reciver_ids: extractedData,
      forward_message_ids:
        selectedMessages?.length != 0
          ? selectedMessages
          : getMessageobj.current._id,
    };
    AllEmit("forward_message", data);
    setForwardModal(false);
    setSelectOpen(false);
    if (selectedUsers.length == 1) {
      setChatLoder(true);
      const Conversation_Api = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_CONVERSATION_API}`;
      const isgroup = selectedUsers[0].isGroup == 1 ? "group" : "user";
      const isGroup = Cookies.set("isGroup", selectedUsers[0].isGroup);
      const addedParamConversation = `${Conversation_Api}/${isgroup}/${selectedUsers[0]._id}?page=1&size=20`;
      let Token = Cookies.get("Token");
      setSidebarobjget(selectedUsers[0]);
      Cookies.set("conversation_id", selectedUsers[0]._id);
      setAllMessage([]);
      dispatch(
        getapiAll({
          Api: addedParamConversation,
          Token: Token,
          urlof: "Conversation",
        })
      ).then((res) => {
        if (res) {
          if (res) {
            setChatLoder(false);
          } else {
            setChatLoder(true);
          }
        }
      });
    }
  };

  useEffect(() => {
    if (forwardMultiple == true) {
      setForwardModal(true);
      setForwardMultiple(false);
    }
  }, [forwardMultiple]);
  useEffect(() => {
    if (forwardModal == false) {
      setSelectedUsers([]);
    }
  }, [forwardModal]);
  const handleOpenMap = (val) => {
    var message = JSON.parse(val?.message);
    if (message?.longitude && message?.latitude) {
      const url = `https://www.google.com/maps?q=${message.latitude},${message.longitude}`;
      window.open(url, "_blank");
    }
  };

  const passHover = (val) => {
    return (
      selectOpen == false && (
        <span
          style={{
            fontSize: "11px",
            position: "relative",
            visibility: hoveredMessageId === val._id ? "visible" : "hidden",
          }}
          onClick={(e) => handleIconClick(e, val)}
        >
          <MessageContextMenu
            class1={
              val.media_type == 3
                ? "messagedropiconleft_audio"
                : "messagedropiconleft"
            }
            handleCopyMessage={handleCopyMessage}
            fullobject={val}
            handleDeleteMessage={handleDeleteMessage}
            showDropdown={showDropdown}
            handleToggleDropdown={handleToggleDropdown}
            handleSelect={handleSelect}
            handleForwardMessage={handleForwardMessage}
            handleReply={handleReply}
          />
        </span>
      )
    );
  };
  const passHover1 = (val) => {
    return (
      selectOpen == false && (
        <span
          style={{
            fontSize: "11px",
            position: "relative",
            visibility: hoveredMessageId === val._id ? "visible" : "hidden",
          }}
          onClick={(e) => handleIconClick(e, val)}
        >
          <MessageContextMenu
            // class1={"messagedropiconright"}
            class1={
              val.media_type == 3
                ? "messagedropiconleft_audio"
                : "messagedropiconright"
            }
            handleCopyMessage={handleCopyMessage}
            fullobject={val}
            handleDeleteMessage={handleDeleteMessage}
            showDropdown={showDropdown}
            handleToggleDropdown={handleToggleDropdown}
            handleSelect={handleSelect}
            handleForwardMessage={handleForwardMessage}
            handleReply={handleReply}
          />
        </span>
      )
    );
  };

  const checkMsgFormat = (msg) => {
    if (msg.includes("\n")) {
      return <pre className="pre_message">{msg}</pre>;
    } else {
      return msg;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "var(--main-white-color)",
      }}
    >
      {chatLoader ? (
        <div className="loader2" style={{ height: getwidth }}>
          <Spinner
            animation="border"
            role="status"
            style={{ color: "var(--main-orange-color)" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {allMessage
            ?.slice()
            .reverse()
            .map((val, index) => {
              const sender_id = val?.sender_id?._id
                ? val?.sender_id?._id
                : val?.sender_id;
              const url = process.env.REACT_APP_FILE_BASE_URL;
              return (
                <Row
                  style={{ width: "100%", position: "relative" }}
                  ref={messagesEndRef}
                  onMouseEnter={() => handleMouseEnter(val._id)}
                  onMouseLeave={() => handleMouseLeave(val._id)}
                  onClick={() => handleCheckboxChange(val)}
                  className={
                    selectedMessages?.find((u) => u == val._id) &&
                    selectOpen == true
                      ? "message-container activecolormessage"
                      : ""
                  }
                  id={val?._id}
                  key={val?._id}
                >
                  {/* <div style={{display:"flex"}}> */}
                  <div>{renderMessages(val)}</div>

                  {(val?.media_type == 7 ||
                    val?.media_type == 8 ||
                    val?.media_type == 9 ||
                    val?.media_type == 10 ||
                    val?.media_type == 11 ||
                    val?.media_type == 12 ||
                    val?.media_type == 13 ||
                    val?.media_type == 14) && (
                    <div className="text-center my-1">
                      <span className="mideatypemesage">{val.message}</span>{" "}
                    </div>
                  )}

                  <Col xs={12} className="py-1">
                    {user_id !== sender_id ? (
                      <div className="msg_left">
                        <div className="d-flex align-items-center">
                          {val?.group_id &&
                            val?.media_type !== 7 &&
                            val?.media_type !== 8 &&
                            val?.media_type !== 9 &&
                            val?.media_type !== 10 &&
                            val?.media_type !== 11 &&
                            val?.media_type !== 12 &&
                            val?.media_type !== 13 &&
                            val?.media_type !== 14 && (
                              <div className="msg_left_avtar">
                                {val?.sender_id?.first_name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                          <div>
                            {val?.group_id &&
                              val?.sender_id?.first_name &&
                              val?.media_type !== 7 &&
                              val?.media_type !== 8 &&
                              val?.media_type !== 9 &&
                              val?.media_type !== 10 &&
                              val?.media_type !== 11 &&
                              val?.media_type !== 12 &&
                              val?.media_type !== 13 &&
                              val?.media_type !== 14 && (
                                <p className="msg_left_sendername">
                                  {val?.sender_id?.first_name +
                                    " " +
                                    val?.sender_id?.last_name}
                                </p>
                              )}
                            {val?.media_type == 0 && val?.message_type == 0 && (
                              <div
                                className={`msg_right_width msg_left_background ${
                                  hoveredMessageId === val._id ? "hovered" : ""
                                }`}
                              >
                                {checkMsgFormat(val.message)}
                                {passHover(val)}
                              </div>
                            )}
                            {val?.message_type == 1 && (
                              <div
                                style={{
                                  background: "var(--main-hover-color)",
                                  borderRadius: "10px",
                                  padding: "5px",
                                }}
                              >
                                <div
                                  style={{
                                    padding: "10px 0px 5px 20px",
                                    display: "flex",
                                  }}
                                >
                                  <div
                                    className={`msg_right_width1 msg_right_background_replay ${
                                      hoveredMessageId === val._id
                                        ? "hovered"
                                        : ""
                                    }`}
                                    style={{
                                      background: val?.group_id
                                        ? userID === val.sender_id._id
                                          ? "var(--main-orange-color)"
                                          : "var(--main-hover-color)"
                                        : userID === val.sender_id
                                        ? "var(--main-orange-color)"
                                        : "var(--main-hover-color)",
                                      borderLeft:
                                        "3px solid var(--main-droparear2-color)",
                                      width: "100%",
                                    }}
                                    onClick={() =>
                                      replyOnclick(val?.replay_message?._id)
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <div
                                        style={{
                                          color:
                                            "var(--main-sidebarfont-color)",
                                        }}
                                      >
                                        {" "}
                                        {val?.replay_message?.sender_id ==
                                        user_id
                                          ? t("You")
                                          : val.group_id
                                          ? val.sender_id.first_name +
                                            " " +
                                            val.sender_id.last_name
                                          : val.originalName}
                                      </div>
                                      <div
                                        style={{
                                          color:
                                            "var(--main-sidebarfont-color)",
                                        }}
                                      >
                                        {val?.replay_message?.media_type == 0 &&
                                          val?.replay_message?.message}
                                        {val?.replay_message?.media_type ==
                                          1 && (
                                          <img
                                            src={
                                              url + val.replay_message?.message
                                            }
                                            style={{
                                              height: "50px",
                                              width: "50px",
                                            }}
                                          />
                                        )}
                                        {val?.replay_message?.media_type ==
                                          2 && (
                                          <video
                                            src={`${url}${val?.replay_message?.message}`}
                                            alt=""
                                            style={{
                                              height: "50px",
                                              width: "50px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        )}
                                        {val?.replay_message?.media_type ==
                                          3 && <div>{t("Audio")}</div>}
                                        {val?.replay_message?.media_type ==
                                          4 && <div>{t("Document")}</div>}
                                        {val?.replay_message?.media_type ==
                                          6 && <div>{t("Location")}</div>}
                                      </div>
                                    </div>
                                  </div>
                                  {passHover(val)}
                                </div>
                                <div
                                  style={{
                                    color: "var(--main-sidebarfont-color)",
                                    padding: "0px 20px",
                                    wordBreak: "break-word",
                                    maxWidth: "500px",
                                  }}
                                >
                                  {val.media_type == 0 &&
                                    checkMsgFormat(val.message)}
                                  {val.media_type == 1 && (
                                    <div className="chat_img_left">
                                      <ImageComponent
                                        message={val}
                                        selectOpen={selectOpen}
                                      />
                                    </div>
                                  )}
                                  {val.media_type == 2 && (
                                    <div className="chat_img_left">
                                      <VideoComponent
                                        message={val}
                                        currentlyPlaying={currentlyPlaying}
                                        setCurrentlyPlaying={
                                          setCurrentlyPlaying
                                        }
                                        selectOpen={selectOpen}
                                      />
                                    </div>
                                  )}
                                  {val.media_type == 3 && (
                                    <div className="chat_img_left">
                                      <AudioComponent
                                        message={val}
                                        currentlyPlaying={currentlyPlaying}
                                        setCurrentlyPlaying={
                                          setCurrentlyPlaying
                                        }
                                        passhover={passHover(val)}
                                      />
                                    </div>
                                  )}
                                  {val.media_type == 4 && (
                                    <div className="chat_doc_left">
                                      <DocumentComponent message={val} />
                                    </div>
                                  )}
                                  {val.media_type == 6 && (
                                    <div
                                      className="p-0 message-content"
                                      style={{
                                        cursor: "pointer",
                                        background: " var(--main-hover-color)",
                                        display: "flex",
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <div
                                        className="message-text"
                                        style={{
                                          color: "black",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <img
                                          src={Googlemapimg}
                                          onClick={() => handleOpenMap(val)}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {val?.media_type == 0 && val?.message_type == 2 && (
                              <div
                                className={`msg_right_width msg_left_background ${
                                  hoveredMessageId === val._id ? "hovered" : ""
                                }`}
                                style={{ flexDirection: "column" }}
                              >
                                <div
                                  style={{
                                    color: "var(--main-adminheaderpage-color)",
                                    fontSize: "10px",
                                  }}
                                >
                                  {" "}
                                  <Forwardicon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      fill: "var(--main-adminheaderpage-color)",
                                    }}
                                  />
                                  <span style={{ fontStyle: "italic" }}>
                                    {t("Forwarded")}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  {checkMsgFormat(val.message)}
                                  {passHover(val)}
                                </div>
                              </div>
                            )}
                            {val?.media_type == 6 && val?.message_type == 0 && (
                              <div
                                className="message-content"
                                style={{
                                  cursor: "pointer",
                                  background: " var(--main-hover-color)",
                                  display: "flex",
                                  borderRadius: "10px",
                                }}
                              >
                                <div
                                  className="message-text"
                                  style={{
                                    color: "black",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={Googlemapimg}
                                    onClick={() => handleOpenMap(val)}
                                  />
                                </div>
                                {passHover(val)}
                              </div>
                            )}
                            {val?.media_type == 6 && val?.message_type == 2 && (
                              <div
                                className="message-content"
                                style={{
                                  cursor: "pointer",
                                  background: " var(--main-hover-color)",
                                  display: "flex",
                                  borderRadius: "10px",
                                }}
                              >
                                <div>
                                  <div
                                    className="pb-1"
                                    style={{
                                      color:
                                        "var(--main-adminheaderpage-color)",
                                      fontSize: "10px",
                                    }}
                                  >
                                    {" "}
                                    <Forwardicon
                                      style={{
                                        height: "15px",
                                        width: "15px",
                                        fill: "var(--main-adminheaderpage-color)",
                                      }}
                                    />
                                    <span style={{ fontStyle: "italic" }}>
                                      {t("Forwarded")}
                                    </span>
                                  </div>
                                  <div
                                    className="message-text"
                                    style={{
                                      color: "black",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={Googlemapimg}
                                      onClick={() => handleOpenMap(val)}
                                    />
                                  </div>
                                </div>
                                {passHover(val)}
                              </div>
                            )}
                            {val?.media_type == 1 && val?.message_type == 0 && (
                              <div className="chat_img_left">
                                <ImageComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  selectOpen={selectOpen}
                                />
                              </div>
                            )}
                            {val?.media_type == 1 && val?.message_type == 2 && (
                              <div className="chat_img_left">
                                <ImageComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  forward={true}
                                  selectOpen={selectOpen}
                                />
                              </div>
                            )}
                            {val?.media_type == 2 && val?.message_type == 0 && (
                              <div className="chat_img_left">
                                <VideoComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                  selectOpen={selectOpen}
                                />
                              </div>
                            )}
                            {val?.media_type == 2 && val?.message_type == 2 && (
                              <div className="chat_img_left">
                                <VideoComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  forward={true}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                  selectOpen={selectOpen}
                                />
                              </div>
                            )}
                            {val?.media_type == 4 && val?.message_type == 0 && (
                              <div className="chat_doc_left">
                                <DocumentComponent
                                  message={val}
                                  passhover={passHover(val)}
                                />
                              </div>
                            )}
                            {val?.media_type == 4 && val?.message_type == 2 && (
                              <div className="chat_doc_left">
                                <DocumentComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  forward={true}
                                />
                              </div>
                            )}
                            {val?.media_type == 3 && val?.message_type == 0 && (
                              <div className="chat_img_left">
                                <AudioComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                />
                              </div>
                            )}
                            {val?.media_type == 3 && val?.message_type == 2 && (
                              <div className="chat_img_left">
                                <AudioComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  forward={true}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                />
                              </div>
                            )}
                            {val?.media_type !== 7 &&
                              val?.media_type !== 8 &&
                              val?.media_type !== 9 &&
                              val?.media_type !== 10 &&
                              val?.media_type !== 11 &&
                              val?.media_type !== 12 &&
                              val?.media_type !== 13 &&
                              val?.media_type !== 14 && (
                                <p className="msg_left_time">
                                  {moment(val?.createdAt).format("LT")}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      //rightttttttttt
                      <div className="msg_right">
                        <div className="d-flex align-items-center">
                          <div>
                            {val?.media_type == 0 && val?.message_type == 0 && (
                              <div
                                className={`msg_right_width1 msg_right_background ${
                                  hoveredMessageId === val._id ? "hovered" : ""
                                }`}
                              >
                                {checkMsgFormat(val.message)}
                                {passHover1(val)}
                              </div>
                            )}
                            {val?.message_type == 1 && (
                              <div
                                style={{
                                  background: "var(--main-orange-color)",
                                  borderRadius: "10px",
                                  padding: "5px",
                                }}
                              >
                                <div
                                  style={{
                                    padding: "10px 0px 5px 20px",
                                    display: "flex",
                                  }}
                                >
                                  <div
                                    className={`msg_right_width1 msg_right_background_replay ${
                                      hoveredMessageId === val._id
                                        ? "hovered"
                                        : ""
                                    }`}
                                    style={{
                                      background: val?.group_id
                                        ? userID === val.sender_id._id
                                          ? "var(--main-orange-color)"
                                          : "var(--main-hover-color)"
                                        : userID === val.sender_id
                                        ? "var(--main-orange-color)"
                                        : "var(--main-hover-color)",
                                      borderLeft:
                                        "3px solid var(--main-droparear2-color)",
                                      width: "100%",
                                    }}
                                    onClick={() =>
                                      replyOnclick(val?.replay_message?._id)
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        color:"var(--main-droparear2-color)"
                                      }}
                                    >
                                      <div>
                                        {" "}
                                        {val?.replay_message?.sender_id ==
                                        user_id
                                          ? t("You")
                                          : val.group_id
                                          ? val.sender_id.first_name +
                                            " " +
                                            val.sender_id.last_name
                                          : val.originalName}
                                      </div>
                                      <div
                                        style={{
                                          color: "var(--main-btninfo-color)",
                                          maxWidth: "100%",
                                        }}
                                      >
                                        {val?.replay_message?.media_type ==
                                          0 && (
                                          <span>
                                            {val?.replay_message?.message}
                                          </span>
                                        )}
                                        {val?.replay_message?.media_type ==
                                          1 && (
                                          <img
                                            src={
                                              url + val.replay_message?.message
                                            }
                                            style={{
                                              height: "50px",
                                              width: "50px",
                                            }}
                                          />
                                        )}
                                        {val?.replay_message?.media_type ==
                                          2 && (
                                          <video
                                            src={`${url}${val?.replay_message?.message}`}
                                            alt=""
                                            style={{
                                              height: "50px",
                                              width: "50px",
                                            }}
                                          />
                                        )}
                                        {val?.replay_message?.media_type ==
                                          3 && <div>{t("Audio")}</div>}
                                        {val?.replay_message?.media_type ==
                                          4 && <div>{t("Document")}</div>}
                                        {val?.replay_message?.media_type ==
                                          6 && <div>{t("Location")}</div>}
                                      </div>
                                    </div>
                                  </div>
                                  {passHover1(val)}
                                </div>
                                <div
                                  style={{
                                    color: "var(--main-droparear2-color)",
                                    padding: "0px 20px",
                                    wordBreak: "break-word",
                                    maxWidth: "500px",
                                  }}
                                >
                                  {val.media_type == 0 &&
                                    checkMsgFormat(val.message)}
                                  {val.media_type == 1 && (
                                    <div className="chat_img_right">
                                      <ImageComponent
                                        message={val}
                                        selectOpen={selectOpen}
                                      />
                                    </div>
                                  )}
                                  {val.media_type == 2 && (
                                    <div className="chat_img_right">
                                      <VideoComponent
                                        message={val}
                                        currentlyPlaying={currentlyPlaying}
                                        setCurrentlyPlaying={
                                          setCurrentlyPlaying
                                        }
                                        selectOpen={selectOpen}
                                      />
                                    </div>
                                  )}
                                  {val.media_type == 3 && (
                                    <div className="chat_img_left">
                                      <AudioComponent
                                        message={val}
                                        currentlyPlaying={currentlyPlaying}
                                        setCurrentlyPlaying={
                                          setCurrentlyPlaying
                                        }
                                      />
                                    </div>
                                  )}
                                  {val.media_type == 4 && (
                                    <div className="chat_doc_right">
                                      <DocumentComponent message={val} />
                                    </div>
                                  )}
                                  {val.media_type == 6 && (
                                    <div
                                      className="p-0 message-content"
                                      style={{
                                        cursor: "pointer",
                                        background: "var(--main-orange-color)",
                                        display: "flex",
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <div
                                        className="message-text"
                                        style={{
                                          color: "black",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <img
                                          src={Googlemapimg}
                                          onClick={() => handleOpenMap(val)}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {val?.media_type == 6 && val?.message_type == 0 && (
                              <div
                                className="message-content"
                                style={{
                                  cursor: "pointer",
                                  background: "var(--main-orange-color)",
                                  display: "flex",
                                  borderRadius: "10px",
                                }}
                              >
                                <div
                                  className="message-text"
                                  style={{
                                    color: "black",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={Googlemapimg}
                                    onClick={() => handleOpenMap(val)}
                                  />
                                </div>
                                {passHover1(val)}
                              </div>
                            )}
                            {val?.media_type == 6 && val?.message_type == 2 && (
                              <div
                                className="message-content"
                                style={{
                                  cursor: "pointer",
                                  background: "var(--main-orange-color)",
                                  display: "flex",
                                  borderRadius: "10px",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      color: "var(--main-white-color)",
                                      fontSize: "10px",
                                    }}
                                  >
                                    {" "}
                                    <Forwardicon
                                      style={{
                                        height: "15px",
                                        width: "15px",
                                        fill: "white",
                                      }}
                                    />
                                    <span style={{ fontStyle: "italic" }}>
                                      {t("Forwarded")}
                                    </span>
                                  </div>
                                  <div
                                    className="message-text"
                                    style={{
                                      color: "black",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={Googlemapimg}
                                      onClick={() => handleOpenMap(val)}
                                    />
                                  </div>
                                </div>
                                {passHover1(val)}
                              </div>
                            )}
                            {val?.media_type == 0 && val?.message_type == 2 && (
                              <div
                                className={`msg_right_width1 msg_right_background ${
                                  hoveredMessageId === val._id ? "hovered" : ""
                                }`}
                                style={{ flexDirection: "column" }}
                              >
                                <div
                                  style={{ color: "white", fontSize: "10px" }}
                                >
                                  {" "}
                                  <Forwardicon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      fill: "white",
                                    }}
                                  />
                                  <span style={{ fontStyle: "italic" }}>
                                    {t("Forwarded")}
                                  </span>
                                </div>
                                <div className="d-flex">
                                  {checkMsgFormat(val.message)}
                                  {passHover1(val)}
                                </div>
                              </div>
                            )}
                            {val?.media_type == 1 && val?.message_type == 0 && (
                              <div className="chat_img_right">
                                <ImageComponent
                                  message={val}
                                  passhover1={passHover1(val)}
                                  selectOpen={selectOpen}
                                />
                              </div>
                            )}
                            {val?.media_type == 1 && val?.message_type == 2 && (
                              <div className="chat_img_right_f">
                                <ImageComponent
                                  message={val}
                                  passhover1={passHover1(val)}
                                  forward={true}
                                  selectOpen={selectOpen}
                                />
                              </div>
                            )}
                            {val?.media_type == 2 && val?.message_type == 0 && (
                              <div className="chat_img_right">
                                <VideoComponent
                                  message={val}
                                  passhover1={passHover1(val)}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                  selectOpen={selectOpen}
                                />
                              </div>
                            )}
                            {val?.media_type == 2 && val?.message_type == 2 && (
                              <div className="chat_img_right">
                                <VideoComponent
                                  message={val}
                                  passhover1={passHover1(val)}
                                  forward={true}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                  selectOpen={selectOpen}
                                />
                              </div>
                            )}
                            {val?.media_type == 4 && val?.message_type == 0 && (
                              <div className="chat_doc_right">
                                <DocumentComponent
                                  message={val}
                                  passhover1={passHover1(val)}
                                />
                              </div>
                            )}
                            {val?.media_type == 4 && val?.message_type == 2 && (
                              <div className="chat_doc_right">
                                <DocumentComponent
                                  message={val}
                                  passhover1={passHover1(val)}
                                  forward={true}
                                />
                              </div>
                            )}
                            {val?.media_type == 3 && val?.message_type == 0 && (
                              <div className="">
                                <AudioComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                />
                              </div>
                            )}
                            {val?.media_type == 3 && val?.message_type == 2 && (
                              <div className="">
                                <AudioComponent
                                  message={val}
                                  passhover={passHover(val)}
                                  forward={true}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                />
                              </div>
                            )}
                            {val?.media_type !== 7 &&
                              val?.media_type !== 8 &&
                              val?.media_type !== 9 &&
                              val?.media_type !== 10 &&
                              val?.media_type !== 11 &&
                              val?.media_type !== 12 &&
                              val?.media_type !== 13 &&
                              val?.media_type !== 14 && (
                                <div className="d-flex align-items-center justify-content-end">
                                  <p className="msg_right_time">
                                    {Utils.timeDisplay(moment(val?.createdAt).toDate())}
                                  </p>
                                  {val?.delivery_type === 1 ? (
                                    <SingleTick className="single_tick" />
                                  ) : val?.delivery_type === 2 ? (
                                    <DoubleTick className="single_tick" />
                                  ) : (
                                    <DoubleTickBlue className="single_tick" />
                                  )}
                                </div>
                              )}
                          </div>
                          {val?.group_id &&
                            val?.media_type !== 7 &&
                            val?.media_type !== 8 &&
                            val?.media_type !== 9 &&
                            val?.media_type !== 10 &&
                            val?.media_type !== 11 &&
                            val?.media_type !== 12 &&
                            val?.media_type !== 13 &&
                            val?.media_type !== 14 && (
                              <div className="msg_right_avtar">
                                {val?.sender_id?.first_name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              );
            })}
        </>
      )}
      {confirmationModal == true && (
        <ConfirmationModal
          title={t("Delete Message")}
          body={t("Are you sure you want to delete message?")}
          button1={t("Delete for me")}
          button2={DeleteAllhide == true ? t("Delete for all") : ""}
          confirmationModal={confirmationModal}
          setConfirmationModal={setConfirmationModal}
          button1function={setDeleteGet}
          button2function={setDeleteGet}
        />
      )}
      {forwardModal == true && (
        <ForwardModal
          forwardModal={forwardModal}
          setForwardModal={setForwardModal}
          ForwardMessage={ForwardMessage}
          setSelectedUsers={setSelectedUsers}
          selectedUsers={selectedUsers}
        />
      )}
    </div>
  );
}

export default MessageShow;
