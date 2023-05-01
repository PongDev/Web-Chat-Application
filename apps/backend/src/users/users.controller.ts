import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { JWTPayload, UpdateUserDto, UserDto } from 'types';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users',
    type: [UserDto],
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<UserDto[]> {
    return await this.usersService.getAllUsers();
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get current user',
    type: UserDto,
  })
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@User() user: JWTPayload): Promise<UserDto> {
    return await this.usersService.getUserById(user.userId);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update current user',
    type: UserDto,
  })
  @Put('/me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(
    @User() user: JWTPayload,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.usersService.updateUser(user.userId, body);
  }
}
