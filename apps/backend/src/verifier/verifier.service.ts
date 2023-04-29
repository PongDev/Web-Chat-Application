import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifierRequestDTO, VerifierResponseDTO } from 'types';

@Injectable()
export class VerifierService {
  constructor(private prismaService: PrismaService) {}

  async verify(
    userId: string,
    payload: VerifierRequestDTO,
  ): Promise<VerifierResponseDTO> {
    const roomId = payload.channelId;

    const room = await this.prismaService.userRoomMember.findUnique({
      where: {
        userId_roomId: {
          userId: userId,
          roomId: roomId,
        },
      },
    });
    if (room !== null) {
      return { valid: true };
    }
    return { valid: false };
  }
}
