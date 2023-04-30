import { Box } from "@mui/material";
import { PropsWithChildren } from "react";
import { NavBar } from "../navigationBar/navigationbar";
import { useRouter } from "next/router";

const Layout = (props: PropsWithChildren) => {
  const router = useRouter();
  return (
    <>
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        {router.pathname == "/login" ? (
          props.children
        ) : (
          <Box sx={{ display: "flex" }}>
            <NavBar />
            {props.children}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Layout;
