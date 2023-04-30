import apiClient from "@/config/axios";
import { Avatar, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
interface IClient {
  id: string;
  name: string;
  profileImage?: string;
}
const Content = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const fetchClients = async () => {
    try {
      const response = await apiClient.get(`users`);
      setClients(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <Stack direction="column" spacing={1} padding={8}>
      <Typography variant="h4" component="span" paddingBottom={4}>
        {"Client List"}
      </Typography>
      {clients.map((client) => (
        <Stack direction="row" alignItems="center" spacing={2} key={client.id}>
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
