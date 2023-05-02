import React from "react";
import Content from "@/components/allRooms/content";
import withAuthGuard from "@/guards/withAuthGuard";
const AllRooms = () => {
  return <Content />;
};
export default withAuthGuard(AllRooms);
