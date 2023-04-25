import { Injectable } from '@nestjs/common';
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
    return await this.prismaService.$transaction(async (tx) => {
      const room = await tx.directMessageRoom.findFirst({
        where: {
          OR: [
            { member1: userId1, member2: userId2 },
            { member1: userId2, member2: userId1 },
          ],
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

  async getAllRooms(page: number, limit: number) {
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

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      owner: room.ownerUser.name,
      users: room.GroupRoomUser.length,
    }));
  }

  async createNewRoom(
    body: CreateGroupRoomBodyDto | CreateDMRoomBodyDto,
    userId: string,
  ) {
    if (body.type === RoomType.GROUP_ROOM) {
      return await this.createNewGroupRoom(body.name, userId);
    }
    if (body.type === RoomType.DIRECT_MESSAGE_ROOM) {
      return await this.createNewDMRoom(body.userID1, body.userID2);
    }
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
}
