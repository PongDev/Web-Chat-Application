import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { JWTPayload, CreateMessageDto } from 'types';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/:roomId')
  @UseGuards(JwtAuthGuard)
  async getMessagesByRoomId(
    @Param('roomId') roomId: string,
    @Query('prevMessageId') prevMessageId: string,
    @Query('limit') limit: string,
    @User() user: JWTPayload,
  ) {
    return await this.messagesService.getMessagesByRoomId(
      roomId,
      prevMessageId,
      +limit,
      user.userID,
    );
  }

  @Post('/:roomId')
  @UseGuards(JwtAuthGuard)
  async createMessage(
    @Param('roomId') roomId: string,
    @User() user: JWTPayload,
    @Body() body: CreateMessageDto,
  ) {
    return await this.messagesService.createMessage(roomId, user.userID, body);
  }
}
