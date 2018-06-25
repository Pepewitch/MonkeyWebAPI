import { Router } from "express";
import { router as v1 } from "./v1/index";

export const router = Router();

router.use("/v1", v1);

router.get("/ping", (req, res) => {
    res.json({
        msg: "pong",
    });
});
