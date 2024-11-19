import React, { useEffect } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const WhatsappContextMenu = ({
  handleToggleDropdown,
  showModal,
  setShowModal,
  handleDeleteMessage,
  handleCopyMessage,
  value,
  handleReplyMessage,
}) => {
  const { t } = useTranslation();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showModal &&
        event.target.closest(".custom-dropdown-button") === null
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, setShowModal]);

  return (
    <DropdownButton
      align="start"
      className="custom-dropdown-button"
      onToggle={handleToggleDropdown}
      show={showModal}
      onClick={() => setShowModal(false)}
      style={{
        background: "unset",
        position: "absolute",
        zIndex: "5px",
        padding: "0px",
        margin: "0px",
      }}
    >
      <Dropdown.Item onClick={() => handleDeleteMessage(value)}>
        {t("Delete Message")}
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleCopyMessage(value)}>
        {t("Copy Message")}
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleReplyMessage(value)}>
        {t("Reply Message")}
      </Dropdown.Item>
    </DropdownButton>
  );
};
