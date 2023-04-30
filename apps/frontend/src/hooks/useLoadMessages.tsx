import { IMessage } from "@/components/chatPage/types";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
const useLoadMessages = () => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [prevId, setPrevId] = useState("11");
  const fetchMore = async () => {
    try {
      const response = await axios.get(
        `https://443031b1-b3ee-4a7d-bfd6-569b719cafa0.mock.pstmn.io/messages/1?prevmessageId=${prevId}&limit=5`
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
    if (isBottom && prevId !== "1") {
      fetchMore();
      setIsBottom(false);
    }
  }, [isBottom]);
  useEffect(() => {
    if (
      messageListRef.current &&
      messageListRef.current.scrollHeight > scrollHeight
    ) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight - scrollHeight;
      setScrollHeight(messageListRef.current!.scrollHeight);
    }
    if (messages[0]) setPrevId(messages[0].messageId);
  }, [messages]);

  return { messageListRef: messageListRef, messages: messages };
};
export default useLoadMessages;
