import { Router } from "express";
import { body, oneOf, param } from "express-validator/check";
import { Visibility } from "../../../models/util/context";
import { AttendanceType } from "../../../models/v1/attendance";
import { UserPosition } from "../../../models/v1/users";
import { Attendance } from "../../../repositories/Attendance";
import { authorizeRequestWithAdminPosition, authorizeRequestWithoutPosition, authorizeRequestWithPosition, completionHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.post(
    "/",
    authorizeRequestWithoutPosition(UserPosition.tutor),
    body("studentID").isInt().optional(),
    body("classID").isInt(),
    body("attendanceDate").isISO8601(),
    body("attendanceType").isIn(Object.keys(AttendanceType)),
    body("reason").isString(),
    body("sender").isString(),
    validateRequest,
    (req, res) => {
        Attendance.getInstance().add(
            req.body.studentID || req.user.id,
            req.body.classID,
            req.body.attendanceDate,
            req.body.attendanceType,
            req.body.reason,
            req.body.sender,
        ).subscribe(completionHandler(res));
    },
);

router.patch(
    "/:attendanceID",
    authorizeRequestWithAdminPosition,
    param("attendanceID").isInt(),
    oneOf([
        body("studentID").isInt(),
        body("classID").isInt(),
        body("attendanceDate").isISO8601(),
        body("attendanceType").isIn(Object.keys(AttendanceType)),
        body("reason").isString(),
        body("remark").isString(),
        body("sender").isString(),
        body("visibility").isIn(Object.keys(Visibility)),
    ]),
    validateRequest,
    (req, res) => {
        Attendance.getInstance().edit(
            req.params.attendanceID, {
                AttendanceDate: req.body.attendanceDate,
                AttendanceType: req.body.attendanceType,
                ClassID: req.body.classID,
                Reason: req.body.reason,
                Remark: req.body.remark,
                Sender: req.body.sender,
                StudentID: req.body.studentID,
                Visibility: req.body.visibility,
            },
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:attendanceID",
    authorizeRequestWithPosition(UserPosition.dev),
    param("attendanceID").isInt(),
    validateRequest,
    (req, res) => {
        Attendance.getInstance().delete(req.params.attendanceID).subscribe(completionHandler(res));
    },
);
