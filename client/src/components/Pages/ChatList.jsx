import React from "react";

import statusClassName from '../../layouts/AuthenticatedLayout/layout.module.scss'

function ChatList({
  usersOnline,
  name,
  message,
  status,
  statusName,
  onOpenModal,
  activeTab,
  badge,
  image,
}) {
  return (
    <ul className={`right_chat list-unstyled mb-0`}>
      <li className={`${status}`}>
        <a href="#" data-toggle="modal" data-target="#contactcard">
          <div
            className="medias"
            onClick={() => onOpenModal(name)}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              className="avtar-pic w35 bg-cyan"
              style={{
                fontSize: "18px",
                flexShrink: 0,
                backgroundColor: "var(--main-orange-color)",
              }}
            >
              {image ? (
                <img
                  style={{ height: "34px", width: "34px", borderRadius: "5px" }}
                  src={process.env.REACT_APP_FILE_BASE_URL + "/" + image}
                />
              ) : (
                <span className="avtarfont">
                  {activeTab === "Group" ? usersOnline : name.charAt(0)}
                </span>
              )}
            </div>
            <div
              className="medias-body"
              style={{ flex: 1, overflow: "hidden" }}
            >
              <span
                className={`name ${
                  activeTab === "Extension" ? "webchatname_ext" : "webchatname"
                }`}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  textTransform: "capitalize",
                }}
                className="message webchatstatus m-0"
              >
                {message}
              </span>
              {badge && <span className={`badge badge-outline status ${statusClassName.userStatus} ${statusClassName.userStatus_badge} ${statusClassName[`userStatus_${statusName}`]}`}></span>}
            </div>
          </div>
        </a>
      </li>
    </ul>
  );
}

export default ChatList;
