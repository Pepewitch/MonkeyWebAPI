import { Router } from "express";
import { body, param } from "express-validator/check";
import { RegStatus } from "../../../models/v1/classReg";
import { UserPosition } from "../../../models/v1/users";
import { ClassReg } from "../../../repositories/ClassReg";
import { authorizeRequestWithAdminPosition, authorizeRequestWithoutPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/",
    authorizeRequestWithoutPosition(UserPosition.tutor, UserPosition.office),
    body("studentID").isInt().optional(),
    body("classID").isInt(),
    body("regStatus").isIn(Object.keys(RegStatus)).optional(),
    validateRequest,
    (req, res) => {
        ClassReg
            .getInstance()
            .add(req.body.studentID || req.user.id, req.body.classID, req.body.regStatus || RegStatus.selected)
            .subscribe(completionHandler(res));
    },
);

router.delete(
    "/:classRegID",
    authorizeRequestWithAdminPosition,
    param("classRegID").isInt(),
    validateRequest,
    (req, res) => {
        ClassReg
            .getInstance()
            .delete(req.params.classRegID)
            .subscribe(completionHandler(res));
    },
);

router.patch(
    "/:classRegID",
    authorizeRequestWithAdminPosition,
    param("classRegID").isInt(),
    body("regStatus").isIn(Object.keys(RegStatus)),
    validateRequest,
    (req, res) => {
        ClassReg
            .getInstance()
            .edit(req.params.classRegID, req.body.RegStatus)
            .subscribe(completionHandler(res));
    },
);
