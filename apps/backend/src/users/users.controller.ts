import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { JWTPayload, UpdateUserDto, UserDto } from 'types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@User() user: JWTPayload): Promise<UserDto> {
    return {
      id: user.userID,
      name: user.name,
      profileImage: user.picture,
    };
  }

  @Put('/me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(
    @User() user: JWTPayload,
    @Body() body: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(user.userID, body);
  }
}
