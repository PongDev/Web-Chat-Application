import { IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const user = useUser();
  const [message, setMessage] = useState("");
  const handleSend = () => {
    setMessage("");
    console.log("sent");
    //   socket.emit("message", message);
    //   setMessage("");
  };
  const handleClickMore = () => {
    console.log("more stuff");
  };
  const { messageListRef, messages } = useLoadMessages();

  useEffect(() => {
    if (router.isReady) {
      apiClient.post(`rooms/group/join/${router.query.id}`);
      WebSocketAPI.getInstance().send({
        type: SocketMessageType.SocketMessageTypeJoin,
        channelId: router.query.id as string,
        token: localStorage.getItem("accessToken") || "",
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
            ownMessage={message.userId === "1" ? true : false}
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
