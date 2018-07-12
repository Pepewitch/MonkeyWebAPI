import { Router } from "express";
import { body, oneOf, param } from "express-validator/check";
import { StudentInfo } from "../../../repositories/StudentInfo";
import { authorizeRequestWithAdminPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/",
    authorizeRequestWithAdminPosition,
    body("studentID").isInt(),
    oneOf([
        body("phone").isMobilePhone("th-TH"),
        body("school").isString(),
    ]),
    validateRequest,
    (req, res) => {
        StudentInfo
            .getInstance()
            .set(
                req.body.studentID,
                {
                    Phone: req.body.phone,
                    School: req.body.school,
                },
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:studentID",
    authorizeRequestWithAdminPosition,
    param("studentID").isInt(),
    validateRequest,
    (req, res) => {
        StudentInfo
            .getInstance()
            .delete(req.params.studentID)
            .subscribe(completionHandler(res));
    },
);
