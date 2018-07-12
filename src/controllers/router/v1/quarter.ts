import { Router } from "express";
import { body, oneOf, param, query } from "express-validator/check";
import { Observable } from "rxjs";
import { IQuarterModel, QuarterType } from "../../../models/v1/quarter";
import { Quarter } from "../../../repositories/Quarter";
import { authenticateRequest, authorizeRequestWithAdminPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/default",
    authenticateRequest,
    query("summer").isBoolean().optional(),
    validateRequest,
    (req, res) => {
        let observable: Observable<IQuarterModel | null>;
        if (req.query.summer === "true") {
            observable = Quarter.getInstance().defaultQuarter(QuarterType.summer);
        } else {
            observable = Quarter.getInstance().defaultQuarter();
        }
        observable
            .subscribe(
                (quarter) => res.status(200).send({ quarter }),
                errorHandler(res),
        );
    },
);

router.get(
    "/",
    authenticateRequest,
    query("type").isIn(Object.keys(QuarterType)).optional(),
    validateRequest,
    (req, res) => {
        Quarter
            .getInstance()
            .list(req.query.type)
            .subscribe(
                (quarters) => res.status(200).send({ quarters }),
                errorHandler(res),
        );
    },
);

router.post(
    "/",
    authorizeRequestWithAdminPosition,
    body("quarterID").isInt(),
    body("quarterName").isString(),
    body("quarterType").isIn(Object.keys(QuarterType)),
    body("startDate").isISO8601(),
    body("endDate").isISO8601(),
    validateRequest,
    (req, res) => {
        Quarter
            .getInstance()
            .add(
                req.body.quarterID,
                req.body.quarterName,
                req.body.quarterType,
                req.body.startDate,
                req.body.endDate,
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:quarterID",
    authorizeRequestWithAdminPosition,
    param("quarterID").isInt(),
    validateRequest,
    (req, res) => {
        Quarter
            .getInstance()
            .delete(req.params.quarterID)
            .subscribe(completionHandler(res));
    },
);

router.patch(
    "/:quarterID",
    authorizeRequestWithAdminPosition,
    param("quarterID").isInt(),
    oneOf([
        body("quarterName").isString(),
        body("quarterType").isIn(Object.keys(QuarterType)),
        body("startDate").isISO8601(),
        body("endDate").isISO8601(),
    ]),
    validateRequest,
    (req, res) => {
        Quarter
            .getInstance()
            .edit(
                req.params.quarterID,
                {
                    EndDate: req.body.endDate,
                    QuarterName: req.body.quarterName,
                    QuarterType: req.body.quarterType,
                    StartDate: req.body.startDate,
                },
        ).subscribe(completionHandler(res));
    },
);
