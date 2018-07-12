import { Router } from "express";
import { body, oneOf, param, query } from "express-validator/check";
import { Room } from "../../../repositories/Room";
import { authenticateRequest, authorizeRequestWithAdminPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/",
    authenticateRequest,
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        Room
            .getInstance()
            .list(req.query.quarterID)
            .subscribe(
                (rooms) => res.status(200).send({ rooms }),
                errorHandler(res),
        );
    },
);

router.post(
    "/",
    authorizeRequestWithAdminPosition,
    body("roomName").isString(),
    body("quarterID").isInt(),
    body("maxSeat").isInt(),
    validateRequest,
    (req, res) => {
        Room
            .getInstance()
            .add(req.body.roomName, req.body.quarterID, req.body.maxSeat)
            .subscribe(completionHandler(res));
    },
);

router.delete(
    "/:roomID",
    authorizeRequestWithAdminPosition,
    param("roomID").isInt(),
    validateRequest,
    (req, res) => {
        Room
            .getInstance()
            .delete(req.params.roomID)
            .subscribe(completionHandler(res));
    },
);

router.patch(
    "/:roomID",
    authorizeRequestWithAdminPosition,
    param("roomID").isInt(),
    oneOf([
        body("roomName").isString(),
        body("maxSeat").isInt(),
        body("quarterID").isInt(),
    ]),
    validateRequest,
    (req, res) => {
        Room
            .getInstance()
            .edit(
                req.params.roomID, {
                    MaxSeat: req.body.maxSeat,
                    QuarterID: req.body.quarterID,
                    RoomName: req.body.roomName,
                },
        ).subscribe(completionHandler(res));
    },
);
