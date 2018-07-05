import { Router } from "express";
import { body } from "express-validator/check";
import { StudentStageList } from "../../../models/v1/studentState";
import { StudentStage } from "../../../repositories/StudentStage";
import { authenticateRequest, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/grade",
    authenticateRequest,
    body("studentID").isInt(),
    body("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentStage.getInstance().grade(req.body.studentID, req.body.quarterID).subscribe(
            (grade) => res.status(200).send({ grade }),
            errorHandler(res),
        );
    },
);

router.post(
    "/add",
    body("quarterID").isInt(),
    body("stage").isIn(Object.keys(StudentStageList)),
    body("studentID").isInt(),
    body("grade").isInt({ min: 1, max: 12 }).optional(),
    validateRequest,
    (req, res) => {
        StudentStage.getInstance().add(
            req.body.quarterID,
            req.body.studentID,
            req.body.stage,
            req.body.grade,
        ).subscribe(completionHandler(res));
    },
);
