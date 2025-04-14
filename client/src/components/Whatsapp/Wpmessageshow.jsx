import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  Button,
  Col,
  Modal,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import ImageComponent from "../Chat/ImageComponent";
import VideoComponent from "../Chat/VideoComponent";
import AudioComponent from "../Chat/AudioComponent";
import DocumentComponent from "../Chat/DocumentComponent";
import moment from "moment";
import { ReactComponent as SingleTick } from "../../Assets/Icon/check-yes.svg";
import { ReactComponent as DoubleTick } from "../../Assets/Icon/double-check.svg";
import { ReactComponent as DoubleTickBlue } from "../../Assets/Icon/double-check copy.svg";
import { WhatsappContextMenu } from "./WhatsappContextMenu";
import { toast } from "react-toastify";
import { AllWhatsappEmit } from "./Whatsappsocketconfig";
import ConfirmationModal from "../Chat/ConfirmationModal";
import { ReactComponent as ErrorMessage } from "../../Assets/Icon/errorMessage.svg";
import { ReactComponent as Openmap } from "../../Assets/Icon/openmap.svg";
// import mapplaceholder from "../../Assets/Image/mapplaceholder.png"
import Googlemapimg from "../../Assets/Image/Googlemapimg.jpeg";
import Avatar from "../../Assets/Icon/Avatar.svg";
import { ReactComponent as Voicecall } from "../../Assets/Icon/callmake.svg";
import { useTranslation } from "react-i18next";

export default function Chat({
  chatLoader,
  allMessages,
  mediaLoader,
  loading,
  replyOnclick,
  setGetReply,
  setReplyShow,
}) {
  const chatOpen = Cookies.get("conversation_id");
  const messagePass = useRef("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const handleClose = () => setShowModal(false);
  const conversation_id = Cookies.get("conversation_id");
  const cid = Cookies.get("Company_Id");
  const [confirmationModal, setConfirmationModal] = useState();
  const handleRightClick = (event, message) => {
    event.preventDefault(); // Prevent the default context menu from showing
    setModalData(message); // Set the data you want to pass to the modal
    setShowModal(true); // Show the modal
  };
  let url = process.env.REACT_APP_MOBIILILINJA_FILE_BASE_URL;
  let currentDate = null;

  const checkMsgFormat = (msg) => {
    if (msg.includes("\n")) {
      return <pre className="pre_message">{msg}</pre>;
    } else {
      return msg;
    }
  };
  const { t } = useTranslation();
  const handleToggleDropdown = (isOpen) => {
    setShowModal(isOpen);
  };
  const handleDeleteMessage = (message) => {
    setConfirmationModal(true);
    messagePass.current = message.message_id;
  };

  const DeleteMessage = () => {
    const data = {
      cid: cid,
      receiver_id: conversation_id,
      message_id: messagePass.current,
    };
    AllWhatsappEmit("delete_message", data);
    setConfirmationModal(false);
  };
  const handleCopyMessage = (fullobject) => {
    navigator.clipboard.writeText(fullobject.message);
    toast.success(t("Message copied!"), {
      autoClose: 2000,
    });
  };
  const handleReplyMessage = (val) => {
    setGetReply(val);
    setReplyShow(true);
  };
  const passHover = (val) => {
    return (
      <span
        style={{
          fontSize: "11px",
          position: "relative",
          visibility:
            modalData?.message_id === val?.message_id ? "visible" : "hidden",
          zIndex: "1000",
        }}
      >
        <WhatsappContextMenu
          class1={"messagedropiconleft"}
          showModal={showModal}
          handleToggleDropdown={handleToggleDropdown}
          setShowModal={setShowModal}
          handleDeleteMessage={handleDeleteMessage}
          handleCopyMessage={handleCopyMessage}
          value={val}
          handleReplyMessage={handleReplyMessage}
        />
      </span>
    );
  };

  const passHover1 = (val) => {
    return (
      <span
        style={{
          fontSize: "11px",
          position: "relative",
          visibility:
            modalData?.message_id === val?.message_id ? "visible" : "hidden",
          zIndex: "1000",
        }}
      >
        <WhatsappContextMenu
          class1={"messagedropiconright"}
          showModal={showModal}
          handleToggleDropdown={handleToggleDropdown}
          setShowModal={setShowModal}
          handleDeleteMessage={handleDeleteMessage}
          handleCopyMessage={handleCopyMessage}
          value={val}
          handleReplyMessage={handleReplyMessage}
        />
      </span>
    );
  };
  const renderTooltip = (message) => {
    return <Tooltip id="button-tooltip">{message}</Tooltip>;
  };

  const handleOpenMap = (message) => {
    if (message?.longitude && message?.latitude) {
      const url = `https://www.google.com/maps?q=${message.latitude},${message.longitude}`;
      window.open(url, "_blank");
    }
  };

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

  return (
    <div className="chat-container">
      {chatLoader == true ? (
        <div className="loader2" style={{ height: "60vh" }}>
          <Spinner
            animation="border"
            role="status"
            style={{ color: "var(--main-orange-color)" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        allMessages
          ?.slice()
          .reverse()
          .map((message) => (
            <Row
              style={{ width: "100%" }}
              key={message.message_id}
              className={
                chatOpen == message.sender_id
                  ? `message sent`
                  : "message received"
              }
              id={message.message_id}
            >
              {renderMessages(message)}
              <Col xs={12}>
                {chatOpen == message.sender_id ? (
                  <>
                    <div
                      className="msg_left"
                      style={{
                        alignItems: "end",
                        margin: "10px 10px 0px 10px",
                      }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          background: "var(--main-messagesent-color)",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "black",
                        }}
                      >
                        {message?.user_name?.charAt(0)?.toUpperCase() ||
                          message?.user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div onContextMenu={(e) => handleRightClick(e, message)}>
                        {message?.media_type == 0 &&
                          message?.message_type == 0 && (
                            <div className="message-content">
                              <div
                                className="message-text"
                                style={{ color: "black" }}
                              >
                                {checkMsgFormat(message?.message)}
                                {passHover(message)}
                              </div>
                            </div>
                          )}
                        {message?.media_type == 6 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{ cursor: "pointer" }}
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
                                  //  style={{ height: "20px", width: "20px" }}
                                  onClick={() =>
                                    handleOpenMap(message?.message)
                                  }
                                />
                                {/* <span style={{ marginLeft: "10px", marginRight: "10px", fontSize: "16px", fontWeight: "700" }}>Location</span> */}
                                {/* <Openmap style={{ height: "20px", width: "20px", fill: "white !important", color: "white" }} onClick={() => handleOpenMap(message?.message)} /> */}
                              </div>
                            </div>
                          )}
                        {message?.media_type == 5 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{ cursor: "pointer" }}
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
                                  src={Avatar}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                <span
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                  }}
                                >
                                  {message.message[0].name.first_name}
                                </span>
                                <Voicecall
                                  style={{
                                    height: "20px",
                                    width: "20px",
                                    fill: "black !important",
                                    color: "black",
                                  }}
                                />
                              </div>
                              <div>{message?.message[0]?.phones[0]?.phone}</div>
                            </div>
                          )}
                        {message.media_type == 1 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var(--main-messagesent-color)",
                              }}
                            >
                              <div className="chat_img_left whatsapp_border">
                                <ImageComponent
                                  message={message}
                                  selectOpen={selectOpen}
                                  passHover={message}
                                />
                              </div>
                            </div>
                          )}
                        {message.media_type == 2 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var(--main-messagesent-color)",
                              }}
                            >
                              <div className="chat_img_left whatsapp_border">
                                <VideoComponent
                                  message={message}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                  selectOpen={selectOpen}
                                  passHover={message}
                                />
                              </div>
                            </div>
                          )}
                        {message.media_type == 3 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var(--main-messagesent-color)",
                              }}
                            >
                              <div className="chat_img_right whatsapp_border">
                                <AudioComponent
                                  message={message}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                  passHover={message}
                                />
                              </div>
                            </div>
                          )}
                        {message.media_type == 4 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var(--main-messagesent-color)",
                              }}
                            >
                              <div className="chat_doc_left p-0 ps-3">
                                <DocumentComponent
                                  message={message}
                                  passHover={message}
                                />
                              </div>
                            </div>
                          )}
                        {message?.message_type == 1 && (
                          <div
                            className="message-content"
                            style={{
                              background: "var(--main-messagesent-color)",
                            }}
                          >
                            <div style={{ display: "flex" }}>
                              <div
                                className={`msg_right_width1 msg_right_background `}
                                style={{
                                  background:
                                    "var(--main-messageshowopacity-color)",
                                  borderLeft: "2px solid white",

                                  width: "100%",
                                }}
                                onClick={() =>
                                  replyOnclick(message?.reply_message_id)
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
                                      color: "var(--main-sidebarfont-color)",
                                    }}
                                  >
                                    {" "}
                                    {message?.replay_message?.user_name}
                                  </div>
                                  <div
                                    style={{
                                      color: "var(--main-sidebarfont-color)",
                                      maxWidth: "100%",
                                    }}
                                  >
                                    {message?.replay_message?.media_type ==
                                      0 && (
                                      <span>
                                        {message?.replay_message?.message}
                                      </span>
                                    )}
                                    {message?.replay_message?.media_type ==
                                      1 && (
                                      <img
                                        src={
                                          url + message.replay_message?.message
                                        }
                                        style={{
                                          height: "50px",
                                          width: "50px",
                                        }}
                                      />
                                    )}
                                    {message?.replay_message?.media_type ==
                                      2 && (
                                      <video
                                        src={`${url}${message?.replay_message?.message}`}
                                        alt=""
                                        style={{
                                          height: "50px",
                                          width: "50px",
                                        }}
                                      />
                                    )}
                                    {message?.replay_message?.media_type ==
                                      3 && <div>{t("Audio")}</div>}
                                    {message?.replay_message?.media_type ==
                                      4 && <div>{t("Document")}</div>}
                                  </div>
                                </div>
                              </div>
                              {passHover(message)}
                            </div>
                            <div
                              style={{
                                color: "var(--main-sidebarfont-color)",
                                wordBreak: "break-word",
                                maxWidth: "500px",
                              }}
                            >
                              {message.media_type == 0 &&
                                checkMsgFormat(message.message)}
                              {message.media_type == 1 && (
                                <div className="chat_img_left">
                                  <ImageComponent
                                    message={message}
                                    selectOpen={selectOpen}
                                  />
                                </div>
                              )}
                              {message.media_type == 2 && (
                                <div className="chat_img_left">
                                  <VideoComponent
                                    message={message}
                                    currentlyPlaying={currentlyPlaying}
                                    setCurrentlyPlaying={setCurrentlyPlaying}
                                    selectOpen={selectOpen}
                                  />
                                </div>
                              )}
                              {message.media_type == 3 && (
                                <div className="chat_img_left">
                                  <AudioComponent
                                    message={message}
                                    currentlyPlaying={currentlyPlaying}
                                    setCurrentlyPlaying={setCurrentlyPlaying}
                                  />
                                </div>
                              )}
                              {message.media_type == 4 && (
                                <div className="chat_doc_left">
                                  <DocumentComponent message={message} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="msg_left_time ps-5">
                      {moment(message?.createdAt).format("LT")}
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      className="msg_right"
                      style={{
                        alignItems: "end",
                        margin: "10px -10px 0px 10px",
                      }}
                    >
                      <div onContextMenu={(e) => handleRightClick(e, message)}>
                        {message?.media_type == 0 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var( --main-orange-color)",
                              }}
                            >
                              <div
                                className="message-text"
                                style={{ color: "white" }}
                              >
                                {checkMsgFormat(message?.message)}
                                {passHover1(message)}
                              </div>
                            </div>
                          )}
                        {message?.media_type == 6 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var( --main-orange-color)",
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
                                  //  style={{ height: "20px", width: "20px" }}
                                  onClick={() =>
                                    handleOpenMap(message?.message)
                                  }
                                />
                                {/* <span style={{ marginLeft: "10px", marginRight: "10px", fontSize: "16px", fontWeight: "700" }}>Location</span> */}
                                {/* <Openmap style={{ height: "20px", width: "20px", fill: "white !important", color: "white" }} onClick={() => handleOpenMap(message?.message)} /> */}
                              </div>
                            </div>
                          )}
                        {message.media_type == 1 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var( --main-orange-color)",
                              }}
                            >
                              <div className="chat_img_right whatsapp_border">
                                <ImageComponent
                                  message={message}
                                  selectOpen={selectOpen}
                                  passhover1={passHover1(message)}
                                />
                              </div>
                            </div>
                          )}
                        {message.media_type == 2 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var( --main-orange-color)",
                              }}
                            >
                              <div className="chat_img_right whatsapp_border">
                                <VideoComponent
                                  message={message}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                  selectOpen={selectOpen}
                                  passhover1={passHover1(message)}
                                />
                              </div>
                            </div>
                          )}
                        {message.media_type == 3 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var( --main-orange-color)",
                              }}
                            >
                              <div className="chat_img_left whatsapp_border">
                                <AudioComponent
                                  message={message}
                                  currentlyPlaying={currentlyPlaying}
                                  setCurrentlyPlaying={setCurrentlyPlaying}
                                  passhover1={passHover1(message)}
                                />
                              </div>
                            </div>
                          )}
                        {message.media_type == 4 &&
                          message?.message_type == 0 && (
                            <div
                              className="message-content"
                              style={{
                                background: "var( --main-orange-color)",
                              }}
                            >
                              <div className="chat_doc_right p-0 ps-3">
                                <DocumentComponent
                                  message={message}
                                  passhover1={passHover1(message)}
                                />
                              </div>
                            </div>
                          )}
                        {message?.message_type == 1 && (
                          <div
                            className="message-content"
                            style={{ background: "var( --main-orange-color)" }}
                          >
                            <div style={{ display: "flex" }}>
                              <div
                                className={`msg_right_width1 msg_right_background `}
                                style={{
                                  background: "var(--main-messageshow-color)",
                                  borderLeft: "2px solid white",
                                  width: "100%",
                                }}
                                onClick={() =>
                                  replyOnclick(message?.reply_message_id)
                                }
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div>
                                    {" "}
                                    {message?.replay_message?.user_name}
                                  </div>
                                  <div
                                    style={{ color: "black", maxWidth: "100%" }}
                                  >
                                    {message?.replay_message?.media_type ==
                                      0 && (
                                      <span>
                                        {message?.replay_message?.message}
                                      </span>
                                    )}
                                    {message?.replay_message?.media_type ==
                                      1 && (
                                      <img
                                        src={
                                          url + message.replay_message?.message
                                        }
                                        style={{
                                          height: "50px",
                                          width: "50px",
                                        }}
                                      />
                                    )}
                                    {message?.replay_message?.media_type ==
                                      2 && (
                                      <video
                                        src={`${url}${message?.replay_message?.message}`}
                                        alt=""
                                        style={{
                                          height: "50px",
                                          width: "50px",
                                        }}
                                      />
                                    )}
                                    {message?.replay_message?.media_type ==
                                      3 && <div>{t("Audio")}</div>}
                                    {message?.replay_message?.media_type ==
                                      4 && <div>{t("Document")}</div>}
                                  </div>
                                </div>
                              </div>
                              {passHover1(message)}
                            </div>
                            <div
                              style={{
                                color: "white",
                                wordBreak: "break-word",
                                maxWidth: "500px",
                              }}
                            >
                              {message.media_type == 0 &&
                                checkMsgFormat(message.message)}
                              {message.media_type == 1 && (
                                <div className="chat_img_right">
                                  <ImageComponent
                                    message={message}
                                    selectOpen={selectOpen}
                                  />
                                </div>
                              )}
                              {message.media_type == 2 && (
                                <div className="chat_img_right">
                                  <VideoComponent
                                    message={message}
                                    currentlyPlaying={currentlyPlaying}
                                    setCurrentlyPlaying={setCurrentlyPlaying}
                                    selectOpen={selectOpen}
                                  />
                                </div>
                              )}
                              {message.media_type == 3 && (
                                <div className="chat_img_left">
                                  <AudioComponent
                                    message={message}
                                    currentlyPlaying={currentlyPlaying}
                                    setCurrentlyPlaying={setCurrentlyPlaying}
                                  />
                                </div>
                              )}
                              {message.media_type == 4 && (
                                <div className="chat_doc_right">
                                  <DocumentComponent message={message} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          background: "var( --main-orange-color)",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        {message?.sender_detail?.first_name
                          .charAt(0)
                          ?.toUpperCase() ||
                          message?.sender_id?.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-end">
                      <p className="msg_right_time">
                        {moment(message?.createdAt).format("LT")}
                      </p>
                      {message?.delivery_type === 1 ? (
                        <SingleTick className="single_tick" />
                      ) : message?.delivery_type === 2 ? (
                        <DoubleTick className="single_tick" />
                      ) : message?.delivery_type === 4 &&
                        message?.fail_message != "" ? (
                        <>
                          <OverlayTrigger
                            placement="left"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip(message?.fail_message)}
                          >
                            <ErrorMessage className="single_tick" />
                          </OverlayTrigger>
                        </>
                      ) : message?.delivery_type === 4 &&
                        message?.fail_message == "" ? (
                        <ErrorMessage className="single_tick" />
                      ) : (
                        <DoubleTickBlue className="single_tick" />
                      )}
                    </div>
                  </>
                )}
              </Col>
            </Row>
          ))
      )}
      {loading && <div className="scroll-overlay"></div>}

      {confirmationModal == true && (
        <ConfirmationModal
          title={t("Delete Message")}
          body={t("Are you sure you want to delete message?")}
          button1={t("Delete for me")}
          // button2={DeleteAllhide == true ? "Delete for all" : ""}
          confirmationModal={confirmationModal}
          setConfirmationModal={setConfirmationModal}
          button1function={DeleteMessage}
          // button2function={setDeleteGet}
        />
      )}
    </div>
  );
}
