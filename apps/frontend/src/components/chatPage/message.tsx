import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { IMessage } from "./types";
import theme from "@/config/theme";
interface IMessageProps {
  ownMessage: boolean;
  message: IMessage;
}
const Message = ({ ownMessage, message }: IMessageProps) => {
  return (
    <Grid
      container
      direction="column"
      alignContent={ownMessage ? "right" : "left"}
      rowSpacing={1}
    >
      {ownMessage ? (
        <></>
      ) : (
        <Grid item>
          <Typography variant="subtitle1">{message.displayName}</Typography>
        </Grid>
      )}
      <Grid
        item
        container
        direction={ownMessage ? "row-reverse" : "row"}
        spacing={1}
        alignItems="flex-end"
      >
        <Grid item zeroMinWidth maxWidth="60%">
          <Card
            sx={{
              backgroundColor: ownMessage
                ? theme.palette.primary["200"]
                : "#D9D9D9",
              height: "100%",
              borderRadius: 3,
              overflowWrap: "break-word",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
              >
                {message.message}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">{message.createdAt}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Message;
