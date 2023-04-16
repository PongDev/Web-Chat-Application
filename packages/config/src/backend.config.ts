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
  swagger: {
    enable: boolean;
    prefixPath: string;
  };
  //   graphql: {
  //     debug: boolean;
  //     playground: boolean;
  //   };
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
  swagger: {
    enable: process.env.BACKEND_SWAGGER_ENABLE === "true",
    prefixPath: process.env.BACKEND_SWAGGER_PREFIX_PATH ?? "api",
  },
});
