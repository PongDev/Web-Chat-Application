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

  @Get('/created')
  @UseGuards(JwtAuthGuard)
  async getCreatedRooms(@User() user: JWTPayload) {
    return this.roomsService.getCreatedRooms(user.userID);
  }
}
