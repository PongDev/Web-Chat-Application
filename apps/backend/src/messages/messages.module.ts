import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, RoomsService],
})
export class MessagesModule {}
