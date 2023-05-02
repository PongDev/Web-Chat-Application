import ChatWindow from "@/components/chatPage/chatWindow";
import withAuthGuard from "@/guards/withAuthGuard";
import React from "react";

const ChatPage = () => {
  return <ChatWindow />;
};
export default withAuthGuard(ChatPage);
