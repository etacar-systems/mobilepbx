import { ChangeEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import z, { ZodError, ZodIssue } from "zod";

import classNames from "./dragAndDrop.module.scss";

import { ReactComponent as Fileupload } from "../../../../../Assets/Icon/fileupload.svg";

interface IDropDownProps {
  maxFileSize: number;
  value?: File;
  onChange: (file?: File) => void;
  disabled?: boolean;
  url?: string;
  onRemove?: () => void;
}

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + " B";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }
};

export const fileDTO = (maxSize: number) =>
  // TODO: add translations
  z
    .instanceof(File, {
      message: "",
      // "Invalid file"
    })
    .refine(
      (file) => file.size < maxSize,
      // `File size must be less than ${formatFileSize(maxSize)}`
      ""
    );

export const DropDown = ({
  maxFileSize,
  onChange,
  value,
  disabled,
  url,
  onRemove: onRemoveExternal,
}: IDropDownProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<ZodIssue>();

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.length
        ? event.target.files![0]
        : undefined;

      try {
        fileDTO(maxFileSize).parse(file);

        setError(undefined);
        onChange(file);
      } catch (e) {
        if (e instanceof ZodError) {
          setError(e.issues[0]);
          onChange(undefined);
        }
      }
    },
    [onChange, maxFileSize]
  );

  const onRemove = useCallback(() => {
    onChange(undefined);

    onRemoveExternal && onRemoveExternal();
  }, [onChange, onRemoveExternal]);

  return (
    <div className={classNames.dropdown}>
      <div
        data-empty={!value}
        className={["drop-area", classNames.dropdown__wrapper].join(" ")}
      >
        {url || value ? (
          <div className={classNames.preview}>
            <video
              src={(value ? URL.createObjectURL(value) : undefined) || url}
              controls
              className={classNames.preview__video}
            />
            <button
              type={"button"}
              onClick={onRemove}
              className={[classNames.preview__remove, "text-danger"].join(" ")}
            >
              {t("Remove")}
            </button>
          </div>
        ) : (
          <>
            <Fileupload height={50} width={50} />
            <p className="drag_drop">
              {t("Drag and drop files here or click")}
            </p>
            <input
              onChange={onInputChange}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className={classNames.dropdown__input}
              multiple={false}
            />
          </>
        )}
      </div>
    </div>
  );
};
