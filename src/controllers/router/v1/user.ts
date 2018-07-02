import { Router } from "express";
import { body } from "express-validator/check";
import { User } from "../../../repositories/Users";
import { authenticateRequest, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/position",
    authenticateRequest,
    body("userID").isInt(),
    validateRequest,
    (req, res) => {
        User.getInstance().getPosition(req.body.userID).subscribe(
            (position) => res.status(200).send({ position }),
            (error) => res.status(500).send({ error }),
        );
    },
);
