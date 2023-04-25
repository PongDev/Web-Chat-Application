import { Type } from "class-transformer";
import { Equals, IsEnum, IsString, ValidateNested } from "class-validator";

export enum RoomType {
  DIRECT_MESSAGE_ROOM = "DIRECT_MESSAGE_ROOM",
  GROUP_ROOM = "GROUP_ROOM",
}

export class CreateRoomTypeDto {
  type: RoomType;
}

export class CreateDMRoomBodyDto {
  @Equals(RoomType.DIRECT_MESSAGE_ROOM)
  type: RoomType.DIRECT_MESSAGE_ROOM;

  @IsString()
  userID1: string;

  @IsString()
  userID2: string;
}

export class CreateGroupRoomBodyDto {
  @Equals(RoomType.GROUP_ROOM)
  type: RoomType.GROUP_ROOM;

  @IsString()
  name: string;

  @IsString()
  ownerID: string;
}

export class CreateRoomDto {
  @ValidateNested()
  @Type(() => CreateRoomTypeDto, {
    discriminator: {
      property: "type",
      subTypes: [
        {
          value: CreateDMRoomBodyDto,
          name: RoomType[RoomType.DIRECT_MESSAGE_ROOM],
        },
        { value: CreateGroupRoomBodyDto, name: RoomType[RoomType.GROUP_ROOM] },
      ],
    },
  })
  body: CreateGroupRoomBodyDto | CreateDMRoomBodyDto;
}
