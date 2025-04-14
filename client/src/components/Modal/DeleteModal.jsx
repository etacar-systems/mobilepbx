import { Modal, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { useTranslation } from "react-i18next";
const DeleteModal = ({ show, handleClose, onDelete, loader, border }) => {
  const { t } = useTranslation();
  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="deletemodal">
        <div style={{ border: border, borderRadius: "3px" }}>
          <Modal.Header
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="modal-delete"
          >
            <Modal.Title className="delete-modal">{t("Delete")}</Modal.Title>
            <Closeicon width={25} onClick={handleClose} height={25} />
          </Modal.Header>
          <Modal.Body className="modal-delete">
            <p className="delete-modal-text">
              {t("Do you really want to delete this record?")}
            </p>
          </Modal.Body>
          <Modal.Footer className="modal-delete">
            <button
              className="btn_cancel me-1"
              onClick={handleClose}
              disabled={loader}
            >
              {t("Cancel")}
            </button>
            {loader ? (
              <Button className="btn_delete me-2">
                <Spinner animation="border" size="sm" />
              </Button>
            ) : (
              <Button className="btn_delete me-2" onClick={onDelete}>
                {t("Delete")}
              </Button>
            )}
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};
export default DeleteModal;
