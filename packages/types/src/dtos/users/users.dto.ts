import { IsOptional, IsString } from "class-validator";

export class UserDto {
  id: string;
  name: string;
  profileImage: string;
}

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  profileImage: string;
}
