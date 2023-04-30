import { SocketMessageDTO, SocketMessageType } from "types";

class WebSocketAPI {
  private static instance: WebSocketAPI;
  private socket: WebSocket;
  private eventHandlers: {
    closeChannel: (channelId: string) => {};
    ack: (channelId: string) => {};
    error: () => {};
    notFound: (channelId: string) => {};
    join: () => {};
    leave: () => {};
    unauthorized: (channelId: string) => {};
    message: (channelId: string, message: string) => {};
    broadcast: () => {};
  };

  private constructor() {
    this.socket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BASE_URL ?? "");
    this.socket.onopen = () => {
      console.log("WebSocketAPI: connected");
    };
    this.socket.onclose = () => {
      console.log("WebSocketAPI: disconnected");
    };
    this.socket.onerror = (error) => {
      console.log("WebSocketAPI: error", error);
    };
    this.socket.onmessage = (event) => {
      console.log("WebSocketAPI: message", event);
      const data: SocketMessageDTO = JSON.parse(event.data);

      switch (data.type) {
        case SocketMessageType.SocketMessageTypeCloseChannel:
          this.eventHandlers.closeChannel(data.channelId);
          break;
        case SocketMessageType.SocketMessageTypeACK:
          this.eventHandlers.ack(data.channelId);
          break;
        case SocketMessageType.SocketMessageTypeError:
          this.eventHandlers.error();
          break;
        case SocketMessageType.SocketMessageTypeNotFound:
          this.eventHandlers.notFound(data.channelId);
        case SocketMessageType.SocketMessageTypeJoin:
          this.eventHandlers.join();
          break;
        case SocketMessageType.SocketMessageTypeLeave:
          this.eventHandlers.leave();
          break;
        case SocketMessageType.SocketMessageTypeUnauthorized:
          this.eventHandlers.unauthorized(data.channelId);
          break;
        case SocketMessageType.SocketMessageTypeMessage:
          this.eventHandlers.message(data.channelId, data.message);
          break;
        case SocketMessageType.SocketMessageTypeBroadcast:
          this.eventHandlers.broadcast();
          break;
      }
    };
  }

  public static getInstance(): WebSocketAPI {
    if (!WebSocketAPI.instance) {
      WebSocketAPI.instance = new WebSocketAPI();
    }
    return WebSocketAPI.instance;
  }

  public getSocket(): WebSocket {
    return this.socket;
  }

  public send(data: SocketMessageDTO): void {
    this.socket.send(JSON.stringify(data));
  }

  public setOnCloseChannel(handler: () => {}) {
    this.eventHandlers.closeChannel = handler;
  }

  public setOnACK(handler: (channelId: string) => {}) {
    this.eventHandlers.ack = handler;
  }

  public setOnError(handler: () => {}) {
    this.eventHandlers.error = handler;
  }

  public setOnNotFound(handler: (channelId: string) => {}) {
    this.eventHandlers.notFound = handler;
  }

  public setOnJoin(handler: () => {}) {
    this.eventHandlers.join = handler;
  }

  public setOnLeave(handler: () => {}) {
    this.eventHandlers.leave = handler;
  }

  public setOnUnauthorized(handler: (channelId: string) => {}) {
    this.eventHandlers.unauthorized = handler;
  }

  public setOnMessage(handler: (channelId: string, message: string) => {}) {
    this.eventHandlers.message = handler;
  }

  public setOnBroadcast(handler: () => {}) {
    this.eventHandlers.broadcast = handler;
  }
}
