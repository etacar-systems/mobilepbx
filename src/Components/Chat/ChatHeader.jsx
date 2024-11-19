import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { ReactComponent as DotsThreeVertical } from "../../Assets/Icon/DotsThreeVertical.svg";
import { ReactComponent as BackArrow } from "../../Assets/Icon/back-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { openChat, openSidebar } from "../../Redux/Reducers/DataServices";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Cookies from "js-cookie";
import EditGroup from "./EditGroup";
import { getapiAll, sidebarUpdate } from "../../Redux/Reducers/ApiServices";
import GroupList from "./GroupList";
import ConfirmationModal from "./ConfirmationModal";
import { AllEmit } from "./SocketConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function ChatHeader({
  sidebarobjget,
  setSidebarobjget,
  checkboxStates,
  setCheckboxStates,
  setGetReply,
  getReply,
}) {
  const convertToLocalTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const timeOptions = { hour: "2-digit", minute: "2-digit" }; // Options to exclude seconds

    if (isToday) {
      return `Last seen at ${date.toLocaleTimeString(undefined, timeOptions)}`; // Only show time if it's today
    } else {
      return `Last seen on ${date.toLocaleDateString()} at ${date.toLocaleTimeString(
        undefined,
        timeOptions
      )}`; // Show full date and time otherwise
    }
  };

  var lastseensidebar = convertToLocalTime(
    sidebarobjget?.last_seen ||
      sidebarobjget?.last_message_time ||
      sidebarobjget?.createdAt
  );

  let imageshowpath;
  if (sidebarobjget?.user_image) {
    imageshowpath = `${process.env.REACT_APP_FILE_BASE_URL}/${sidebarobjget?.user_image}`;
  } else {
    imageshowpath = `${process.env.REACT_APP_FILE_BASE_URL}/${sidebarobjget?.image}`;
  }
  const listOfUserUrl = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_GROUP_LIST_USER}`;
  const NewConversation = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_NEW_CONVERSATION}`;

  let Token = Cookies.get("Token");
  const uid = Cookies.get("User_id");
  const cid = Cookies.get("Company_Id");
  const conversation_id = Cookies.get("conversation_id");
  const Sidebar = useSelector((state) => state.getapiall.getapiall.Sidebar);
  const allListeners = useSelector((state) => state.allListeners.allListeners);
  const screensize = window.innerWidth > 991;
  const dispatch = useDispatch();
  const isGroup = Cookies.get("isGroup");
  const listOfUser = useSelector(
    (state) => state.getapiall.getapiall.ListofUser
  );
  const [groupListShow, setGroupListShow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editGroupShow, setEditGroupShow] = useState(false);
  const [deleteGroupShow, setDeleteGroup] = useState(false);
  const [deleteGroupShow1, setDeleteGroup1] = useState(false);
  const [deleteUserShow, setDeleteUser] = useState(false);
  const [blockUserOpen, setBlockUser] = useState(false);
  const [checkBlock, setCheckBlock] = useState(false);
  const [onlinesocket, setOnlinesocket] = useState("");
  const [exitGroup, setExitGroup] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [isblockedByReciver, setByReciver] = useState(false);
  const [nameBlock, setNameBlock] = useState();
  const [numberOfAdmin, setNumberOfAdmin] = useState(false);
  const [clerChatShow, setClearChatShow] = useState(false);
  const NewConversationdata = useSelector(
    (state) => state.getapiall.getapiall.NewConversation
  );
  const [blockCheckarr, setBlockCheckArr] = useState();

  const handleToggle = (isOpen) => {
    setShowDropdown(isOpen);
  };

  useEffect(() => {
    const data = listOfUser?.group_users?.filter((val) => {
      return val?.is_admin === 1;
    });
    if (data?.length == 1) {
      setNumberOfAdmin(false);
    } else if (data?.length > 1) {
      setNumberOfAdmin(true);
    }
  }, [listOfUser]);

  useEffect(() => {
    if (
      allListeners.name === "ack_typing" &&
      allListeners.listener_params.sender_id === conversation_id
    ) {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
      }, 3000);
    }
  }, [allListeners, conversation_id]);

  useEffect(() => {
    if (
      (allListeners.name == "ack_user_online_status" &&
        allListeners.listener_params.receiver_id == conversation_id) ||
      (allListeners.name == "send_online_status" &&
        allListeners.listener_params._id == conversation_id)
    ) {
      if (
        (allListeners.listener_params.user_status === 0 ||
          allListeners.listener_params.is_online === 0) &&
        allListeners.listener_params.user_lastseen_time !== null
      ) {
        setOnlinesocket(
          convertToLocalTime(
            allListeners.listener_params.user_lastseen_time ||
              allListeners.listener_params.last_seen
          )
        );
      } else if (
        allListeners.listener_params.user_status === 1 ||
        allListeners.listener_params.is_online === 1
      ) {
        setOnlinesocket("Online");
      } else {
        setOnlinesocket("");
      }
    } else {
      setOnlinesocket("");
    }
  }, [allListeners, conversation_id]);

  const openGroupList = () => {
    setGroupListShow(true);
  };

  useEffect(() => {
    if (sidebarobjget?.isGroup === 1) {
      const url = `${listOfUserUrl}/${sidebarobjget?._id}`;
      dispatch(getapiAll({ Api: url, Token, urlof: "ListOfUser" }));
      dispatch(
        getapiAll({
          Api: NewConversation,
          Token: Token,
          urlof: "NewConversation",
        })
      );
    }
  }, [sidebarobjget, groupListShow]);

  const backBtn = () => {
    dispatch(openChat(false));
    dispatch(openSidebar(true));
  };

  const editGroupOpen = () => {
    setEditGroupShow(true);
  };

  const deleteGroup = () => {
    setDeleteGroup(true);
  };

  const EmitDeleteGroup = () => {
    const data = {
      cid: cid,
      uid: uid,
      isgroup: 1,
      receiver_id: sidebarobjget?._id,
    };

    AllEmit("delete_conversation", data);
    if (data) {
      toast.success(t("Exit group successfully"), { autoClose: 2000 });
    }
    setDeleteGroup(false);
    setSidebarobjget(null);
    dispatch(openSidebar(true));
  };
  const EmitDeleteGroup1 = () => {
    const data = {
      cid: cid,
      uid: uid,
      isgroup: 1,
      receiver_id: sidebarobjget?._id,
    };

    AllEmit("delete_conversation", data);
    if (data) {
      toast.success(t("Exit group successfully"), { autoClose: 2000 });
    }
    setDeleteGroup1(false);
    setSidebarobjget(null);
    dispatch(openSidebar(true));
  };

  const deleteUser = () => {
    setDeleteUser(true);
  };

  const EmitDeleteUser = () => {
    const data = {
      cid: cid,
      uid: uid,
      isgroup: 0,
      receiver_id: sidebarobjget?._id,
    };

    AllEmit("delete_conversation", data);
    if (data) {
      toast.success(t("Delete user successfully"), { autoClose: 2000 });
    }
    setDeleteUser(false);
    setSidebarobjget(null);
    dispatch(openSidebar(true));
  };

  const blockUserClick = () => {
    const dataChecked = Sidebar;

    setBlockUser(true);
    // const IsBlocked = dataChecked?.filter((map) => {
    //     if (map._id == conversation_id) {
    //         return map;
    //     }
    // })
    if (sidebarobjget?.isBlocked == "0") {
      setNameBlock(t("Block"));
    } else {
      setNameBlock(t("Unblock"));
    }
  };

  const emitblockUser = () => {
    const blockuser = {
      cid: cid,
      block_by: uid,
      block_id: conversation_id,
      isBlocked: sidebarobjget?.isBlocked == "0" ? 1 : 0,
    };
    AllEmit("send_block", blockuser);
    setBlockUser(false);
    if (sidebarobjget?.isBlocked == "0") {
      setNameBlock(t("Block"));
      toast.success(t("Block user successfully!"), { autoClose: 2000 });
    } else {
      setNameBlock(t("Unblock"));

      toast.success(t("Unblock user successfully!"), { autoClose: 2000 });
    }
  };

  const emitExitGroup = () => {
    const data = {
      uid: uid,
      group_id: conversation_id,
      cid: cid,
    };
    AllEmit("leave_goup", data);
    toast.success("Exit group successfully!", { autoClose: 2000 });
    setExitGroup(false);
  };
  const clerConfirmationModal = () => {
    setExitGroup(false);
    setDeleteGroup(false);
    setBlockUser(false);
    setDeleteUser(false);
    setClearChatShow(false);
    setDeleteGroup1(false);
  };

  useEffect(() => {
    const newdata = Sidebar?.some((val) => {
      return (
        (conversation_id == val?._id && val?.isblocked_by_reciver == 1) ||
        (conversation_id == val?._id && val.isBlocked == 1)
      );
    });

    setByReciver(newdata);
  }, [conversation_id, Sidebar]);

  const clearChat = () => {
    const data = {
      uid: uid,
      receiver_id: sidebarobjget?._id,
      cid: cid,
      isgroup: sidebarobjget?.isGroup ? sidebarobjget?.isGroup : 0,
    };
    AllEmit("clear_chat", data);
    setClearChatShow(false);
    setGetReply("");
    if (sidebarobjget?.isGroup == 1) {
      toast.success(t("Clear group chat successfully!"), { autoClose: 2000 });
    } else {
      toast.success(t("Clear user chat successfully!"), { autoClose: 2000 });
    }
  };
  const { t } = useTranslation();
  return (
    <>
      <Row
        style={{ background: "var(--main-white-color)", height: "56px" }}
        className="borderend3"
      >
        <Col
          xs={11}
          style={{ display: "flex", padding: "3px", alignItems: "center" }}
          className="ps-1"
        >
          {!screensize && (
            <div onClick={backBtn} className="mx-1">
              <BackArrow width={25} height={25} />
            </div>
          )}
          <div className="ms-1">
            {sidebarobjget?.user_image || sidebarobjget?.image ? (
              <Image
                src={imageshowpath}
                style={{ width: "40px", height: "40px" }}
                alt=""
                roundedCircle
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "var( --main-orange-color)",
                  borderRadius: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "var(--main-btninfo-color)",
                }}
              >
                {sidebarobjget?.name?.charAt(0)?.toUpperCase() ||
                  sidebarobjget?.first_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ms-3">
            <div
              style={{
                textTransform: "capitalize",
                color: "var(--main-adminheaderpage-color)",
              }}
            >
              {sidebarobjget.name ||
                sidebarobjget.first_name + sidebarobjget.last_name}
            </div>
            {!isblockedByReciver && (
              <div
                style={{
                  padding:
                    sidebarobjget.description === "" &&
                    sidebarobjget.isGroup == 1
                      ? "12px"
                      : "0px",
                  color: "var(--main-adminheaderpage-color)",
                }}
              >
                {showTyping == true ? (
                  <div style={{ display: "flex", alignItems: "end" }}>
                    <div>{t("typing")}</div>
                    <div class="typingloader">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                ) : onlinesocket !== "" ? (
                  onlinesocket
                ) : sidebarobjget.is_online == 1 &&
                  (sidebarobjget.isGroup == 0 || !sidebarobjget.isGroup) ? (
                  t("Online")
                ) : sidebarobjget.isGroup == 1 ? (
                  sidebarobjget.description
                ) : (
                  lastseensidebar
                )}
              </div>
            )}
          </div>
        </Col>
        <Col
          xs={1}
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <DropdownButton
            align="start"
            id="dropdown-menu-align-end"
            show={showDropdown}
            className="custom-dropdown-button"
            onToggle={handleToggle}
            title={<DotsThreeVertical style={{ cursor: "pointer" }} />}
          >
            {isGroup == 1 && (
              <>
                {listOfUser?.group_users?.map((val) => {
                  if (val?.is_admin === 1 && val.member_id?._id === uid) {
                    return (
                      <>
                        <Dropdown.Item
                          key={val.member_id._id}
                          eventKey="1"
                          onClick={editGroupOpen}
                        >
                          {t("Edit Group")}
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="2" onClick={deleteGroup}>
                          {t("Exit Group")}
                        </Dropdown.Item>
                      </>
                    );
                  } else if (
                    val?.is_admin === 0 &&
                    val.member_id?._id === uid &&
                    val?.isleaved == 0
                  ) {
                    return (
                      <Dropdown.Item
                        eventKey="5"
                        onClick={() => {
                          setExitGroup(true);
                        }}
                      >
                        {t("Exit Group")}
                      </Dropdown.Item>
                    );
                  } else if (
                    val?.is_admin === 0 &&
                    val.member_id?._id === uid &&
                    val?.isleaved == 1
                  ) {
                    return (
                      <Dropdown.Item
                        eventKey="5"
                        onClick={() => setDeleteGroup1(true)}
                      >
                        {t("Delete Group")}
                      </Dropdown.Item>
                    );
                  }

                  return null;
                })}
                {listOfUser && (
                  <Dropdown.Item eventKey="3" onClick={openGroupList}>
                    {t("List of User")}
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  eventKey="4"
                  onClick={() => setClearChatShow(true)}
                >
                  {t("Clear Chat")}
                </Dropdown.Item>
              </>
            )}
            {isGroup == 0 && (
              <>
                {/* {Sidebar?.map((user) => {
                                        if (user._id == conversation_id) {
                                            return ( */}
                <Dropdown.Item eventKey="1" onClick={blockUserClick}>
                  {sidebarobjget?.isBlocked == "0"
                    ? t("Block User")
                    : t("Unblock User")}
                </Dropdown.Item>
                {/* );
                                        }
                                        return null;
                                    })} */}
                <Dropdown.Item eventKey="2" onClick={deleteUser}>
                  {t("Delete User")}
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => setClearChatShow(true)}
                >
                  {t("Clear Chat")}
                </Dropdown.Item>
              </>
            )}
          </DropdownButton>
        </Col>
      </Row>
      {editGroupShow && (
        <EditGroup
          editGroupShow={editGroupShow}
          setEditGroupShow={setEditGroupShow}
          sidebarobjget={sidebarobjget}
          setSidebarobjget={setSidebarobjget}
        />
      )}
      {groupListShow && (
        <GroupList
          groupListShow={groupListShow}
          setGroupListShow={setGroupListShow}
          sidebarobjget={sidebarobjget}
          listOfUser={listOfUser}
          checkboxStates={checkboxStates}
          setCheckboxStates={setCheckboxStates}
        />
      )}
      {deleteGroupShow && (
        <ConfirmationModal
          title={t(`Delete Group`)}
          body={
            numberOfAdmin
              ? t(`Are you sure you want to delete Group`)
              : t(
                  "You are the last admin of the group, first, you make any member admin then you can leave the group"
                )
          }
          button2={numberOfAdmin ? t("Cancel") : t("Ok")}
          button1={numberOfAdmin ? t("Yes") : ""}
          confirmationModal={deleteGroupShow}
          setConfirmationModal={setDeleteGroup}
          button2function={clerConfirmationModal}
          button1function={EmitDeleteGroup}
          cancelcss={numberOfAdmin ? true : false}
        />
      )}
      {deleteGroupShow1 && (
        <ConfirmationModal
          title={t(`Delete Group`)}
          body={t(`Are you sure you want to delete Group`)}
          button2={t("Cancel")}
          button1={t("Yes")}
          confirmationModal={deleteGroupShow1}
          setConfirmationModal={setDeleteGroup1}
          button2function={clerConfirmationModal}
          button1function={EmitDeleteGroup1}
          cancelcss={true}
        />
      )}
      {deleteUserShow && (
        <ConfirmationModal
          title={t("Delete User")}
          body={t(`Are you sure you want to delete User`)}
          button2={t("Cancel")}
          button1={t("Yes")}
          confirmationModal={deleteUserShow}
          setConfirmationModal={setDeleteUser}
          button2function={clerConfirmationModal}
          button1function={EmitDeleteUser}
          cancelcss={true}
        />
      )}
      {blockUserOpen && (
        <ConfirmationModal
          title={t("Block User")}
          body={`${t("Are you sure you want to")} ${nameBlock} ${t("user?")}`}
          button2={t("Cancel")}
          button1={t("Yes")}
          confirmationModal={blockUserOpen}
          setConfirmationModal={setBlockUser}
          button2function={clerConfirmationModal}
          button1function={emitblockUser}
          cancelcss={true}
        />
      )}
      {clerChatShow && (
        <ConfirmationModal
          title={t("Clear Chat")}
          body={`${t("Are you sure you want to clear")} ${
            isGroup == 1 ? t("Group") : t("User")
          } ${t("chat?")}`}
          button2={t("Cancel")}
          button1={t("Yes")}
          confirmationModal={clerChatShow}
          setConfirmationModal={setClearChatShow}
          button2function={clerConfirmationModal}
          button1function={clearChat}
          cancelcss={true}
        />
      )}
      {exitGroup && (
        <ConfirmationModal
          title={t("Exit Group")}
          body={t("Are you sure you want to exit group?")}
          button2={t("Cancel")}
          button1={t("Yes")}
          confirmationModal={exitGroup}
          setConfirmationModal={setExitGroup}
          button2function={clerConfirmationModal}
          button1function={emitExitGroup}
          cancelcss={true}
        />
      )}
    </>
  );
}

export default ChatHeader;
