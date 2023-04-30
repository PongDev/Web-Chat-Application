import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  GoogleTokenIDBody,
  JWTPayload,
  JWTToken,
  RenewAccessTokenResponse,
} from 'types';
import { JwtAuthGuard as RefreshJWTAuthGuard } from './jwt-refresh-auth.guard';
import { User } from './user.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Authenticate with Google OAuth',
    type: JWTToken,
  })
  @Post('/token/google')
  async googleLogin(@Body() body: GoogleTokenIDBody): Promise<JWTToken> {
    return this.authService.googleLogin(body.token);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Refresh JWT Token',
    type: RenewAccessTokenResponse,
  })
  @Post('/token/refresh')
  @ApiBearerAuth()
  @UseGuards(RefreshJWTAuthGuard)
  async renewAccessToken(
    @User() user: JWTPayload,
  ): Promise<RenewAccessTokenResponse> {
    return this.authService.renewAccessToken(user);
  }
}
