import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { SocketService } from 'src/socket/socket.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, RoomsService, SocketService],
})
export class MessagesModule {}
