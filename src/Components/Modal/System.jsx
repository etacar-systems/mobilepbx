import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import cloud from "../../Assets/Icon/cloud-upload.svg";
import { ReactComponent as Fileupload } from "../../Assets/Icon/fileupload.svg";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import DragFile from "./DragFile";
import config from "../../config";

export default function System({
  handleClose,
  show,
  header,
  handlesavedata,
  setFiles,
  files,
  loader,
  setFormData,
  formData,
  handleeditsavedata,
  isEdit,
}) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [dragShow, setDragNotShow] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.recname) {
      newErrors.recname = t("Recording name is required");
      valid = false;
    }

    if (!formData.recdesc) {
      newErrors.recdesc = t("Recording name is required");
      valid = false;
    }
    if (isEdit !== "edit") {
      if (!files) {
        newErrors.files = t("File is required");
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (isEdit === "edit") {
        handleeditsavedata();
      } else {
        handlesavedata();
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const { files: droppedFiles } = e.dataTransfer;

    handleFiles(droppedFiles[0]);
  };

  const handleFiles = (fileList) => {
    setFiles(fileList);
    setErrors((state) => ({ ...state, files: "" }));
  };

  const handleInputChange = (e) => {
    const fileList = e.target.files[0];
    handleFiles(fileList);
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  return (
    <>
      <Modal show={show} size="lg">
        <div className="modal-data">
          <div
            className="p-3"
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between add_new_num">
              <h6>{header}</h6>
              <Closeicon width={23} onClick={handleClose} height={23} />
            </div>
          </div>
          <div className="p-3">
            <Form
              style={{
                borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
              }}
            >
              <Row className="mb-4">
                <Col lg={4} md={12}>
                  <Row>
                    <Col lg={12}>
                      <Form.Label className="modal-head">{t("Recording name")}</Form.Label>
                      <Form.Control
                        className="search-bg"
                        name="recname"
                        value={formData.recname}
                        onChange={handleChange}
                      />
                      {errors.recname && (
                        <div className="text-danger error-ui">{errors.recname}</div>
                      )}
                    </Col>

                    <Col lg={12}>
                      <Form.Label className="modal-head mt-3">
                        {t("Recording description")}
                      </Form.Label>
                      <Form.Control
                        className="search-bg"
                        name="recdesc"
                        value={formData.recdesc}
                        onChange={handleChange}
                      />
                      {errors.recdesc && (
                        <div className="text-danger error-ui">{errors.recdesc}</div>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col lg={8} md={12}>
                  <Form.Label className="modal-head">{t("Soundfile: wav, mp3")}</Form.Label>

                  <DragFile
                    setFiles={setFiles}
                    files={files}
                    accept={`.${config.AUDIO.MP3},.${config.AUDIO.WAV}`}
                    setErrors={setErrors}
                    setDragNotShow={setDragNotShow}
                  />
                  {errors.files && <div className="text-danger error-ui">{errors.files}</div>}
                </Col>
              </Row>
            </Form>
          </div>

          <div
            className=" d-flex justify-content-end "
            style={{ marginBottom: "37px", marginRight: "33px" }}
          >
            <button className="btn_cancel me-2" onClick={handleClose} disabled={loader}>
              {t("Cancel")}
            </button>
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
      </Modal>
    </>
  );
}
