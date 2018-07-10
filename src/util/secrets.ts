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
export const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env.SESSION_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET;
export const AES_SECRET = process.env.AES_SECRET;
export const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
export const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_SERVER = process.env.DB_SERVER;
export const DB_NAME = process.env.DB_NAME;
// DB_USERNAME='non'
// DB_PASSWORD='Non29301'
// DB_SERVER='35.198.245.101'
// DB_NAME='monkeyDB'

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!JWT_SECRET) {
    logger.error("No json web token secret. Set JWT_SECRET environment variable.");
    process.exit(1);
}

if (!AES_SECRET) {
    logger.error("No aes secret. Set AES_SECRET environment variable.");
    process.exit(1);
}

if (!GOOGLE_APPLICATION_CREDENTIALS) {
    logger.error("No google application credentials. Set GOOGLE_APPLICATION_CREDENTIALS environment variable.");
    process.exit(1);
}

if (!GOOGLE_CLOUD_PROJECT_ID) {
    logger.error("No google cloud project id. Set GOOGLE_CLOUD_PROJECT_ID environment variable.");
    process.exit(1);
}

if (!DB_USERNAME) {
    logger.error("No db username. Set DB_USERNAME environment variable.");
    process.exit(1);
}

if (!DB_PASSWORD) {
    logger.error("No db password. Set DB_PASSWORD environment variable.");
    process.exit(1);
}

if (!DB_SERVER) {
    logger.error("No db server. Set DB_SERVER environment variable.");
    process.exit(1);
}

if (!DB_NAME) {
    logger.error("No db name. Set DB_NAME environment variable.");
    process.exit(1);
}
