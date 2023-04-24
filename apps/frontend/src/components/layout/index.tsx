import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => {
  return (
    <>
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        {props.children}
      </Box>
    </>
  );
};

export default Layout;
