import * as React from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Key } from "@mui/icons-material";

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

function DrawerContent() {
  return (
    <Box paddingLeft={2}>
      <Box paddingX={1} paddingY={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5">Hello</Typography>
          <IconButton>
            <ModeEditIcon />
          </IconButton>
        </Box>
        <Typography variant="h5" color={"darkorchid"}>
          {"<Working Name>"}
        </Typography>
      </Box>
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
