import React from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";

export default function ConfirmationModal({
  title,
  body,
  button1,
  button2,
  confirmationModal,
  setConfirmationModal,
  button2function,
  button1function,
  cancelcss,
}) {
  const handleClose = () => {
    setConfirmationModal(false);
  };
  return (
    <Modal show={confirmationModal} onHide={handleClose} centered>
      <div style={{ backgroundColor: "var(--main-white-color)" }}>
        <Modal.Header
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Modal.Title className="delete-modal">{title}</Modal.Title>
          <Closeicon width={25} onClick={handleClose} height={25} />
        </Modal.Header>

        <Modal.Body className="bodymodal">
          <p className="delete-modal-text">{body}</p>
        </Modal.Body>

        <Modal.Footer>
          {button1 && <> {cancelcss ? (
            <>
              {" "}
              <button className="btn_save" onClick={() => button1function("1")}>
                {button1}
              </button>
            </>
          ) : (
            <Button
              className="buttoncolormodal"
              onClick={() => button1function("1")}
            >
              {button1}
            </Button>
          )}</>}
         
          {button2 && (
            <>
              {cancelcss ? (
                <button
                  className="btn_cancel "
                  onClick={() => button2function("2")}
                >
                  {button2}
                </button>
              ) : (
                <Button
                  className="buttoncolormodal"
                  onClick={() => button2function("2")}
                >
                  {button2}
                </Button>
              )}
            </>
          )}
        </Modal.Footer>
      </div>
    </Modal>
  );
}
