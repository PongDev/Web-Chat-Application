import apiClient from "@/config/axios";
import { useCallback } from "react";

const useCreateNavBar = () => {
  const updateUsername = useCallback(async (newName: string) => {
    try {
      await apiClient.put(`/users/me`, {
        name: newName,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getJoinedRooms = useCallback(async () => {
    try {
      const response = await apiClient.get(`/rooms/joined`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getCreatedRooms = useCallback(async () => {
    try {
      const response = await apiClient.get(`/rooms/group/created`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    updateUsername,
    getJoinedRooms,
    getCreatedRooms,
  };
};

export default useCreateNavBar;
