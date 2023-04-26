import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import { IMessage } from "./types";
import Message from "./message";
import { useUser } from "@/context/AuthContext";
import axios from "axios";
const roomName = "network chat";
const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const user = useUser();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [prevId, setPrevId] = useState("11");
  const handleSend = () => {
    setMessage("");
    console.log("sent");
    //   socket.emit("message", message);
    //   setMessage("");
  };
  const handleClickMore = () => {
    console.log("more stuff");
  };
  const fetchMore = async () => {
    try {
      const response = await axios.get(
        `url/messages/1?prevmessageId=${prevId}&limit=5`
      );
      setMessages([...response.data.messages, ...messages]);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    messageListRef.current!.scrollTop = messageListRef.current!.scrollHeight;
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsBottom(true);
          } else {
            setIsBottom(false);
          }
        });
      },
      { threshold: 1 }
    );
    observer.current.observe(document.getElementById("top-sentinel")!);
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isBottom && prevId != "1") {
      fetchMore();
      setIsBottom(false);
    }
  }, [isBottom, prevId]);
  useEffect(() => {
    if (
      messageListRef.current &&
      messageListRef.current.scrollHeight > scrollHeight
    ) {
      console.log("b", messageListRef.current!.scrollTop);
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight - scrollHeight;
      console.log("a", messageListRef.current!.scrollTop);
      setScrollHeight(messageListRef.current!.scrollHeight);
    }
    if (messages[0]) setPrevId(messages[0].messageId);
  }, [messages]);

  return (
    <Stack
      direction="column"
      padding={8}
      spacing={5}
      justifyContent="space-between"
    >
      <Typography variant="h4" align="center">
        {roomName}
      </Typography>
      <Stack
        direction="column"
        spacing={2}
        ref={messageListRef}
        sx={{ maxHeight: "65vh", overflow: "auto" }}
      >
        <div id="top-sentinel" style={{ height: "1px" }} />
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
