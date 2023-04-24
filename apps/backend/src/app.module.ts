import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, JwtService, PrismaService, AuthService],
})
export class AppModule {}
