import { Router } from "express";
import { body, param } from "express-validator/check";
import { RegStatus } from "../../../models/v1/classReg";
import { UserPosition } from "../../../models/v1/users";
import { ClassReg } from "../../../repositories/ClassReg";
import { authenticateRequestWithAdminPosition, authenticateRequestWithoutPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/",
    authenticateRequestWithoutPosition(UserPosition.tutor, UserPosition.office),
    body("studentID").isInt().optional(),
    body("classID").isInt(),
    body("regStatus").isIn(Object.keys(RegStatus)),
    validateRequest,
    (req, res) => {
        ClassReg.getInstance().add(
            req.body.studentID,
            req.body.classID,
            req.body.regStatus,
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:classRegID",
    authenticateRequestWithAdminPosition,
    param("classRegID").isInt(),
    validateRequest,
    (req, res) => {
        ClassReg.getInstance().delete(req.params.classRegID,
        ).subscribe(completionHandler(res));
    },
);

router.patch(
    "/:classRegID",
    authenticateRequestWithAdminPosition,
    param("classRegID").isInt(),
    body("regStatus").isIn(Object.keys(RegStatus)),
    validateRequest,
    (req, res) => {
        ClassReg.getInstance().edit(
            req.params.classRegID,
            req.body.RegStatus,
        ).subscribe(completionHandler(res));
    },
);
