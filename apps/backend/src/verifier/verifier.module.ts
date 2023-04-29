import { Module } from '@nestjs/common';
import { VerifierService } from './verifier.service';
import { VerifierController } from './verifier.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [VerifierService, PrismaService],
  controllers: [VerifierController],
})
export class VerifierModule {}
