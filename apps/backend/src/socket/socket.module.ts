import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SocketService, PrismaService],
  exports: [SocketService],
})
export class SocketModule {}
