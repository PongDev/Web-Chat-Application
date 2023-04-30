import { IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import { IMessage } from "./types";
import Message from "./message";
import { useUser } from "@/context/AuthContext";
import useLoadMessages from "@/hooks/useLoadMessages";
import apiClient from "@/config/axios";
import { useRouter } from "next/router";
import { WebSocketAPI } from "@/utility/socket";
import { SocketMessageType } from "types";
const roomName = "network chat";
const ChatWindow = () => {
  const router = useRouter();
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const handleSend = () => {
    apiClient.post(`messages/${router.query.id}`, { content: message });
    setMessage("");
    console.log("sent");
  };
  const handleClickMore = () => {
    console.log("more stuff");
  };
  const { messageListRef, messages } = useLoadMessages();
  const webSocket = useRef<WebSocketAPI | null>(null);
  useEffect(() => {
    if (router.isReady) {
      apiClient.post(`rooms/group/join/${router.query.id}`);
      webSocket.current = WebSocketAPI.getInstance();
      webSocket.current?.getSocket().addEventListener("open", (event) => {
        console.log("WebSocket connection opened.");
        webSocket.current?.send({
          type: SocketMessageType.SocketMessageTypeJoin,
          channelId: router.query.id as string,
          message: "",
          token: localStorage.getItem("accessToken") || "",
        });
      });
      webSocket.current?.getSocket().addEventListener("message", (event) => {
        console.log(event.data);
      });
    }
  }, [router]);
  return (
    <Stack
      direction="column"
      paddingY={6}
      paddingX={12}
      spacing={5}
      justifyContent="space-between"
      minHeight="100vh"
      width="100%"
    >
      <Typography variant="h4" align="center">
        {roomName}
      </Typography>
      <Stack
        direction="column"
        spacing={2}
        ref={messageListRef}
        sx={{ maxHeight: "65vh", minHeight: "65vh", overflow: "auto" }}
      >
        <div
          id="top-sentinel"
          style={{ marginTop: "auto !important", height: "1px" }}
        />
        {messages.map((message: IMessage) => (
          <Message
            ownMessage={message.userId === user?.id ? true : false}
            message={message}
            key={message.messageId}
          ></Message>
        ))}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton
          aria-label="more button"
          size="large"
          onClick={handleClickMore}
        >
          <AddCircleOutlineIcon fontSize="large" />
        </IconButton>
        <TextField
          label="Type your message"
          variant="outlined"
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton aria-label="send button" size="large" onClick={handleSend}>
          <SendIcon fontSize="large" />
        </IconButton>
      </Stack>
    </Stack>
  );
};
export default ChatWindow;
