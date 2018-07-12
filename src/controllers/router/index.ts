import { Router } from "express";
import { body } from "express-validator/check";
import { User } from "../../repositories/Users";
import { JWTAuth } from "../auth/JWTAuth";
import { authenticateRequest, errorHandler, validateRequest } from "./util/requestValidator";
import { router as v1 } from "./v1";

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
    (_, res) => {
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
        User.getInstance().login(req.body.userID, req.body.password).subscribe(
            (verify) => {
                if (verify) {
                    res.status(200).send(JWTAuth.getAllToken(req.body.userID));
                } else {
                    res.status(401).send({
                        error: "Wrong username or password",
                    });
                }
            },
            errorHandler(res),
        );
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
