import apiClient from "@/config/axios";
import { useNavBar } from "@/context/NavbarContext";
import { useRouter } from "next/router";
import { useState } from "react";
import { JoinRoonRequestDTO, JoinedRoomDetailsDto } from "types";

const useJoinRoomDialog = () => {
  const [open, setOpen] = useState(false);
  const [roomInfo, setRoomInfo] = useState<JoinedRoomDetailsDto | null>();
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { updateRoom } = useNavBar();
  const router = useRouter();

  const handleOpen = async (room: JoinedRoomDetailsDto) => {
    if (!room.isRequiredPassword) {
      await apiClient.post(`rooms/group/join/${room.id}`);
      updateRoom("joined", room.id, room.name);
      router.push(`chat/${room.id}`);
      return;
    }
    setOpen(true);
    setRoomInfo(room);
  };

  const handleClose = () => {
    setOpen(false);
    setPassword("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!roomInfo) return;

    setSubmitted(false);
    setError("");
    if (password === "") {
      setSubmitted(true);
      return;
    }

    try {
      await apiClient.post<any, any, JoinRoonRequestDTO>(
        `rooms/group/join/${roomInfo?.id}`,
        {
          password,
        }
      );
      updateRoom("joined", roomInfo.id, roomInfo.name);
      router.push(`chat/${roomInfo.id}`);
    } catch (err) {
      setError("Wrong password");
      console.log(err);
    }
  };

  return {
    open,
    roomInfo,
    password,
    error,
    submitted,
    setPassword,
    handleOpen,
    handleClose,
    handleSubmit,
  };
};

export default useJoinRoomDialog;
