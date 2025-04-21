import { io } from "socket.io-client";

export let socket: any;
export const connectTosocket = () => {
  const SERVER_URL = `ws://70.34.195.221:8081`;
  console.log(SERVER_URL, "SERVER_URL");
  const options = {
    query: {
      isAgent_connect: 0,
    },
    transports: ["websocket", "polling"],
    rejectUnauthorized: false,
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    upgrade: true,
    secure: true,
  };

  socket = io(SERVER_URL, options);

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("connect_error", (error: any) => {
    console.error("Socket connection error:", error);
  });

  socket.on("error", (error: any) => {
    console.error("Socket error:", error);
  });
};
