import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { RoomType } from "database";

export { RoomType };
export class CreateRoomTypeDto {
  @ApiProperty({
    type: () => String,
    required: true,
    description: "The type of the room to be created",
    enum: RoomType,
  })
  @IsEnum(RoomType)
  type: RoomType;
}

export class CreateDMRoomBodyDto {
  type: RoomType;

  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class CreateGroupRoomBodyDto {
  type: RoomType;

  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: () => Boolean })
  @IsBoolean()
  @IsOptional()
  isJoinable?: boolean;

  @ApiProperty({ type: () => String })
  @IsString()
  @IsOptional()
  password?: string;
}

export class CreateRoomDto {
  @ApiProperty({
    type: () => CreateRoomTypeDto,
  })
  @ValidateNested()
  @Type(() => CreateRoomTypeDto, {
    discriminator: {
      property: "type",
      subTypes: [
        {
          value: CreateDMRoomBodyDto,
          name: RoomType.DIRECT,
        },
        { value: CreateGroupRoomBodyDto, name: RoomType.GROUP },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  body: CreateGroupRoomBodyDto | CreateDMRoomBodyDto;
}

export class RoomInfoDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: () => String, required: true })
  @IsEnum(RoomType)
  @IsNotEmpty()
  type: RoomType;

  @ApiProperty({ type: () => Boolean })
  @IsBoolean()
  @IsOptional()
  isJoinable?: boolean;

  @ApiProperty({ type: () => String })
  @IsString()
  @IsOptional()
  password?: string;
}

export class CreateRoomResultDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class JoinRoonRequestDTO {
  @ApiProperty({ type: () => String })
  @IsString()
  @IsOptional()
  password?: string;
}

export class JoinGroupResultDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class JoinedRoomDetailsDto {
  id: string;
  name: string;
}

export class RoomBriefDetailsDto extends JoinedRoomDetailsDto {
  owner: string;
  userCount: number;
}

export class JoinedRoomsDto {
  directRoom: JoinedRoomDetailsDto[];
  groupRoom: JoinedRoomDetailsDto[];
}
