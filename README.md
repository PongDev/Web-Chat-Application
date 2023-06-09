# Turbo NestJS NextJS Starter Pack

## Project initialization with

- NestJS
- NextJS
- Prisma

## Requirement

- [NodeJS](https://nodejs.org/en/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [pnpm](https://pnpm.io/installation) (Or install by `npm install -g pnpm`)

## Get Started

### Setup Environment

- Copy `.env.template` to `.env` and set environment variables (Both in root and frontend)

### Install dependencies

- `pnpm install`

### Generate Prisma Client

- `pnpm db:generate`

### Run Development

- To run database `docker compose up`
- To run all apps `pnpm run dev`
- To run only frontend app `pnpm run dev:frontend`
- To run only backend app `pnpm run dev:backend`

### Production Build

- `pnpm run build`
