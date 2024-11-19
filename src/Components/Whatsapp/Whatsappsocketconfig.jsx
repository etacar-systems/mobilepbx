import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import socketIoClient from "socket.io-client";
import {
  AllListeners,
  WhatsappAllListeners,
} from "../../Redux/Reducers/DataServices";
import { performLogout } from "../LogOut";
import mobilinjafavicon from "../../Assets/Icon/mobilinjafavicon.png";
import AudioPlayer from "react-audio-player";
import Note from "./note-25867.mp3";
import { useNavigate } from "react-router-dom";

var socket;
export const AllWhatsappEmit = (name, data) => {
  socket?.emit(name, data);
};
export const wShowNotification = (MessageValue, setCallRing, navigate) => {
  let senderName = MessageValue?.message_detail?.user_name;
  let messageContent = MessageValue?.message_detail?.message;

  if (window.innerWidth >= 769) {
    if (typeof Notification !== "undefined") {
      if (Notification.permission === "granted") {
        const isEdge = navigator.userAgent.indexOf("Edge") > -1;

        var notificationOptions = {
          body: `${messageContent}`,
          silent: true,
          icon: mobilinjafavicon,
        };

        try {
          const notification = new Notification(
            `${senderName}(Whatsapp)`,
            notificationOptions
          );
          setCallRing(true);
          setTimeout(() => {
            setCallRing(false);
          }, 3000);
          notification.onclick = (event) => {
            if (event) {
              const currentUrl = window.location.href;
              window.focus(currentUrl);
              navigate("/whatsappChat");
              setTimeout(() => {
                notification.close();
              }, 2000);
            }
          };

          if (isEdge) {
          }
        } catch (error) {
          if (isEdge) {
            alert(`New message from ${senderName}: ${messageContent}`);
          }
        }
      } else if (Notification.permission === "denied") {
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            wShowNotification(MessageValue);
          }
        });
      }
    } else {
    }
  }
};
export default function Whatsappsocketconfig() {
  const dispatch = useDispatch();
  const [callRing, setCallRing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const Role = Cookies.get("role");
    const cid = Cookies.get("Company_Id");
    const uid = Cookies.get("User_id");
    const currentDate = new Date();
    const currentTime = currentDate
      .toISOString()
      .replace("T", " ")
      .slice(0, -1);

    const { v4: uuidv4 } = require("uuid");
    const uniqueId = uuidv4();
    if (Role == 1 || Role == 2 || Role == 4) {
      socket = socketIoClient(
        // `ws://localhost:8081/?uid=${uid}&cid=${cid}`,
        `wss://chat.mobiililinja.fi/?uid=${uid}&cid=${cid}&isAgent_connect=1`,
        {
          transports: ["websocket", "polling"],
          rejectUnauthorized: false,
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          upgrade: true,
          secure: true,
        }
      );
      socket?.on("connect", (data) => {
        AllsocketListeners();
      });
    }
  }, []);

  useEffect(() => {
    const company_id = Cookies.get("Company_Id");
    socket?.on("ack_log_out", (data) => {
      if (data.cid == company_id) {
        performLogout();
      }
    });
  }, [socket]);

  const AllsocketListeners = () => {
    const Role = Cookies.get("role");

    const allowedEvents = [
      "ack_receive_message",
      "ack_send_message",
      "ack_deliver_status",
      "ack_read_all_message",
      "ack_user_assign",
      "ack_delete_message",
      "ack_log_out",
      "ack_clear_chat",
    ];
    allowedEvents?.forEach((item) => {
      socket?.on(item, (data) => {
        dispatch(WhatsappAllListeners({ listener_params: data, name: item }));
        if (item === "ack_receive_message" && Role == 1) {
          wShowNotification(data, setCallRing, navigate);
        }
      });
    });
  };

  return <>{callRing && <AudioPlayer src={Note} autoPlay loop />}</>;
}
