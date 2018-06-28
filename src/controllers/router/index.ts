import { Router } from "express";
import { body } from "express-validator/check";
import { JWTAuth } from "../auth/JWTAuth";
import { authenticateRequest, validateRequest } from "./util/requestValidator";
import { router as v1 } from "./v1/index";

export const router = Router();

router.use("/v1", v1);

router.get(
    "/ping",
    (_, res) => {
        res.json({
            msg: "pong",
        });
    },
);

router.get(
    "/authPing",
    authenticateRequest,
    (req, res) => {
        res.json({
            msg: "pong",
        });
    },
);

router.post(
    "/token",
    body("userID").isInt(),
    body("password").isString(),
    validateRequest,
    (req, res) => {
        res.status(200).send(JWTAuth.getAllToken(req.body.userID));
    },
);

router.post(
    "/refreshToken",
    body("token").isString(),
    validateRequest,
    (req, res) => {
        try {
            const userID = JWTAuth.decodeToken(req.body.token);
            res.status(200).send(JWTAuth.getToken(userID));
        } catch (_) {
            res.sendStatus(401);
        }
    },
);
