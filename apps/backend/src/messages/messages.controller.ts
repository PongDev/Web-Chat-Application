import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import {
  JWTPayload,
  CreateMessageDto,
  GetMessagesByRoomIdResponse,
  RoomIdMessageResponse,
} from 'types';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get messages by room ID',
    type: [RoomIdMessageResponse],
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not Member of Room',
  })
  @Get('/:roomId')
  @UseGuards(JwtAuthGuard)
  async getMessagesByRoomId(
    @Param('roomId') roomId: string,
    @Query('prevMessageId') prevMessageId: string,
    @Query('limit', ParseIntPipe) limit: string,
    @User() user: JWTPayload,
  ): Promise<GetMessagesByRoomIdResponse> {
    return await this.messagesService.getMessagesByRoomId(
      roomId,
      prevMessageId,
      +limit,
      user.userID,
    );
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create message',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not Member of Room',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Couldn't send message to channel",
  })
  @Post('/:roomId')
  @UseGuards(JwtAuthGuard)
  async createMessage(
    @Param('roomId') roomId: string,
    @User() user: JWTPayload,
    @Body() body: CreateMessageDto,
  ): Promise<void> {
    return await this.messagesService.createMessage(roomId, user.userID, body);
  }
}
