import { Router } from "express";
import { body, param, query } from "express-validator/check";
import { Room } from "../../../repositories/Room";
import { authenticateRequest, authenticateRequestWithAdminPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/",
    authenticateRequest,
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        Room.getInstance().list(req.query.quarterID).subscribe(
            (rooms) => res.status(200).send({ rooms }),
            errorHandler(res),
        );
    },
);

router.post(
    "/",
    authenticateRequestWithAdminPosition,
    body("roomName").isString(),
    body("quarterID").isInt(),
    body("maxSeat").isInt(),
    validateRequest,
    (req, res) => {
        Room.getInstance().add(
            req.body.roomName,
            req.body.quarterID,
            req.body.maxSeat,
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:roomID",
    authenticateRequestWithAdminPosition,
    param("roomID").isInt(),
    validateRequest,
    (req, res) => {
        Room.getInstance().delete(req.params.roomID).subscribe(completionHandler(res));
    },
);
