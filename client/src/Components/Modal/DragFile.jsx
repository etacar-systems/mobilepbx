import React, { useRef, useState } from "react";
import { ReactComponent as Fileupload } from "../../Assets/Icon/fileupload.svg";
import { ReactComponent as Audio } from "../../Assets/Icon/audio_file_icon.svg";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import config from "../../config";
import { image_type } from "../ConstantConfig";
import { settingUpdate } from "../../Redux/Reducers/DataServices";
import { useDispatch } from "react-redux";
import { profileupdate } from "../../Redux/Reducers/ApiServices";

export default function DragFile({
  setFiles,
  files,
  accept,
  setErrors,
  dragShow,
  removeFunction,
  setDragNotShow,
}) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const profile_url = Cookies.get("profile_url");
  const fileBaseUrl = process.env.REACT_APP_FILE_BASE_URL;
  const [hoverIndex, setHoverIndex] = useState(null);
  const dispatch = useDispatch();

  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    preventDefault(e); // Prevent opening in a new tab
    const { files: droppedFiles } = e.dataTransfer;
    if (droppedFiles.length > 1) {
      toast.error(t("Please upload only one file at a time."));
      return; // Prevent further execution
    }
    const fileExtension = droppedFiles[0]?.name?.split(".")?.pop()?.toLowerCase();

    if (accept === "image/*") {
      if (image_type.includes(fileExtension)) {
        handleFiles(droppedFiles);
        setDragNotShow(false);
      } else {
        toast.error(t("Only image files are allowed."));
      }
    } else {
      if (
        fileExtension === config.AUDIO.MP3.toLowerCase() ||
        fileExtension === config.AUDIO.WAV.toLowerCase()
      ) {
        handleFiles(droppedFiles);
        setDragNotShow(false);
      } else {
        toast.error(t("Only MP3 and WAV files are allowed."));
      }
    }
  };

  const handleFiles = (fileList) => {
    const filesArray = Array.from(fileList);
    setFiles(filesArray);
    if (setErrors) {
      setErrors((state) => ({ ...state, files: "" }));
    }
  };

  const handleInputChange = (e) => {
    const fileList = e.target.files;
    let validExtensions;
    if (accept === "image/*") {
      validExtensions = image_type; // List all valid image extensions
    } else {
      validExtensions = [config.AUDIO.MP3.toLowerCase(), config.AUDIO.WAV.toLowerCase()];
    }

    for (const file of fileList) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (validExtensions.includes(fileExtension)) {
        handleFiles(fileList);
        setDragNotShow(false);
        return;
      }
    }

    if (accept === "image/*") {
      toast.error(t("Invalid file type. Please upload the correct file format."));
    } else {
      toast.error(t("Only MP3 and WAV files are allowed."));
    }
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  const openReplaceFileDialog = (index) => {
    const replaceInputRef = document.getElementById(`replace-input-${index}`);
    replaceInputRef.click();
  };

  const handleReplaceFileChange = (e, index) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles];

        if (index === "profile" || updatedFiles.length === 0) {
          updatedFiles[0] = newFile; // Treat it as the first file if no files exist
        } else {
          updatedFiles[index] = newFile; // Replace based on index
        }

        return updatedFiles;
      });
    }
  };

  const removeFile = (index) => {
    // setFiles((prevFiles) => {
    //   if (index === "profile") {
    //     return [];
    //   } else {
    //     return prevFiles.filter((_, i) => i !== index);
    //   }
    // });
    setDragNotShow(true);
    Cookies.remove("profile_url");
    dispatch(settingUpdate(""));
    dispatch(profileupdate(""));
    setFiles("");

    if (accept === "image/*") {
      removeFunction();
    }
  };

  return (
    <>
      {files && files.length > 0 ? (
        <div>
          {Array.from(files).map((file, index) => (
            <div
              key={index}
              className="image-preview borderend"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onDrop={preventDefault} // Prevent opening in a new tab here too
              onDragOver={preventDefault} // Prevent default drag over behavior
            >
              {file.type.split("/")[0] === "audio" ? (
                <div className="d-flex align-items-center justify-content-center w-100 h-100">
                  <Audio
                    alt=""
                    width={54}
                    height={54}
                    style={{
                      stroke: "var(--main-sidebarfont-color)",
                      fill: "var(--main-sidebarfont-color)",
                    }}
                  />
                </div>
              ) : (
                <img src={URL.createObjectURL(file)} alt={file.name} />
              )}
              {console.log(hoverIndex, "hoverIndex")}
              {hoverIndex === index && (
                <>
                  <div
                    className="hover-layer"
                    onClick={() => openReplaceFileDialog(index)}
                    style={{ padding: "10px", textAlign: "center", boxSizing: "border-box" }}
                  >
                    <p className="mb-1" style={{ color: "var(--main-sideborder-color)" }}>
                      {file.name}
                    </p>
                    {/* <p>____</p> */}
                    <p style={{ color: "var(--main-sideborder-color)" }}>{t("Click to replace")}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="hover-layer1"
                  >
                    {t("Remove")}
                  </button>
                </>
              )}
              <input
                id={`replace-input-${index}`}
                type="file"
                accept={accept}
                style={{ display: "none" }}
                onChange={(e) => handleReplaceFileChange(e, index)}
                onDrop={preventDefault} // Prevent drop default behavior
                onDragOver={preventDefault} // Prevent drag over default behavior
              />
            </div>
          ))}
        </div>
      ) : profile_url && accept === "image/*" ? (
        <div
          className="image-preview borderend"
          onMouseEnter={() => setHoverIndex("profile")}
          onMouseLeave={() => setHoverIndex(null)}
          onDrop={handleDrop} // Prevent drop default behavior
          onDragOver={preventDefault} // Prevent drag over default behavior
        >
          <img src={fileBaseUrl + profile_url} alt="Profile" />
          {hoverIndex === "profile" && (
            <>
              <div className="hover-layer" onClick={() => openReplaceFileDialog("profile")}>
                <p style={{ color: "var(--main-sideborder-color)" }} className="mb-1">
                  {t("Profile picture")}
                </p>
                {/* <p style={{ color: "var(--main-phone-color)" }}>____</p> */}
                <p style={{ color: "var(--main-sideborder-color)" }}>{t("Click to replace")}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile("profile");
                }}
                className="hover-layer1"
              >
                {t("Remove")}
              </button>
            </>
          )}
          <input
            id="replace-input-profile"
            type="file"
            accept={accept}
            style={{ display: "none" }}
            onChange={(e) => handleReplaceFileChange(e, "profile")}
            onDrop={preventDefault} // Prevent drop default behavior
            onDragOver={preventDefault} // Prevent drag over default behavior
          />
        </div>
      ) : (
        <div
          className="drop-area"
          onDrop={handleDrop} // Prevent file opening in new tab on drop
          onDragOver={preventDefault} // Prevent drag over default behavior
          onClick={openFileDialog}
          style={{ marginBottom: "10px" }}
        >
          <Fileupload height={50} width={50} style={{ opacity: "0.7" }} />
          <p className="drag_drop mb-2">{t("Drag and drop files here or click")}</p>
          <input
            type="file"
            accept={accept}
            ref={inputRef}
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>
      )}
    </>
  );
}
