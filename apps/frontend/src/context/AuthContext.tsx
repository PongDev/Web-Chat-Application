import apiClient from "@/config/axios";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserDto } from "types";

interface IAuthContextValue {
  user: UserDto | null;
  loading: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextValue>({} as IAuthContextValue);
const useUser = () => useContext(AuthContext);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await apiClient.get<UserDto>("/users/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    await refetch();
  }, [refetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
      refetch,
    }),
    [user, loading, logout, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useUser };
