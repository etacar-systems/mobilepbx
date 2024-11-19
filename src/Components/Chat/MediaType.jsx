import React from "react";
import { ReactComponent as ImageDoc } from "../../Assets/Icon/image_type.svg";
import { ReactComponent as Video } from "../../Assets/Icon/video_type.svg";
import { ReactComponent as Document } from "../../Assets/Icon/document.svg";
import { ReactComponent as Audio } from "../../Assets/Icon/audio-type.svg";
import { ReactComponent as Location1 } from "../../Assets/Icon/location.svg";
import { useTranslation } from "react-i18next";

export default function MediaType({ media_type, message }) {
  const { t } = useTranslation();
  return (
    <div>
      {(media_type == 0 ||
        media_type == 7 ||
        media_type == 8 ||
        media_type == 9 ||
        media_type == 10 ||
        media_type == 11 ||
        media_type == 12 ||
        media_type == 13 ||
        media_type == 14) && <div className="forelipsislastmessage">{message}</div>}
      {media_type == 1 && (
        <div className="d-flex align-items-center">
          <ImageDoc
            alt=""
            width={18}
            height={18}
            style={{ stroke: "var(--main-sidebarfont-color)", fill: "white" }}
          />
          <div className="ps-1">{t("Image")}</div>
        </div>
      )}
      {media_type == 2 && (
        <div className="d-flex align-items-center">
          <Video
            alt=""
            width={18}
            height={18}
            style={{ stroke: "var(--main-sidebarfont-color)", fill: "white" }}
          />
          <div className="ps-1">{t("Video")}</div>
        </div>
      )}
      {media_type == 3 && (
        <div className="d-flex align-items-center">
          <Audio
            alt=""
            width={18}
            height={18}
            style={{ stroke: "var(--main-sidebarfont-color)", fill: "white" }}
          />
          <div className="ps-1">{t("Audio")}</div>
        </div>
      )}
      {media_type == 4 && (
        <div className="d-flex align-items-center">
          <Document
            style={{
              width: "18px",
              height: "18px",
              stroke: "var(--main-sidebarfont-color)",
              fill: "white",
            }}
          />
          <div className="ps-1">{t("Document")}</div>
        </div>
      )}
      {media_type == 6 && (
        <div className="d-flex align-items-center">
          <Location1
            style={{
              width: "18px",
              height: "18px",
              stroke: "var(--main-sidebarfont-color)",
              fill: "white",
            }}
          />
          <div className="ps-1">{t("Location")}</div>
        </div>
      )}
    </div>
  );
}
