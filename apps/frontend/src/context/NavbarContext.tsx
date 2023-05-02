import useCreateNavBar from "@/hooks/useCreateNavBar";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { JoinedRoomDetailsDto, JoinedRoomsDto } from "types";
import { useUser } from "./AuthContext";

export type UpdateRoomType = "created" | "joined" | "direct";

interface INavBarContextValue {
  createdRooms: JoinedRoomDetailsDto[];
  joinedRooms: JoinedRoomDetailsDto[];
  directMessages: JoinedRoomDetailsDto[];
  updateRoom: (type: UpdateRoomType, roomId: string, roomName: string) => void;
  name?: string;
}

const NavBarContext = createContext<INavBarContextValue>(
  {} as INavBarContextValue
);

const useNavBar = () => useContext(NavBarContext);

const NavBarProvider = ({ children }: PropsWithChildren) => {
  const [createdRooms, setCreatedRooms] = useState<JoinedRoomDetailsDto[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<JoinedRoomDetailsDto[]>([]);
  const [directMessages, setDirectMessages] = useState<JoinedRoomDetailsDto[]>(
    []
  );
  const { user } = useUser();
  const { getJoinedRooms, getCreatedRooms } = useCreateNavBar();

  const updateRoom = useCallback(
    (type: UpdateRoomType, roomId: string, roomName: string) => {
      const roomInfo: JoinedRoomDetailsDto = {
        id: roomId,
        name: roomName,
        isRequiredPassword: false,
      };
      switch (type) {
        case "created":
          setCreatedRooms((prev) => {
            if (prev.find((room) => room.id === roomId)) return prev;
            return [...prev, roomInfo];
          });
        case "joined":
          setJoinedRooms((prev) => {
            if (prev.find((room) => room.id === roomId)) return prev;
            return [...prev, roomInfo];
          });
          break;
        case "direct":
          setDirectMessages((prev) => {
            if (prev.find((room) => room.id === roomId)) return prev;
            return [...prev, roomInfo];
          });
          break;
        default:
          break;
      }
    },
    []
  ); //not implemented yet

  useEffect(() => {
    const fetchRooms = async () => {
      const joinedAndDM: JoinedRoomsDto = await getJoinedRooms();
      setCreatedRooms(joinedAndDM.createdGroupRoom);
      setJoinedRooms(joinedAndDM.groupRoom);
      setDirectMessages(joinedAndDM.directRoom);
    };
    if (user) {
      fetchRooms();
    }
  }, [getCreatedRooms, getJoinedRooms, user]);

  const value = useMemo(
    () => ({
      createdRooms,
      joinedRooms,
      directMessages,
      updateRoom,
      name: user?.name,
    }),
    [createdRooms, joinedRooms, directMessages, updateRoom, user?.name]
  );

  return (
    <NavBarContext.Provider value={value}>{children}</NavBarContext.Provider>
  );
};
export { NavBarProvider, useNavBar };
