import * as React from "react";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

function ItemGroups(groupName: String, items: String[]) {
  return (
    <Box>
      <Typography variant="subtitle1" color={"gray"}>
        {groupName}
      </Typography>
      <List>
        {items.map((text: String, index) => (
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function HelloHeader() {
  const [open, setOpen] = React.useState(false);
  const [workingName, setWorkingName] = React.useState("<Working Name>");
  const [text, setText] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setWorkingName(text);
    setOpen(false);
  };
  return (
    <Box paddingX={1} paddingY={2}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5">Hello</Typography>
        <IconButton onClick={handleClickOpen}>
          <ModeEditIcon />
        </IconButton>
      </Box>
      <Typography variant="h5" color={"primary"}>
        {workingName}
      </Typography>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{ backdropFilter: "blur(5px)" }}
        disableRestoreFocus
      >
        <DialogTitle variant="h5" align="center">
          Edit Username
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Username"
            fullWidth
            variant="filled"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingTop: 0 }}>
          <Button
            variant="contained"
            sx={{ borderRadius: 6, minWidth: 100 }}
            onClick={handleSave}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function DrawerContent() {
  return (
    <Box paddingLeft={2}>
      <HelloHeader />
      <List>
        {["All Rooms", "All Clients"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PublicIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {ItemGroups("Created", ["Group 1", "Group 2", "Group 3"])}
      {ItemGroups("Joined", ["Group 1", "Group 2", "Group 3"])}
      {ItemGroups("Direct Message", ["Group 1", "Group 2", "Group 3"])}
    </Box>
  );
}

export default DrawerContent;
