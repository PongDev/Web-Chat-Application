import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateRoomDto, JWTPayload } from 'types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllRooms(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.roomsService.getAllRooms(+page, +limit);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async createNewRoom(@Body() body: CreateRoomDto, @User() user: JWTPayload) {
    return this.roomsService.createNewRoom(body.body, user.userID);
  }

  @ApiBearerAuth()
  @Get('/joined')
  @UseGuards(JwtAuthGuard)
  async getJoinedRooms(@User() user: JWTPayload) {
    return this.roomsService.getJoinedRooms(user.userID);
  }

  // Join group room (I guess ?)
  @ApiBearerAuth()
  @Post('/group/join/:roomId')
  @UseGuards(JwtAuthGuard)
  async joinRoom(@User() user: JWTPayload, @Param('roomId') roomId: string) {
    return this.roomsService.joinGroupRoom(user.userID, roomId);
  }

  @ApiBearerAuth()
  @Get('/group/created')
  @UseGuards(JwtAuthGuard)
  async getCreatedRooms(@User() user: JWTPayload) {
    return this.roomsService.getCreatedRooms(user.userID);
  }

  @ApiBearerAuth()
  @Get('/info/:roomId')
  @UseGuards(JwtAuthGuard)
  async getRoomInfo(@Query('roomId') roomId: string, @User() user: JWTPayload) {
    return this.roomsService.getRoomInfo(roomId, user.userID);
  }
}
