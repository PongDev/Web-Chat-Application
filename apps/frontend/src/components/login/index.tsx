import { Box, Button, Typography, useTheme } from "@mui/material";
import useGoogleSignin from "./hooks/useGoogleSignin";

const Login = () => {
  const theme = useTheme();
  const { handleSignin } = useGoogleSignin();

  return (
    <>
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor={theme.palette.primary[100]}
      >
        <div id="google_signin" style={{ width: "100%", display: "none" }} />
        <Box
          bgcolor={theme.palette.common.white}
          borderRadius="12px"
          padding="24px"
          maxWidth="500px"
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="16px"
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          borderColor="black"
        >
          <Typography variant="h4">Welcome to Chat Application</Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSignin}
            sx={{
              width: "100%",
              maxWidth: "250px",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            Login with google
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Login;
