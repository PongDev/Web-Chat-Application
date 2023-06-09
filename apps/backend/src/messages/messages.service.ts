import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { SocketService } from 'src/socket/socket.service';
import {
  CreateMessageDto,
  GetMessagesByRoomIdResponse,
  RoomIdMessageResponse,
} from 'types';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private roomsService: RoomsService,
    private socketService: SocketService,
  ) {}

  async getMessagesByRoomId(
    roomId: string,
    prevMessageId: string,
    limit: number,
    userId: string,
  ): Promise<GetMessagesByRoomIdResponse> {
    if (!limit || limit <= 0) limit = 50;

    if (!(await this.roomsService.checkJoinedRoom(userId, roomId)))
      throw new ForbiddenException('You are not a member of this room');

    const messages = await this.prisma.message.findMany({
      where: {
        roomId,
        id: {
          lt: prevMessageId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        senderUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return messages.reverse().map((val) => ({
      messageId: val.id,
      message: val.text,
      displayName: val.senderUser.name,
      createdAt: val.createdAt,
      userId: val.senderUser.id,
    }));
  }

  async createMessage(roomId: string, userId: string, body: CreateMessageDto) {
    if (!(await this.roomsService.checkJoinedRoom(userId, roomId)))
      throw new ForbiddenException('You are not a member of this room');

    const messageData = await this.prisma.message.create({
      data: {
        roomId,
        senderId: userId,
        text: body.content,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        senderUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const messagePayload: RoomIdMessageResponse = {
      messageId: messageData.id,
      message: messageData.text,
      displayName: messageData.senderUser.name,
      createdAt: messageData.createdAt,
      userId: messageData.senderUser.id,
    };

    const result = await this.socketService.sendMessageToChannel(
      roomId,
      JSON.stringify(messagePayload),
    );

    if (!result)
      throw new InternalServerErrorException(
        "Couldn't send message to channel",
      );
  }
}
