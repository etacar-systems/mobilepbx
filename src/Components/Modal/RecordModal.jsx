import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { Col, Row } from "react-bootstrap";
import DragFile from "./DragFile";
import { ReactComponent as Download } from "../../Assets/Icon/download-svgrepo-com.svg";
import { useTranslation } from "react-i18next";
export default function RecordModal({ recordshow, setRecordShow }) {
  const [files, setFiles] = useState([]);
  const [dragShow, setDragNotShow] = useState(true);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const setChunkUrl = useRef(null);
  const { t } = useTranslation();
  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setRecording(true);
        const mediaRecorderInstance = new MediaRecorder(stream);
        mediaRecorderInstance.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, e.data]);
            const blob = new Blob([e.data], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            audioRef.current.src = url;
          }
        };
        mediaRecorderInstance.start();
        mediaRecorder.current = mediaRecorderInstance;
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const handleStopRecording = async () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      await mediaRecorder.current.stream
        .getTracks()
        .forEach((track) => track.stop()); // Stop tracks explicitly
      setRecording(false);

      setAudioChunks([]);
      mediaRecorder.current = null;
    }
  };
  const handleClose = () => {
    setRecordShow(false);
  };
  return (
    <div>
      <Modal
        show={recordshow}
        onHide={() => setRecordShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <div className="new-dial">
          <div
            className="p-3"
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <h6>{t("Record")}</h6>
              <Closeicon width={25} onClick={handleClose} height={25} />
            </div>
          </div>
          <div
            style={{
              borderBottom: "1px solid var(--main-bordermodaldashboard-color)",
            }}
          >
            <Row className="p-3">
              <Col
                md={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div className="record_plus" onClick={handleStartRecording}>
                  <p className="m-0">+</p>
                </div>
              </Col>
              <Col
                md={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div className="record_plus1" onClick={handleStopRecording}>
                  <p className="m-0"></p>
                </div>
              </Col>
            </Row>
            <Row className="p-3 text-center">
              <Col md={12} className="text-center">
                <audio ref={audioRef} controls />
              </Col>
              <Col
                md={12}
                className="p-3 d-flex justify-content-center align-items-center"
              >
                <h6 className="pe-2">{t("Lataa nauhoite")} </h6>
                <Download style={{ width: "15px", height: "15px" }} />
              </Col>
            </Row>
            <Row className="px-3 text-center mb-3">
              <DragFile
                setFiles={setFiles}
                files={files}
                setDragNotShow={setDragNotShow}
              />
            </Row>
          </div>

          <div className="mb-4 d-flex justify-content-end me-4 mt-3">
            <button className="btn_cancel me-3" onClick={handleClose}>
              {t("Cancel")}
            </button>
            <button className="btn_save2">{t("Save")}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
