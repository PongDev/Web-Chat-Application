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
