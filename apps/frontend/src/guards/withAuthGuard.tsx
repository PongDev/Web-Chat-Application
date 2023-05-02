import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/router";

const withAuthGuard = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { user, loading } = useUser();
    const router = useRouter();

    if (loading) {
      return null;
    }

    if (!user) {
      router.replace("/login");
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuthGuard;
