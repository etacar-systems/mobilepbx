import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
// import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

import AdminHeader from "../../Admin/AdminHeader";
// import config from "../../../config";
// import { getapiAll, postapiAll } from "../../../Redux/Reducers/ApiServices";
// import { json } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { DropDown } from "./components/DragAndDrop/DragAndDrop";

import classNames from "./videoUpload.module.scss";

import { ReactComponent as Dropdownicon } from "../../../Assets/Icon/Dropdownicon.svg";
import { pages } from "./pages";
import { useRemoveVideo, useUploadVideo } from "../../../requests/mutations";
import { useGetVideoURL } from "../../../requests/queries";

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10mb;

const VideoUpload = () => {
  const [file, setFile] = useState<{
    section: (typeof pages)[number]["key"];
    file?: File;
  }>({
    section: pages[0].key,
  });
  const { t } = useTranslation();

  const { uploadVideo, isFetching } = useUploadVideo();
  const { removeVideo } = useRemoveVideo();
  const { url, isFetching: isURLFetching } = useGetVideoURL({
    section: file.section,
  });

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const handleSave = useCallback(async () => {
    if (file.file) {
      const base64 = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String: string = reader.result?.toString() || "";
          return resolve(base64String);
        };
        reader.readAsDataURL(file.file as File);
      });

      const body = {
        section: file.section,
        base64: await base64,
        ext: file.file.name.split(".").reverse()[0] as any,
        mime: file.file.type as any,
        size: file.file.size,
      };

      uploadVideo(body, {
        onSuccess() {
          toast.success(t("The video has been successfully saved"));
        },
      });
    }
  }, [file, uploadVideo, t]);

  const onFileChange = (file?: File) => {
    setFile((prev) => ({ ...prev, file }));
  };

  const onSectionChange = (key: (typeof pages)[number]["key"]) => {
    setFile({ section: key, file: undefined });
    setOpenDropdown(false);
  };

  const onRemoveVideo = useCallback(() => {
    if (url) {
      removeVideo({ section: file.section });
    }
  }, [url, removeVideo, file.section]);

  return (
    <div className="tablespadding">
      <AdminHeader
        pathname={t("Video upload")}
        addBtn={true}
        openModal={undefined}
        btnName={undefined}
      />
      <div
        style={{
          overflowY: "auto",
          width: "100%",
          background: "var(--main-tabledarkbackground-color)",
          padding: "25px",
        }}
        className="sidebar_scroll"
      >
        <div className={classNames.section}>
          <div className="col-md-4">
            <label
              style={{
                marginBottom: "10px",
                color: "var(--main-adminnumberheader-color)",
              }}
            >
              {t("Select Type")}
            </label>
            <div className="Selfmade-dropdown">
              <div
                className="Selfmadedropdown-btn"
                onClick={() => setOpenDropdown(true)}
              >
                {t(
                  pages[pages.findIndex((page) => page.key === file.section)]
                    .label
                )}
                <div>
                  <Dropdownicon />
                </div>
              </div>
              {openDropdown && (
                <ul className="Selfmadedropdown-content">
                  {pages.map((page) => (
                    <li
                      key={page.key}
                      onClick={() => onSectionChange(page.key)}
                    >
                      {t(page.label)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <DropDown
            onChange={onFileChange}
            value={file.file}
            maxFileSize={MAX_FILE_SIZE}
            url={url}
            disabled={isURLFetching}
            onRemove={onRemoveVideo}
          />
        </div>
        <div
          className="d-flex justify-content-end "
          style={{ marginTop: "37px" }}
        >
          <button
            disabled={!file.file || isFetching || !!url}
            className="btn_save"
            onClick={handleSave}
          >
            {isFetching ? <Spinner animation="border" size="sm" /> : t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
