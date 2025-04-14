import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as FileIcon } from "../../Assets/Icon/File.svg";
import { ReactComponent as Smiley } from "../../Assets/Icon/Smiley.svg";
import { ReactComponent as Messagesend } from "../../Assets/Icon/messagesend.svg";
import { Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import Picker from "emoji-picker-react"; // Import the Picker component
import Cookies from "js-cookie";
import FileUploadModal from "../Chat/FileUploadModal";
import { ReactComponent as Closereply } from "../../Assets/Icon/closereply.svg";
import { ReactComponent as ImageDoc } from "../../Assets/Icon/image_type.svg";
import { ReactComponent as Video } from "../../Assets/Icon/video_type.svg";
import { ReactComponent as Document } from "../../Assets/Icon/document.svg";
import { ReactComponent as Audio } from "../../Assets/Icon/audio-type.svg";
import { ReactComponent as Location } from "../../Assets/Icon/location.svg";
import { AllWhatsappEmit } from "./Whatsappsocketconfig";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmationModal from "../Chat/ConfirmationModal";
import { useTranslation } from "react-i18next";

function Wpsendmessage({
  sidebarobjget,
  mediaLoader,
  setMediaLoader,
  getReply,
  replyshow,
  setReplyShow,
  refreshState,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const modalRef = useRef(null);
  const textareaRef = useRef();
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);
  const [helloWidth, setHelloWidth] = useState("auto");
  const cid = Cookies.get("Company_Id");
  const conversation_id = Cookies.get("conversation_id");
  const Sidebar = useSelector(
    (state) => state.getapiall.getapiall.wpsidebarCompanydetail
  );
  const senderId = Sidebar?.CompanyDetail?.whatsapp_number;
  console.log(senderId, Sidebar, "senderId");
  const [openFile, setOpenFile] = useState(false);
  const [fileChange, setFileChange] = useState("");
  const [selectedFiles, setSelectedFiles] = useState();
  const [LocationConfirm, setLocationConfirm] = useState(false);
  const uid = Cookies.get("User_id");
  const accessToken = process.env.REACT_APP_ACCESSTOKEN;
  const [mediaType, setMediaType] = useState();

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
  const closeModal = () => {
    setShowEmojiPicker(false);
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
    const trimmedText = text.trim();
    if (trimmedText !== "") {
      const data = {
        cid: cid,
        agent_id: uid,
        sender_id: senderId,
        receiver_id: conversation_id,
        message: text,
        message_type: replyshow == true ? 1 : 0,
        media_type: 0,
        user_name: sidebarobjget?.name,
        reply_message_id: replyshow == true ? getReply.message_id : "",
      };
      AllWhatsappEmit("send_message", data);
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
  const fileSend = () => {
    setMediaLoader(true);
    const formData = new FormData();
    formData.append("messaging_product", "whatsapp");
    formData.append("file", selectedFiles);
    setOpenFile(false);

    axios
      .post(
        "https://graph.facebook.com/v20.0/378441851999607/media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        setMediaLoader(false);
        const data = {
          cid: cid,
          agent_id: uid,
          sender_id: senderId,
          receiver_id: conversation_id,
          user_name: sidebarobjget?.name,
          message: res.data.id,
          message_type: replyshow == true ? 1 : 0,
          media_type: mediaType,
          reply_message_id: replyshow == true ? getReply.message_id : "",
        };
        AllWhatsappEmit("send_message", data);

        fileInputRef.current.value = null;
      })
      .catch((err) => {
        setMediaLoader(false);
        toast.error(err?.response?.data?.error?.error_data?.details, {
          autoClose: 2000,
        });
      });
  };

  useEffect(() => {
    setText("");
    setReplyShow(false);
  }, [refreshState]);

  const LocationConfirmclose = () => {
    setLocationConfirm(false);
  };

  const LocationSend = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const Messageobj = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: "",
            address: "",
          };
          const data = {
            cid: cid,
            agent_id: uid,
            sender_id: senderId,
            receiver_id: conversation_id,
            message: Messageobj,
            message_type: replyshow == true ? 1 : 0,
            media_type: 6,
            user_name: sidebarobjget?.name,
            reply_message_id: replyshow == true ? getReply.message_id : "",
          };
          AllWhatsappEmit("send_message", data);
        },
        (err) => {}
      );
    } else {
    }
    setLocationConfirm(false);
  };
  return (
    <>
      <Row className="align-items-center borderend" style={{ height: "80px" }}>
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
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
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
                  {getReply &&
                    (getReply?.sender_detail?._id == uid
                      ? t("You")
                      : getReply?.user_name
                      ? getReply?.user_name
                      : getReply?.sender_detail?.first_name +
                        getReply?.sender_detail?.last_name)}
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
                        style={{ height: "25px", width: "25px", fill: "white" }}
                      />{" "}
                      {t("Image")}
                    </div>
                  )}
                  {getReply?.media_type == 2 && (
                    <div className="ps-1" style={{ color: "white" }}>
                      <Video
                        style={{ height: "25px", width: "25px", fill: "white" }}
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
              fill: "var(--main-location-color)",
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

export default Wpsendmessage;
