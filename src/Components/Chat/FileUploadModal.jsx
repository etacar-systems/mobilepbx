import React from "react";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { ReactComponent as Document } from "../../Assets/Icon/document.svg";
import { useTranslation } from "react-i18next";

export default function FileUploadModal({
  setOpenFile,
  fileChange,
  fileSend,
  mediaType,
  selectedFiles,
}) {
  const { t } = useTranslation();
  return (
    <div
      style={{ backgroundColor: "var(--main-white-color)", padding: "20px" }}
    >
      <div className="text-end">
        <Closeicon
          width={25}
          onClick={() => {
            setOpenFile(false);
          }}
          height={25}
        />
      </div>
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        {mediaType == 1 && (
          <img
            src={fileChange}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
          />
        )}
        {mediaType == 2 && (
          <video
            src={fileChange}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
            controls
          />
        )}
        {mediaType == 3 && (
          <audio src={fileChange} controls style={{ maxWidth: "100%" }} />
        )}
        {mediaType == 4 && (
          <div style={{ width: "300px", maxHeight: "200px" }}>
            <Document style={{ height: "30px", width: "30px" }} />
            <p
              style={{
                width: "100%",
                maxHeight: "200px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              {selectedFiles?.name}
            </p>
          </div>
        )}
        {mediaType == 5 && (
          <div style={{ width: "300px", maxHeight: "200px" }}>
            <p
              style={{
                width: "100%",
                maxHeight: "200px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                marginTop: "8px",
              }}
              className="not_support"
            >
              {t("Not supported this file type")}
            </p>
          </div>
        )}
      </div>
      <div className="text-end">
        {mediaType == 5 ? (
          <div className="py-2"></div>
        ) : (
          <button
            disabled={mediaType == 5}
            onClick={fileSend}
            className="btn_save"
          >
            {t("Send")}
          </button>
        )}
      </div>
    </div>
  );
}
