import { Router } from "express";
import { body, oneOf } from "express-validator/check";
import { Observable } from "rxjs";
import { IQuarterModel, QuarterType } from "../../../models/v1/quarter";
import { Quarter } from "../../../repositories/Quarter";
import { authenticateRequest, authenticateRequestWithAdminPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/add",
    authenticateRequestWithAdminPosition,
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
        if (req.body.summer === "true") {
            observable = Quarter.getInstance().defaultQuarter(QuarterType.summer);
        } else {
            observable = Quarter.getInstance().defaultQuarter();
        }
        observable.subscribe(
            (quarter) => res.status(200).send({ quarter }),
            errorHandler(res),
        );
    },
);

router.post(
    "/list",
    authenticateRequest,
    (_, res) => {
        Quarter.getInstance().list().subscribe(
            (quarters) => res.status(200).send({ quarters }),
            errorHandler(res),
        );
    },
);

router.post(
    "/delete",
    authenticateRequestWithAdminPosition,
    body("quarterID").isInt(),
    validateRequest,
    (req, res) => {
        Quarter.getInstance().delete(req.body.quarterID).subscribe(completionHandler(res));
    },
);

router.post(
    "/edit",
    authenticateRequestWithAdminPosition,
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
