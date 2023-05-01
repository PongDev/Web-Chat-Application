import { IMessage } from "@/components/chatPage/types";
import apiClient from "@/config/axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
const useLoadMessages = () => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const isLatest = useRef(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const prevId = useRef("");
  const router = useRouter();
  const [isMore, setMore] = useState(true);
  const isSocketMessage = useRef(false);

  const handleSocketMessage = useCallback((message: string) => {
    const { createdAt, ...rest } = JSON.parse(message);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...rest,
        createdAt: dayjs(createdAt).format("YYYY-MM-DD HH:mm"),
      },
    ]);

    isSocketMessage.current = true;
  }, []);

  const fetchMore = useCallback(async () => {
    try {
      if (!isMore) return;

      const query = new URLSearchParams();
      if (prevId.current) query.append("prevMessageId", prevId.current);
      query.append("limit", "15");

      const response = await apiClient.get(
        `messages/${router.query.id}?${query.toString()}`
      );

      const messages = response.data;
      messages.map((message: IMessage) => {
        message.createdAt = dayjs(message.createdAt).format("YYYY-MM-DD HH:mm");
      });

      setMessages((prevMessages) => [...response.data, ...prevMessages]);
      setMore(response.data.length > 0);
      prevId.current = response.data[0].messageId;
    } catch (error) {
      console.error(error);
    }
  }, [isMore, router.query.id]);

  useEffect(() => {
    messageListRef.current!.scrollTop = messageListRef.current!.scrollHeight;
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === "top-sentinel") {
            if (entry.isIntersecting) {
              setIsBottom(true);
            } else {
              setIsBottom(false);
            }
          }
          if (entry.target.id === "bottom-sentinel") {
            if (entry.isIntersecting) {
              isLatest.current = true;
            } else {
              isLatest.current = false;
            }
          }
        });
      },
      { threshold: 1 }
    );
    observer.current.observe(document.getElementById("top-sentinel")!);
    observer.current.observe(document.getElementById("bottom-sentinel")!);
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (router.isReady) {
      if (isBottom && isMore) {
        fetchMore();
        setIsBottom(false);
      }
    }
  }, [router, isBottom, isMore, fetchMore]);

  useEffect(() => {
    if (
      messageListRef.current &&
      messageListRef.current.scrollHeight > scrollHeight &&
      !isSocketMessage.current
    ) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight - scrollHeight;
      setScrollHeight(messageListRef.current!.scrollHeight);
    }
    if (messages[0]) {
      prevId.current = messages[0].messageId;
    }
    if (isLatest.current && messageListRef.current && isSocketMessage.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
    isSocketMessage.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return {
    messageListRef: messageListRef,
    messages: messages,
    handleSocketMessage,
  };
};

export default useLoadMessages;
