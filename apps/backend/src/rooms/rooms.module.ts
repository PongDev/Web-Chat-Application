import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from 'src/socket/socket.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService, SocketService],
})
export class RoomsModule {}
