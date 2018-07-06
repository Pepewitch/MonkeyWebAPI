import { Router } from "express";
import { body } from "express-validator/check";
import { StudentRemark } from "../../../repositories/StudentRemark";
import { authenticateRequest, authenticateRequestWithAdminPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/set",
    authenticateRequestWithAdminPosition,
    body("studentID").isInt(),
    body("quarterID").isInt().optional(),
    body("remark").isString(),
    validateRequest,
    (req, res) => {
        StudentRemark.getInstance().set(req.body.studentID, req.body.remark, req.body.quarterID).subscribe(completionHandler(res));
    },
);

router.post(
    "/get",
    authenticateRequest,
    body("studentID").isInt(),
    body("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentRemark.getInstance().get(req.body.studentID, req.body.quarterID).subscribe(
            (remark) => res.status(200).send({ remark }),
            errorHandler(res),
        );
    },
);
