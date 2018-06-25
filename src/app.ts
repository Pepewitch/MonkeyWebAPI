import { json } from "body-parser";
import dotenv from "dotenv";
import express, { urlencoded } from "express";
import expressValidator from "express-validator";
import morgan from "morgan";
import logger from "./util/logger";

dotenv.config({ path: ".env" });

const app = express();

// Set running port form environment
app.set("port", process.env.PORT || 3000);

// Decode middleware body from client
app.use(json());
app.use(urlencoded({ extended: true }));

// Middleware used to validate request
app.use(expressValidator());

// Logger for express
app.use(morgan("dev", {
    stream: {
        write(text: string) {
            logger.info(text);
        },
    },
}));

export default app;
