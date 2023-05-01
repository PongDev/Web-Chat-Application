import apiClient from "@/config/axios";
import { JoinedRoomsDto } from "types";

const useCreateNavBar = () => {
  const updateUsername = async (newName: string) => {
    try {
      await apiClient.put(`/users/me`, {
        username: newName,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getJoinedRooms = async () => {
    try {
      const response = await apiClient.get(`/rooms/joined`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const getCreatedRooms = async () => {
    try {
      const response = await apiClient.get(`/rooms/group/created`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  return {
    updateUsername,
    getJoinedRooms,
    getCreatedRooms,
  };
};

export default useCreateNavBar;
