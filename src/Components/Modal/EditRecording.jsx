import { Modal, Button } from "react-bootstrap";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { useTranslation } from "react-i18next";
const EditRecording = ({ show, onHide }) => {
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header
        className="edit-mod"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Modal.Title className="delete-modal">
          {t("Speech to text")}
        </Modal.Title>
        <Closeicon height={25} width={25} onClick={onHide} />
      </Modal.Header>
      <Modal.Body className="edit-mod">
        <div className="row clearfix">
          <div className="col-md-12">
            <div className="body demo-card">
              <div className="row clearfix">
                <div className="col-lg-12 col-md-12">
                  <label className="edit-listner-modal-text">
                    {t("Recording details...")}
                  </label>
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
                    <button className="mb-2 btn_listner">{t("Save")}</button>
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

export default EditRecording;
