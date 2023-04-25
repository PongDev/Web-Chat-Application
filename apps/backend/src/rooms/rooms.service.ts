import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDMRoomBodyDto, CreateGroupRoomBodyDto, RoomType } from 'types';

@Injectable()
export class RoomsService {
  constructor(private prismaService: PrismaService) {}

  private async createNewGroupRoom(name: string, userId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const newRoom = await tx.room.create({
        data: {},
      });

      const newGroupRoom = await tx.groupRoom.create({
        data: {
          id: newRoom.id,
          name,
          owner: userId,
        },
      });

      return {
        id: newGroupRoom.id,
      };
    });
  }

  private async createNewDMRoom(userId1: string, userId2: string) {
    if (userId1 === userId2)
      throw new BadRequestException('Cannot create DM room with yourself');

    if (userId1 > userId2) {
      const temp = userId1;
      userId1 = userId2;
      userId2 = temp;
    }

    return await this.prismaService.$transaction(async (tx) => {
      const room = await tx.directMessageRoom.findFirst({
        where: {
          member1: userId1,
          member2: userId2,
        },
      });

      let roomId = room?.id;
      if (!roomId) {
        const newRoom = await tx.room.create({
          data: {},
        });

        await tx.directMessageRoom.create({
          data: {
            id: newRoom.id,
            member1: userId1,
            member2: userId2,
          },
        });

        roomId = newRoom.id;
      }

      return {
        id: roomId,
      };
    });
  }

  private async getJoinedDMRoom(userId: string) {
    const DMRoom = await this.prismaService.directMessageRoom.findMany({
      where: {
        OR: [
          {
            member1: userId,
          },
          {
            member2: userId,
          },
        ],
      },
      select: {
        id: true,
        member1User: true,
        member2User: true,
      },
    });

    return DMRoom.map((room) => ({
      id: room.id,
      name:
        room.member1User.id === userId
          ? room.member2User.name
          : room.member1User.name,
    }));
  }

  private async getJoinedGroupRoom(userId: string) {
    const groupRoom = await this.prismaService.groupRoomUser.findMany({
      where: {
        userId,
      },
      select: {
        roomId: true,
        groupRoom: {
          select: {
            name: true,
          },
        },
      },
    });

    return groupRoom.map((room) => ({
      id: room.roomId,
      name: room.groupRoom.name,
    }));
  }

  async getAllRooms(page: number, limit: number) {
    if (!page) page = 1;
    if (!limit) limit = 10;

    const count = await this.prismaService.groupRoom.count();

    const skip = (page - 1) * limit;
    const rooms = await this.prismaService.groupRoom.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        ownerUser: {
          select: {
            name: true,
          },
        },
        GroupRoomUser: true,
      },
    });

    return {
      page,
      maxPage: Math.ceil(count / limit),
      rooms: rooms.map((room) => ({
        id: room.id,
        name: room.name,
        owner: room.ownerUser.name,
        users: room.GroupRoomUser.length,
      })),
    };
  }

  async createNewRoom(
    body: CreateGroupRoomBodyDto | CreateDMRoomBodyDto,
    userId: string,
  ) {
    if (body.type === RoomType.GROUP_ROOM) {
      return await this.createNewGroupRoom(body.name, userId);
    }
    if (body.type === RoomType.DIRECT_MESSAGE_ROOM) {
      return await this.createNewDMRoom(userId, body.userID);
    }

    throw new BadRequestException('Invalid room type');
  }

  async getCreatedRooms(userId: string) {
    const rooms = await this.prismaService.groupRoom.findMany({
      where: {
        owner: userId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return rooms;
  }

  async getJoinedRooms(userId: string) {
    const directRoom = await this.getJoinedDMRoom(userId);
    const groupRoom = await this.getJoinedGroupRoom(userId);

    return {
      directRoom,
      groupRoom,
    };
  }

  async joinGroupRoom(roomId: string, userId: string) {
    const room = await this.prismaService.groupRoom.findFirst({
      where: {
        id: roomId,
      },
    });

    if (!room) throw new BadRequestException('Group Room not found');

    await this.prismaService.groupRoomUser.upsert({
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

  async getRoomInfo(roomId: string, userId: string) {
    const room = await this.prismaService.room.findFirst({
      where: {
        id: roomId,
      },
      select: {
        channelId: true,
        GroupRoom: true,
        privateRoom: true,
      },
    });

    let name = '';

    if (!room) throw new BadRequestException('Room not found');
    if (room.GroupRoom) {
      const groupRoom = await this.prismaService.groupRoom.findFirst({
        where: {
          id: roomId,
        },
        select: {
          name: true,
          ownerUser: {
            select: {
              name: true,
            },
          },
          GroupRoomUser: true,
        },
      });

      name = groupRoom.name;
    }

    if (room.privateRoom) {
      const privateRoom = await this.prismaService.directMessageRoom.findFirst({
        where: {
          id: roomId,
        },
        select: {
          member1User: true,
          member2User: true,
        },
      });

      name =
        privateRoom.member1User.id === userId
          ? privateRoom.member2User.name
          : privateRoom.member1User.name;
    }

    return {
      id: roomId,
      name,
      channelId: room.channelId,
    };
  }
}
