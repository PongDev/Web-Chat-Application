import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from 'src/socket/socket.service';
import {
  CreateDMRoomBodyDto,
  CreateGroupRoomBodyDto,
  CreateRoomResultDto,
  JoinGroupResultDto,
  JoinedRoomDetailsDto,
  JoinedRoomsDto,
  RoomBriefDetailsDto,
  RoomInfoDto,
  RoomType,
} from 'types';
import * as bcrypt from 'bcrypt';
import { backendConfig } from 'config';

@Injectable()
export class RoomsService {
  constructor(
    private prismaService: PrismaService,
    private socketService: SocketService,
  ) {}

  private async createNewGroupRoom(
    name: string,
    userId: string,
    password?: string,
  ): Promise<CreateRoomResultDto> {
    if (password)
      password = await bcrypt.hash(password, backendConfig.bcrypt.salt_rounds);
    else password = undefined;
    return await this.prismaService.$transaction(async (tx) => {
      const newRoom = await tx.room.create({
        data: {
          type: RoomType.GROUP,
          owner: userId,
          name,
          isJoinable: true,
          password: password,
        },
      });

      await tx.userRoomMember.create({
        data: {
          roomId: newRoom.id,
          userId,
        },
      });

      const result = this.socketService.createSocketChannelWithId(newRoom.id);
      if (!result)
        throw new InternalServerErrorException(
          'Failed to create socket channel',
        );

      return {
        id: newRoom.id,
      };
    });
  }

  private async createNewDMRoom(
    userId1: string,
    userId2: string,
  ): Promise<CreateRoomResultDto> {
    if (userId1 === userId2)
      throw new BadRequestException('Cannot create DM room with yourself');

    if (userId1 > userId2) {
      const temp = userId1;
      userId1 = userId2;
      userId2 = temp;
    }

    return await this.prismaService.$transaction(async (tx) => {
      const room = await tx.room.findFirst({
        where: {
          type: RoomType.DIRECT,
          UserRoomMember: {
            every: {
              userId: {
                in: [userId1, userId2],
              },
            },
          },
        },
      });

      let roomId = room?.id;
      if (!roomId) {
        const newRoom = await tx.room.create({
          data: {
            type: RoomType.DIRECT,
            isJoinable: false,
          },
        });

        await tx.userRoomMember.createMany({
          data: [
            {
              roomId: newRoom.id,
              userId: userId1,
            },
            {
              roomId: newRoom.id,
              userId: userId2,
            },
          ],
        });

        roomId = newRoom.id;

        const result = this.socketService.createSocketChannelWithId(newRoom.id);
        if (!result)
          throw new InternalServerErrorException(
            'Failed to create socket channel',
          );
      }

      return {
        id: roomId,
      };
    });
  }

  private async getJoinedDMRoom(
    userId: string,
  ): Promise<JoinedRoomDetailsDto[]> {
    const DMRoom = await this.prismaService.room.findMany({
      where: {
        type: RoomType.DIRECT,
        UserRoomMember: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        UserRoomMember: {
          select: {
            User: true,
          },
        },
      },
    });

    return DMRoom.map((room) => ({
      id: room.id,
      name:
        room.UserRoomMember[0].User.id === userId
          ? room.UserRoomMember[1].User.name
          : room.UserRoomMember[0].User.name,
      isRequiredPassword: false,
    }));
  }

  private async getJoinedGroupRoom(
    userId: string,
  ): Promise<JoinedRoomDetailsDto[]> {
    const groupRoom = await this.prismaService.userRoomMember.findMany({
      where: {
        userId,
        Room: {
          type: RoomType.GROUP,
        },
      },
      select: {
        Room: {
          select: {
            name: true,
            id: true,
            password: true,
          },
        },
      },
    });

    return groupRoom.map((room) => ({
      id: room.Room.id,
      name: room.Room.name,
      isRequiredPassword: room.Room.password ? true : false,
    }));
  }

  async checkJoinedRoom(userId: string, roomId: string): Promise<boolean> {
    const room = await this.prismaService.userRoomMember.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    return !!room;
  }

  async getAllRooms(
    page: number,
    limit: number,
  ): Promise<RoomBriefDetailsDto[]> {
    if (!page) page = 1;
    if (!limit) limit = 10;

    const rooms = await this.prismaService.room.findMany({
      where: {
        type: RoomType.GROUP,
      },
      include: {
        OwnerUser: true,
        UserRoomMember: true,
      },
    });

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      owner: room.OwnerUser.name,
      userCount: room.UserRoomMember.length,
      isRequiredPassword: room.password ? true : false,
    }));
  }

  async createNewRoom(
    body: CreateGroupRoomBodyDto | CreateDMRoomBodyDto,
    userId: string,
  ): Promise<CreateRoomResultDto> {
    let newRoom: CreateRoomResultDto = null;

    if (body.type === RoomType.GROUP) {
      const _body = body as CreateGroupRoomBodyDto;
      newRoom = await this.createNewGroupRoom(
        _body.name,
        userId,
        _body.password,
      );
    } else if (body.type === RoomType.DIRECT) {
      const _body = body as CreateDMRoomBodyDto;
      newRoom = await this.createNewDMRoom(userId, _body.userId);
    } else throw new BadRequestException('Invalid room type');

    return newRoom;
  }

  async getCreatedRooms(userId: string): Promise<JoinedRoomDetailsDto[]> {
    const rooms = await this.prismaService.room.findMany({
      where: {
        owner: userId,
      },
      select: {
        id: true,
        name: true,
        password: true,
      },
    });

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      isRequiredPassword: room.password ? true : false,
    }));
  }

  async getJoinedRooms(userId: string): Promise<JoinedRoomsDto> {
    const directRoom = await this.getJoinedDMRoom(userId);
    const groupRoom = await this.getJoinedGroupRoom(userId);

    return {
      directRoom,
      groupRoom,
    };
  }

  async joinGroupRoom(
    userId: string,
    roomId: string,
    password?: string,
  ): Promise<JoinGroupResultDto> {
    const room = await this.prismaService.room.findFirst({
      where: {
        id: roomId,
        type: RoomType.GROUP,
      },
    });

    if (!room) throw new NotFoundException('Group Room not found');
    if (room.isJoinable === false)
      throw new BadRequestException('Room is not joinable');
    if (room.password && !(await bcrypt.compare(password, room.password)))
      throw new UnauthorizedException('Invalid password');

    await this.prismaService.userRoomMember.upsert({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      create: {
        userId,
        roomId,
      },
      update: {},
    });

    return {
      id: room.id,
    };
  }

  async getRoomInfo(roomId: string, userId: string): Promise<RoomInfoDto> {
    const room = await this.prismaService.room.findFirst({
      where: {
        id: roomId,
      },
      include: {
        UserRoomMember: {
          include: {
            User: true,
          },
        },
      },
    });

    let name = '';

    if (!room) throw new NotFoundException('Room not found');
    if (room.type === RoomType.GROUP) {
      name = room.name;
    }

    if (room.type === RoomType.DIRECT) {
      name =
        room.UserRoomMember[0].User.id === userId
          ? room.UserRoomMember[1].User.name
          : room.UserRoomMember[0].User.name;
    }

    return {
      type: room.type,
      id: roomId,
      name,
    };
  }
}
