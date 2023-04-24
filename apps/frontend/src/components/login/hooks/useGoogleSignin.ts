import { useRouter } from "next/router";
import { useEffect } from "react";

const useGoogleSignin = () => {
  const history = useRouter();

  const handleSignin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    const el = document
      .getElementById("google_signin")
      ?.querySelectorAll('[role="button"]')[0] as HTMLElement;
    if (el) {
      el.click();
    }
  };

  useEffect(() => {
    const handleCallback = async (
      response: google.accounts.id.CredentialResponse
    ) => {
      console.log(response.credential);
    };

    const initGoogleButton = async () => {
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
    };
    initGoogleButton();
  }, [history]);

  return { handleSignin };
};

export default useGoogleSignin;
