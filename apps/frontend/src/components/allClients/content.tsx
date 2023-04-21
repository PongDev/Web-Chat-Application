import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
interface IClient {
  userId: string;
  displayName: string;
  profileImage?: string;
}
const clients: IClient[] = [
  { userId: "1", displayName: "aaaaaaaaaaa" },
  {
    userId: "2",
    displayName: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbcsdsds",
  },
  { userId: "3", displayName: "cccc" },
  { userId: "4", displayName: "d" },
  { userId: "5", displayName: "eeeeeeeeeeeeeeeeeeee" },
  { userId: "6", displayName: "ภาษาไทย" },
  { userId: "7", displayName: "9595959efsffs" },
];
const Content = () => {
  return (
    <Stack direction="column" spacing={1} padding={8}>
      {clients.map((client) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={"https://cdn.myanimelist.net/images/characters/6/496453.jpg"}
            sx={{ width: 52, height: 52 }}
          />
          <Typography variant="h5" component="span">
            {client.displayName}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
export default Content;
