import { IMessage } from "@/components/chatPage/types";
import apiClient from "@/config/axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
const useLoadMessages = () => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [prevId, setPrevId] = useState("11");
  const router = useRouter();
  const fetchMore = async () => {
    try {
      const response = await apiClient.get(
        `messages/${router.query.id}?prevmessageId=${prevId}&limit=15`
      );
      setMessages([...response.data, ...messages]);
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
    if (router.isReady) {
      if (isBottom && prevId !== "1") {
        fetchMore();
        setIsBottom(false);
      }
    }
  }, [router, isBottom]);
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
