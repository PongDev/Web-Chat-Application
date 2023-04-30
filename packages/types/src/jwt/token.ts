import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class JWTToken {
  accessToken: string;
  refreshToken: string;
}

export class GoogleTokenIDBody {
  @ApiProperty({
    description: "Google Token ID",
    type: () => String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
