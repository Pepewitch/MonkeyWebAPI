import { Router } from "express";
import { body } from "express-validator/check";
import { JWTAuth } from "../auth/JWTAuth";
import { validateRequest } from "./util/requestValidator";
import { router as v1 } from "./v1/index";

export const router = Router();

router.use("/v1", v1);

router.get("/ping", (_, res) => {
    res.json({
        msg: "pong",
    });
});

router.post(
    "/token",
    body("userID").isInt(),
    body("password").isString(),
    validateRequest,
    (req, res) => {
        res.status(200).send(JWTAuth.getToken(req.body.userID));
    },
);

router.post(
    "/decode",
    body("token").isString(),
    validateRequest,
    (req, res) => {
        const result = JWTAuth.decodeToken(req.body.token);
        console.log(result);
        res.sendStatus(200);
    },
);
