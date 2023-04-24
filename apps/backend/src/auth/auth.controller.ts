import { AuthService } from './auth.service';
import { Body, Controller, Injectable, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/google')
  async googleLogin(@Req() req: Request, @Body() body: { token: string }) {
    return this.authService.googleLogin(body.token);
  }
}
