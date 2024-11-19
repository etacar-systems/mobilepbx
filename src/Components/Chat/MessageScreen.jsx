import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageShow from "./MessageShow";
import SendMessage from "./SendMessage";
import { useDispatch, useSelector } from "react-redux";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import Cookies from "js-cookie";

export default function MessageScreen({
  getReply,
  setGetReply,
  setSideClick,
  sideClick,
  setSelectOpen,
  selectOpen,
  sidebarobjget,
  chatLoader,
  setAllMessage,
  allMessage,
  setSidebarobjget,
  sendNewMsg,
  setSendNewMsg,
  setChatLoder,
  admincanmsg,
  setadmincanmsg,
  setCurrentPage,
  currentPage,
  setMediaLoader,
  mediaLoader,
  checkboxStates,
  setCheckboxStates,
}) {
  const Conversation_Api = `${process.env.REACT_APP_MOBIILILINJA_BASE_URL}${process.env.REACT_APP_CONVERSATION_API}`;
  let Token = Cookies.get("Token");
  const getWidth = useRef("");
  const dispatch = useDispatch();
  const conversation = useSelector(
    (state) => state.getapiall?.getapiall?.Conversation
  );
  const [loader, setLoader] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState(0);
  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [forwardMultiple, setForwardMultiple] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [forwardModal, setForwardModal] = useState(false);
  const [deleteGet, setDeleteGet] = useState("");
  const totalPages = Math.ceil(conversation?.response?.totalMessgesCount / 20);
  const messagesEndRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const container = messagesEndRef?.current;
    if (!container) return;

    setImagesLoaded(false);
    const images = container?.querySelectorAll("img");
    let loadedImagesCount = 0;

    images?.forEach((img) => {
      img.onload = () => {
        loadedImagesCount += 1;
        if (loadedImagesCount === images.length) {
          setImagesLoaded(true);
        }
      };
    });
    if (images?.length === 0) {
      setImagesLoaded(true);
    }
  }, [allMessage]);

  useEffect(() => {
    if (selectOpen == false) {
      setSelectedMessages([]);
    }
  }, [selectOpen]);
  useEffect(() => {
    if (messagesEndRef.current && sideClick && imagesLoaded) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [allMessage, imagesLoaded]);

  useEffect(() => {
    if (sendNewMsg) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        setSendNewMsg(false);
      }
    }
  }, [sendNewMsg]);

  useEffect(() => {
    if (conversation?.response?.conversationsData) {
      setAllMessage(conversation?.response?.conversationsData);
    }
  }, [conversation]);

  const fetchMoreMessages = async (page) => {
    if (page > totalPages) {
      return;
    }
    setLoader(true);
    setSideClick(false);
    var checkgroup = Cookies.get("isGroup");
    const isgroup = checkgroup == 1 ? "group" : "user";
    const conversation_id = Cookies.get("conversation_id");
    const addedParamConversation = `${Conversation_Api}/${isgroup}/${conversation_id}?page=${page}&size=20`;

    try {
      const res = await dispatch(
        getapiAll({
          Api: addedParamConversation,
          Token: Token,
          urlof: "Conversation1",
        })
      );
      var resget = res.payload.response.conversationsData;
      if (resget.length > 0) {
        setLoader(false);

        setAllMessage((prevMessages) => {
          const combinedMessages = [...prevMessages, ...resget];
          return combinedMessages;
        });
      } else {
        setLoader(false);
      }
    } catch (err) {}
  };
  const handleScroll = () => {
    if (messagesEndRef.current) {
      const scrollHeight = messagesEndRef.current?.scrollHeight;
      const scrollTop = messagesEndRef.current?.scrollTop;
      const clientHeight = messagesEndRef.current?.clientHeight;
      if (scrollTop == 0 && scrollHeight > clientHeight) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchMoreMessages(nextPage);
      }
    }
  };

  useEffect(() => {
    const container = messagesEndRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [allMessage]);

  useEffect(() => {
    if (deleteMultiple) {
      setDeleteMultiple(false);
      setConfirmationModal(true);
    }
  }, [deleteMultiple]);

  useEffect(() => {
    if (deleteGet !== "") {
      setSelectedMessages([]);
      setSelectOpen(false);
    }
  }, [deleteGet]);

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

  const handleReply = (fullobject) => {
    setGetReply(fullobject);
  };

  useEffect(() => {
    if (sideClick == true) {
      setAllMessage([]);
    }
  }, [sideClick]);

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

  const closeselectcomp = () => {
    setSelectOpen(false);
    setSelectedMessages([]);
  };
  return (
    <div className="w-100 position-relative">
      {sidebarobjget && (
        <>
          <div ref={getWidth}>
            <ChatHeader
              sidebarobjget={sidebarobjget}
              setSidebarobjget={setSidebarobjget}
              checkboxStates={checkboxStates}
              setCheckboxStates={setCheckboxStates}
              getReply={getReply}
              setGetReply={setGetReply}
            />
          </div>
          {loader && (
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
            style={{ height: dynamicHeight }}
            className="messagescreen"
            ref={messagesEndRef}
          >
            <MessageShow
              chatLoader={chatLoader}
              setAllMessage={setAllMessage}
              allMessage={allMessage}
              setSelectOpen={setSelectOpen}
              selectOpen={selectOpen}
              setSelectedMessages={setSelectedMessages}
              selectedMessages={selectedMessages}
              deleteMultiple={deleteMultiple}
              setConfirmationModal={setConfirmationModal}
              confirmationModal={confirmationModal}
              deleteGet={deleteGet}
              setDeleteGet={setDeleteGet}
              setForwardModal={setForwardModal}
              forwardModal={forwardModal}
              forwardMultiple={forwardMultiple}
              setForwardMultiple={setForwardMultiple}
              handleReply={handleReply}
              replyOnclick={replyOnclick}
              setChatLoder={setChatLoder}
              setSidebarobjget={setSidebarobjget}
              getwidth={dynamicHeight}
              sidebarobjget={sidebarobjget}
              
            />
          </div>
          <div>
            <SendMessage
              selectOpen={selectOpen}
              count={selectedMessages?.length}
              setSelectOpen={setSelectOpen}
              setDeleteMultiple={setDeleteMultiple}
              setForwardMultiple={setForwardMultiple}
              forwardMultiple={forwardMultiple}
              getReply={getReply}
              setGetReply={setGetReply}
              sidebarobjget={sidebarobjget}
              setAllMessage={setAllMessage}
              closeselectcomp={closeselectcomp}
              admincanmsg={admincanmsg}
              setadmincanmsg={setadmincanmsg}
              mediaLoader={mediaLoader}
              setMediaLoader={setMediaLoader}
            />
          </div>
        </>
      )}
    </div>
  );
}
