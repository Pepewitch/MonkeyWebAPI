import { Router } from "express";
import { body } from "express-validator/check";
import { QuarterType } from "../../../models/v1/quarter";
import { Quarter } from "../../../repositories/Quarter";
import { completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/add",
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
