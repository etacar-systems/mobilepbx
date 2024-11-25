import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "react-medium-image-zoom/dist/styles.css";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close-square-svgrepo-com.svg";
import chatbot from "../../Assets/Image/chatbot.png";
import { useTranslation } from "react-i18next";
import promo from "../../Assets/Video/promo.mp4";
import { useDispatch } from "react-redux";
import { getapiAll } from "../../Redux/Reducers/ApiServices";
import config from "../../config";
import Cookies from "js-cookie";
import { error } from "toastr";
import { toast } from "react-toastify";

export default function Supports({ show, setShow }) {
  const file_base = process.env.REACT_APP_FILE_BASE_URL;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const Role = Cookies.get("role");
  const Token = Cookies.get("Token");
  const [videoURL, setVideoURL] = useState(null);
  useEffect(() => {
    dispatch(
      getapiAll({
        Api: config.INTEGRATION_LIST.VIDEO_BY_ROLE + Role,
        Token: Token,
      })
    )
      .then((response) => {
        if (response?.payload?.response?.success === 1) {
          setVideoURL(file_base + response.payload.response.IntergationList[0].video_url);
        } else {
          toast.error(response?.payload?.response?.message);
          setVideoURL(promo);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-supports-open"
        aria-labelledby="example-custom-modal-styling-title"
        style={{ backdropFilter: "brightness(0.2)" }}
      >
        <div>
          <Closeicon
            className="set_close_modal"
            onClick={() => {
              setShow(false);
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
                "  You can also watch the video in full screen mode by selecting the icon or the icon to stream to another device."
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
                "You can also watch the video in full screen mode by selecting or from the icon from the icon to stream to another device."
              )}
            </p>
            <img src={chatbot} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
