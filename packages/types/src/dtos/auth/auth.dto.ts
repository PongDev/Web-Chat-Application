import { PickType } from "@nestjs/swagger";
import { JWTToken } from "../../jwt";

export class RenewAccessTokenResponse extends PickType(JWTToken, [
  "accessToken",
]) {}
