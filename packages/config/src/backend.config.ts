/* eslint turbo/no-undeclared-env-vars: 0 */

export type BackendConfig = {
  port: number;
  //   bcrypt: {
  //     salt: number;
  //   };
  jwt: {
    accessToken: {
      secret: string;
      expire: number;
    };
    refreshToken: {
      secret: string;
      expire: number;
    };
  };
  google: {
    clientId: string;
    clientSecret: string;
  };
  swagger: {
    enable: boolean;
    prefixPath: string;
  };
  socketBaseUrl: string;
  socketHealthCheckInterval: number;
  socketHealthCheckChannelName: string;
  //   graphql: {
  //     debug: boolean;
  //     playground: boolean;
  //   };
  bcrypt: {
    salt_rounds: number;
  };
};

export const loadBackendConfig = (): BackendConfig => ({
  port: parseInt(process.env.BACKEND_PORT ?? "", 10) || 3000,
  jwt: {
    accessToken: {
      secret: process.env.BACKEND_JWT_ACCESS_TOKEN_SECRET ?? "",
      expire:
        parseInt(process.env.BACKEND_JWT_ACCESS_TOKEN_EXPIRE ?? "", 10) || 900,
    },
    refreshToken: {
      secret: process.env.BACKEND_JWT_REFRESH_TOKEN_SECRET ?? "",
      expire:
        parseInt(process.env.BACKEND_JWT_REFRESH_TOKEN_EXPIRE ?? "", 10) ||
        604800,
    },
  },
  google: {
    clientId: process.env.BACKEND_GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.BACKEND_GOOGLE_CLIENT_SECRET ?? "",
  },
  swagger: {
    enable: process.env.BACKEND_SWAGGER_ENABLE === "true",
    prefixPath: process.env.BACKEND_SWAGGER_PREFIX_PATH ?? "api",
  },
  socketBaseUrl: process.env.SOCKET_BASE_URL ?? "",
  socketHealthCheckInterval:
    parseInt(process.env.SOCKET_HEALTH_CHECK_INTERVAL ?? "", 10) || 5000,
  socketHealthCheckChannelName:
    process.env.SOCKET_HEALTH_CHECK_CHANNEL_NAME ?? "health-check",
  bcrypt: {
    salt_rounds:
      parseInt(process.env.BACKEND_BCRYPT_SALT_ROUNDS ?? "", 10) || 10,
  },
});
