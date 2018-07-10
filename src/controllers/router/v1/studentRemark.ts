import { Router } from "express";
import { body, param, query } from "express-validator/check";
import { UserPosition } from "../../../models/v1/users";
import { StudentRemark } from "../../../repositories/StudentRemark";
import { authenticateRequest, authenticateRequestWithAdminPosition, authenticateRequestWithPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/",
    authenticateRequestWithPosition(UserPosition.student),
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentRemark.getInstance().get(req.user.id, req.query.quarterID).subscribe(
            (remark) => res.status(200).send({ remark }),
            errorHandler(res),
        );
    },
);

router.get(
    "/:studentID",
    authenticateRequest,
    param("studentID").isInt().optional(),
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentRemark.getInstance().get(req.params.studentID, req.query.quarterID).subscribe(
            (remark) => res.status(200).send({ remark }),
            errorHandler(res),
        );
    },
);

router.post(
    "/:studentID",
    authenticateRequestWithAdminPosition,
    param("studentID").isInt(),
    body("remark").isString(),
    body("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        StudentRemark.getInstance().set(req.body.studentID, req.body.remark, req.body.quarterID).subscribe(completionHandler(res));
    },
);
