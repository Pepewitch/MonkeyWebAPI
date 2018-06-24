import dotenv from "dotenv";
import express from "express";

dotenv.config({path: ".env"});

const app = express();

app.set("port", process.env.PORT || 3000);

export default app;
