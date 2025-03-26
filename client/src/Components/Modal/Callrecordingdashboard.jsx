import { Modal, Button } from "react-bootstrap";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { useTranslation } from "react-i18next";
const Callrecordingdashboard = ({
  show,
  onHide,
  recordingUrl,
  callerid,
  callername,
  createdat,
}) => {
  const { t } = useTranslation();
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
                    {callerid} {callername}
                  </label>
                  <br></br>
                  <label style={{ color: "var(--main-adminheaderpage-color)" }}>
                    {createdat}
                  </label>
                  <div className="form-group new-audio">
                    <div className="container-audio new-audio-listner2">
                      <audio
                        src={recordingUrl}
                        controls
                        loop
                        className="audio-data"
                      >
                        <source src="" type="audio/wav" />
                        {t("Your browser does not support the audio tag.")}
                      </audio>
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

export default Callrecordingdashboard;
