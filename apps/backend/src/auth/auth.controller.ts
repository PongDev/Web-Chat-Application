import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GoogleTokenIDBody, JWTPayload } from 'types';
import { JwtAuthGuard as RefreshJWTAuthGuard } from './jwt-refresh-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.decorator';

@Controller('auth')
@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/token/google')
  async googleLogin(@Body() body: GoogleTokenIDBody) {
    return this.authService.googleLogin(body.token);
  }

  @UseGuards(RefreshJWTAuthGuard)
  @Post('/token/refresh')
  async renewAccessToken(@User() user: JWTPayload) {
    return this.authService.renewAccessToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUser(@User() user: JWTPayload) {
    return {
      userID: user.userID,
      name: user.name,
      picture: user.picture,
    };
  }
}
