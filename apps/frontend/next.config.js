const fs = require("fs");
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  modularizeImports: {
    "@mui/icons-material/?(((\\w*)?/?)*)": {
      transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
    },
  },
  webpack: (config) => {
    config.resolve.alias = Object.assign(config.resolve.alias, {
      "@nestjs/swagger": require.resolve("frontend-optimizer"),
    });

    return config;
  },
};

module.exports = nextConfig;
