import { JwtPayload } from "jsonwebtoken";

export type JWTPayload = JwtPayload & {
  id: string;
};
