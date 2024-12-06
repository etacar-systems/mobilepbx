import { Modal, Button } from "react-bootstrap";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { useTranslation } from "react-i18next";
const ListenRecordingModal = ({ show, onHide, recordingUrl, recordDate }) => {
  const { t } = useTranslation();

  const formattedDate = new Date(recordDate).toLocaleDateString("en-GB").replace(/\//g, ".");
  function extractTimeFromDate(dateString, locale) {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header
        className="rec-modal"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Modal.Title className="delete-modal">{t("Listen recording")}</Modal.Title>
        <Closeicon height={23} width={23} onClick={onHide} />
      </Modal.Header>
      <Modal.Body className="rec-modal">
        <div className="row clearfix">
          <div className="col-md-12">
            <div className="body demo-card">
              <div className="row clearfix">
                <div className="col-lg-12 col-md-12">
                  <label className="listner-modal-text">
                    {formattedDate}
                    {"  "}
                    {"  "}
                    {extractTimeFromDate(recordDate)}
                  </label>
                  <div className="form-group new-audio">
                    <div className="container-audio new-audio-listner">
                      <audio src={recordingUrl} controls loop className="audio-data">
                        <source src="" type="audio/wav" />
                        {t("Your browser does not support the audio tag.")}
                      </audio>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="modal-footer">
                    <button className="mb-2 btn_cancel" onClick={onHide} aria-label="Close">
                      {t("Close")}
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

export default ListenRecordingModal;
