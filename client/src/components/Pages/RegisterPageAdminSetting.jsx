import React, { useRef, useState, useTransition } from "react";
import { Form, Col, Row } from "react-bootstrap";
import cloud from "../../Assets/Icon/cloud-upload.svg";
import { ReactComponent as Fileupload } from "../../Assets/Icon/fileupload.svg";
import { useTranslation } from "react-i18next";

const RegisterPageAdminSetting = () => {
  const { t } = useTranslation();

  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const { files: droppedFiles } = e.dataTransfer;

    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList) => {
    const filesArray = Array.from(fileList);
    setFiles(filesArray);
  };

  const handleInputChange = (e) => {
    const fileList = e.target.files;
    handleFiles(fileList);
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };
  return (
    <Form.Group className="backgroundofregisterAdmintab">
      <Row className="mainadmin" style={{ padding: "15px" }}>
        <Col lg={4} md={12} className="admincol">
          <p className="adminheader textdown">{t("Download files")}</p>
          <a
            href="files/valtakirja_numeron_siirtoon.docx"
            download=""
            className="textdown"
          >
            <i className="fa fa-download" style={{ fontWeight: "bolder" }}></i>{" "}
            {t("Valtakirja")}
          </a>
          <p></p>
          <a
            href="files/valtakirja_numeron_siirtoon.docx"
            download=""
            className="textdown"
          >
            <i className="fa fa-download"></i> {t("Siirrettävät numerot")}
          </a>
          <p></p>
          <a
            href="files/valtakirja_numeron_siirtoon.docx"
            download=""
            className="textdown"
          >
            <i className="fa fa-download"></i> {t("Vaihdepalvelu")}
          </a>
        </Col>
        <Col lg={4} md={12} className="admincol">
          <p className="adminheader">{t("Upload files")}</p>
          <div
            className="drop-area1"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={openFileDialog}
            style={{ marginBottom: "10px" }}
          >
            <Fileupload height={50} width={50} style={{ opacity: "0.7" }} />
            <p className="drag_drop mb-2">
              {t("Drag and drop files here or click")}
            </p>
            <input
              type="file"
              accept="*"
              ref={inputRef}
              onChange={handleInputChange}
              style={{ display: "none" }}
            />
          </div>
        </Col>
        <Col lg={4} md={12} className="admincol">
          <p className="adminheader">{t("Send files")}</p>
          <div className="form-group">
            <p className="adminheader">{t("List of uploaded files")}</p>
          </div>
        </Col>
      </Row>
    </Form.Group>
  );
};

export default RegisterPageAdminSetting;
