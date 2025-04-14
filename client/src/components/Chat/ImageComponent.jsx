import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-medium-image-zoom/dist/styles.css";
import imageplaceholder from "../../Assets/Image/Imgplaceholder.jpg";
import { ReactComponent as Forwardicon } from "../../Assets/Icon/forwardicon.svg";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close-square-svgrepo-com.svg";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
export default function ImageComponent({
  message,
  passhover,
  passhover1,
  forward,
  selectOpen,
}) {
  let url;
  const [show, setShow] = useState(false);
  const [imgModal, setImgModal] = useState();
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const userID = Cookies.get("User_id");
  var path = window.location.pathname;
  if (path == "/whatsappChat") {
    url = process.env.REACT_APP_MOBIILILINJA_FILE_BASE_URL;
  } else {
    url = process.env.REACT_APP_FILE_BASE_URL;
  }

  const openImgModal = (image) => {
    if (selectOpen == false) {
      setShow(true);
      setImgModal(image);
    }
  };

  function onLoad() {
    setTimeout(() => setIsLoadingImg(false), 1000);
  }

  const videoRef = useRef(null);

  let scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 };

  function setTransform() {
    videoRef.current.style.transform =
      "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
  }
  const mouseMoveHandler = (e) => {
    e.preventDefault();
    if (!panning) {
      return;
    }
    pointX = e.clientX - start.x;
    pointY = e.clientY - start.y;
    setTransform();
  };

  const mouseWheelHandler = (e) => {
    e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
      ys = (e.clientY - pointY) / scale,
      delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
    delta > 0 ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    setTransform();
  };
  const { t } = useTranslation();
  return (
    <>
      <div
        style={{
          background: forward && passhover1 ? "" : "var(--main-hover-color)",
          borderRadius: "10px",
          
        }}
      >
        {forward == true && (
          <div
            style={{
              color: "var(--main-adminheaderpage-color)",
              fontSize: "14px",
              paddingLeft: "10px",
              paddingBottom: "10px",
              borderRadius: "8px 8px 0px 0px",
              backgroundColor: message?.group_id
                ? userID === message.sender_id._id
                  ? "var(--main-orange-color)"
                  : "var(--main-hover-color)"
                : userID === message.sender_id
                ? "var(--main-orange-color)"
                : "var(--main-hover-color)",
            }}
          >
            <Forwardicon
              style={{
                height: "15px",
                width: "15px",
                fill: passhover
                  ? "var(--main-adminheaderpage-color)"
                  : "var(--main-phone-color)",
              }}
            />
            <span
              style={{
                fontStyle: "italic",
                color: passhover
                  ? "var(--main-adminheaderpage-color)"
                  : "var(--main-phone-color)",
              }}
            >
              {t("Forwarded")}
            </span>
          </div>
        )}
        <div
          style={{
          
            display: "flex",
            borderRadius: "10px",
          }}
        >
          <img
            src={`${url}${message?.message}`}
            onClick={() => {
              openImgModal(message?.message);
            }}
            onLoad={onLoad}
            style={{ display: isLoadingImg ? "none" : "block" }}
            alt="Message Image"
          />
          <img
            onClick={() => {
              openImgModal(message?.message);
            }}
            onLoad={onLoad}
            style={{
              display: isLoadingImg ? "block" : "none",
              height: "250px",
              width: "250px",
            }}
            alt="Image Placeholder"
            src={imageplaceholder}
          />
          <div
            style={{
              backgroundColor: message?.group_id
                ? userID === message.sender_id._id
                  ? "var(--main-orange-color)"
                  : "var(--main-hover-color)"
                : userID === message.sender_id
                ? "var(--main-orange-color)"
                : "var(--main-hover-color)",
              borderRadius: !forward ? "0px 8px 8px 0px" : "0px 0px 8px 0px",
              width:"100%",
              textAlign:"center"
            }}
          >
            {passhover1 ? passhover1 : passhover}
          </div>
        </div>
      </div>
      <Modal
        show={show}
        centered
        onHide={() => setShow(false)}
        dialogClassName="modal-img-open"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <div className="image_model_box">
          <div
            ref={videoRef}
            id="zoom"
            onMouseMove={mouseMoveHandler}
            onWheel={mouseWheelHandler}
          >
            <img src={`${url}${imgModal}`} alt="" />
          </div>

          <Closeicon
            className="set_close_modal"
            onClick={() => {
              setShow(false);
            }}
            style={{
              width: "40px",
              height: "40px",
              verticalAlign: "top",
              borderRadius: "10px",
              background: "var(--main-orange-color)",
              cursor: "pointer",
            }}
          />
        </div>
      </Modal>
    </>
  );
}
