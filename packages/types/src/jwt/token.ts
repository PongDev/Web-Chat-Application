export type JWTToken = {
  accessToken: string;
  refreshToken: string;
};

export interface GoogleTokenIDBody {
  token: string;
}
