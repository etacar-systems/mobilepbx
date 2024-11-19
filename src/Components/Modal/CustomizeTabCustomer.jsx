import React, { useEffect, useRef, useState } from "react";
import "./CustomerModalCss.css";
import cloud from "../../Assets/Icon/cloud-upload.svg";
import { ReactComponent as Fileupload } from "../../Assets/Icon/fileupload.svg";
import { useTranslation } from "react-i18next";
import ConstantConfig from "../ConstantConfig";

const CustomizeTab = ({
  colors,
  setColors,
  error,
  seterror,
  mode,
  setLogo,
  logo,
  logoDisplay,
  setLogoDisplay,
}) => {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASE_URL;

  const { t } = useTranslation();

  useEffect(() => {
    if (mode !== "edit" && !colors) {
      setColors(ConstantConfig.CUSTOMER.modalColor);
      seterror("");
    }
  }, []);
  const colorVal = (e) => {
    const value = e.target.value;
    setColors(value);
    console.log("colorvalue", value);
    const hexColorRegex = ConstantConfig.CUSTOMER.color;
    if (!value) {
      setColors(ConstantConfig.CUSTOMER.modalColor);
      seterror("");
    } else if (hexColorRegex.test(value)) {
      setColors(value);
      seterror("");
    } else {
      seterror(t("Please use a valid hex code."));
    }
  };
  // const RgbColor = (e) => {
  //   const value = e.target.value;
  //   setrgbColor(value);
  // };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e, key) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const newFile = files[0];

      setLogo((prevLogo) => ({
        ...prevLogo,
        [key]: newFile,
      }));
    }
  };
  const fileInputRefs = {
    small_logo: useRef(),
    dark_small_logo: useRef(),
    logo_text: useRef(),
    dark_logo_text: useRef(),
  };

  const handleFileChange = (event, key) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setLogo((prevFeatures) => ({
        ...prevFeatures,
        [key]: selectedFile,
      }));
    }
  };

  const openFileDialog = (key) => {
    const fileInput = document.getElementById(`file-input-${key}`);
    if (fileInput) {
      fileInput.click();
    } else {
      console.error(`No input found for ${key}`);
    }
  };

  const handleRemoveFile = (key) => {
    setLogo((prevFeatures) => ({
      ...prevFeatures,
      [key]: "",
    }));
    setLogoDisplay((prevFeatures) => ({
      ...prevFeatures,
      [key]: "",
    }));
  };
  const clearphoto = (key) => {
    setLogo((prevFeatures) => ({
      ...prevFeatures,
      [key]: "",
    }));
  };
  console.log(logoDisplay, "logoDisplay");
  const renderFileInput = (key, label) => (
    <div className="image-preview1 bordrend">
      {(logo[key] || logoDisplay[key]) && (
        <>
          {logo[key] &&
          logo[key].name &&
          !logo[key].name.startsWith("uploads") ? (
            <>
              <img src={URL.createObjectURL(logo[key])} alt={logo[key].name} />
              <div
                className="hover-layer"
                onClick={() => openFileDialog(key)}
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  handleDrop(e, key);
                }}
              >
                <p
                  style={{ color: "var(--main-phone-color)" }}
                  className="mb-1"
                >
                  {logo[key].name}
                </p>
                <p style={{ color: "var(--main-phone-color)" }}>____</p>
                <p style={{ color: "var(--main-phone-color)" }}>
                  {t("Click to replace")}
                </p>
              </div>

              <button
                className="hover-layer_customer"
                onClick={() => clearphoto(key)}
              >
                {t("Remove")}
              </button>
            </>
          ) : (
            <>
              <img
                src={fileBaseUrl + logoDisplay[key]}
                alt={logoDisplay[key]?.name}
              />
              <div
                className="hover-layer"
                onClick={() => openFileDialog(key)}
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  handleDrop(e, key);
                }}
              >
                <p
                  style={{ color: "var(--main-phone-color)" }}
                  className="mb-1"
                >
                  {logoDisplay[key]?.name}
                </p>
                <p style={{ color: "var(--main-phone-color)" }}>____</p>
                <p style={{ color: "var(--main-phone-color)" }}>
                  {t("Click to replace")}
                </p>
              </div>

              <button
                className="hover-layer_customer"
                onClick={() => handleRemoveFile(key)}
              >
                {t("Remove")}
              </button>
            </>
          )}
        </>
      )}
      {
        <div
          style={{ display: logo[key] || logoDisplay[key] ? "none" : "block" }}
        >
          <div className="customer-form-group">
            <div
              className="drop-area"
              style={{ padding: "50px 18px" }}
              onClick={() => openFileDialog(key)}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                handleDrop(e, key);
              }}
            >
              <Fileupload height={50} width={50} />
              <p className="drag_drop">
                {t("Drag and drop files here or click")}
              </p>
              <input
                type="file"
                id={`file-input-${key}`}
                accept="image/*"
                ref={fileInputRefs[key]}
                onChange={(e) => handleFileChange(e, key)}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      }
    </div>
  );
  return (
    <div className="customer col-md-12">
      <div className="body customer-demo-card">
        <div className="customer row clearfix">
          <div className="customer col-lg-4 col-md-12">
            <div>
              {" "}
              <label
                className="labledata"
                style={{ color: "var(--main-adminheaderpage-color)" }}
              >
                {t("Small logo")}
              </label>
              {renderFileInput("small_logo", "Small logo")}
            </div>
            <div style={{ marginTop: "30px" }}>
              {" "}
              <label
                className="labledata"
                style={{ color: "var(--main-adminheaderpage-color)" }}
              >
                {t("Dark mode small logo")}
              </label>
              {renderFileInput("dark_small_logo", "Large logo")}
            </div>
          </div>

          <div className="customer col-lg-4 col-md-12">
            <div>
              {" "}
              <label
                className="labledata"
                style={{ color: "var(--main-adminheaderpage-color)" }}
              >
                {t("Logo text")}
              </label>
              {renderFileInput("logo_text", "Banner image")}
            </div>
            <div style={{ marginTop: "30px" }}>
              {" "}
              <label
                className="labledata"
                style={{ color: "var(--main-adminheaderpage-color)" }}
              >
                {t("Dark mode Logo text")}
              </label>
              {renderFileInput("dark_logo_text", "Footer image")}
            </div>
          </div>
          <div className="customer col-lg-4 col-md-12">
            <label
              className="mb-4"
              style={{ color: "var(--main-adminheaderpage-color)" }}
            >
              {t("Colors")}
            </label>
            <label style={{ color: "var(--main-adminheaderpage-color)" }}>
              {t("HEX CODE")}
            </label>
            <div className="customer-input-group colorpicker">
              <input
                type="text"
                className="form-control emailforminput2"
                value={colors}
                style={{ fontSize: "14px" }}
                onChange={colorVal}
              />
              <div className="customer-append ">
                <span className="customer-input-group-text emailforminput">
                  <span className="input-group-addon">
                    <i style={{ backgroundColor: colors }}></i>
                  </span>
                </span>
              </div>
            </div>
            {error && <div className="text-danger error-ui">{error}</div>}
            <br />
            {/* <label style={{ color: "var(--main-adminheaderpage-color)" }}>
              {t("RGB CODE")}
            </label>
            <div className="customer-input-group colorpicker">
              <input
                type="text"
                className="form-control emailforminput2"
                style={{ fontSize: "14px" }}
                value={rgbColor}
                onChange={RgbColor}
              />
              <div className="customer-append">
                <span className="customer-input-group-text emailforminput">
                  <span className="input-group-addon">
                    <i style={{ backgroundColor: rgbColor }}></i>
                  </span>
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeTab;
