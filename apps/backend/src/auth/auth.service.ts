import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { backendConfig } from 'config';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTPayload, JWTToken } from 'types';

@Injectable()
export class AuthService {
  private readonly jwtAccessTokenOptions = {
    secret: backendConfig.jwt.accessToken.secret,
    expiresIn: backendConfig.jwt.accessToken.expire,
  };
  private readonly jwtRefreshTokenOptions = {
    secret: backendConfig.jwt.refreshToken.secret,
    expiresIn: backendConfig.jwt.refreshToken.expire,
  };
  private OAuthClient = new OAuth2Client(
    backendConfig.google.clientId,
    backendConfig.google.clientSecret,
  );

  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  signAccessToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, this.jwtAccessTokenOptions);
  }

  async signAccessTokenAsync(payload: JWTPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, this.jwtAccessTokenOptions);
  }

  signRefreshToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, this.jwtRefreshTokenOptions);
  }

  async signRefreshTokenAsync(payload: JWTPayload): Promise<string> {
    return await this.jwtService.signAsync(
      payload,
      this.jwtRefreshTokenOptions,
    );
  }

  async generateToken(jwtPayload: JWTPayload): Promise<JWTToken> {
    const accessToken = this.signAccessTokenAsync(jwtPayload);
    const refreshToken = this.signRefreshTokenAsync(jwtPayload);

    return {
      accessToken: await accessToken,
      refreshToken: await refreshToken,
    };
  }

  async renewAccessToken(
    user: JWTPayload,
  ): Promise<Pick<JWTToken, 'accessToken'>> {
    const { userID, name, picture } = user;

    const jwtPayload: JWTPayload = {
      userID,
      name,
      picture,
    };

    const jwtToken = await this.signAccessTokenAsync(jwtPayload);

    return {
      accessToken: jwtToken,
    };
  }

  async googleLogin(token: string) {
    const res = await this.OAuthClient.verifyIdToken({
      idToken: token,
    });

    const payload = res.getPayload();
    const googleId = res.getUserId();
    const { email, picture, name } = payload;

    const { id } = await this.prismaService.user.upsert({
      where: { gid: googleId },
      create: {
        gid: googleId,
        email,
        profileImage: picture,
        name,
      },
      update: {},
    });

    const jwtPayload: JWTPayload = {
      userID: `${id}`,
      name,
      picture,
    };

    const jwtToken = await this.generateToken(jwtPayload);

    return jwtToken;
  }
}
