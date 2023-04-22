import { useState } from "react";

const useCreateRoomDialog = () => {
  const [open, setOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setSubmitted(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSubmitted(false);
    setNewRoomName("");
  };

  const handleCreate = (newRoomName: string) => {
    setSubmitted(false);
    if (newRoomName === "") {
      setSubmitted(true);
      return;
    }
    setOpen(false);
    console.log(newRoomName);
    setNewRoomName("");
  };

  return {
    open,
    newRoomName,
    submitted,
    handleClickOpen,
    handleClose,
    handleCreate,
    setNewRoomName,
  };
};

export default useCreateRoomDialog;
