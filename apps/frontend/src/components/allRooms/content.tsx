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
import useJoinRoomDialog from "@/hooks/useJoinRoomDialog";
import { RoomBriefDetailsDto } from "types";
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
    setPassword,
    handleClickOpen,
    handleClose,
    handleCreate,
    setNewRoomName,
  } = useCreateRoomDialog();

  const {
    open: openJoin,
    error: errorJoin,
    submitted: submittedJoin,
    handleClose: handleCloseJoin,
    setPassword: setPasswordJoin,
    handleOpen: handleOpenJoin,
    password: passwordJoin,
    handleSubmit: handleJoin,
  } = useJoinRoomDialog();

  const [cards, setCards] = useState<RoomBriefDetailsDto[]>([]);
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
              handleJoinRoom={handleOpenJoin}
              requiredPassword={room.isRequiredPassword}
            />
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={openJoin}
        onClose={handleCloseJoin}
        maxWidth="sm"
        fullWidth
        sx={{ backdropFilter: "blur(5px)" }}
        disableRestoreFocus
      >
        <DialogTitle variant="h5" align="center">
          Join Room
        </DialogTitle>
        <DialogContent sx={{ paddingY: 0 }}>
          <TextField
            autoFocus
            label="Password"
            margin="dense"
            fullWidth
            type="password"
            variant="filled"
            onChange={(v) => setPasswordJoin(v.target.value)}
            error={passwordJoin === "" && submittedJoin}
            helperText={
              passwordJoin === "" && submittedJoin
                ? "Please enter a password"
                : " "
            }
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingTop: 0 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 6, minWidth: 100 }}
            onClick={() => handleJoin()}
          >
            Join
          </Button>
        </DialogActions>
        <Typography
          variant="subtitle1"
          sx={{ textAlign: "center", paddingBottom: 2 }}
          color="error"
        >
          {errorJoin}
        </Typography>
      </Dialog>
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
            required
            variant="filled"
            onChange={(v) => setNewRoomName(v.target.value)}
            error={newRoomName === "" && submitted}
            helperText={
              newRoomName === "" && submitted ? "Please enter a room name" : ""
            }
          />
          <TextField
            label="Password"
            margin="dense"
            fullWidth
            type="password"
            variant="filled"
            onChange={(v) => setPassword(v.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingTop: "1rem" }}>
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
