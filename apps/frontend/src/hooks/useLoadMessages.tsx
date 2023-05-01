import { IMessage } from "@/components/chatPage/types";
import apiClient from "@/config/axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
const useLoadMessages = () => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const isLatest = useRef(true);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const prevId = useRef("");
  const isFirst = useRef(true);
  const router = useRouter();
  const isMore = useRef(true);
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

  const fetchMore = useCallback(
    async (override?: boolean) => {
      try {
        if (!isMore.current && !override) return;

        const query = new URLSearchParams();
        if (prevId.current && !override)
          query.append("prevMessageId", prevId.current);
        query.append("limit", "15");

        const response = await apiClient.get(
          `messages/${router.query.id}?${query.toString()}`
        );

        const messages = response.data.map((message: IMessage) => ({
          ...message,
          createdAt: dayjs(message.createdAt).format("YYYY-MM-DD HH:mm"),
        }));

        if (override) setMessages(messages);
        else setMessages((prevMessages) => [...messages, ...prevMessages]);

        isMore.current = messages.length > 0;
        prevId.current = response.data[0].messageId;
      } catch (error) {
        console.error(error);
      }
    },
    [router.query.id]
  );

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
    isFirst.current = true;
    setScrollHeight(0);
  }, [router.query.id]);

  useEffect(() => {
    if (router.isReady && isFirst.current) {
      fetchMore(true);
    }
  }, [fetchMore, router.isReady, router.query.id]);

  useEffect(() => {
    if (router.isReady) {
      if (!isFirst.current && isBottom && isMore.current) {
        fetchMore();
        setIsBottom(false);
      }
    }
  }, [router, isBottom, fetchMore]);

  useEffect(() => {
    if (!isFirst.current) {
      if (
        messageListRef.current &&
        messageListRef.current.scrollHeight > scrollHeight &&
        !isSocketMessage.current
      ) {
        messageListRef.current.scrollTop =
          messageListRef.current.scrollHeight - scrollHeight;
        setScrollHeight(messageListRef.current!.scrollHeight);
      }
    } else if (isFirst.current && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      setScrollHeight(messageListRef.current!.scrollHeight);
      isFirst.current = false;
    }

    if (messages[0]) {
      prevId.current = messages[0].messageId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return {
    messageListRef: messageListRef,
    messages: messages,
    handleSocketMessage,
  };
};

export default useLoadMessages;
