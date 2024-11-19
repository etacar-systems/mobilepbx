import React, { useRef, useState, useEffect } from "react";
import imageplaceholder from "../../Assets/Image/Imgplaceholder.jpg";
import { ReactComponent as Forwardicon } from "../../Assets/Icon/forwardicon.svg";
import { useTranslation } from "react-i18next";

export default function VideoComponent({
  message,
  passhover,
  passhover1,
  forward,
  setCurrentlyPlaying,
  currentlyPlaying,
  selectOpen,
}) {
  const { t } = useTranslation();
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const videoRef = useRef(null);
  let url;

  var path = window.location.pathname;
  if (path == "/whatsappChat") {
    url = process.env.REACT_APP_MOBIILILINJA_FILE_BASE_URL;
  } else {
    url = process.env.REACT_APP_FILE_BASE_URL;
  }

  useEffect(() => {
    if (currentlyPlaying && currentlyPlaying !== videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentlyPlaying]);

  const handlePlay = () => {
    if (selectOpen == false) {
      setCurrentlyPlaying(videoRef.current);
    }
  };

  const handlePause = () => {
    if (currentlyPlaying === videoRef.current) {
      setCurrentlyPlaying(null);
    }
  };

  const onLoad = () => {
    setTimeout(() => setIsLoadingImg(false), 1000);
  };

  return (
    <div
      style={{
        background:
          forward && passhover1
            ? "var(--main-orange-color)"
            : "var(--main-hover-color)",
        borderRadius: "10px",
      }}
    >
      {forward === true && (
        <div
          style={{
            color: "var(--main-adminheaderpage-color)",
            fontSize: "14px",
            borderBottom: "1px solid",
            marginLeft: "10px",
            marginBottom: "10px",
          }}
        >
          <Forwardicon
            style={{
              height: "15px",
              width: "15px",
              fill: passhover ? "black" : "white",
            }}
          />
          <span
            style={{
              fontStyle: "italic",
              color: passhover ? "black" : "white",
            }}
          >
            {t("Forwarded")}
          </span>
        </div>
      )}
      <div
        style={{
          background: passhover1
            ? "var(--main-orange-color)"
            : "var(--main-hover-color)",
          display: "flex",
          borderRadius: "10px",
        }}
      >
        <video
          src={`${url}${message?.message}`}
          controls={selectOpen === false}
          style={{ display: isLoadingImg ? "none" : "block" }}
          onPlay={handlePlay}
          onPause={handlePause}
          ref={videoRef}
        />
        <img
          onLoad={onLoad}
          style={{
            display: isLoadingImg ? "block" : "none",
            height: "250px",
            width: "250px",
          }}
          alt="Image Placeholder"
          src={imageplaceholder}
        />
        {passhover1 ? passhover1 : passhover}
      </div>
    </div>
  );
}
