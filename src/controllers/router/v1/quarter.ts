import { Router } from "express";
import { body, oneOf } from "express-validator/check";
import { Observable } from "rxjs";
import { IQuarterModel, QuarterType } from "../../../models/v1/quarter";
import { UserPosition } from "../../../models/v1/users";
import { Quarter } from "../../../repositories/Quarter";
import { authenticateRequest, authenticateRequestWithPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/add",
    authenticateRequestWithPosition(UserPosition.admin, UserPosition.dev, UserPosition.mel),
    body("quarterID").isInt(),
    body("quarterName").isString(),
    body("quarterType").isIn(Object.keys(QuarterType)),
    body("startDate").isISO8601(),
    body("endDate").isISO8601(),
    validateRequest,
    (req, res) => {
        Quarter.getInstance().add(
            req.body.quarterID,
            req.body.quarterName,
            req.body.quarterType,
            req.body.startDate,
            req.body.endDate,
        ).subscribe(completionHandler(res));
    },
);

router.post(
    "/default",
    authenticateRequest,
    body("summer").isBoolean().optional(),
    validateRequest,
    (req, res) => {
        let observable: Observable<IQuarterModel | null>;
        if (req.body.summer === true) {
            observable = Quarter.getInstance().defaultQuarter(QuarterType.summer);
        } else {
            observable = Quarter.getInstance().defaultQuarter();
        }
        observable.subscribe(
            (quarter) => res.status(200).send({ quarter }),
            (error) => res.status(500).send({ error }),
        );
    },
);

router.post(
    "/list",
    authenticateRequest,
    (_, res) => {
        Quarter.getInstance().list().subscribe(
            (quarters) => res.status(200).send({ quarters }),
            (error) => res.status(500).send({ error }),
        );
    },
);

router.post(
    "/delete",
    authenticateRequestWithPosition(UserPosition.admin, UserPosition.dev, UserPosition.mel),
    body("quarterID").isInt(),
    validateRequest,
    (req, res) => {
        Quarter.getInstance().delete(req.body.quarterID).subscribe(completionHandler(res));
    },
);

router.post(
    "/edit",
    authenticateRequestWithPosition(UserPosition.admin, UserPosition.dev, UserPosition.mel),
    body("quarterID").isInt(),
    oneOf([
        body("quarterName").isString(),
        body("startDate").isISO8601(),
        body("endDate").isISO8601(),
    ]),
    validateRequest,
    (req, res) => {
        Quarter.getInstance().edit(
            req.body.quarterID,
            {
                EndDate: req.body.endDate,
                QuarterName: req.body.quarterName,
                StartDate: req.body.startDate,
            },
        ).subscribe(completionHandler(res));
    },
);
