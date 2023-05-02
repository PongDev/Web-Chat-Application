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
  send: (type: SocketMessageType, channelId: string, message?: string) => void;
  state?: number;
}

export const WebsocketContext = createContext<WebsocketContextValue>(
  {} as WebsocketContextValue
);
export const useWebsocket = () => useContext(WebsocketContext);

export const WebsocketProvider = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  const websocket = useRef<WebSocket | null>(null);
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
    let timeout: NodeJS.Timeout;

    ws.onmessage = (event) => handleMessage(event.data);
    ws.onerror = () => {
      setWebsocketState(ws.readyState);
      websocket.current = null;
      clearInterval(timeout);
    };
    ws.onclose = () => {
      setWebsocketState(ws.readyState);
      websocket.current = null;
      clearInterval(timeout);
    };
    ws.onopen = () => {
      setWebsocketState(ws.readyState);
      timeout = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN)
          ws.send(
            JSON.stringify({
              type: SocketMessageType.SocketMessageTypePing,
            })
          );
      }, 15000);
    };

    websocket.current = ws;
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
    (type: SocketMessageType, channelId: string, message?: string) => {
      if (websocket.current?.readyState !== WebSocket.OPEN) {
        return;
      }
      websocket.current?.send(
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
    if (!websocket.current) connect();

    return () => {
      if (websocket.current?.readyState === WebSocket.OPEN)
        websocket.current?.close();
    };
  }, [connect]);

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
