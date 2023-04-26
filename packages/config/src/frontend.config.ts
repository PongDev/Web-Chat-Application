/* eslint turbo/no-undeclared-env-vars: 0 */

export type FrontendConfig = {
  backendURL: string;
};

export const loadFrontendConfig = (): FrontendConfig => ({
  backendURL: process.env.BACKEND_URL ?? "",
});
