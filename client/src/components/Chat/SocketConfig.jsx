import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import socketIoClient from "socket.io-client";
import { AllListeners } from "../../Redux/Reducers/DataServices";
import mobilinjafavicon from "../../Assets/Icon/mobilinjafavicon.png";
import Note from "./note-25867.mp3";
import AudioPlayer from "react-audio-player";
import { useNavigate } from "react-router-dom";

var socket;
export const AllEmit = (name, data) => {
  socket?.emit(name, data);
};

export const showNotification = (MessageValue, setCallRing, navigate) => {
  let senderName = MessageValue?.message_detail?.originalName;
  let messageContent;
  if (
    MessageValue?.message_detail?.media_type == 0 ||
    MessageValue?.message_detail?.media_type == 7 ||
    MessageValue?.message_detail?.media_type == 8 ||
    MessageValue?.message_detail?.media_type == 9 ||
    MessageValue?.message_detail?.media_type == 10 ||
    MessageValue?.message_detail?.media_type == 11 ||
    MessageValue?.message_detail?.media_type == 12 ||
    MessageValue?.message_detail?.media_type == 13 ||
    MessageValue?.message_detail?.media_type == 14
  ) {
    messageContent = MessageValue?.message_detail?.message;
  } else if (MessageValue?.message_detail?.media_type == 1) {
    messageContent = "Image";
  } else if (MessageValue?.message_detail?.media_type == 2) {
    messageContent = "Video";
  } else if (MessageValue?.message_detail?.media_type == 3) {
    messageContent = "Audio";
  } else if (MessageValue?.message_detail?.media_type == 4) {
    messageContent = "Document";
  } else if (MessageValue?.message_detail?.media_type == 6) {
    messageContent = "Location";
  }

  if (window.innerWidth >= 769) {
    if (typeof Notification !== "undefined") {
      if (Notification.permission === "granted") {
        // Check if the browser is Edge
        const isEdge = navigator.userAgent.indexOf("Edge") > -1;

        var notificationOptions = {
          body: `${messageContent}`,
          silent: true,
          icon: mobilinjafavicon,
        };

        try {
          const notification = new Notification(
            `${senderName}`,
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
              navigate("/chat");

              // audioplay();
              setTimeout(() => {
                notification.close();
              }, 2000);
            }
          };

          // If it's Edge, we might need to handle things differently
          if (isEdge) {
            // Add any Edge-specific handling here
          }
        } catch (error) {
          // Fallback for Edge if needed
          if (isEdge) {
            alert(`New message from ${senderName}: ${messageContent}`);
          }
        }
      } else if (Notification.permission === "denied") {
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            showNotification(MessageValue);
          }
        });
      }
    } else {
    }
  }
};
export default function SocketConfig() {
  const [callRing, setCallRing] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uid = Cookies.get("User_id");
  useEffect(() => {
    const Role = Cookies.get("role");
    const cid = Cookies.get("Company_Id");
    const currentDate = new Date();
    const currentTime = currentDate
      .toISOString()
      .replace("T", " ")
      .slice(0, -1);

    const { v4: uuidv4 } = require("uuid");
    const uniqueId = uuidv4();

    if (Role == 1 || Role == 2) {
      socket = socketIoClient(
       // `wss://ui.mobiililinja.fi/?uid=${uid}&cid=${cid}&device_id=${uniqueId}&last_message_time=${currentTime}`,
        `wss://pabx.mobiililinja.fi/?uid=${uid}&cid=${cid}&device_id=${uniqueId}&last_message_time=${currentTime}`,
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
        setTimeout(() => {
          socket.emit("unread_message_count", { uid: uid });
        }, [1000]);
        AllsocketListeners();
      });
    }
  }, []);

  const requestNotificationPermission = () => {
    if (
      typeof Notification !== "undefined" &&
      "requestPermission" in Notification
    ) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
          } else {
          }
        })
        .catch((error) => {});
    } else {
    }
  };

  useEffect(() => {
    setTimeout(() => {
      requestNotificationPermission();
    }, 2000);
  }, []);

  const AllsocketListeners = () => {
    const allowedEvents = [
      "receive_message",
      "group_receive_message",
      "send_online_status",
      "ack_online_users",
      "last_messages",
      "ack_sended_messages",
      "ack_deliver_messages",
      "ack_send_update_user",
      "receive_update_user",
      "ack_send_report",
      "ack_send_block",
      "ack_send_delete_chat",
      "ack_send_edit_message",
      "ack_send_message",
      "receive_forward_message",
      "ack_send_forward_message",
      "group_receive_forward_message",
      "ack_group_send_forward_message",
      "ack_delete_message",
      "receive_delete_message",
      "ack_typing",
      "ack_group_send_edit_message",
      "ack_group_send_message",
      "receive_group_delete_message",
      "ack_send_all_read_status",
      "ack_send_delivery_status",
      "receive_delivery_status",
      "ack_group_delivery_status",
      "ack_message_report",
      "ack_send_create_group",
      "receive_create_group",
      "receive_edit_group",
      "receive_delete_group",
      "receive_group_member_role",
      "receive_add_group_member",
      "receive_member_remove_group_member",
      "receive_group_member_role",
      "receive_remove_group_member",
      "receive_group_admin",
      "receive_group_member_role",
      "ack_group_send_delivery_status",
      "ack_send_message_broadcast",
      "ack_add_broadcast_users",
      "ack_edit_broadcast_detail",
      "ack_delete_broadcast_message",
      "ack_clear_broadcast_messages",
      "ack_exit_group",
      "receive_exit_group",
      "ack_delete_conversation",
      "ack_add_pin_conversation",
      "ack_mute_conversation",
      "ack_schedule_normal",
      "ack_group_schedule_normal",
      "ack_unmute_notification  ",
      "ack_broadcast_schedule_normal",
      "ack_add_message_reaction",
      "receive_add_message_reaction",
      "ack_typing",
      "online_users",
      "recive_user_ideal_status",
      "ack_remove_message_reaction",
      "receive_remove_message_reaction",
      "user_ideal_status",
      "ack_send_edit_message",
      "ack_pin_message",
      "ack_remove_group_members",
      "receive_group_member_detail",
      "receive_group_admin",
      "receive_group_member_role",
      "ack_add_group_members",
      "ack_remove_broadcast_user",
      "ack_clear_broadcast_message",
      "ack_leave_goup",
      "receive_leave_goup",
      "ack_read_all_delivered_message",
      "receive_read_all_delivered_message",
      "ack_delivere_all_message",
      "receive_delivere_all_message",
      "ack_clear_chat",
      "receive_send_block",
      "ack_update_group_message_setting",
      "ack_user_online_status",
      "ack_register_extantions",
      "ack_unread_message_count"
    ];
    allowedEvents?.forEach((event_name) => {
      socket?.on(event_name, (data) => {
        dispatch(AllListeners({ listener_params: data, name: event_name }));
        if (event_name === "receive_message") {
          AllEmit("unread_message_count", { uid: uid })
          showNotification(data, setCallRing, navigate);
        }
      });
    });
  };

  return <>{callRing && <AudioPlayer src={Note} autoPlay loop />}</>;
}
