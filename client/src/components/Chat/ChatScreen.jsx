import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "./Sidebar";
import MessageScreen from "./MessageScreen";
import { useDispatch, useSelector } from "react-redux";
import {
  AckBlockUser,
  AcksendMessage,
  CreateGroupUpdate,
  DeleteGroup,
  GroupMemberRole,
  ReceiveMessage,
  RecieveBlockUser,
  ackClearChat,
  ackEditGroup,
  ackLeaveGroup,
  ackRemoveGroup,
  deleteMessage,
  getapiAll,
  makeGroupAdmin,
  postapiAll,
  setUnreadCount,
  sidebarUpdate,
} from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import { openChat, openSidebar } from "../../Redux/Reducers/DataServices";
import { AllEmit, showNotification } from "./SocketConfig";

export default function ChatScreen() {
  // Api Config //
  let Token = Cookies.get("Token");
  const Sidebarapi = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_MOBIILILINJA_SIDEBAR}`;

  //Api Config//

  const dispatch = useDispatch();
  const [checkboxStates, setCheckboxStates] = useState(0);
  const [sidebarobjget, setSidebarobjget] = useState(null);
  const openchat = useSelector((state) => state.openchat.openchat);
  const listOfUser = useSelector(
    (state) => state.getapiall.getapiall.ListofUser
  );
  const opensidebar = useSelector((state) => state.opensidebar.opensidebar);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 991);
  const [chatLoader, setChatLoder] = useState(false);
  const allListeners = useSelector((state) => state.allListeners.allListeners);
  const activeConversationId = Cookies.get("conversation_id");
  const cid = Cookies.get("Company_Id");
  const uid = Cookies.get("User_id");
  const [selectOpen, setSelectOpen] = useState(false);
  const [getReply, setGetReply] = useState("");
  const [sideClick, setSideClick] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const [sendNewMsg, setSendNewMsg] = useState(false);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [admincanmsg, setadmincanmsg] = useState(false);
  const [mediaLoader, setMediaLoader] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    setLoader(true);
    dispatch(getapiAll({ Api: Sidebarapi, Token: Token, urlof: "Sidebar" }))
      .then((res) => {
        if (res) return setLoader(false);
      })
      .catch((err) => {
        return setLoader(true);
      })
      .finally(() => {
        return setLoader(false);
      });
  }, []);

  const screensize = window.innerWidth > 991;

  useEffect(() => {
    const data = {
      uid: uid,
      cid: cid,
    };
    AllEmit("delivere_all_message", data);
  }, []);

  useEffect(() => {
    Cookies.remove("conversation_id");
    Cookies.remove("isGroup");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 991);
    };

    window.addEventListener("resize", handleResize);

    if (isLargeScreen) {
      dispatch(openChat(true));
      dispatch(openSidebar(true));
    } else {
      dispatch(openChat(false));
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLargeScreen, dispatch]);

  const EmitDoubleTick = (recieve) => {
    const tick = {
      cid: cid,
      isgroup: recieve?.group_id ? 1 : 0,
      message_id: recieve?._id,
      group_id: recieve?.group_id ? recieve?.group_id : null,
      receiver_id: recieve?.receiver_id ? recieve?.receiver_id : uid,
      delivery_type: 2,
    };
    AllEmit("send_delivery_status", tick);
  };

  const EmitDoubleTickBlue = (recieve) => {
    const tick = {
      cid: cid,
      isgroup: recieve?.group_id ? 1 : 0,
      message_id: recieve?._id,
      group_id: recieve?.group_id ? recieve?.group_id : null,
      receiver_id: recieve?.receiver_id ? recieve?.receiver_id : uid,
      delivery_type: 3,
    };
    AllEmit("send_delivery_status", tick);
  };

  useEffect(() => {
    const ackObj = allListeners?.listener_params?.message_detail;
    const ackCheckId = ackObj?.receiver_id
      ? ackObj?.receiver_id
      : ackObj?.group_id;
    const sender_id = ackObj?.group_id ? ackObj?.group_id : ackObj?.sender_id;
    if (allListeners.name == "send_online_status") {
      dispatch(
        sidebarUpdate({
          data: allListeners?.listener_params?.is_online,
          id: allListeners?.listener_params?._id,
        })
      );
    }
    if (allListeners.name == "ack_user_online_status") {
      dispatch(
        sidebarUpdate({
          data: allListeners?.listener_params?.user_status,
          id: allListeners?.listener_params?.receiver_id,
        })
      );
    }

    if (allListeners.name === "ack_send_message") {
      
      if (ackCheckId === activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners.listener_params.message_detail,
          ...prevMessages,
        ]);
        setSendNewMsg(true);
        const mediaCheck =
          allListeners.listener_params.message_detail?.media_type;
        if (
          mediaCheck == 1 ||
          mediaCheck == 2 ||
          mediaCheck == 3 ||
          mediaCheck == 4
        ) {
          setMediaLoader(false);
        }
      }
      dispatch(
        AcksendMessage({
          ...sidebarobjget,
          data: allListeners.listener_params.message_detail,
          id: ackCheckId,
          isgroup: allListeners?.listener_params?.isgroup,
        })
      );
    }
    if (allListeners.name === "receive_message") {
      AllEmit("unread_message_count", { uid: uid });
      if (sender_id === activeConversationId) {
        setAllMessage((prevMessages) => {
          const newMessage = allListeners.listener_params.message_detail;
          const newMessageId = newMessage?._id; // Adjust based on your message structure

          const messageAlreadyExists = prevMessages.some(
            (message) => message?._id === newMessageId
          );

          if (messageAlreadyExists) {
            return prevMessages;
          }

          return [newMessage, ...prevMessages];
        });

        // setAllMessage((prevMessages) => [
        //   allListeners.listener_params.message_detail,
        //   ...prevMessages,
        // ]);
        EmitDoubleTickBlue(allListeners.listener_params.message_detail);
        setSendNewMsg(true);
      }

      if (sender_id !== activeConversationId) {
        EmitDoubleTick(allListeners.listener_params.message_detail);
      }
      const addGroup = {
        message: allListeners?.listener_params?.message_detail.message,
        media_type: allListeners?.listener_params?.message_detail.media_type,
        createdAt: allListeners?.listener_params?.message_detail.createdAt,
        isGroup: allListeners?.listener_params?.isgroup,
        name: allListeners?.listener_params?.sender_detail?.name,
        image: allListeners?.listener_params?.sender_detail?.image,
      };
      dispatch(ReceiveMessage({ data: addGroup, id: sender_id }));
    }
    if (allListeners.name === "ack_update_group_message_setting") {
      const message =
        allListeners?.listener_params?.group_detail?.is_admin_send_message;
      const groupId = allListeners?.listener_params?.group_detail?._id;
      dispatch(
        ReceiveMessage({
          data: allListeners.listener_params.message_detail,
          id: groupId,
        })
      );
      if (groupId === activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners?.listener_params?.message_detail,
          ...prevMessages,
        ]);
        const currentUser = listOfUser?.group_users.find(
          (item) => item.member_id._id === uid
        );
        if (message === 1) {
          if (currentUser && currentUser.is_admin === 0) {
            setadmincanmsg(true);
          } else {
            setadmincanmsg(false);
          }
        } else {
          setadmincanmsg(false);
        }
      } else {
        setadmincanmsg(false);
      }
      if (message === 1) {
        setCheckboxStates(1);
      } else {
        setCheckboxStates(0);
      }
    }
    if (allListeners.name === "ack_send_delivery_status") {
      const ackObj = allListeners?.listener_params?.post;
      const ackCheckId = ackObj?.receiver_id
        ? ackObj?.receiver_id
        : ackObj?.group_id;

      const changeMessage = allListeners.listener_params.post;

      if (ackCheckId === activeConversationId) {
        setAllMessage((prevMessages) => {
          return prevMessages.map((item) => {
            if (item._id === changeMessage._id) {
              return {
                ...item,
                delivery_type: changeMessage.delivery_type,
              };
            }

            return item;
          });
        });
      }
    }

    if (allListeners.name === "receive_delivery_status") {
      AllEmit("unread_message_count", { uid: uid });
      const changeMessage = allListeners.listener_params.post;
      const sender_id = changeMessage?.group_id
        ? changeMessage?.group_id
        : changeMessage?.sender_id;

      if (sender_id === activeConversationId) {
        setAllMessage((prevMessages) => {
          const messageIdFind = prevMessages.findIndex(
            (msg) => msg?._id === changeMessage?._id
          );
          if (messageIdFind !== -1) {
            return prevMessages.map((msg, index) =>
              index === messageIdFind
                ? { ...msg, delivery_type: changeMessage?.delivery_type }
                : msg
            );
          } else {
            return prevMessages;
          }
        });
      }
    }
    if (allListeners.name === "ack_read_all_delivered_message") {
      AllEmit("unread_message_count", { uid: uid });
      if (allListeners?.listener_params?.recevier_id === activeConversationId) {
        setAllMessage((prevMessages) => {
          return prevMessages?.map((message) => {
            if (
              allListeners?.listener_params?.message_sender_id_arr.includes(
                message?._id
              )
            ) {
              return {
                ...message,
                delivery_type: 3,
              };
            }
            return message;
          });
        });
      }
    }
    if (allListeners.name === "receive_read_all_delivered_message") {
      const checkId =
        allListeners?.listener_params?.isgroup == 1
          ? allListeners?.listener_params?.recevier_id
          : allListeners?.listener_params?.uid;
      if (checkId == activeConversationId) {
        setAllMessage((prevMessages) => {
          return prevMessages?.map((message) => {
            if (
              allListeners?.listener_params?.message_sender_id_arr.includes(
                message?._id
              )
            ) {
              return {
                ...message,
                delivery_type: 3,
              };
            }
            return message;
          });
        });
      }
    }
    if (allListeners.name === "ack_send_create_group") {
      dispatch(CreateGroupUpdate(allListeners?.listener_params));
    }
    if (allListeners.name === "receive_create_group") {
      dispatch(CreateGroupUpdate(allListeners?.listener_params));
    }
    if (allListeners.name == "receive_edit_group") {
      dispatch(ackEditGroup(allListeners?.listener_params));
    }
    if (allListeners.name === "ack_delete_message") {
      const deletedMessages =
        allListeners?.listener_params?.Deleted_messages || [];

      setAllMessage((prevMessages) => {
        const filteredMessages = prevMessages.filter(
          (message) => !deletedMessages.some((item) => item._id === message._id)
        );

        const lastMessage = filteredMessages[0];

        dispatch(
          AcksendMessage({
            data: lastMessage || allMessage[0],
            id:
              allListeners?.listener_params?.receiver_id ||
              allListeners?.listener_params?.group_id,
            isgroup: allListeners?.listener_params?.isgroup,
          })
        );
        return filteredMessages;
      });
      // dispatch(deleteMessage({allListeners:allListeners?.listener_params,messages:allMessage}))
    }

    if (allListeners.name === "receive_delete_message") {
      const deletedMessages =
        allListeners?.listener_params?.Deleted_messages || [];
      setAllMessage((prevMessages) => {
        const filteredMessages = prevMessages.filter(
          (message) => !deletedMessages.some((item) => item._id === message._id)
        );

        const lastMessage = filteredMessages[0];

        dispatch(
          AcksendMessage({
            data: lastMessage,
            id:
              allListeners?.listener_params?.sender_id ||
              allListeners?.listener_params?.group_id,
            isgroup: allListeners?.listener_params?.isgroup,
          })
        );
        return filteredMessages;
      });
    }
    if (allListeners.name == "ack_remove_group_members") {
      const groupId = allListeners?.listener_params?.groupPost[0]?.group_id;
      if (groupId == activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners?.listener_params?.groupPost[0],
          ...prevMessages,
        ]);
      }
      dispatch(ackRemoveGroup(allListeners?.listener_params?.group_details));
      dispatch(
        AcksendMessage({
          data: allListeners.listener_params.groupPost[0],
          id: groupId,
        })
      );
    }
    if (allListeners.name == "ack_add_group_members") {
      const groupId = allListeners?.listener_params?.groupPost[0]?.group_id;

      if (groupId == activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners?.listener_params?.groupPost[0],
          ...prevMessages,
        ]);
      }
      dispatch(
        AcksendMessage({
          data: allListeners.listener_params.groupPost[0],
          id: groupId,
        })
      );
      dispatch(ackRemoveGroup(allListeners?.listener_params?.group_details));
    }
    if (allListeners.name === "receive_group_member_detail") {
      const groupId = allListeners?.listener_params?.groupPost[0]?.group_id;

      if (groupId === activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners?.listener_params?.groupPost[0],
          ...prevMessages,
        ]);
      }

      const addGroup = {
        message: allListeners?.listener_params?.groupPost[0].message,
        media_type: allListeners?.listener_params?.groupPost[0].media_type,
        createdAt: allListeners?.listener_params?.groupPost[0].createdAt,
        isGroup: allListeners?.listener_params?.groupPost[0].group_id ? 1 : 0,
        name: allListeners?.listener_params?.group_details?.group_name,
      };

      dispatch(ReceiveMessage({ data: addGroup, id: groupId }));
      dispatch(ackRemoveGroup(allListeners?.listener_params?.group_details));
    }

    if (allListeners.name == "receive_group_admin") {
      const groupId = allListeners?.listener_params?.infoMessage?.group_id;

      if (groupId == activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners?.listener_params?.infoMessage,
          ...prevMessages,
        ]);
      }
      dispatch(
        ReceiveMessage({
          data: allListeners.listener_params.infoMessage,
          id: groupId,
        })
      );
      dispatch(
        AcksendMessage({
          data: allListeners.listener_params.infoMessage,
          id: groupId,
        })
      );
      dispatch(makeGroupAdmin(allListeners.listener_params.post));
    }
    if (allListeners.name == "receive_group_member_role") {
      const groupId = allListeners?.listener_params?.infoMessage?.group_id;

      if (groupId == activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners?.listener_params?.infoMessage,
          ...prevMessages,
        ]);
      }
      dispatch(
        ReceiveMessage({
          data: allListeners.listener_params.infoMessage,
          id: groupId,
        })
      );
      dispatch(
        GroupMemberRole({ data: allListeners.listener_params.role, id: uid })
      );
    }
    if (allListeners.name == "ack_send_block") {
      setSidebarobjget((preObj) => {
        if (preObj?._id == allListeners?.listener_params?.block_id) {
          return {
            ...preObj,
            isBlocked: allListeners?.listener_params.isBlocked,
            isblocked_by_reciver:
              allListeners?.listener_params.isBlocked === 1 ? 1 : 0,
          };
        }
        return preObj;
      });
      dispatch(AckBlockUser(allListeners?.listener_params));
    }
    if (allListeners.name == "receive_send_block") {
      setSidebarobjget((preObj) => {
        if (preObj?._id == allListeners?.listener_params?.block_by) {
          return {
            ...preObj,
            isblocked_by_reciver:
              allListeners?.listener_params?.isBlocked === 1 ? 1 : 0,
          };
        }
        return preObj;
      });
      dispatch(RecieveBlockUser(allListeners?.listener_params));
    }
    if (allListeners.name == "ack_delete_conversation") {
      dispatch(DeleteGroup(allListeners?.listener_params?.delete_conversation));
    }
    if (allListeners.name == "ack_leave_goup") {
      const groupId = allListeners?.listener_params?.message_detail?.group_id;

      if (groupId == activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners?.listener_params?.message_detail,
          ...prevMessages,
        ]);
      }
      // dispatch(ackRemoveGroup(allListeners?.listener_params?.group_details))
      dispatch(
        AcksendMessage({
          data: allListeners.listener_params.message_detail,
          id: groupId,
        })
      );
      dispatch(ackLeaveGroup(allListeners?.listener_params?.group_detail));
    }
    if (allListeners.name == "receive_leave_goup") {
      const groupId = allListeners?.listener_params?.message_detail?.group_id;

      if (groupId == activeConversationId) {
        setAllMessage((prevMessages) => [
          allListeners?.listener_params?.message_detail,
          ...prevMessages,
        ]);
      }
      dispatch(
        ReceiveMessage({
          data: allListeners.listener_params.message_detail,
          id: groupId,
        })
      );
      dispatch(ackLeaveGroup(allListeners?.listener_params?.group_detail));
    }
    if (allListeners.name === "receive_delivere_all_message") {
      AllEmit("unread_message_count", { uid: uid });
      const unreadArr = allListeners?.listener_params?.message_upadted_arr;

      unreadArr?.map((val) => {
        if (
          val.receiver_id
            ? val.receiver_id
            : val.group_id == activeConversationId
        ) {
          setAllMessage((prevMessages) => {
            return prevMessages?.map((message) => {
              if (val?._id?.includes(message?._id)) {
                return {
                  ...message,
                  delivery_type: 2,
                };
              }
              return message;
            });
          });
        }
      });
    }
    if (allListeners.name === "ack_clear_chat") {
      const chatId = allListeners?.listener_params?.receiver_id;

      if (activeConversationId === chatId) {
        setAllMessage([]);
      }
      dispatch(ackClearChat(chatId));
    }
    if (allListeners.name === "ack_unread_message_count") {
      const data = allListeners.listener_params;
      dispatch(setUnreadCount(data));
    }
  }, [allListeners]);

  return (
    <>
      <Container style={{ width: "100%" }} className="maincontainerchat" fluid>
        <Row style={{ width: "100%" }} className="mainoverride">
          {opensidebar && (
            <Col
              lg={4}
              style={{ overflow: "hidden" }}
              className="mainoverride1"
            >
              <Sidebar
                setSidebarobjget={setSidebarobjget}
                setChatLoder={setChatLoder}
                selectOpen={selectOpen}
                setSelectOpen={setSelectOpen}
                setGetReply={setGetReply}
                getReply={getReply}
                setSideClick={setSideClick}
                loader={loader}
                setLoader={setLoader}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setadmincanmsg={setadmincanmsg}
              />
            </Col>
          )}

          {openchat && (
            <Col lg={8} className="mainoverride2">
              <MessageScreen
                checkboxStates={checkboxStates}
                setCheckboxStates={setCheckboxStates}
                selectOpen={selectOpen}
                setSelectOpen={setSelectOpen}
                sidebarobjget={sidebarobjget}
                chatLoader={chatLoader}
                setAllMessage={setAllMessage}
                allMessage={allMessage}
                setSidebarobjget={setSidebarobjget}
                setGetReply={setGetReply}
                getReply={getReply}
                sideClick={sideClick}
                setSideClick={setSideClick}
                setSendNewMsg={setSendNewMsg}
                sendNewMsg={sendNewMsg}
                setChatLoder={setChatLoder}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                admincanmsg={admincanmsg}
                setadmincanmsg={setadmincanmsg}
                mediaLoader={mediaLoader}
                setMediaLoader={setMediaLoader}
              />
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}
