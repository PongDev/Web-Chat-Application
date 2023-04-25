import { Type } from "class-transformer";
import { Equals, IsString, ValidateNested } from "class-validator";

export enum RoomType {
  DIRECT_MESSAGE_ROOM = "DIRECT_MESSAGE_ROOM",
  GROUP_ROOM = "GROUP_ROOM",
}

export class CreateRoomTypeDto {
  type: RoomType;
}

export class CreateDMRoomBodyDto {
  type: RoomType.DIRECT_MESSAGE_ROOM;

  @IsString()
  userID: string;
}

export class CreateGroupRoomBodyDto {
  type: RoomType.GROUP_ROOM;

  @IsString()
  name: string;
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
