import { PartialType, PickType } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsUrl()
  @IsOptional()
  profileImage: string;
}

export class UpdateUserDto extends PartialType(
  PickType(UserDto, ["name", "profileImage"])
) {}
