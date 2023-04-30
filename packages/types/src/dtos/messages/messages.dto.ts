import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  content: string;
}

export class RoomIdMessageResponse {
  @ApiProperty({
    description: "Message ID",
    type: () => String,
  })
  messageId: string;

  @ApiProperty({
    description: "Message Body",
    type: () => String,
  })
  message: string;

  @ApiProperty({
    description: "Display Name",
    type: () => String,
  })
  displayName: string;

  @ApiProperty({
    description: "Created At",
    type: () => Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: "User ID",
    type: () => String,
  })
  userId: string;
}

export type GetMessagesByRoomIdResponse = RoomIdMessageResponse[];
