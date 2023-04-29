import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { SocketService } from './socket/socket.service';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [AuthModule, RoomsModule, UsersModule, MessagesModule, SocketModule],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    PrismaService,
    AuthService,
    SocketService,
  ],
})
export class AppModule {}
