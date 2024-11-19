import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const EmailEdit = ({
  email_modal_edit,
  loader,
  handlesavedata,
  email_temp,
  handleInputChange,
  handleClose,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      show={email_modal_edit}
      onHide={handleClose}
      aria-labelledby="example-modal-sizes-title-lg"
      size="lg"
    >
      <div className="num_table">
        <div className=" row ">
          <div className="customer col-lg-4 col-md-12">
            <label className="labledata modal-head">{t("Sender name")}</label>
            <div className="customer-form-group">
              <input
                type="text"
                className="customer-form-control modal-select"
                name="sender_name"
                value={email_temp.sender_name}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="customer col-lg-4 col-md-12">
            <label className="labledata modal-head">{t("From")}</label>
            <div className="customer-form-group">
              <input
                type="text"
                className="customer-form-control modal-select"
                name="from"
                value={email_temp.from}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="customer col-lg-4 col-md-12">
            <label className="labledata modal-head">{t("Replay to")}</label>
            <div className="customer-form-group">
              <input
                type="text"
                className="customer-form-control modal-select"
                name="replay_to"
                value={email_temp.replay_to}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="customer col-lg-4 col-md-12">
            <label className="labledata modal-head">{t("Subject")}</label>
            <div className="customer-form-group">
              <input
                type="text"
                className="customer-form-control modal-select"
                name="subject"
                value={email_temp.subject}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="row">
            <label className="labledata modal-head">{t("Message")}</label>
            <div className="customer-form-group">
              <textarea
                name="message"
                id=""
                rows={10}
                className="customer-form-control hide_scrollbar"
                value={email_temp.message}
                onChange={handleInputChange}
                style={{height:"250px"}}
              ></textarea>
            </div>
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn_cancel me-3" onClick={handleClose}>
            {t("Cancel")}
          </button>
          {loader ? (
            <button className="btn_save">
              <Spinner animation="border" size="sm" />
            </button>
          ) : (
            <button className="btn_save" onClick={handlesavedata}>
              {t("Save")}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EmailEdit;
