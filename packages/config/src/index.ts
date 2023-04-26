import * as dotenv from "dotenv";
import { FrontendConfig, loadFrontendConfig } from "./frontend.config";
import { BackendConfig, loadBackendConfig } from "./backend.config";

dotenv.config();

export const frontendConfig: FrontendConfig = loadFrontendConfig();
export const backendConfig: BackendConfig = loadBackendConfig();
