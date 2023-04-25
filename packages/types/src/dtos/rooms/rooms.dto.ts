import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";

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

export interface RoomInfoDto {
  id: string;
  name: string;
  channelId: string;
}

export interface CreateRoomResultDto {
  id: string;
}

export interface JoinGroupResultDto {
  id: string;
}

export interface JoinedRoomDetailsDto {
  id: string;
  name: string;
}

export interface RoomBriefDetailsDto extends JoinedRoomDetailsDto {
  owner: string;
  userCount: number;
}

export interface JoinedRoomsDto {
  directRoom: JoinedRoomDetailsDto[];
  groupRoom: JoinedRoomDetailsDto[];
}
