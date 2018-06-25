import dotenv from "dotenv";
import { existsSync } from "fs";
import logger from "./logger";

if (!existsSync(".env")) {
    logger.warn(".env file not found. Create one using .env.example");
}

dotenv.config();

if (!process.env.NODE_ENV) {
    logger.info("Node environment not found use \"dev\" environment as default");
}

export const ENVIRONMENT = process.env.NODE_ENV || "dev";
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}
