import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class UserDto {
  @ApiProperty({
    description: "User ID",
    type: () => String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: "Name",
    type: () => String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Profile Image",
    type: () => String,
  })
  @IsUrl()
  @IsOptional()
  profileImage: string;
}

export class UpdateUserDto extends PartialType(
  PickType(UserDto, ["name", "profileImage"])
) {}
