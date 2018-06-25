import { createLogger, format, transports } from "winston";

const logger = createLogger({
    transports: [
        new (transports.Console)({
            format: format.simple(),
            level: process.env.NODE_ENV === "production" ? "error" : "debug",
        }),
        new (transports.File)({ filename: "log/debug.log", level: "debug" }),
        new (transports.File)({ filename: "log/error.log", level: "error" }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;
