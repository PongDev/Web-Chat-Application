import { Injectable } from '@nestjs/common';
import { backendConfig } from 'config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelResponse, HandleMessageRequest } from 'types';

@Injectable()
export class SocketService {
  private readonly socketBaseUrl: string;

  constructor(private prismaService: PrismaService) {
    this.socketBaseUrl = backendConfig.socketBaseUrl.endsWith('/')
      ? backendConfig.socketBaseUrl.slice(0, -1)
      : backendConfig.socketBaseUrl;
  }

  async initializeSocketChannel() {
    const rooms = await this.prismaService.room.findMany();

    for (const channelId of rooms.map((room) => room.id)) {
      await this.createSocketChannelWithId(channelId);
    }
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
