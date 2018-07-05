import { Router } from "express";
import { body } from "express-validator/check";
import { StudentStageList } from "../../../models/v1/studentState";
import { UserPosition } from "../../../models/v1/users";
import { StudentStage } from "../../../repositories/StudentStage";
import { authenticateRequest, authenticateRequestWithPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

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
    authenticateRequestWithPosition(UserPosition.student, UserPosition.admin, UserPosition.dev, UserPosition.mel),
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

router.post(
    "/get",
    authenticateRequest,
    body("studentID").isInt(),
    body("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentStage.getInstance().get(req.body.studentID, req.body.quarterID).subscribe(
            (studentStage) => res.status(200).send({ studentStage }),
            errorHandler(res),
        );
    },
);
