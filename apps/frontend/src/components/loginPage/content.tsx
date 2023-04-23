import { Box, Button, Typography } from "@mui/material";

function content() {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box textAlign={"center"}>
        <Typography variant="h3">{"Welcome to <Working Title>"}</Typography>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            fontSize: 36,
            height: 50,
            width: 500,
            color: "black",
            margin: 5,
            backgroundColor: "lightgray",
          }}
        >
          Login with Google
        </Button>
      </Box>
    </Box>
  );
}

export default content;
