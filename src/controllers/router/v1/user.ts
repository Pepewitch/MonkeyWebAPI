import { Router } from "express";
import { body } from "express-validator/check";
import { UserPosition } from "../../../models/v1/users";
import { User } from "../../../repositories/Users";
import { authenticateRequest, authenticateRequestWithPosition, validateRequest } from "../util/requestValidator";

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

router.post(
    "/addStudent",
    authenticateRequestWithPosition(UserPosition.admin, UserPosition.dev, UserPosition.mel),
    (req, res) => {
        console.log("object");
    },
);
