import apiClient from "@/config/axios";
import { useNavBar } from "@/context/NavbarContext";
import { Avatar, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CreateRoomResultDto, RoomType, UserDto } from "types";

const Content = () => {
  const router = useRouter();
  const [clients, setClients] = useState<UserDto[]>([]);
  const { updateRoom } = useNavBar();

  const fetchClients = async () => {
    try {
      const response = await apiClient.get(`users`);
      setClients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickUser = async (id: string, name: string) => {
    try {
      const response = await apiClient.post<CreateRoomResultDto>(`rooms`, {
        body: {
          type: RoomType.DIRECT,
          userId: id,
        },
      });
      updateRoom("direct", response.data.id, name);
      router.push(`/chat/${response.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <Stack direction="column" spacing={2} padding={8}>
      <Typography variant="h4" component="span">
        {"Client List"}
      </Typography>
      {clients.map((client) => (
        <Stack
          onClick={() => handleClickUser(client.id, client.name)}
          sx={{ cursor: "pointer" }}
          direction="row"
          alignItems="center"
          spacing={2}
          key={client.id}
        >
          <Avatar
            imgProps={{ referrerPolicy: "no-referrer" }}
            src={client.profileImage}
            alt={client.name}
            sx={{ width: 52, height: 52 }}
          />
          <Typography variant="h5" component="span">
            {client.name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
export default Content;
