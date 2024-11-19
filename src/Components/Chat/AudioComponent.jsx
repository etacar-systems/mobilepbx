import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function AudioComponent({
  message,
  passhover,
  passhover1,
  forward,
  currentlyPlaying,
  setCurrentlyPlaying,
}) {
  let url;
  const { t } = useTranslation();
  var path = window.location.pathname;
  if (path == "/whatsappChat") {
    url = process.env.REACT_APP_MOBIILILINJA_FILE_BASE_URL;
  } else {
    url = process.env.REACT_APP_FILE_BASE_URL;
  }

  const audioRef = useRef(null);

  useEffect(() => {
    if (currentlyPlaying !== audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentlyPlaying]);

  const handlePlay = () => {
    setCurrentlyPlaying(audioRef.current);
  };

  const handlePause = () => {
    if (currentlyPlaying === audioRef.current) {
      setCurrentlyPlaying(null);
    }
  };

  return (
    <div
      style={{
        background: "var(--main-audiocomponenet-color)",
        borderRadius: "10px",
      }}
    >
      {forward === true && (
        <div
          style={{
            color: "black",
            fontSize: "14px",
            borderBottom: "1px solid",
            marginLeft: "10px",
            marginBottom: "10px",
          }}
        >
          {t("Forwarded")}
        </div>
      )}
      <div
        style={{
          background: "var(--main-audiocomponenet-color)",
          display: "flex",
          borderRadius: "10px",
        }}
      >
        <audio
          src={`${url}${message.message}`}
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          ref={audioRef}
        />
        {passhover1 ? passhover1 : passhover}
      </div>
    </div>
  );
}
