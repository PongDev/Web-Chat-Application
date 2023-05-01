import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import {
  CreateRoomDto,
  CreateRoomResultDto,
  JWTPayload,
  JoinGroupResultDto,
  JoinedRoomDetailsDto,
  JoinedRoomsDto,
  RoomBriefDetailsDto,
  RoomInfoDto,
} from 'types';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [RoomBriefDetailsDto],
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllRooms(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<RoomBriefDetailsDto[]> {
    return this.roomsService.getAllRooms(+page, +limit);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateRoomResultDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid room type',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to create room',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createNewRoom(
    @Body() body: CreateRoomDto,
    @User() user: JWTPayload,
  ): Promise<CreateRoomResultDto> {
    return this.roomsService.createNewRoom(body.body, user.userId);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: JoinedRoomsDto,
  })
  @Get('/joined')
  @UseGuards(JwtAuthGuard)
  async getJoinedRooms(@User() user: JWTPayload): Promise<JoinedRoomsDto> {
    return this.roomsService.getJoinedRooms(user.userId);
  }

  // Join group room (I guess ?)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: JoinGroupResultDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Group room not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Group room password invalid',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Group room is not joinable',
  })
  @Post('/group/join/:roomId')
  @UseGuards(JwtAuthGuard)
  async joinRoom(
    @User() user: JWTPayload,
    @Param('roomId') roomId: string,
    @Body('password') password: string,
  ): Promise<JoinGroupResultDto> {
    return this.roomsService.joinGroupRoom(user.userId, roomId, password);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [JoinedRoomDetailsDto],
  })
  @Get('/group/created')
  @UseGuards(JwtAuthGuard)
  async getCreatedRooms(
    @User() user: JWTPayload,
  ): Promise<JoinedRoomDetailsDto[]> {
    return this.roomsService.getCreatedRooms(user.userId);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoomInfoDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Room not found',
  })
  @Get('/info/:roomId')
  @UseGuards(JwtAuthGuard)
  async getRoomInfo(
    @Param('roomId') roomId: string,
    @User() user: JWTPayload,
  ): Promise<RoomInfoDto> {
    return this.roomsService.getRoomInfo(roomId, user.userId);
  }
}
