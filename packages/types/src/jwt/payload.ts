import { JwtPayload } from "jsonwebtoken";

export type JWTPayload = JwtPayload & {
  userID: string;
  name: string;
  profileImage: string;
};
