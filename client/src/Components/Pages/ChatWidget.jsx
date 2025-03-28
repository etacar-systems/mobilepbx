import { useEffect } from "react";
import { useChatCredentials } from "../../requests/queries";

const ChatWidget = () => {
  const { data, isFetching } = useChatCredentials();
  useEffect(() => {
    if (!data || isFetching) return;

    const origin = data.origin || "https://desk.contakti.com";
    const channelId = data.id || "10259";

    const buildDom = () => {
      const ifrm = document.createElement("iframe");
      const iFrameSrc = `${origin}/build_plugin?id=${channelId}`;

      ifrm.setAttribute("src", iFrameSrc);
      ifrm.setAttribute("id", "contakti-chat-main-iframe");
      ifrm.frameBorder = 0;
      ifrm.setAttribute(
        "style",
        `z-index: 9999999 !important; filter: alpha(opacity=100) !important; 
        right: 10px !important; position: fixed !important; 
        display: block !important; background-color: transparent !important; 
        bottom: 0 !important;`
      );
      ifrm.style.border = "none";
      ifrm.allow = "microphone";

      document.body.appendChild(ifrm);
    };

    const handleMessage = (event) => {
      if (event.origin !== origin) return;

      if (event.data.type === "set_dimensions") {
        const iframe = document.querySelector("#contakti-chat-main-iframe");
        if (iframe) {
          iframe.width = `${event.data.width}px`;
          iframe.height = `${event.data.height}px`;
        }
      }
    };

    buildDom();

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      const iframe = document.querySelector("#contakti-chat-main-iframe");
      if (iframe) {
        iframe.remove();
      }
    };
  }, [data, isFetching]);

  return null;
};

export default ChatWidget;
