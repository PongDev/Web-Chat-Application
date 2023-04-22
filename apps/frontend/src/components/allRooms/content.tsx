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
import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RoomBox from "./roomBox";
import useCreateRoomDialog from "@/hooks/useCreateRoomDialog";
interface IRoom {
  roomId: string;
  currentUser: number;
  roomName: string;
}
const cards: IRoom[] = [
  { roomId: "1", currentUser: 8, roomName: "aaaaaaaaaaa" },
  {
    roomId: "2",
    currentUser: 38,
    roomName: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbcsdsds",
  },
  { roomId: "3", currentUser: 2, roomName: "cccc" },
  { roomId: "4", currentUser: 6, roomName: "d" },
  { roomId: "5", currentUser: 7, roomName: "eeeeeeeeeeeeeeeeeeee" },
  { roomId: "6", currentUser: 1, roomName: "ภาษาไทย" },
  { roomId: "7", currentUser: 15, roomName: "9595959efsffs" },
];
const Content = () => {
  const {
    open,
    newRoomName,
    submitted,
    handleClickOpen,
    handleClose,
    handleCreate,
    setNewRoomName,
  } = useCreateRoomDialog();
  return (
    <Box padding={8}>
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
          <Grid item xs={12} sm={6} md={4} key={room.roomId}>
            <RoomBox
              roomName={room.roomName}
              currentUser={room.currentUser}
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
