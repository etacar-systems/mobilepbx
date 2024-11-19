import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  WAackClearChat,
  WAcksendMessage,
  ackClearChat,
  ackUserAssign,
  getapiAll,
} from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";
import Wpmessageshow from "./Wpmessageshow";
import Wpsendmessage from "./whatsappsendmsg";
import Wpchatheader from "./Wpchatheader";
import { AllWhatsappEmit } from "./Whatsappsocketconfig";
import { useTranslation } from "react-i18next";

export default function WpChatScreen({
  sidebarobjget,
  allMessage,
  sideClick,
  setSideClick,
  setSidebarobjget,
  setChatLoder,
  chatLoader,
  setAckAssign,
  refreshState,
}) {
  const { t } = useTranslation();
  let Token = Cookies.get("Token");
  const Conversation_Api = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_WhatsappConversation}`;

  const getWidth = useRef("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [mediaLoader, setMediaLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getReply, setGetReply] = useState("");
  const WMessages = useSelector(
    (state) => state.getapiall.getapiall.WConversation
  );
  const [allMessages, setAllMessages] = useState([]);
  const chatOpen = Cookies.get("conversation_id");
  const WhatsappAllListeners = useSelector(
    (state) => state.whatsappAllListeners.whatsappAllListeners
  );
  const chatContainerRef = useRef(null);
  const totalPages = Math.ceil(WMessages?.totalMessageCount / 20);
  const [replyshow, setReplyShow] = useState(false);

  const EmitDoubleTickBlue = (recieve) => {
    const tick = {
      sender_id: recieve?.receiver_id,
      receiver_id: recieve?.sender_id,
      cid: recieve?.cid,
    };
    AllWhatsappEmit("read_all_message", tick);
  };

  useEffect(() => {
    if (allMessages == undefined || allMessages?.length == 0) {
      setAllMessages(WMessages?.conversation_data);
    }
  }, [WMessages]);

  useEffect(() => {
    if (WhatsappAllListeners.name === "ack_receive_message") {
      if (
        chatOpen ==
        WhatsappAllListeners?.listener_params?.message_detail?.sender_id
      ) {
        setAllMessages((prevMessages) => [
          WhatsappAllListeners?.listener_params?.message_detail,
          ...prevMessages,
        ]);

        EmitDoubleTickBlue(
          WhatsappAllListeners?.listener_params?.message_detail
        );
      }
      dispatch(
        WAcksendMessage({
          data: WhatsappAllListeners.listener_params.message_detail,
          id: WhatsappAllListeners.listener_params.message_detail.sender_id,
          key: true,
          // image: allListeners?.listener_params?.sender_detail?.image
        })
      );
    }
    if (WhatsappAllListeners.name == "ack_delete_message") {
      const deletedMessages =
        WhatsappAllListeners?.listener_params?.user_assign;
      if (chatOpen == WhatsappAllListeners?.listener_params?.receiver_id) {
        if (WhatsappAllListeners?.listener_params?.user_assign.length != 0) {
          setAllMessages((prevMessages) => {
            const filteredMessages = prevMessages?.filter(
              (message) =>
                !deletedMessages.some((item) => item === message.message_id)
            );
            const lastMessage = filteredMessages[0];

            dispatch(
              WAcksendMessage({
                data: lastMessage || allMessages[0],
                id: WhatsappAllListeners?.listener_params?.receiver_id,
              })
            );
            return filteredMessages;
          });
        }
      }
    }
    if (WhatsappAllListeners.name === "ack_clear_chat") {
      if (chatOpen == WhatsappAllListeners.listener_params.receiver_id) {
        setAllMessages([]);
      }
      dispatch(WAackClearChat(chatOpen));
    }
    if (WhatsappAllListeners.name === "ack_send_message") {
      if (
        chatOpen ==
        WhatsappAllListeners.listener_params.message_detail.receiver_id
      ) {
        setAllMessages((prevMessages) => [
          WhatsappAllListeners.listener_params.message_detail,
          ...(Array.isArray(prevMessages) ? prevMessages : []),
        ]);
      }
      dispatch(
        WAcksendMessage({
          data: WhatsappAllListeners.listener_params.message_detail,
          id: WhatsappAllListeners.listener_params.message_detail.receiver_id,
          key: false,
          // image: allListeners?.listener_params?.sender_detail?.image
        })
      );
    }
    if (WhatsappAllListeners.name === "ack_deliver_status") {
      const deliver_obj = WhatsappAllListeners.listener_params.message_detail;

      if (deliver_obj?.receiver_id == chatOpen) {
        setAllMessages((preMsg) => {
          return preMsg?.map((val) => {
            if (val.message_id == deliver_obj?.message_id) {
              return {
                ...val,
                delivery_type: deliver_obj?.delivery_type,
                fail_message: deliver_obj?.fail_message,
              };
            }
            return val;
          });
        });
      }
    }
    if (WhatsappAllListeners.name === "ack_user_assign") {
      dispatch(
        ackUserAssign(WhatsappAllListeners?.listener_params?.user_assign)
      );
      setAckAssign((state) => !state);
    }
  }, [WhatsappAllListeners]);

  useEffect(() => {
    if (sideClick == true) {
      setAllMessages([]);
      setCurrentPage(1);
    }
  }, [sideClick]);

  useEffect(() => {
    if (
      chatContainerRef.current != null &&
      chatContainerRef.current &&
      (sideClick == true || sideClick == false)
    ) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [allMessages, sideClick]);

  const fetchMoreMessages = async (page) => {
    const conversation_id = Cookies.get("conversation_id");
    if (page > totalPages || loading || conversation_id == "") {
      return;
    }
    setLoading(true);
    setSideClick(false);
    const addedParamConversation = `${Conversation_Api}/${conversation_id}?page=${page}&size=20`;
    try {
      dispatch(
        getapiAll({
          Api: addedParamConversation,
          Token: Token,
          urlof: "WConversation",
        })
      ).then((res) => {
        var resget = res.payload.response.conversation_data;
        if (resget.length > 0) {
          const currentScrollPosition =
            chatContainerRef.current.scrollHeight -
            chatContainerRef.current.scrollTop;

          setLoading(false);
          setAllMessages((prevMessages) => {
            const combinedMessages = [...prevMessages, ...resget];
            return combinedMessages;
          });
          setTimeout(() => {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight - currentScrollPosition;
          }, 0);
        } else {
          setLoading(false);
        }
      });
    } catch (err) {}
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current?.scrollHeight;
      const scrollTop = chatContainerRef.current?.scrollTop;
      const clientHeight = chatContainerRef.current?.clientHeight;
      if (scrollTop == 0 && scrollHeight > clientHeight && !loading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchMoreMessages(nextPage);
      }
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [allMessages]);

  useEffect(() => {
    const calculateDynamicHeight = () => {
      const windowHeight = window.innerHeight - 240;
      setDynamicHeight(windowHeight);
    };
    calculateDynamicHeight();
    window.addEventListener("resize", calculateDynamicHeight);
    return () => {
      window.removeEventListener("resize", calculateDynamicHeight);
    };
  }, []);

  const replyOnclick = (getId) => {
    const messageElement = document.getElementById(getId);
    if (messageElement) {
      messageElement.scrollIntoViewIfNeeded({
        behavior: "smooth",
        block: "start",
      });
      const previouColor = messageElement.style.backgroundColor;
      messageElement.style.backgroundColor = "var(--main-wpchatscreen-color)";

      setTimeout(() => {
        messageElement.style.backgroundColor = previouColor;
      }, 1000);
    }
  };

  return (
    <div className="w-100 position-relative">
      {sidebarobjget && (
        <>
          <div ref={getWidth}>
            <Wpchatheader
              sidebarobjget={sidebarobjget}
              setSidebarobjget={setSidebarobjget}
            />
          </div>
          {loading && (
            <div className="chatloder_position">
              <div>Loading</div>
              <div class="typingloader">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          <div
            style={{
              height: dynamicHeight,
              marginLeft: "-12px",
              marginRight: "-11px",
            }}
            className="messagescreen"
            ref={chatContainerRef}
          >
            <Wpmessageshow
              chatLoader={chatLoader}
              allMessages={allMessages}
              mediaLoader={mediaLoader}
              replyOnclick={replyOnclick}
              setGetReply={setGetReply}
              setReplyShow={setReplyShow}
              loading={loading}
            />
          </div>
          <div>
            <Wpsendmessage
              getReply={getReply}
              sidebarobjget={sidebarobjget}
              mediaLoader={mediaLoader}
              setMediaLoader={setMediaLoader}
              replyshow={replyshow}
              setReplyShow={setReplyShow}
              refreshState={refreshState}
            />
          </div>
        </>
      )}
    </div>
  );
}
