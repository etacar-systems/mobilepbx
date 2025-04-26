import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

import { ReactComponent as Closeicon } from "../../../../../Assets/Icon/close.svg";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";

interface IAudioDetailsModal {
  onHide: () => void;
  recordingUrl: string;
  caller_id_number: string;
  caller_id_name: string;
  createdAt: string | Date;
}

export const AudioDetailsModal = ({
  onHide,
  recordingUrl,
  caller_id_number,
  caller_id_name,
  createdAt,
}: IAudioDetailsModal) => {
  const token = Cookies.get("Token");

  const [recordUrl, setRecordUrl] = useState<string>();
  const { t } = useTranslation();

  const formatData = (date: Date | string) => {
    return new Date(date).toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!recordingUrl || !token) return;
    axios
      .get(
        process.env.REACT_APP_MOBIILILINJA_BASE_URL + "/company/call_record/" + recordingUrl,
        {
          headers: {
            Authorization: token,
          },
          responseType: "blob",
        }
      )
      .then((response) => {
        setRecordUrl(URL.createObjectURL(response.data));
      })
      .catch(() => "");
  }, [recordingUrl, token]);

  return (
    <Modal show={true} onHide={onHide} size="lg">
      <Modal.Header
        className="rec-modal"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Modal.Title className="delete-modal">
          {t("Call recording")}
        </Modal.Title>
        <Closeicon height={23} width={23} onClick={onHide} />
      </Modal.Header>
      <Modal.Body className="rec-modal">
        <div className="row clearfix">
          <div className="col-md-12">
            <div className="body demo-card">
              <div className="row clearfix">
                <div className="col-lg-12 col-md-12">
                  <label className="listner-modal-text2">
                    {caller_id_number} {caller_id_name}
                  </label>
                  <br></br>
                  <label style={{ color: "var(--main-adminheaderpage-color)" }}>
                    {formatData(createdAt)}
                  </label>
                  <div className="form-group new-audio">
                    <div className="container-audio new-audio-listner2">
                      <Suspense>
                        <audio
                          src={recordUrl}
                          controls
                          loop
                          className="audio-data"
                        >
                          <source src="" type="audio/wav" />
                          {t("Your browser does not support the audio tag.")}
                        </audio>
                      </Suspense>
                    </div>
                    <textarea
                      name=""
                      placeholder={t("Speech to text")}
                      id=""
                      style={{
                        width: "100%",
                        padding: "6px 12px",
                        height: "100px",
                        borderColor: "var(--main-bordermodaldashboard-color)",
                      }}
                      // value={message}
                      // onChange={handleChange}
                      className="search-bg textcall"
                    ></textarea>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="modal-footer">
                    <button
                      className="mb-2 btn_cancel"
                      onClick={onHide}
                      aria-label="Close"
                    >
                      {t("Cancel")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
