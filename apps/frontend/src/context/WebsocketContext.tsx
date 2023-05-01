/* eslint-disable turbo/no-undeclared-env-vars */
import { useRouter } from "next/router";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SocketMessageDTO, SocketMessageType } from "types";

interface WebsocketContextValue {
  subscribe: (channelId: string, callback: (message: string) => void) => void;
  unsubscribe: (channelId: string, callback: (message: string) => void) => void;
  send: (type: SocketMessageType, channelId: string, message: string) => void;
  state?: number;
}

export const WebsocketContext = createContext<WebsocketContextValue>(
  {} as WebsocketContextValue
);
export const useWebsocket = () => useContext(WebsocketContext);

export const WebsocketProvider = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  const router = useRouter();
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [websocketState, setWebsocketState] = useState<number | undefined>();
  const subscribers = useRef<{
    [channelId: string]: Set<(message: string) => void>;
  }>({});

  const handleMessage = useCallback((message: string) => {
    const { channelId, type, message: msg } = JSON.parse(message);

    if (type === SocketMessageType.SocketMessageTypeMessage) {
      subscribers.current[channelId]?.forEach((callback) => {
        callback(msg);
      });
    }
  }, []);

  const connect = useCallback(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BASE_URL ?? "");
    ws.onmessage = (event) => handleMessage(event.data);
    ws.onerror = () => {
      setWebsocketState(ws.readyState);
      setTimeout(() => connect(), 1000);
    };
    ws.onclose = () => {
      setWebsocketState(ws.readyState);
      setTimeout(() => connect(), 1000);
    };
    ws.onopen = () => {
      setWebsocketState(ws.readyState);
    };

    setWebsocket(ws);
  }, [handleMessage]);

  const subscribe = useCallback(
    (channelId: string, callback: (message: string) => void) => {
      subscribers.current[channelId] =
        subscribers.current[channelId] ?? new Set();

      subscribers.current[channelId].add(callback);
    },
    []
  );

  const unsubscribe = useCallback(
    (channelId: string, callback: (message: string) => void) => {
      if (!subscribers.current[channelId]) {
        return;
      }

      subscribers.current[channelId].delete(callback);
    },
    []
  );

  const send = useCallback(
    (type: SocketMessageType, channelId: string, message: string) => {
      if (websocket?.readyState !== WebSocket.OPEN) {
        throw new Error("Websocket not connected");
      }
      websocket?.send(
        JSON.stringify({
          type,
          channelId,
          message,
          token: localStorage.getItem("accessToken") || "",
        } as SocketMessageDTO)
      );
    },
    [websocket]
  );

  useEffect(() => {
    if (router.isReady && !websocket) connect();

    return () => {
      websocket?.close();
    };
  }, [connect, router, websocket]);

  const value = useMemo(
    () => ({
      subscribe,
      unsubscribe,
      send,
      state: websocketState,
    }),
    [send, subscribe, unsubscribe, websocketState]
  );

  return (
    <WebsocketContext.Provider value={value}>
      {children}
    </WebsocketContext.Provider>
  );
};
