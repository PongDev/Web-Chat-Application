import { AuthService } from './auth.service';
import { Body, Controller, Injectable, Post, Req } from '@nestjs/common';
import { GoogleTokenIDBody } from 'types';

@Controller('auth')
@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/token/google')
  async googleLogin(@Body() body: GoogleTokenIDBody) {
    return this.authService.googleLogin(body.token);
  }
}
