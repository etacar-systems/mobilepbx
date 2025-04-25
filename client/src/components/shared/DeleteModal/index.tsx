import { Modal, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";

import { ReactComponent as Closeicon } from "../../../Assets/Icon/close.svg";

interface IDeleteModalProps {
  close: () => void;
  onDelete: () => void;
  isSubmitting?: boolean;
}

export const DeleteModal = ({ close, onDelete, isSubmitting }: IDeleteModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal show={true} onHide={close} centered className="deletemodal">
      <div style={{ borderRadius: "3px" }}>
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
          <Closeicon width={25} onClick={close} height={25} />
        </Modal.Header>
        <Modal.Body className="modal-delete">
          <p className="delete-modal-text">
            {t("Do you really want to delete this record?")}
          </p>
        </Modal.Body>
        <Modal.Footer className="modal-delete">
          <button
            className="btn_cancel me-1"
            onClick={close}
            disabled={isSubmitting}
          >
            {t("Cancel")}
          </button>
          {isSubmitting ? (
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
  );
};
