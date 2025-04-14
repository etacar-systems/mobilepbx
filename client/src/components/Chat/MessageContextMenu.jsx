import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { ReactComponent as Downmessage } from "../../Assets/Icon/downmessage1.svg";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Fi } from "../ConstantConfig";

const MessageContextMenu = ({
  setEmojiPickerOpen,
  setAnchorEl,
  class1,
  handleCopyMessage,
  fullobject,
  handleDeleteMessage,
  handleToggleDropdown,
  showDropdown,
  handleSelect,
  handleForwardMessage,
  handleReply,
}) => {
  const { t } = useTranslation();
  const language = Cookies.get("language");
  const handleEmojiPickerToggle = (event) => {
    setEmojiPickerOpen((state) => !state);
    setAnchorEl(event.currentTarget);
  };
  const Sidebar = useSelector((state) => state.getapiall.getapiall.Sidebar);
  var conversation_id = Cookies.get("conversation_id");
  const [replyHide, setReplyHide] = useState(false);
  useEffect(() => {
    if (
      Sidebar.some(
        (item) => item._id === conversation_id && item.isBlocked === 1
      )
    ) {
      setReplyHide(true);
    } else {
      setReplyHide(false); // Optionally reset if no match found
    }
  }, [Sidebar, conversation_id]);

  return (
    <>
      {language === Fi && (
        <style>
          {`
           .Dropdownbutton .dropdown-menu {
            width:200px
            }
          `}
        </style>
      )}
      <DropdownButton
        align="start"
        id="dropdown-menu-align-end"
        className="custom-dropdown-button Dropdownbutton"
        onToggle={handleToggleDropdown}
        show={showDropdown} // Control visibility with state
        style={{ padding: "0px", margin: "0px", background: "unset" }}
        title={
          <Downmessage
            style={{ cursor: "pointer", height: "15px", width: "20px" }}
            className={class1}
          />
        }
      >
        <Dropdown.Item onClick={() => handleDeleteMessage(fullobject)}>
          {t("Delete Message")}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleForwardMessage(fullobject)}>
          {t("Forward Message")}
        </Dropdown.Item>
        {fullobject?.media_type == 0 && (
          <Dropdown.Item onClick={() => handleCopyMessage(fullobject)}>
            {t("Copy Message")}
          </Dropdown.Item>
        )}
        <Dropdown.Item onClick={() => handleSelect(fullobject)}>
          {t("Select")}
        </Dropdown.Item>
        {replyHide == false && (
          <Dropdown.Item onClick={() => handleReply(fullobject)}>
            {t("Reply Message")}
          </Dropdown.Item>
        )}
      </DropdownButton>
    </>
  );
};

export default MessageContextMenu;
