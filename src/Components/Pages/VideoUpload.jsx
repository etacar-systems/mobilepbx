import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as Fileupload } from "../../Assets/Icon/fileupload.svg";
import { ReactComponent as VideoPlay } from "../../Assets/Icon/video_play_button.svg";
import { ReactComponent as VideoPause } from "../../Assets/Icon/video_pause.svg";
import AdminHeader from "../Admin/AdminHeader";
import config from "../../config";
import { useDispatch } from "react-redux";
import { getapiAll, postapiAll } from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import { json } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { ReactComponent as Dropdownicon } from "../../Assets/Icon/Dropdownicon.svg";

const VideoUpload = () => {
  const { t } = useTranslation();
  const upload = process.env.REACT_APP_FILE_UPLOAD;
  const file_base = process.env.REACT_APP_FILE_BASE_URL;
  const [loader, setLoader] = useState(false);
  const [selectedKey, setSelectedKey] = useState("super admin");
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [role, setRole] = useState();
  const [RoleList, setRoleList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dispatch = useDispatch();
  const [fileDisplay, setFileDisplay] = useState({
    "super admin": null,
    admin: null,
    agent: null,
    "sub admin": null,
  });
  let Token = Cookies.get("Token");
  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.INTEGRATION_LIST.GET_ROLE,
        Token: Token,
      })
    ).then((response) => {
      if (response.payload.response.success === 1) {
        setRoleList(response.payload.response.RoleList);
      }
    });
    dispatch(
      getapiAll({
        Api: config.INTEGRATION_LIST.VIDEO_LIST,
        Token: Token,
      })
    ).then((response) => {
      if (response?.payload?.response?.success === 1) {
        const updatedFileDisplay = { ...fileDisplay }; // Create a copy of the current state

        response.payload.response.IntergationList.forEach((item) => {
          if (updatedFileDisplay.hasOwnProperty(item.role)) {
            updatedFileDisplay[item.role] = item.video_url; // Update the matching role with video_url
          }
        });

        setFileDisplay(updatedFileDisplay);
      }
    });
  }, []);

  const [file, setFile] = useState({
    "super admin": null,
    admin: null,
    agent: null,
    "sub admin": null,
  });

  const [isPlay, setIsPlay] = useState(false);
  const videoRefs = useRef({});

  const handleKeyChange = (event, dropdown) => {
    const selectedObject = RoleList.find((item) => item.name === event);
    setRole(selectedObject._id);
    setSelectedKey(event);
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile.type, "12321331221");
    const selectedObject = RoleList.find((item) => item.name === selectedKey);
    setRole(selectedObject._id);
    if (selectedFile.type.includes("video")) {
      setFile((prevFiles) => ({
        ...prevFiles,
        [selectedKey]: selectedFile,
      }));
    } else {
      toast.error(t("Only video files are allowed."));
    }
  };

  const openFileDialog = () => {
    const fileInput = document.getElementById(`file-input-${selectedKey}`);
    if (fileInput) fileInput.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.includes("video")) {
      setFile((prevFiles) => ({
        ...prevFiles,
        [selectedKey]: droppedFile,
      }));
    } else {
      toast.error(t("Only video files are allowed."));
    }
  };

  const togglePlayPause = (event, key) => {
    event.preventDefault();
    const videoElement = videoRefs.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  const clearVideo = (key) => {
    setFile((prevFiles) => ({
      ...prevFiles,
      [key]: null,
    }));
    setFileDisplay((prevFiles) => ({
      ...prevFiles,
      [key]: null,
    }));
    setIsPlay((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };
  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 200;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, [window.innerWidth, window.innerHeight, dynamicHeight]);
  const handleSave = () => {
    if (file[selectedKey]) {
      setLoader(true);
      let data = new FormData();
      data.append("file", file[selectedKey]);
      dispatch(
        postapiAll({
          inputData: data,
          Api: upload,
        })
      ).then((response) => {
        if (response?.payload?.response?.success === 1) {
          const video_data = {
            video_url: response?.payload?.response?.filePath,
            role: role,
          };
          dispatch(
            postapiAll({
              inputData: video_data,
              Api: config.INTEGRATION_LIST.ADD_VIDEO,
              Token: Token,
            })
          ).then((response) => {
            if (response?.payload?.response?.success === 1) {
              toast.success(response?.payload?.response.message);
              setLoader(false);
            } else {
              toast.error(response?.payload?.error?.response?.data?.message);
              setLoader(false);
            }
          });
        }
      });
    } else {
      const video_data = {
        video_url: fileDisplay[selectedKey],
        role: role,
      };
      dispatch(
        postapiAll({
          inputData: video_data,
          Api: config.INTEGRATION_LIST.ADD_VIDEO,
          Token: Token,
        })
      ).then((response) => {
        if (response?.payload?.response?.success === 1) {
          toast.success(response?.payload?.response.message);
          setLoader(false);
        } else {
          toast.error(response?.payload?.error?.response?.data?.message);
          setLoader(false);
        }
      });
    }
  };
  const toggleDropdown = (dropdown, type) => {
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };
  return (
    <div className="tablespadding">
      <AdminHeader pathname={t("Video upload")} addBtn={true} />
      <div
        style={{
          overflowY: "auto",
          height: dynamicHeight,
          width: "100%",
          background: "var(--main-tabledarkbackground-color)",
          padding: "25px",
        }}
        className="sidebar_scroll"
      >
        <div className="row align-items-center">
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
                onClick={() => toggleDropdown(`select_type`)}
              >
                {String(selectedKey).charAt(0).toUpperCase() +
                  String(selectedKey).slice(1) || t("None selected")}
                <div>
                  <Dropdownicon />
                </div>
              </div>
              {openDropdown === `select_type` && (
                <div className="Selfmadedropdown-content">
                  {RoleList.map((type) => (
                    <a
                      key={type._id}
                      onClick={() => handleKeyChange(type.name)}
                    >
                      {String(type?.name)?.charAt(0)?.toUpperCase() +
                        String(type?.name).slice(1)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="image-preview1 bordrend"
              style={{
                display:
                  file[selectedKey] || fileDisplay[selectedKey]
                    ? "block"
                    : "none",
              }}
            >
              {file[selectedKey] ? (
                <>
                  <video
                    ref={videoRefs}
                    src={
                      file[selectedKey]
                        ? URL.createObjectURL(file[selectedKey])
                        : undefined
                    }
                    controls
                    alt={file[selectedKey] ? file[selectedKey].name : ""}
                    style={{ display: file[selectedKey] ? "block" : "none" }}
                  />
                  <div
                    className="hover-layer"
                    onClick={() => openFileDialog(selectedKey)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, selectedKey)}
                  >
                    <p
                      className="mb-1 mt-5"
                      style={{ color: "var(--main-phone-color)" }}
                    >
                      {file[selectedKey].name}
                    </p>

                    {!isPlay ? (
                      <VideoPlay
                        style={{
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          togglePlayPause(event, selectedKey);
                        }}
                      />
                    ) : (
                      <VideoPause
                        style={{
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          togglePlayPause(event, selectedKey);
                        }}
                      />
                    )}

                    <p style={{ color: "var(--main-phone-color)" }}>
                      {t("Click to replace")}
                    </p>
                  </div>
                  <button
                    className="hover-layer_customer"
                    onClick={() => clearVideo(selectedKey)}
                  >
                    {t("Remove")}
                  </button>
                </>
              ) : (
                <>
                  <video
                    ref={videoRefs}
                    src={
                      fileDisplay[selectedKey]
                        ? file_base + fileDisplay[selectedKey]
                        : undefined
                    }
                    controls
                    alt={
                      fileDisplay[selectedKey]
                        ? fileDisplay[selectedKey].name
                        : ""
                    }
                    style={{
                      display: fileDisplay[selectedKey] ? "block" : "none",
                    }}
                  />
                  <div
                    className="hover-layer"
                    onClick={() => openFileDialog(selectedKey)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, selectedKey)}
                  >
                    <p
                      className="mb-1 mt-5"
                      style={{ color: "var(--main-phone-color)" }}
                    ></p>

                    {!isPlay ? (
                      <VideoPlay
                        style={{
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                        }}
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent this click from triggering openFileDialog
                          togglePlayPause(event, selectedKey);
                        }}
                      />
                    ) : (
                      <VideoPause
                        style={{
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          togglePlayPause(event, selectedKey);
                        }}
                      />
                    )}

                    <p style={{ color: "var(--main-phone-color)" }}>
                      {t("Click to replace")}
                    </p>
                  </div>
                  <button
                    className="hover-layer_customer"
                    onClick={() => clearVideo(selectedKey)}
                  >
                    {t("Remove")}
                  </button>
                </>
              )}
            </div>
            <div
              style={{
                display:
                  !file[selectedKey] && !fileDisplay[selectedKey]
                    ? "block"
                    : "none",
              }}
            >
              <div className="customer-form-group">
                <div
                  className="drop-area"
                  style={{ padding: "50px 18px" }}
                  onClick={() => openFileDialog(selectedKey)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, selectedKey)}
                >
                  <Fileupload height={50} width={50} />
                  <p className="drag_drop">
                    {t("Drag and drop files here or click")}
                  </p>
                  <input
                    type="file"
                    id={`file-input-${selectedKey}`}
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, selectedKey)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="d-flex justify-content-end "
          style={{ marginTop: "37px" }}
        >
          {loader ? (
            <button className="btn_save">
              <Spinner animation="border" size="sm" />
            </button>
          ) : (
            <button className="btn_save" onClick={handleSave}>
              {t("Save")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
