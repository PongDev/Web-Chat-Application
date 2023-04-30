import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JWTPayload, VerifierRequestDTO, VerifierResponseDTO } from 'types';
import { VerifierService } from './verifier.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Verifier')
@Controller('verifier')
export class VerifierController {
  constructor(private readonly verifierService: VerifierService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verify the user',
    type: VerifierResponseDTO,
  })
  @UseGuards(JwtAuthGuard)
  async verify(
    @Body() payload: VerifierRequestDTO,
    @User() user: JWTPayload,
  ): Promise<VerifierResponseDTO> {
    return await this.verifierService.verify(user.userID, payload);
  }
}
