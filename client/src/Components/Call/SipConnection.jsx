import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as Closeicon } from "../../Assets/Icon/close.svg";
import CallScreen from "./CallScreen";
import MinimizeCallScreen from "./MinimizeCallScreen";
import MinimizeIncomingcall from "./MinimizeIncomingcall";
import JsSIP from "jssip";
import { useDispatch } from "react-redux";
import {
  Calling_Function,
  setAsTransfer,
  Sipconnect,
  Transfer_Function,
} from "../../Redux/Reducers/DataServices";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AudioPlayer from "react-audio-player";
import Ringing from "../Call/CallRing/Ringing.mp3";
import ContactModal from "./ContactModal";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ReactComponent as End } from "../../Assets/Icon/Phone.svg";
import { ReactComponent as Mute } from "../../Assets/Icon/MicrophoneSlash.svg";
import { ReactComponent as Maximize } from "../../Assets/Icon/maximize.svg";
import { ReactComponent as UnMute } from "../../Assets/Icon/unmute.svg";
import { ReactComponent as Close1 } from "../../Assets/Icon/close copy.svg";
import { ReactComponent as VideoOff } from "../../Assets/Icon/videoOff.svg";
import { ReactComponent as VideoOn } from "../../Assets/Icon/videoOn.svg";
import Draggable from "react-draggable";

var ua;
var session;
var isVideoCall;
let callTypecheck = "audio";
// JsSIP.debug.disable('JsSIP:*');

var localStream;

export default function SipConnection({ show, setShow }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [callState, setCallState] = useState(null);
  const [minimizeOpen, setMinimizeOpen] = useState(null);
  const audio = new window.Audio();
  const [callRing, setCallRing] = useState(null);
  console.log(callRing, "1212callRing");
  const [activeCalls, setActiveCalls] = useState([]);
  const [callTimer, setCallTimer] = useState(null);
  const [incomingName, setIncomingName] = useState("");
  const [mute, setMute] = useState(null);
  const [contactlistOpen, setContactlistOpen] = useState(null);
  const ongoingName = useRef();
  const [notificationShown, setNotificationShown] = useState(false);
  const [notificationName, setNotificationName] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const callerName = session?._remote_identity?._display_name;
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [fullscreenVideoCall, setFullscrennVideo] = useState(false);
  const [audioVideo, setaudioVideo] = useState();
  console.log(audioVideo, "audioVideo122222");
  const [muteVideo, setMuteVideo] = useState(false);
  const [pauseVideo, setPauseVideo] = useState(false);
  console.log(activeCalls, "multipleCallObj");
  const localStreamRef = useRef();
  const remoteStreamRef = useRef();
  const [outgoingVideo, setOutgoingVideo] = useState(false);
  const [isKeypad, setIsKeypad] = useState(false);
  const [callType, setCallType] = useState();
  useEffect(() => {
    if (!callTimer) return;

    const time = setTimeout(() => {
      setCallTimer((state) => state + 1);
    }, 1000);

    return () => {
      clearTimeout(time);
    };
  }, [callTimer]);
  const filterAudioCodecs = async (sdp) => {
    // Extract the m=audio line and the related codec information
    const sdpLines = sdp.split("\r\n");

    // Codecs for PCMU and PCMA
    const allowedCodecs = {
      PCMU: null, // Payload number for PCMU
      PCMA: null, // Payload number for PCMA
    };

    // Find the payload numbers for PCMU and PCMA
    const newSdpLines = sdpLines.filter((line) => {
      if (line.startsWith("a=rtpmap")) {
        const parts = line.split(" ");
        const payloadType = parts[0].split(":")[1]; // Get the payload number
        const codecName = parts[1].split("/")[0]; // Get the codec name

        console.log(codecName, "codecName");
        if (codecName === "PCMU" || codecName === "PCMA") {
          console.log(codecName, "codecNameheck");

          allowedCodecs[codecName] = payloadType; // Store the payload number
          return true; // Keep the codec line
        }
        return false; // Remove non-PCMU/PCMA codecs
      }
      return true; // Keep all other lines by default
    });

    // Replace the m=audio line with only allowed payload numbers
    return newSdpLines
      .map((line) => {
        if (line.startsWith("m=audio")) {
          // Filter the payload types in the m=audio line
          const audioLineParts = line.split(" ");
          const filteredAudioLine = audioLineParts
            .filter(
              (part, index) =>
                index < 3 || Object.values(allowedCodecs).includes(part)
            )
            .join(" ");
          return filteredAudioLine;
        }
        return line;
      })
      .join("\r\n");
  };

  useEffect(() => {
    const pc = new RTCPeerConnection();

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NjFjYzYzZWIwN2ViODgzYTQ0ZTRjNTgiLCJlaWQiOiI2NjFjMzRlYmIwN2ViODgzYTQ0ZGZjNWIiLCJkZXZpY2VfaWQiOiJlMjEyYjE2MWVmOTM0NTk0Iiwic2lwX3VzZXJuYW1lIjoiMzAwNSIsInNpcF9wYXNzd29yZCI6IjMwMDUiLCJzaXBfZG9tYWluIjoibXRlc3QxLmNvbSIsInNpcF9pcCI6IjE3Mi4yMC4xMDYuMTQwIiwic2lwX3BvcnQiOiI1MDYwIiwiZW5kcG9pbnROdW1iZXIiOiIzMDA1IiwiY2FsbGVySWQiOiIzMDA1IiwiaWF0IjoxNzE1Nzc3MTI1LCJleHAiOjE3MTU4NjM1MjV9.IEPqCD48jsStQiZODhA7R-UtnsyWdHU5064eso9o60c";
    if (!token) return;
    const Role = Cookies.get("role");
    const user_extension = Cookies.get("user_extension");
    const sip_password = Cookies.get("sip_password");
    const Sip_number = "5002";
    let domainName = Cookies.get("domain_name");

    var socket = new JsSIP.WebSocketInterface("wss://pbx.mobiililinja.fi:7443");
    // var socket = new JsSIP.WebSocketInterface("wss://internal.celloip.com:4443");

    JsSIP.debug.enable("JsSIP:*");
    const configuration = {
      sockets: [socket],
      uri: `sip:${user_extension}@${domainName}`,
      password: sip_password,
      session_timers: false,
      realm: "*",
      register: true,
      transport: "wss",
      hackIpInContact: true,
      contactParams: {
        transport: "wss",
      },
      dtmf: {
        transport: "RFC2833",
      },
      contact_uri: `sip:${user_extension}@${domainName};transport=wss`,
    };
    if (Role == 1) {
      ua = new JsSIP.UA(configuration);
      if (!ua.isRegistered()) ua.register();
      ua.start();
    }

    ua?.on("connected", (e) => {
      console.log(e, "eventcheckconnect");
      dispatch(Sipconnect(true));
    });

    ua?.on("disconnected", (e) => {
      console.log(e, "eventcheckconnect");
      dispatch(Sipconnect(false));
    });

    ua?.on("registrationFailed", (e) => {
      console.error(e, "Connection failed - forbidden");
      dispatch(Sipconnect(false));
    });

    ua?.on("newRTCSession", (data) => {
      console.log(data.session, "jssip 123");
      session = data.session;

      session.on("sdp", (e) => {
        const sdp = e.sdp;
        isVideoCall = sdp.includes("m=video");
        console.log("SDP:", sdp);
        console.log("videovideo:", isVideoCall);
        console.log(session, audioVideo, "audioVideosession");
      });

      if (session._direction == "outgoing") {
        session.on("sdp", (e) => {
          let sdp = e.sdp;
          console.log(isVideoCall, "isVideoCall112");

          if (isVideoCall === true || isVideoCall === "true") {
            console.log("checkisVideoCall", isVideoCall);

            console.log("checkisVideoCall", isVideoCall);
            sdp = sdp.replace(
              /m=video \d+ [^\r\n]+\r\n/g,
              "m=video 57005 RTP/AVP 96\r\n"
            );
          }
          console.log("Modified SDP to prioritize codecs:", sdp);

          e.sdp = sdp;
        });
        setCallType(0);
        if (ongoingName.current.flag) {
          setCallState("Calling");
          setActiveCalls((state) => {
            return [
              {
                call: session,
                hold: false,
                number: ongoingName.current.number,
                name: ongoingName.current.name || "Unknown",
              },
              ...state.map((item) => {
                item.call.hold();
                return { ...item, hold: true };
              }),
            ];
          });
        } else {
          setShow(false);
          setOutgoingVideo(false);
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              // Display local video
              if (localVideoRef.current) {
                setVideoModal(true);
                setShow(false);
                localVideoRef.current.srcObject = stream;
                localStreamRef.current.srcObject = stream;
                localVideoRef.current.classList.add("video-mirror");
                localStreamRef.current.classList.add("video-mirror");
              }
            })
            .catch((error) => {
              console.error("Error accessing camera:", error);
            });
        }

        session.on("progress", () => {
          console.log("progress");
        });
        session.on("connected", () => {
          console.log("connected");
        });
        session.on("accepted", () => {
          console.log("accepted");
          setCallState("Connected");
          setOutgoingVideo(true);
          setCallTimer(1);
        });
        console.log(isVideoCall, "remotttte");

        if (ongoingName.current.flag) {
          console.log(ongoingName.current.flag, "remotttte");

          session.connection.addEventListener("addstream", (e) => {
            const audio = document.createElement("audio");
            console.log("remotttte 1");

            audio.srcObject = e.stream;
            audio.play();
          });
        } else {
          session.connection.addEventListener("addstream", (e) => {
            console.log(ongoingName.current.flag, "remotttte 2");

            if (e.stream) {
              console.log(e.stream, "remotttte");
              remoteVideoRef.current.srcObject = e.stream;
              remoteStreamRef.current.srcObject = e.stream;
            }
          });
        }
      } else if (session._direction == "incoming") {
        console.log(
          session?._request?.data?.includes("m=video"),
          "isVideoCall"
        );
        const headers = session?._request?.headers;
        console.log(headers, "headers1212");
        // Default to audio
        if (headers["X-Call-Type"] && headers["X-Call-Type"][0]) {
          callTypecheck = headers["X-Call-Type"][0].raw;
        }
        console.log(callTypecheck, "callTypecheck");
        setNotificationName(session?._request?.data?.includes("m=video"));
        setCallType(1);
        setShow(false);
        setCallState("incoming");
        setOutgoingVideo(true);
        if (!show) setMinimizeOpen(true);
        setCallRing(true);
        setIncomingName(session?._remote_identity?._display_name || "Unknown");
        showNotification();

        session.on("progress", () => {
          setCallRing(true);
        });

        session.on("confirmed", () => {
          console.log("confirmed");
        });

        console.log(callTypecheck, "callTypecheck");
        session.on("accepted", () => {
          console.log(isVideoCall, "isVideoCall");
          if (isVideoCall && callTypecheck == "video") {
            console.log(isVideoCall, "isVideoCall");
            setCallRing(false);
            setMinimizeOpen(false);
            setVideoModal(true);
            navigator.mediaDevices
              .getUserMedia({ video: isVideoCall, audio: true })
              .then((Stream) => {
                console.log(isVideoCall, "isVideoCall");
                localStream = Stream;
                if (localVideoRef?.current) {
                  localStreamRef.current.srcObject = Stream;
                  localVideoRef.current.srcObject = Stream;
                  localVideoRef.current.classList.add("video-mirror");
                  localStreamRef.current.classList.add("video-mirror");
                }
                session.connection.addStream(Stream);
              })
              .catch((error) => {
                console.error("Error accessing camera:", error);
              });
          } else {
            console.log("accepted");
            setCallState("Connected");
            setCallRing(false);
            setCallTimer(1);

            setActiveCalls((state) => [
              {
                call: session,
                hold: false,
                number: session?._remote_identity?._uri?._user,
                name: session?._remote_identity?._display_name || "Unknown",
              },
              ...state.map((item) => {
                item.call.hold();
                return { ...item, hold: true };
              }),
            ]);
          }
        });

        session.on("peerconnection", (event) => {
          const peerConnection = event.peerconnection;
          peerConnection.ontrack = (event) => {
            console.log(event, remoteVideoRef, "checkvideocallevent");
            if (event.streams && event.streams[0]) {
              if (
                isVideoCall &&
                remoteVideoRef.current &&
                callTypecheck == "video"
              ) {
                remoteVideoRef.current.srcObject = event.streams[0];
                remoteStreamRef.current.srcObject = event.streams[0];
              } else {
                const remoteAudio = new window.Audio();
                remoteAudio.srcObject = event.streams[0];
                remoteAudio.play();
                setFullscrennVideo(false);
              }
            }
          };
        });
      }

      session.on("ended", (e) => {
        setCallRing(false);
        setOutgoingVideo(false);
        if (isVideoCall || ongoingName?.current?.flag == 0) {
          if (remoteVideoRef?.current || remoteStreamRef?.current) {
            if (remoteVideoRef?.current != undefined) {
              remoteVideoRef.current.srcObject = null;
            }
            if (remoteStreamRef?.current != undefined) {
              remoteStreamRef.current.srcObject = null;
            }
          }
          if (localVideoRef.current || localStreamRef.current) {
            const stream = localVideoRef.current.srcObject;
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
            }
            if (localStreamRef.current != undefined) {
              localStreamRef.current.srcObject = null;
            }
            if (localVideoRef.current != undefined) {
              localVideoRef.current.srcObject = null;
            }
          }
          setVideoModal(false);
          setFullscrennVideo(false);
          setCallState(null);
          setMinimizeOpen(false);
          dispatch(setAsTransfer(false));
        } else {
          setCallRing(false);

          setActiveCalls((state) => {
            return state.filter((c) => session._id !== c.call._id);
          });
        }
      });

      session.on("failed", (e) => {
        setCallRing(false);
        setOutgoingVideo(false);

        if (isVideoCall || ongoingName?.current?.flag == 0) {
          if (remoteVideoRef.current || remoteStreamRef.current) {
            remoteVideoRef.current.srcObject = null;
            remoteStreamRef.current.srcObject = null;
          }
          if (localVideoRef.current || localStreamRef.current) {
            const stream = localVideoRef.current.srcObject;
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
            }
            localVideoRef.current.srcObject = null;
            localStreamRef.current.srcObject = null;
          }
          setVideoModal(false);
          setFullscrennVideo(false);
          setCallState(null);
          setMinimizeOpen(false);
        } else {
          setCallRing(false);

          setActiveCalls((state) => {
            return state.filter((c) => session._id !== c.call._id);
          });
        }
      });

      session.on("cancel", () => {
        setMinimizeOpen(false);
        setCallRing(false);
        setCallState(null);
        setShow(false);
        if (session) {
          session.terminate();
        }
        setActiveCalls([]);
      });
      session.on("addstream", function (e) {
        const hiddenAudio = audio;
        hiddenAudio.src = window.URL.createObjectURL(e.stream);
        hiddenAudio.play();
      });
    });
  }, []);

  useEffect(() => {
    console.log(activeCalls, "DFghfsd");

    if (activeCalls.length == 0) {
      console.log("DFghfsd");
      setCallState(null);
      setShow(null);
      setMinimizeOpen(null);
      setCallTimer(null);
      setMute(false);
      dispatch(setAsTransfer(false));
    }
  }, [activeCalls]);

  const makeCall = (number, name, flag) => {
    let domainName = Cookies.get("domain_name");
    console.log(number, "number", flag);
    setaudioVideo(flag);
    setShow(true);
    setCallState("Calling");

    if (ua) {
      const options = {
        mediaConstraints: { audio: true, video: flag ? false : true },
        sessionTimersExpires: 120,
        pcConfig: {
          iceServers: [
            {
              urls: ["stun:stun.l.google.com:19302"],
            },
          ],
          iceTransportPolicy: "all",
          rtcpMuxPolicy: "negotiate",
        },
        extraHeaders: [`X-Call-Type: ${flag ? "audio" : "video"}`],
      };
      ongoingName.current = { name, number, flag };
      ua.call(`sip:${number}@${domainName}`, options);
    }
  };

  useEffect(() => {
    dispatch(Calling_Function(makeCall));
    dispatch(Transfer_Function(TransferCall));
  }, []);

  const answerCall = () => {
    try {
      session.answer({
        mediaConstraints: { audio: true, video: isVideoCall },
        sessionTimersExpires: 120,
        pcConfig: {
          iceServers: [
            {
              urls: ["stun:stun.l.google.com:19302"],
            },
          ],
          iceTransportPolicy: "all",
          rtcpMuxPolicy: "negotiate",
        },
      });
    } catch {}
  };

  const rejectCall = () => {
    try {
      if (session) {
        session.terminate();
        setMinimizeOpen(false);
        setCallRing(false);
        setActiveCalls([]);
      }
    } catch {}
  };
  const endCall = () => {
    console.log("jssip end");
    try {
      if (session) {
        session.terminate();
        setShow(false);
        setMinimizeOpen(false);
      }
    } catch {}
    setShow(false);
    setMinimizeOpen(false);
    setCallState(null);
    setActiveCalls([]);
    setCallTimer(null);
    dispatch(setAsTransfer(false));
  };
  function filterForPCMUandPCMA(sdp) {
    const audioCodecsToKeep = ["0", "8"]; // PCMU and PCMA

    // Helper function to filter codecs in a specific media line (audio)
    function filterCodecs(mediaType, codecsToKeep) {
      // Regex to match the media line (m=audio)
      const mediaLineRegex = new RegExp(`m=${mediaType} .+`);
      const mediaLine = sdp.match(mediaLineRegex);
      if (!mediaLine) return sdp;

      // Filter the codec IDs in the m=audio line
      let newMediaLine = mediaLine[0]
        .split(" ")
        .filter((item, index) => {
          // Keep the first three values in m= line, then filter based on codec IDs
          return index < 3 || codecsToKeep.includes(item);
        })
        .join(" ");

      // Replace the original media line in the SDP
      sdp = sdp.replace(mediaLine[0], newMediaLine);

      // Remove any a=rtpmap and a=fmtp lines for codecs that are not in codecsToKeep
      sdp = sdp.replace(/a=rtpmap:(\d+).*?\r?\n/g, (match, codec) => {
        return codecsToKeep.includes(codec) ? match : "";
      });

      sdp = sdp.replace(/a=fmtp:(\d+).*?\r?\n/g, (match, codec) => {
        return codecsToKeep.includes(codec) ? match : "";
      });

      return sdp;
    }

    // Filter only the audio codecs
    sdp = filterCodecs("audio", audioCodecsToKeep);

    return sdp;
  }

  // Example usage:
  // const filteredSdp = filterForPCMUandPCMA(originalSdp);
  // console.log(filteredSdp);

  const callHold = async () => {
    console.log(
      activeCalls.length === 0,
      callState !== "Connected",
      "callhold"
    );

    // Early return if there are no active calls or the call is not connected
    if (activeCalls.length === 0 || callState !== "Connected") {
      return;
    }

    // Process each active call
    const manageCall = await Promise.all(
      activeCalls.map(async (item) => {
        const call = item.call;
        console.log(item, "itemcheck");

        // Create a promise to handle SDP processing and hold/unhold logic
        return new Promise((resolve) => {
          // Event listener for SDP
          call.on("sdp", async (e) => {
            let sdp = e.sdp;
            console.log("SDP:", sdp);

            // Filter the SDP if available
            if (sdp) {
              try {
                // Modify SDP as required
                sdp = sdp.replace(
                  /m=audio \d+ [^\r\n]+\r\n/g,
                  "m=audio 57005 RTP/AVP 0 8\r\n"
                );
                e.sdp = sdp;
                console.log("Filtered SDP before hold/unhold:", sdp);

                // Check if the call should be held or unheld
                if (item.hold) {
                  console.log("Unholding call:", item);
                  if (call.connection.getSenders().length > 0) {
                    await call.unhold(); // Wait for unhold operation to complete
                    item.hold = false; // Update hold status
                  }
                } else {
                  console.log("Holding call:", item);
                  if (call.connection.getSenders().length > 0) {
                    await call.hold(); // Wait for hold operation to complete
                    item.hold = true; // Update hold status
                  }
                }
              } catch (error) {
                console.error(
                  "Error filtering SDP or holding/unholding call:",
                  error
                );
              }
            }
            resolve(item); // Resolve the promise with the updated item
          });
        });
      })
    );

    setActiveCalls(manageCall);
  };
  // const callHold = () => {
  //   console.log(
  //     activeCalls.length == 0,
  //     callState !== "Connected",
  //     "calllhold"
  //   );
  //   if (activeCalls.length == 0) {
  //     return;
  //   }
  //   // if (callState !== "Connected") return

  //   const manageCall = activeCalls.map((item) => {
  //     if (item.hold) {
  //       item.call.unhold();
  //       return { ...item, hold: false };
  //     } else {
  //       item.call.hold();
  //       return { ...item, hold: true };
  //     }
  //   });

  //   setActiveCalls(manageCall);
  // };

  const muteCall = () => {
    if (activeCalls.length === 0) {
      return;
    }
    if (mute) {
      const updatedSessions = activeCalls.map((item) => {
        item.call.unmute();
        return item;
      });
      setActiveCalls(updatedSessions);
      setMute(false);
    } else {
      const updatedSessions = activeCalls.map((item) => {
        item.call.mute();
        return item;
      });
      setActiveCalls(updatedSessions);
      setMute(true);
    }
  };

  const fullScreen = () => {
    setShow(true);
    setMinimizeOpen(false);
  };

  const currentCallEnd = (item) => {
    console.log(item, "Avtive");

    try {
      if (!item.call.isEnded()) {
        item.call.terminate();
        setActiveCalls((state) => {
          return state.filter((val) => val?.call._id !== item?.call._id);
        });
      }
    } catch {}
  };

  const currentCallHold = (item) => {
    const updatedState = activeCalls.map((callItem) => {
      console.log(callItem, item, "checkitem");
      if (item.call._id === callItem.call._id) {
        console.log(callItem, item, "checkitem");
        const isOnHold = item.call.isOnHold().local;
        if (!isOnHold) {
          callItem.call.hold();
        } else {
          callItem.call.unhold();
        }
        return { ...callItem, hold: !isOnHold };
      } else {
        console.log(callItem, item, "checkitem");
        const isOnHold = callItem.call.isOnHold().local;
        if (!isOnHold) {
          callItem.call.hold();
        }
        return { ...callItem, hold: true };
      }
    });
    setActiveCalls(updatedState);
  };

  const transferCallNavigate = () => {
    if (session) {
      console.log("callingcheckfunction");
      navigate("/webphone");
      setMinimizeOpen(true);
      setShow(false);
      dispatch(setAsTransfer(true));
    }
  };

  const showNotification = () => {
    if (!("Notification" in window)) {
      return;
    }

    setTimeout(() => {
      if (typeof Notification !== "undefined") {
        if (
          Notification.permission === "granted" &&
          !notificationShown &&
          !document.hasFocus() &&
          callerName
        ) {
          const callType1 =
            session?._request?.data?.includes("m=video") &&
            callTypecheck == "video"
              ? "Video"
              : "Audio";

          const notificationOptions = {
            body: `${callerName} is calling`,
            silent: true,
          };

          const notification = new Notification(
            `Incoming ${callType1} Call`,
            notificationOptions
          );

          notification.onclick = (event) => {
            if (event) {
              const currentUrl = window.location.href;
              window.focus(currentUrl);

              setTimeout(() => {
                notification.close();
              }, 3000);
            }
          };

          setNotificationShown(true);
        } else if (Notification.permission === "denied") {
          // Handle denied permission if needed
        } else {
          // if (!screensize) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              showNotification();
            }
          });
          // }
        }
      }
    }, 2000);
  };

  const VideoMute = () => {
    if (muteVideo) {
      session.unmute();
      setMuteVideo(false);
    } else {
      session.mute();
      setMuteVideo(true);
    }
  };
  const handlePauseVideo = () => {
    if (pauseVideo) {
      const localStream = session?.connection?.getLocalStreams()[0];
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = true; // Resume the video track
      }
      setPauseVideo(false);
    } else {
      const localStream = session?.connection?.getLocalStreams()[0];
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = false; // Pause the video track
      }

      setPauseVideo(true);
    }
  };
  const VideoEndCall = () => {
    if (session) {
      session.terminate();
      setVideoModal(false);
      setShow(false);
      setMinimizeOpen(false);
      setCallState(null);
      setActiveCalls([]);
    }
  };

  const DTMFhandler = (number) => {
    console.log(number, session, "number123");

    if (session?.sendDTMF) {
      session.sendDTMF(number, {
        duration: 100, // Duration of the tone in milliseconds
        interToneGap: 70, // Gap between tones in milliseconds
        transportType: "RFC2833", // Specify RFC 2833 transport
      });
    }
  };

  console.log(outgoingVideo && callType == 0, "outgoingVideo");

  const recordCall = () => {
    session.sendDTMF("*2", {
      duration: 100,
      interToneGap: 70,
      transportType: "RFC2833",
    });
  };

  const TransferCall = (number) => {
    console.log(number, "numbercheck");
    let domainName = Cookies.get("domain_name");

    console.log(session, "asgdsfc");
    try {
      if (session) {
        console.log(session, "asgdsfc");
        const options = {
          mediaConstraints: { audio: true, video: false },
          sessionTimersExpires: 120,
          pcConfig: {
            iceServers: [
              {
                urls: ["stun:stun.l.google.com:19302"],
              },
            ],
            iceTransportPolicy: "all",
            rtcpMuxPolicy: "negotiate",
          },
        };
        const transferSession = session.refer(
          `sip:${number}@${domainName}`,
          options
        );
        console.log(transferSession, "test112");
        transferSession.on("succeeded", (e) => {
          console.log(e, "test112");
        });

        transferSession.on("failed", (e) => {
          console.log(e, "test112");
        });
        if (!session.isEnded()) {
          session.terminate();
        }
        setCallTimer(null);
        setActiveCalls([]);
        setShow(false);
        setMinimizeOpen(false);
      }
    } catch (error) {
      console.error("Error during call transfer:", error);
    }
  };
  return (
    <>
      <Draggable>
        <div
          className="minimize_screen1"
          style={{ display: videoModal ? "block" : "none" }}
        >
          <div className="position-relativea">
            <video
              ref={localVideoRef}
              className={outgoingVideo ? "remoteVideoRef" : "localVideoRef"}
              muted
              autoPlay
              playsInline
              style={{
                transform:
                  outgoingVideo && callType == 0 ? "scaleX(-1)" : "scaleX(-1)",
              }}
            />
            {/* <div className="absolute-image"> */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={outgoingVideo ? "localVideoRef" : "remoteVideoRef"}
            />
            {/* </div> */}
            <div className="video-maximize">
              <Maximize
                className="maximize_logo"
                onClick={() => {
                  setFullscrennVideo(true);
                  setVideoModal(false);
                }}
              />
            </div>
            <div className="video-end-btn">
              <Button
                className="me-2"
                style={{
                  backgroundColor: "var(--main-orange-color)",
                  border: "none",
                }}
                onClick={VideoMute}
                onTouchStart={VideoMute}
              >
                {muteVideo ? (
                  <UnMute className="multiple_call_btn1" />
                ) : (
                  <Mute className="multiple_call_btn1" />
                )}
              </Button>
              <Button
                className="me-2"
                style={{
                  backgroundColor: "var(--main-orange-color)",
                  border: "none",
                }}
                onClick={handlePauseVideo}
                onTouchStart={handlePauseVideo}
              >
                {pauseVideo ? (
                  <VideoOn className="multiple_call_btn1" />
                ) : (
                  <VideoOff className="multiple_call_btn1" />
                )}
              </Button>
              <Button
                variant="danger"
                className="me-2"
                style={{
                  backgroundColor: "var(--main-red-color)",
                  border: "none",
                }}
                onClick={VideoEndCall}
                onTouchStart={VideoEndCall}
              >
                <End className="multiple_call_btn1" />
              </Button>
            </div>
          </div>
        </div>
      </Draggable>
      <div
        className="fullscreen-video"
        style={{ display: fullscreenVideoCall ? "block" : "none" }}
      >
        <div className="fullscreen-relative">
          <video
            ref={localStreamRef}
            className={
              outgoingVideo ? "video-absolute-full" : "fullscreen-relative11"
            }
            autoPlay
            muted
            playsInline
            style={{
              transform:
                outgoingVideo && callType == 0 ? "scaleX(-1)" : "scaleX(-1)",
            }}
          />
          {/* <div className="video-absolute-full"> */}
          <video
            ref={remoteStreamRef}
            className={
              outgoingVideo ? "fullscreen-relative11" : "video-absolute-full"
            }
            autoPlay
            playsInline
          />
          {/* </div> */}
          <div className="video-maximize-fullscreen">
            <Close1
              onClick={() => {
                setFullscrennVideo(false);
                setVideoModal(true);
              }}
              style={{ cursor: "pointer", width: "30px", height: "30px" }}
            />
          </div>
          <div className="video-end-fullscreen">
            <Button
              className="me-2"
              style={{
                backgroundColor: "var(--main-orange-color)",
                border: "none",
              }}
              onClick={VideoMute}
            >
              {muteVideo ? (
                <UnMute className="multiple_call_btn1" />
              ) : (
                <Mute className="multiple_call_btn1" />
              )}
            </Button>
            <Button
              className="me-2"
              style={{
                backgroundColor: "var(--main-orange-color)",
                border: "none",
              }}
              onClick={handlePauseVideo}
            >
              {pauseVideo ? (
                <VideoOn className="multiple_call_btn1" />
              ) : (
                <VideoOff className="multiple_call_btn1" />
              )}
            </Button>
            <Button
              variant="danger"
              className=""
              style={{
                backgroundColor: "var(--main-red-color)",
                border: "none",
              }}
              onClick={VideoEndCall}
            >
              <End className="multiple_call_btn1" />
            </Button>
          </div>
        </div>
      </div>
      {callRing && <AudioPlayer src={Ringing} autoPlay loop />}
      <Modal show={contactlistOpen} size="sm" centered>
        <ContactModal setContactlistOpen={setContactlistOpen} />
      </Modal>

      <Modal show={show} size={activeCalls.length > 1 ? "md" : "sm"} centered>
        <Modal.Body className="dial-pad-width new-dial">
          <div className="d-flex align-items-center justify-content-end mb-2">
            <Closeicon
              width={25}
              onClick={() => {
                setShow(false);
                setIsKeypad(false);
                if (callState) setMinimizeOpen(true);
              }}
              height={25}
            />
            {/* <img src={close}
                            onClick={() => {
                                setShow(false)
                                setIsKeypad(false)
                                if (callState) setMinimizeOpen(true)
                            }}
                            alt="" width={25}
                            style={{ cursor: "pointer" }} /> */}
          </div>
          <CallScreen
            setCallState={setCallState}
            callState={callState}
            makeCall={makeCall}
            endCall={endCall}
            callHold={callHold}
            activeCalls={activeCalls}
            fullScreen={fullScreen}
            callTimer={callTimer}
            muteCall={muteCall}
            mute={mute}
            setContactlistOpen={setContactlistOpen}
            isMultipleCall={activeCalls.length > 1}
            currentCallEnd={currentCallEnd}
            transferCall={TransferCall}
            transferCallNavigate={transferCallNavigate}
            DTMFhandler={DTMFhandler}
            setIsKeypad={setIsKeypad}
            isKeypad={isKeypad}
            currentCallHold={currentCallHold}
            callerName={callerName}
            recordCall={recordCall}
          />
        </Modal.Body>
      </Modal>
      <Draggable bounds="parent">
        <div className="minimize_screen">
          {minimizeOpen && callState == "incoming" && (
            <MinimizeIncomingcall
              answerCall={answerCall}
              rejectCall={rejectCall}
              activeCalls={activeCalls}
              incomingName={incomingName}
              showNotification={showNotification}
              isVideoCall={notificationName}
              callTypecheck={callTypecheck}
            />
          )}
          {minimizeOpen && callState != "incoming" && (
            <MinimizeCallScreen
              setCallState={setCallState}
              callState={callState}
              setShow={setShow}
              setMinimizeOpen={setMinimizeOpen}
              endCall={endCall}
              callHold={callHold}
              activeCalls={activeCalls}
              fullScreen={fullScreen}
              callTimer={callTimer}
              muteCall={muteCall}
              mute={mute}
              setContactlistOpen={setContactlistOpen}
              transferCallNavigate={transferCallNavigate}
              setIsKeypad={setIsKeypad}
            />
          )}
        </div>
      </Draggable>
    </>
  );
}
