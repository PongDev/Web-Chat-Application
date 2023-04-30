import { Injectable, Logger } from '@nestjs/common';
import { backendConfig } from 'config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelResponse, HandleMessageRequest } from 'types';

@Injectable()
export class SocketService {
  private readonly socketBaseUrl: string;
  private readonly logger = new Logger(SocketService.name);

  constructor(private prismaService: PrismaService) {
    this.socketBaseUrl = backendConfig.socketBaseUrl.endsWith('/')
      ? backendConfig.socketBaseUrl.slice(0, -1)
      : backendConfig.socketBaseUrl;
  }

  async healthCheck() {
    const healthCheckChannelCreated = await this.createSocketChannelWithId(
      backendConfig.socketHealthCheckChannelName,
    );

    if (healthCheckChannelCreated) {
      this.logger.log('Health Not Found, Initializing Socket Channel');
      await this.initializeSocketChannel();
    }
  }

  async initializeSocketChannel() {
    const roomsID = (
      await this.prismaService.room.findMany({
        select: {
          id: true,
        },
      })
    ).map((room) => room.id);

    for (const channelId of roomsID) {
      await this.createSocketChannelWithId(channelId);
    }
    await this.createSocketChannelWithId(
      backendConfig.socketHealthCheckChannelName,
    );
  }

  async createSocketChannel(): Promise<string> {
    const res = await fetch(`${backendConfig.socketBaseUrl}/channel`, {
      method: 'POST',
    });
    const jsonResponse: CreateChannelResponse = await res.json();
    return jsonResponse.channelId;
  }

  async createSocketChannelWithId(channelId: string): Promise<boolean> {
    const res = await fetch(
      `${backendConfig.socketBaseUrl}/channel/${channelId}`,
      {
        method: 'POST',
      },
    );
    return res.status === 200;
  }

  async sendMessageToChannel(
    channelId: string,
    message: string,
  ): Promise<boolean> {
    const payload: HandleMessageRequest = { content: message };

    const res = await fetch(
      `${backendConfig.socketBaseUrl}/channel/message/${channelId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      },
    );
    return res.status === 200;
  }

  async closeSocketChannel(channelId: string): Promise<boolean> {
    const res = await fetch(
      `${backendConfig.socketBaseUrl}/channel/${channelId}`,
      {
        method: 'DELETE',
      },
    );
    return res.status === 200;
  }
}
