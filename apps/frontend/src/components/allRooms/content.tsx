import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RoomBox from "./roomBox";
import useCreateRoomDialog from "@/hooks/useCreateRoomDialog";
import apiClient from "@/config/axios";
interface IRoom {
  id: string;
  userCount: number;
  name: string;
  owner: string;
}
const Content = () => {
  const {
    open,
    newRoomName,
    submitted,
    created,
    handleClickOpen,
    handleClose,
    handleCreate,
    setNewRoomName,
  } = useCreateRoomDialog();
  const [cards, setCards] = useState<IRoom[]>([]);
  const fetchRooms = async () => {
    try {
      const response = await apiClient.get(`rooms`);
      setCards(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [created]);

  return (
    <Box paddingX={6} paddingY={2}>
      <Box sx={{ display: "flex" }} alignItems={"center"} paddingY={4}>
        <Typography variant="h4" component="span">
          {"All rooms"}
        </Typography>
        <IconButton
          aria-label="add new room"
          size="large"
          onClick={handleClickOpen}
        >
          <AddCircleOutlineIcon fontSize="large" />
        </IconButton>
      </Box>
      <Grid
        container
        columnSpacing={8}
        rowSpacing={4}
        sx={{ alignItems: "stretch" }}
      >
        {cards.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <RoomBox
              owner={room.owner}
              roomName={room.name}
              currentUser={room.userCount}
              id={room.id}
            ></RoomBox>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{ backdropFilter: "blur(5px)" }}
        disableRestoreFocus
      >
        <DialogTitle variant="h5" align="center">
          Create New Room
        </DialogTitle>
        <DialogContent sx={{ paddingY: 0 }}>
          <TextField
            autoFocus
            label="Room name"
            margin="dense"
            fullWidth
            variant="filled"
            onChange={(v) => setNewRoomName(v.target.value)}
            error={newRoomName === "" && submitted}
            helperText={
              newRoomName === "" && submitted ? "Please enter a room name" : " "
            }
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingTop: 0 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 6, minWidth: 100 }}
            onClick={() => handleCreate(newRoomName)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Content;
