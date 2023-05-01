import React, { useState, useEffect } from "react";
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
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import theme from "@/config/theme";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "next/link";

import { NextRouter, useRouter } from "next/router";
import { JoinedRoomDetailsDto, JoinedRoomsDto } from "types";
import useCreateNavBar from "@/hooks/useCreateNavBar";

function ItemGroups(
  groupName: string,
  items: JoinedRoomDetailsDto[],
  router: NextRouter
) {
  // routes is an array of routes to navigate to from /chat
  const [open, setOpen] = useState(true);
  const toggleOpen = () => {
    setOpen(!open);
  };
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push(event.currentTarget.href);
  };
  return (
    <Box>
      <Button
        variant="text"
        onClick={toggleOpen}
        sx={{ textTransform: "none" }}
        disableRipple
      >
        {
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="subtitle1" color={"white"}>
              {groupName}
            </Typography>
            {open ? (
              <KeyboardArrowDownIcon sx={{ color: "white" }} />
            ) : (
              <KeyboardArrowRightIcon sx={{ color: "white" }} />
            )}
          </Box>
        }
      </Button>

      {/* </div> */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List>
          {items.map((item: JoinedRoomDetailsDto, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton href={"/chat/" + item.id} onClick={handleClick}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
}

function HelloHeader() {
  const [open, setOpen] = useState(false);
  const [workingName, setWorkingName] = useState("<Working Name>");
  const [text, setText] = useState("");
  const { updateUsername, getJoinedRooms, getCreatedRooms } = useCreateNavBar();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setWorkingName(text);
    updateUsername(text);
    setOpen(false);
  };
  return (
    <Box paddingX={1} paddingY={2}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5">Hello</Typography>
        <IconButton onClick={handleClickOpen}>
          <ModeEditIcon sx={{ color: theme.palette.primary[500] }} />
        </IconButton>
      </Box>
      <Typography variant="h5" color={theme.palette.primary[800]}>
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

const NAVIGATION_CONTENT = [
  {
    label: "All Rooms",
    icon: <PublicIcon />,
    path: "/",
  },
  {
    label: "All Clients",
    icon: <PersonIcon />,
    path: "/clients",
  },
];

function DrawerContent() {
  const { updateUsername, getJoinedRooms, getCreatedRooms } = useCreateNavBar();
  const router = useRouter();
  const [createdRooms, setCreatedRooms] = useState<JoinedRoomDetailsDto[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<JoinedRoomDetailsDto[]>([]);
  const [directMessages, setDirectMessages] = useState<JoinedRoomDetailsDto[]>(
    []
  );

  useEffect(() => {
    const fetchRooms = async () => {
      const newCreatedRooms: JoinedRoomDetailsDto[] = await getCreatedRooms();
      const joinedAndDM: JoinedRoomsDto = await getJoinedRooms();
      setCreatedRooms(newCreatedRooms);
      setJoinedRooms(joinedAndDM.groupRoom);
      setDirectMessages(joinedAndDM.directRoom);
    };
    fetchRooms();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push(event.currentTarget.href);
  };
  return (
    <Box paddingLeft={2}>
      <HelloHeader />
      <List>
        {NAVIGATION_CONTENT.map((text) => (
          <Link
            href={text.path}
            passHref
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem key={text.label} color="black" disablePadding>
              <ListItemButton>
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      {ItemGroups("Created", createdRooms, router)}
      {ItemGroups("Joined", joinedRooms, router)}
      {ItemGroups("Direct Message", directMessages, router)}
    </Box>
  );
}

export default DrawerContent;
