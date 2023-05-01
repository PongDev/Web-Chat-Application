import apiClient from "@/config/axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RoomInfoDto } from "types";

const useRoomInfo = () => {
  const router = useRouter();
  const [roomInfo, setRoomInfo] = useState<RoomInfoDto | null>(null);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await apiClient.get(`rooms/info/${router.query.id}`);
        setRoomInfo(response.data);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };
    if (router.isReady) fetchRoomInfo();
  }, [router]);

  return { roomInfo };
};

export default useRoomInfo;
