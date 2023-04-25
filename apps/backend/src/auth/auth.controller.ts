import { AuthService } from './auth.service';
import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';
import { GoogleTokenIDBody, JWTPayload } from 'types';
import { JwtAuthGuard as RefreshJWTAuthGuard } from './jwt-refresh-auth.guard';
import { User } from './user.decorator';

@Controller('auth')
@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/token/google')
  async googleLogin(@Body() body: GoogleTokenIDBody) {
    return this.authService.googleLogin(body.token);
  }

  @Post('/token/refresh')
  @UseGuards(RefreshJWTAuthGuard)
  async renewAccessToken(@User() user: JWTPayload) {
    return this.authService.renewAccessToken(user);
  }
}
