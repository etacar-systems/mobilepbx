import React, { useState } from "react";
import { Col, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import { ReactComponent as Hide } from "../../Assets/Icon/hide.svg";
import { ReactComponent as Show } from "../../Assets/Icon/show.svg";
import CustomTooltipModal from "../CustomTooltipModal";

const SmtpModal = ({
  email_modal_show,
  handleClose,
  loader,
  handlesavedata,
  handleInputChange,
  setShowPassword,
  showPassword,
  smtpData,
}) => {
  const { t } = useTranslation();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Modal
      show={email_modal_show}
      onHide={handleClose}
      aria-labelledby="example-modal-sizes-title-lg"
      size="lg"
    >
      <div className="num_table">
        <div className=" row ">
          <div className="customer col-lg-4 col-md-12">
            <label className="labledata modal-head">{t("Provider")}</label>
            <div className="customer-form-group">
              <input
                type="text"
                className="customer-form-control modal-select"
                name="provider"
                value={smtpData.provider}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="customer col-lg-4 col-md-12">
            <label className="labledata modal-head">{t("User name")}</label>
            <div className="customer-form-group">
              <input
                type="text"
                className="customer-form-control modal-select"
                name="username"
                value={smtpData.username}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="customer col-lg-4 col-md-12">
            <Form.Label className="modal-head">
              {t("Password")}
              <CustomTooltipModal
                tooltip={t(
                  "Password must be 4-15 characters long and can include letters, numbers, and special characters"
                )}
              />
            </Form.Label>
            <InputGroup className="">
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
                className="modal-icon"
              >
                {showPassword ? (
                  <Show height={15} width={15} />
                ) : (
                  <Hide
                    height={17}
                    width={17}
                    style={{
                      fill: "var(--main-adminnumberheader-color)",
                    }}
                  />
                )}{" "}
                {/* Toggle eye icon */}
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"} // Toggle type between "text" and "password"
                placeholder=""
                aria-label="Password"
                aria-describedby="basic-addon1"
                className="search-bg emailforminput"
                name="Password"
                value={smtpData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
              />
            </InputGroup>
          </div>
          <div className="customer col-lg-4 col-md-12">
            <label className="labledata modal-head">{t("SMTP server")}</label>
            <div className="customer-form-group">
              <input
                type="text"
                className="customer-form-control modal-select"
                name="smtpServer"
                value={smtpData.smtpServer}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="customer col-lg-4 col-md-12">
            <label className="labledata modal-head">{t("SMTP port")}</label>
            <div className="customer-form-group">
              <input
                type="text"
                className="customer-form-control modal-select"
                name="smtpPort"
                value={smtpData.smtpPort}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="customer col-lg-4 col-md-12">
              <label className="labledata modal-head">{t("Sendgrid auth")}</label>
              <Form.Check
                aria-label="option 1"
                checked={smtpData.sendgrid_auth === 1}
                name="sendgrid_auth"
                onChange={handleInputChange}
              />
            </div>
            <div className="customer col-lg-8 col-md-12">
              <label className="labledata modal-head">{t("Sendgrid token")}</label>
              <div className="customer-form-group">
                <input
                  type="text"
                  className="customer-form-control modal-select"
                  name="sendgrid_token"
                  value={smtpData.sendgrid_token}
                  onChange={handleInputChange}
                  disabled={smtpData.sendgrid_auth === 0}
                />
              </div>
            </div>
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

export default SmtpModal;
