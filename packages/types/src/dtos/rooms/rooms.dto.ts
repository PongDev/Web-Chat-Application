import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

export enum RoomType {
  DIRECT_MESSAGE_ROOM = "DIRECT_MESSAGE_ROOM",
  GROUP_ROOM = "GROUP_ROOM",
}

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
  type: RoomType.DIRECT_MESSAGE_ROOM;
}

export class CreateGroupRoomBodyDto {
  type: RoomType.GROUP_ROOM;

  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: () => Boolean })
  @IsBoolean()
  isJoinable?: boolean;

  @ApiProperty({ type: () => String })
  @IsString()
  password?: string;
}

export class CreateRoomDto {
  @ValidateNested()
  @Type(() => CreateRoomTypeDto, {
    discriminator: {
      property: "type",
      subTypes: [
        {
          value: CreateDMRoomBodyDto,
          name: RoomType.DIRECT_MESSAGE_ROOM,
        },
        { value: CreateGroupRoomBodyDto, name: RoomType.GROUP_ROOM },
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

  @ApiProperty({ type: () => RoomType, required: true })
  @IsEnum(RoomType)
  @IsNotEmpty()
  type: RoomType;

  @ApiProperty({ type: () => Boolean })
  @IsBoolean()
  isJoinable?: boolean;

  @ApiProperty({ type: () => String })
  @IsString()
  password?: string;
}

export class CreateRoomResultDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  id: string;
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
