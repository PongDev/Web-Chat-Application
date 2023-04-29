export class CreateChannelResponse {
  channelId: string;
}

export class CreateChannelWithIdResponse {
  message: string;
}

export class DeleteChannelResponse {
  message: string;
}

export class HandleMessageResponse {
  message: string;
}

export class HandleMessageRequest {
  content: string;
}

export enum SocketMessageType {
  SocketMessageTypeCloseChannel = "CLOSE_CHANNEL",
  SocketMessageTypeACK = "ACK",
  SocketMessageTypeError = "ERROR",
  SocketMessageTypeJoin = "JOIN",
  SocketMessageTypeLeave = "LEAVE",
  SocketMessageTypeUnauthorized = "UNAUTHORIZED",
  SocketMessageTypeMessage = "MESSAGE",
  SocketMessageTypeBroadcast = "BROADCAST",
}

export class SocketMessageDTO {
  type: SocketMessageType;
  channelId: string;
  message: string;
  token: string;
}
