import { PartialType, PickType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UserDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  @IsOptional()
  profileImage: string;
}

export class UpdateUserDto extends PartialType(
  PickType(UserDto, ["name", "profileImage"])
) {}
