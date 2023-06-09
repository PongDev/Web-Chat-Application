import apiClient from "@/config/axios";
import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { JWTToken } from "types";

const useGoogleSignin = () => {
  const router = useRouter();
  const { refetch, user, loading } = useUser();

  const handleSignin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    const el = document
      .getElementById("google_signin")
      ?.querySelectorAll('[role="button"]')[0] as HTMLElement;
    if (el) {
      el.click();
    }
  };

  const handleCallback = useCallback(
    async (response: google.accounts.id.CredentialResponse) => {
      const res = await apiClient.post<JWTToken>("/auth/token/google", {
        token: response.credential,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      await refetch();
      router.push("/");
    },
    [refetch, router]
  );

  const initGoogleButton = useCallback(async () => {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      callback: handleCallback,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google_signin")!,
      {
        theme: "outline",
        size: "large",
        shape: "pill",
        logo_alignment: "left",
        type: "icon",
      }
    );
    document
      .getElementById("google_signin")
      ?.getElementsByTagName("iframe")[0]
      .remove();
  }, [handleCallback]);

  useEffect(() => {
    if (router.isReady) {
      if (user && !loading) {
        router.push("/");
        return;
      }
      initGoogleButton();
    }
  }, [initGoogleButton, loading, router, user]);

  return { handleSignin };
};

export default useGoogleSignin;
