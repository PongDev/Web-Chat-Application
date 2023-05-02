import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

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
  SocketMessageTypeNotFound = "NOT_FOUND",
  SocketMessageTypeJoin = "JOIN",
  SocketMessageTypeLeave = "LEAVE",
  SocketMessageTypePing = "PING",
  SocketMessageTypeUnauthorized = "UNAUTHORIZED",
  SocketMessageTypeMessage = "MESSAGE",
  SocketMessageTypeBroadcast = "BROADCAST",
}

export class SocketMessageDTO {
  @ApiProperty({
    type: () => String,
    description: "Socket Message Type",
    enum: SocketMessageType,
  })
  @IsEnum(SocketMessageType)
  type: SocketMessageType;

  @ApiProperty({
    type: () => String,
    description: "Socket Channel ID",
  })
  @IsString()
  channelId: string;

  @ApiProperty({
    type: () => String,
    description: "Socket Message",
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    type: () => String,
    description: "JSON Web Token for Verification",
  })
  @IsString()
  @IsOptional()
  token?: string;
}

export class VerifierRequestDTO extends PickType(SocketMessageDTO, [
  "type",
  "channelId",
]) {}

export class VerifierResponseDTO {
  @ApiProperty({
    type: () => Boolean,
    description: "Verificatopn Result",
  })
  valid: boolean;
}
