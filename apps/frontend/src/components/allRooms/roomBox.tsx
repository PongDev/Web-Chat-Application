import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import theme from "@/config/theme";
interface IRoomBoxProps {
  currentUser: number;
  roomName: string;
}
const RoomBox = ({ currentUser, roomName }: IRoomBoxProps) => {
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.secondary["200"],
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack direction="column" spacing={2} justifyContent="center">
          <Stack direction="row" justifyContent="right" alignItems="center">
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
