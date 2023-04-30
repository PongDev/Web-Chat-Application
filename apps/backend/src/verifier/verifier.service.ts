import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifierRequestDTO, VerifierResponseDTO } from 'types';

@Injectable()
export class VerifierService {
  private readonly logger = new Logger(VerifierService.name);

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
    this.logger.log(
      `User ${userId} verified for room ${roomId} with request type ${
        payload.type
      } result: ${room !== null}`,
    );
    return { valid: room !== null };
  }
}
