import apiClient from "@/config/axios";
import { useState } from "react";

const useCreateRoomDialog = () => {
  const [open, setOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [created, setCreated] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    setSubmitted(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSubmitted(false);
    setNewRoomName("");
  };

  const handleCreate = async (newRoomName: string) => {
    setSubmitted(false);
    if (newRoomName === "") {
      setSubmitted(true);
      return;
    }
    await apiClient.post("rooms", {
      body: {
        type: "GROUP",
        name: newRoomName,
      },
    });
    setOpen(false);
    setNewRoomName("");
    setCreated(!created);
  };

  return {
    open,
    newRoomName,
    submitted,
    created,
    handleClickOpen,
    handleClose,
    handleCreate,
    setNewRoomName,
  };
};

export default useCreateRoomDialog;
