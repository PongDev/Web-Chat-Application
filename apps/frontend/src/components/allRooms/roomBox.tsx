import { Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import theme from "@/config/theme";
import apiClient from "@/config/axios";
import { useRouter } from "next/router";
import { UpdateRoomType } from "@/context/NavbarContext";
import { JoinedRoomDetailsDto } from "types";

interface IRoomBoxProps {
  currentUser: number;
  roomName: string;
  owner: string;
  id: string;
  requiredPassword: boolean;
  handleJoinRoom: (room: JoinedRoomDetailsDto) => void;
}

const RoomBox = ({
  currentUser,
  roomName,
  owner,
  id,
  requiredPassword,
  handleJoinRoom,
}: IRoomBoxProps) => {
  const handlejoin = async (id: string) => {
    handleJoinRoom({
      id,
      isRequiredPassword: requiredPassword,
      name: roomName,
    });
  };
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.secondary["200"],
        height: "100%",
        borderRadius: 3,
      }}
      onClick={() => handlejoin(id)}
    >
      <CardContent>
        <Stack direction="column" spacing={2} justifyContent="center">
          <Stack direction="row" justifyContent="left" alignItems="center">
            <PersonIcon fontSize="small" color="primary" />
            <Typography
              variant="subtitle2"
              align="right"
              color="primary"
              marginRight="auto"
            >
              {owner}
            </Typography>
            <PeopleIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" align="right" color="primary">
              {" "}
              {currentUser}{" "}
            </Typography>
          </Stack>
          <Typography variant="h6" sx={{ overflowWrap: "break-word" }}>
            {roomName}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default RoomBox;
