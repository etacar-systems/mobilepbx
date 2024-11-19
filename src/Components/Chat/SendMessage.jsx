import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as FileIcon } from "../../Assets/Icon/File.svg";
import { ReactComponent as Smiley } from "../../Assets/Icon/Smiley.svg";
import { ReactComponent as Messagesend } from "../../Assets/Icon/messagesend.svg";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import Picker from "emoji-picker-react"; // Import the Picker component
import { AllEmit } from "./SocketConfig";
import Cookies from "js-cookie";
import FileUploadModal from "./FileUploadModal";
import axios from "axios";
import SelectedMessageComp from "./SelectedMessageComp";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ReactComponent as Closereply } from "../../Assets/Icon/closereply.svg";
import ConfirmationModal from "./ConfirmationModal";
import { ReactComponent as ImageDoc } from "../../Assets/Icon/image_type.svg";
import { ReactComponent as Video } from "../../Assets/Icon/video_type.svg";
import { ReactComponent as Document } from "../../Assets/Icon/document.svg";
import { ReactComponent as Audio } from "../../Assets/Icon/audio-type.svg";
import { ReactComponent as Location } from "../../Assets/Icon/location.svg";
import { useTranslation } from "react-i18next";

function SendMessage({
  selectOpen,
  count,
  setSelectOpen,
  setDeleteMultiple,
  forwardMultiple,
  setForwardMultiple,
  getReply,
  setGetReply,
  sidebarobjget,
  setSendmessagee,
  closeselectcomp,
  admincanmsg,
  setadmincanmsg,
  setMediaLoader,
  mediaLoader,
}) {
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const Sidebar = useSelector((state) => state.getapiall.getapiall.Sidebar);
  const fileUploadUrl = process.env.REACT_APP_FILE_UPLOAD;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const modalRef = useRef(null);
  const textareaRef = useRef();
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);
  const [helloWidth, setHelloWidth] = useState("auto");
  const hasEmitted = useRef(false);
  const [openFile, setOpenFile] = useState(false);
  const [fileChange, setFileChange] = useState("");
  const [selectedFiles, setSelectedFiles] = useState();
  const cid = Cookies.get("Company_Id");
  const uid = Cookies.get("User_id");
  const conversation_id = Cookies.get("conversation_id");
  const isGroup = Cookies.get("isGroup");
  const [mediaType, setMediaType] = useState();
  const [isBlocked, setIsBlocked] = useState(false);
  const [replyshow, setReplyShow] = useState(false);
  const [removeGroup, setRemoveGroup] = useState(false);
  const [blockUserOpen, setBlockUser] = useState(false);
  const [LocationConfirm, setLocationConfirm] = useState(false);

  const [adminmsg, setadminmsg] = useState(false);
  const NewConversationdata = useSelector(
    (state) => state.getapiall.getapiall.NewConversation
  );

  useEffect(() => {
    if (replyshow == false) {
      setGetReply("");
    }
  }, [replyshow]);

  const listOfUser = useSelector(
    (state) => state.getapiall.getapiall.ListofUser
  );
  const closeModal = () => {
    setShowEmojiPicker(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileType = selectedFile.type.split("/")[0];
    if (fileType == "image") {
      setMediaType(1);
    } else if (fileType == "video") {
      setMediaType(2);
    } else if (fileType == "audio") {
      setMediaType(3);
    } else if (fileType == "application") {
      setMediaType(4);
    } else {
      setMediaType(5);
    }
    setSelectedFiles(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileChange(reader.result);
        setOpenFile((state) => !state);
      };
      reader.readAsDataURL(selectedFile);
    }
    fileInputRef.current.value = null;
  };
  const handleEmojiClick = (event, emojiObject) => {
    setText((prev) => prev + event.emoji);
  };
  const handleSmileyClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleChange = (e) => {
    clearTimeout(typingTimeoutRef.current);
    var data = {
      cid: cid,
      sender_id: uid,
      reciver_id: conversation_id,
    };
    if (!hasEmitted.current) {
      AllEmit("typing", data);
      hasEmitted.current = true; // Set the flag to true
    }
    typingTimeoutRef.current = setTimeout(() => {
      AllEmit("typing", data);
      hasEmitted.current = false;
    }, 1000);
    setText(e.target.value);
    adjustTextareaHeight();
  };
  const adjustTextareaHeight = () => {
    const textareas = textareaRef.current;
    textareas.style.height = "36px";
    const setHeight = textareas.scrollHeight;
    textareas.style.height = `${setHeight}px`;
  };
  const messageSend = () => {
    // setSendmessagee(true)
    const trimmedText = text.trim();
    if (trimmedText !== "") {
      if (isGroup == 0) {
        const data = {
          isgroup: 0,
          cid: cid,
          sender_id: uid,
          receiver_id: conversation_id,
          message: text,
          group_id: null,
          message_type: replyshow == true ? 1 : 0,
          media_type: 0,
          reply_message_id: replyshow == true ? getReply._id : "",
          schedule_time: null,
          tmp_message_id: null,
          message_caption: "",
        };
        AllEmit("send_message", data);
      } else {
        const data = {
          isgroup: 1,
          cid: cid,
          sender_id: uid,
          receiver_id: null,
          message: text,
          group_id: conversation_id,
          message_type: replyshow == true ? 1 : 0,
          media_type: 0,
          reply_message_id: replyshow == true ? getReply._id : "",
          schedule_time: null,
          tmp_message_id: null,
          message_caption: "",
        };
        AllEmit("send_message", data);
      }
      setText("");
      const textareas = textareaRef.current;
      textareas.style.height = "36px";
    }
    setReplyShow(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        event.preventDefault();
        clearTimeout(typingTimeoutRef.current);
        const cursorPosition = textareaRef.current.selectionStart;
        const newValue =
          text.substring(0, cursorPosition) +
          "\n" +
          text.substring(cursorPosition);
        setText(newValue);
        setTimeout(() => {
          textareaRef.current.selectionStart = cursorPosition + 1;
          textareaRef.current.selectionEnd = cursorPosition + 1;
          adjustTextareaHeight();
        }, 0);
      } else {
        event.preventDefault();
        messageSend();
      }
    }
  };
  const LocationConfirmclose = () => {
    setLocationConfirm(false);
  };
  const fileSend = () => {
    setMediaLoader(true);
    const formData = new FormData();
    formData.append("file", selectedFiles);
    setOpenFile(false);
    axios
      .post(`${fileUploadUrl}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (isGroup == 0) {
          const data = {
            isgroup: 0,
            cid: cid,
            sender_id: uid,
            receiver_id: conversation_id,
            message: res.data.filePath,
            group_id: null,
            message_type: replyshow == true ? 1 : 0,
            media_type: mediaType,
            reply_message_id: replyshow == true ? getReply._id : "",
            schedule_time: null,
            tmp_message_id: null,
            message_caption: "",
          };
          AllEmit("send_message", data);
        } else {
          const data = {
            isgroup: 1,
            cid: cid,
            sender_id: uid,
            receiver_id: null,
            message: res.data.filePath,
            group_id: conversation_id,
            message_type: replyshow == true ? 1 : 0,
            media_type: mediaType,
            reply_message_id: replyshow == true ? getReply._id : "",
            schedule_time: null,
            tmp_message_id: null,
            message_caption: "",
          };
          AllEmit("send_message", data);
        }
        fileInputRef.current.value = null;
        setReplyShow(false);
      })
      .catch((err) => {
        setMediaLoader(false);
      });
  };

  useEffect(() => {
    const groupId = listOfUser?._id;
    if (groupId === conversation_id && sidebarobjget?.isGroup == 1) {
      const newdata = listOfUser?.group_users?.filter((val) => {
        return uid == val?.member_id?._id && val.isleaved == 1;
      });
      if (newdata.length !== 0) {
        setRemoveGroup(true);
      } else {
        setRemoveGroup(false);
      }
    } else {
      setRemoveGroup(false);
    }
  }, [listOfUser, conversation_id, sidebarobjget]);
  useEffect(() => {
    const groupId = listOfUser?._id;
    if (groupId === conversation_id && sidebarobjget?.isGroup === 1) {
      const isAdminSendMessage = listOfUser?.is_admin_send_message;

      // Find the specific user object with the uid
      const currentUser = listOfUser?.group_users.find(
        (item) => item.member_id._id === uid
      );

      if (isAdminSendMessage === 1) {
        if (currentUser && currentUser.is_admin === 0) {
          setadmincanmsg(true);
        } else {
          setadmincanmsg(false);
        }
      } else {
        setadmincanmsg(false);
      }
    } else {
      setadmincanmsg(false);
    }
  }, [listOfUser, conversation_id, sidebarobjget, uid]);

  const blockUserClick = () => {
    setBlockUser(true);
  };

  const emitblockUser = () => {
    const blockuser = {
      cid: cid,
      block_by: uid,
      block_id: conversation_id,
      isBlocked: sidebarobjget?.isBlocked == "0" ? 1 : 0,
    };
    AllEmit("send_block", blockuser);
    setBlockUser(false);
    if (sidebarobjget?.isBlocked == "0") {
      toast.success(t("Block user successfully!"), { autoClose: 2000 });
    } else {
      toast.success(t("Unblock user successfully!"), { autoClose: 2000 });
    }
  };
  useEffect(() => {
    // Cleanup the timeout when the component unmounts
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const widthReply = () => {
    if (textareaRef.current) {
      setHelloWidth(textareaRef.current.offsetWidth);
    }
  };
  useEffect(() => {
    widthReply();
    window.addEventListener("resize", widthReply);
    return () => {
      window.removeEventListener("resize", widthReply);
    };
  }, [textareaRef]);

  useEffect(() => {
    if (getReply != "") {
      setReplyShow(true);
    } else {
      setReplyShow(false);
    }
  }, [getReply]);
  const url = process.env.REACT_APP_FILE_BASE_URL;
  const clerConfirmationModal = () => {
    setBlockUser(false);
  };

  useEffect(() => {
    setText("");
  }, [sidebarobjget]);

  const LocationSend = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const Messageobj = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          const data = {
            isgroup: isGroup == 0 ? 0 : 1,
            cid: cid,
            sender_id: uid,
            receiver_id: isGroup == 0 ? conversation_id : null,
            message: JSON.stringify(Messageobj),
            group_id: isGroup == 1 ? conversation_id : null,
            message_type: replyshow == true ? 1 : 0,
            media_type: 6,
            reply_message_id: replyshow == true ? getReply._id : "",
            schedule_time: null,
            tmp_message_id: null,
            message_caption: "",
          };
          AllEmit("send_message", data);
          setReplyShow(false);
        },
        (err) => {}
      );
    } else {
    }
    setLocationConfirm(false);
  };
  return (
    <>
      {selectOpen == true ? (
        <SelectedMessageComp
          count={count}
          setSelectOpen={setSelectOpen}
          setDeleteMultiple={setDeleteMultiple}
          forwardMultiple={forwardMultiple}
          setForwardMultiple={setForwardMultiple}
          closeselectcomp={closeselectcomp}
        />
      ) : sidebarobjget?.isBlocked == 1 ? (
        <div
          className="click-group-btn d-flex align-items-center justify-content-center"
          style={{ height: "80px" }}
        >
          <Button onClick={blockUserClick}>{t("Unblock user")}</Button>
        </div>
      ) : removeGroup ? (
        <div
          className=" d-flex align-items-center justify-content-center borderend"
          style={{
            height: "80px",
            width: "100%",
            color: "var(--main-sidebarfont-color",
          }}
        >
          <div>
            {t(
              "You can not send messages to this group because you are not a member"
            )}
          </div>
        </div>
      ) : admincanmsg ? (
        <div
          className=" d-flex align-items-center justify-content-center borderend"
          style={{
            height: "80px",
            width: "100%",
            color: "var(--main-sidebarfont-color",
          }}
        >
          <div>{t("Only Admin can send message")}</div>
        </div>
      ) : (
        <Row
          className="align-items-center borderend"
          style={{ height: "80px" }}
        >
          <Col xs={1} className="text-center">
            {mediaLoader ? (
              <div className="loader2">
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
                <label htmlFor="fileInput">
                  <FileIcon />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </>
            )}
          </Col>
          <Col xs={1}>
            <div style={{ position: "relative" }}></div>
            <Smiley onClick={handleSmileyClick} />{" "}
            {/* Add onClick event to the smiley icon */}
            <div
              style={{
                position: "absolute",
                bottom: "50px",
                width: "0px",
                zIndex: "5",
              }}
              className="modal-content"
              ref={modalRef}
            >
              {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} previewConfig={{ showPreview: false }} />}
            </div>
          </Col>
          <Col xs={8} style={{ position: "relative" }}>
            {replyshow == true && (
              <div
                style={{
                  width: helloWidth,
                  position: "absolute",
                  bottom: "110%",
                  borderRadius: "5px",
                  background: "var(--main-orange-color)",
                  height: "70px",
                  display: "flex",
                }}
              >
                <div style={{ width: "90%" }}>
                  <div
                    style={{
                      color: "white",
                      fontSize: "14px",
                      paddingLeft: "10px",
                      paddingTop: "5px",
                    }}
                  >
                    {isGroup == 0 &&
                      (getReply?.sender_id == uid
                        ? t("You")
                        : getReply?.originalName)}
                    {isGroup == 1 &&
                      (getReply?.sender_id?._id == uid
                        ? t("You")
                        : getReply?.sender_id?.first_name +
                          getReply?.sender_id?.last_name)}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      paddingLeft: "10px",
                      paddingTop: "5px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {getReply?.media_type == 0 && getReply?.message}
                    </div>
                    {getReply?.media_type == 1 && (
                      <div className="ps-1" style={{ color: "white" }}>
                        <ImageDoc
                          style={{
                            height: "25px",
                            width: "25px",
                            fill: "white",
                          }}
                        />{" "}
                        {t("Image")}
                      </div>
                    )}
                    {getReply?.media_type == 2 && (
                      <div className="ps-1" style={{ color: "white" }}>
                        <Video
                          style={{
                            height: "25px",
                            width: "25px",
                            fill: "white",
                          }}
                        />{" "}
                        {t("Video")}
                      </div>
                    )}
                    {getReply?.media_type == 3 && (
                      <div className="ps-1" style={{ color: "white" }}>
                        <Audio
                          style={{
                            height: "25px",
                            width: "25px",
                            fill: "white",
                            stroke: "white",
                          }}
                        />{" "}
                        {t("Audio")}
                      </div>
                    )}
                    {getReply?.media_type == 4 && (
                      <div className="ps-1" style={{ color: "white" }}>
                        <Document
                          style={{
                            height: "25px",
                            width: "25px",
                            fill: "white",
                            color: "white",
                          }}
                        />{" "}
                        {t("Document")}
                      </div>
                    )}
                    {getReply?.media_type == 6 && (
                      <div className="ps-1" style={{ color: "white" }}>
                        <Location
                          style={{
                            height: "25px",
                            width: "25px",
                            fill: "white",
                            color: "white",
                          }}
                        />{" "}
                        {t("Location")}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    width: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Closereply
                    style={{ width: "30px", height: "30px", fill: "white" }}
                    onClick={() => setReplyShow(false)}
                  />
                </div>
              </div>
            )}

            <Form.Control
              value={text}
              as="textarea"
              ref={textareaRef}
              placeholder={t("Write a message...")}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              style={{
                minHeight: "0px",
                maxHeight: "70px",
                background: "var(--main-white-color)",
                color: "var(--main-adminheaderpage-color)",
              }}
              className="textarea-scroll txt-placeholder"
            />
          </Col>
          <Col xs={1}>
            <Location
              style={{
                width: "20px",
                height: "20px",
                fill: " var(--main-searchGrey-color)",
              }}
              onClick={() => setLocationConfirm(true)}
            />
          </Col>
          <Col xs={1}>
            <Messagesend
              onClick={messageSend}
              className={text == "" ? "sendmessageicon1" : "sendmessageicon"}
              style={{ marginLeft: "-8px" }}
            />
          </Col>
          {openFile && (
            <Modal
              show={openFile}
              centered
              dialogClassName="modal-img-send-open"
              aria-labelledby="example-custom-modal-styling-title"
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "100vh", overflow: "hidden" }}
              >
                <FileUploadModal
                  setOpenFile={setOpenFile}
                  fileChange={fileChange}
                  fileSend={fileSend}
                  mediaType={mediaType}
                  selectedFiles={selectedFiles}
                />
              </div>
            </Modal>
          )}
        </Row>
      )}

      {blockUserOpen && (
        <ConfirmationModal
          title={t("Block User")}
          body={t("Are you sure you want to Unblock user?")}
          button2={t("Cancel")}
          button1={t("Yes")}
          confirmationModal={blockUserOpen}
          setConfirmationModal={setBlockUser}
          button2function={clerConfirmationModal}
          button1function={emitblockUser}
          cancelcss={true}
        />
      )}
      {LocationConfirm && (
        <ConfirmationModal
          title={t(`Location`)}
          body={t(`Are you sure you want to send your device current location`)}
          button2={t("Cancel")}
          button1={t("Yes")}
          confirmationModal={LocationConfirm}
          setConfirmationModal={LocationConfirmclose}
          button2function={LocationConfirmclose}
          button1function={LocationSend}
          cancelcss={true}
        />
      )}
    </>
  );
}

export default SendMessage;
