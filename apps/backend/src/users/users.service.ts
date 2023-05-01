import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserDto } from 'types';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers(): Promise<UserDto[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        profileImage: true,
      },
    });
  }

  async updateUser(userId: string, body: UpdateUserDto): Promise<UserDto> {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        name: body.name,
        profileImage: body.profileImage,
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
      },
    });
  }

  async getUserById(userId: string): Promise<UserDto> {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
      },
    });
  }
}
