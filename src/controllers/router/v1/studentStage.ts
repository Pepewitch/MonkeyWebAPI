import { Router } from "express";
import { body, param, query } from "express-validator/check";
import { StudentStageList } from "../../../models/v1/studentState";
import { UserPosition } from "../../../models/v1/users";
import { StudentStage } from "../../../repositories/StudentStage";
import { authenticateRequest, authenticateRequestWithAdminPosition, authenticateRequestWithPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/",
    authenticateRequestWithPosition(UserPosition.student),
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentStage.getInstance().get(req.user.id, req.query.quarterID).subscribe(
            (studentStage) => res.status(200).send({ studentStage }),
            errorHandler(res),
        );
    },
);

router.get(
    "/:studentID",
    authenticateRequest,
    param("studentID").isInt(),
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentStage.getInstance().get(req.params.studentID, req.query.quarterID).subscribe(
            (studentState) => res.status(200).send({ studentState }),
            errorHandler(res),
        );
    },
);

router.get(
    "/grade",
    authenticateRequestWithPosition(UserPosition.student),
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentStage.getInstance().grade(req.user.id, req.query.quarterID).subscribe(
            (grade) => res.status(200).send({ grade }),
            errorHandler(res),
        );
    },
);

router.get(
    "/grade/:studentID",
    authenticateRequest,
    param("studentID").isInt(),
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentStage.getInstance().grade(req.params.studentID, req.query.quarterID).subscribe(
            (grade) => res.status(200).send({ grade }),
            errorHandler(res),
        );
    },
);

router.post(
    "/:studentID",
    authenticateRequestWithAdminPosition,
    param("studentID").isInt(),
    body("quarterID").isInt(),
    body("stage").isIn(Object.keys(StudentStageList)),
    body("grade").isInt({ min: 1, max: 12 }).optional(),
    validateRequest,
    (req, res) => {
        StudentStage.getInstance().add(
            req.body.quarterID,
            req.params.studentID,
            req.body.stage,
            req.body.grade,
        ).subscribe(completionHandler(res));
    },
);
