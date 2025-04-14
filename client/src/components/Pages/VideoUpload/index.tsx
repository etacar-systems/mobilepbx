import React, { useState, useCallback, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { pages } from "./pages";
import { useRemoveVideo, useUploadVideo } from "../../../requests/mutations";
import { useGetVideoURL } from "../../../requests/queries";
import { DragAndDrop } from "./components";
import { ContentTemplate } from "../../shared";

import classNames from "./videoUpload.module.scss";

import { ReactComponent as Dropdownicon } from "../../../Assets/Icon/Dropdownicon.svg";

const MAX_FILE_SIZE = 1024 * 1024 * 40; // 40mb;

export default function VideoUploadPage() {
  const [file, setFile] = useState<{
    section: (typeof pages)[number]["key"];
    file?: File;
  }>({
    section: pages[0].key,
  });
  const { t } = useTranslation();

  const { uploadVideo, isFetching } = useUploadVideo();
  const { removeVideo } = useRemoveVideo();
  const { url } = useGetVideoURL({
    section: file.section,
  });

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const handleSave = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

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
    <ContentTemplate
      className={classNames.section}
      isSubmitting={isFetching}
      disabled={!file.file || isFetching || !!url}
      onSubmit={handleSave}
    >
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
              pages[pages.findIndex((page) => page.key === file.section)].label
            )}
            <div>
              <Dropdownicon />
            </div>
          </div>
          {openDropdown && (
            <ul className="Selfmadedropdown-content">
              {pages.map((page) => (
                <li key={page.key} onClick={() => onSectionChange(page.key)}>
                  {t(page.label)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DragAndDrop
        onChange={onFileChange}
        value={file.file}
        maxFileSize={MAX_FILE_SIZE}
        url={url}
        onRemove={onRemoveVideo}
      />
    </ContentTemplate>
  );
}
