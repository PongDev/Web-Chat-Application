/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  modularizeImports: {
    "@mui/icons-material/?(((\\w*)?/?)*)": {
      transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
    },
  },
  webpack: (config) => {
    Object.assign(config.resolve.alias, {
      "@nestjs/swagger": "frontend-optimizer",
    });

    return config;
  },
};

module.exports = nextConfig;
