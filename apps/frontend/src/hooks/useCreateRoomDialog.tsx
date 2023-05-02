import apiClient from "@/config/axios";
import { useNavBar } from "@/context/NavbarContext";
import { useState } from "react";
import { CreateRoomDto } from "types";

const useCreateRoomDialog = () => {
  const [open, setOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [created, setCreated] = useState(false);

  const { updateRoom } = useNavBar();
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
    const { data } = await apiClient.post<any, any, CreateRoomDto>("rooms", {
      body: {
        type: "GROUP",
        name: newRoomName,
        password: password || undefined,
      },
    });
    updateRoom("created", data.id, newRoomName);
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
    updateRoomNavbar: updateRoom,
    setPassword,
    password,
  };
};

export default useCreateRoomDialog;
