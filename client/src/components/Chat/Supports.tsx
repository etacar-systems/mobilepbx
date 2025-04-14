import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

import { pages } from "../Pages/VideoUpload/pages";
import { useGetVideoURL } from "../../requests/queries";
import ChatWidget from "../Pages/ChatWidget";

import { ReactComponent as Closeicon } from "../../Assets/Icon/close-square-svgrepo-com.svg";
import chatbot from "../../Assets/Image/chatbot.png";
import promo from "../../Assets/Video/promo.mp4";

interface ISupportsProps {
  show?: boolean;
  setShow?: (isShow: boolean) => void;
}

export default function Supports({ show, setShow }: ISupportsProps) {
  const { t } = useTranslation();
  let location = useLocation();

  const section = useMemo(() => {
    return pages.find(({ link }) => link === location.pathname)?.key;
  }, [location.pathname]);

  const { url, isFetching: isURLFetching } = useGetVideoURL({
    section,
  });

  const [videoURL, setVideoURL] = useState<string>();
  useEffect(() => {
    if (isURLFetching) return;

    if (url) setVideoURL(url);
    else setVideoURL(promo);
  }, [url, isURLFetching]);
  return (
    <div>
      <Modal
        show={show}
        onHide={() => setShow && setShow(false)}
        dialogClassName="modal-supports-open"
        aria-labelledby="example-custom-modal-styling-title"
        style={{ backdropFilter: "brightness(0.2)" }}
      >
        <div>
          <Closeicon
            className="set_close_modal"
            onClick={() => {
              setShow && setShow(false);
            }}
            style={{
              width: "40px",
              height: "40px",
              verticalAlign: "top",
              borderRadius: "10px",
              background: "var(--main-orange-color)",
              cursor: "pointer",
            }}
          />
        </div>
        <div className="container supportcontent">
          <div className="firstpart">
            <p className="snamemain">{t("Video")}</p>

            <video width="100%" height="309px" controls>
              <source src={videoURL} type="video/mp4" />
            </video>
            <p className="paragraphsupoort">
              {t(
                "You can watch the instructional video and make the desired changes at the same time. In the video, select the Picture in Picture function from the icon, on the right side of the video image, and close this tab from the upper right corner."
              )}
            </p>
            <p className="paragraphsupoort">
              {t(
                "You can also watch the video in full screen mode."
              )}
            </p>
          </div>
          <div className="firstpart">
            <p className="snamemain">{t("Operating support")}</p>
            <p className="paragraphsupoort">
              {t(
                "Our chatbot is at the bottom right of the page answering questions and to help with the use of the gear service."
              )}
            </p>
            <p className="paragraphsupoort">
              {t(
                "You can also leave us a support request via Chatbot if necessary."
              )}
            </p>
            <p className="snamemain">{t("Multi-channel customer support")}</p>
            <p className="paragraphsupoort">
              {t(
                "Our service is integrated into Contakti's multi-channel customer service solution, which you can use seamlessly. You can place an order or request a quote via the Chatbot."
              )}
            </p>
            <img src={chatbot} alt="chat" />
          </div>
          <ChatWidget />
        </div>
      </Modal>
    </div>
  );
}
