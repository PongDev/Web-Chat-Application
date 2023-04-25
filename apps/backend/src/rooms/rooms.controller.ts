import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateRoomDto, JWTPayload } from 'types';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllRooms(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.roomsService.getAllRooms(+page, +limit);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createNewRoom(@Body() body: CreateRoomDto, @User() user: JWTPayload) {
    return this.roomsService.createNewRoom(body.body, user.userID);
  }

  @Get('/joined')
  @UseGuards(JwtAuthGuard)
  async getJoinedRooms(@User() user: JWTPayload) {
    return this.roomsService.getJoinedRooms(user.userID);
  }

  // Join group room (I guess ?)
  @Post('/group/join/:roomId')
  @UseGuards(JwtAuthGuard)
  async joinRoom(@User() user: JWTPayload, @Query('roomId') roomId: string) {
    return this.roomsService.joinGroupRoom(user.userID, roomId);
  }

  @Get('/group/created')
  @UseGuards(JwtAuthGuard)
  async getCreatedRooms(@User() user: JWTPayload) {
    return this.roomsService.getCreatedRooms(user.userID);
  }

  @Get('/info/:roomId')
  @UseGuards(JwtAuthGuard)
  async getRoomInfo(@Query('roomId') roomId: string, @User() user: JWTPayload) {
    return this.roomsService.getRoomInfo(roomId, user.userID);
  }
}
