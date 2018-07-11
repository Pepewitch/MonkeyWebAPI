import { Router } from "express";
import { body, oneOf, param, query } from "express-validator/check";
import { ClassType } from "../../../models/v1/class";
import { Class } from "../../../repositories/Class";
import { authenticateRequest, authorizeRequestWithAdminPosition, authorizeRequestWithTutorPosition, completionHandler, errorHandler, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/",
    authenticateRequest,
    query("type").isIn(Object.keys(ClassType)).optional(),
    query("quarterID").isInt().optional(),
    validateRequest,
    (req, res) => {
        Class.getInstance().list(req.body.type, req.body.quarterID).subscribe(
            (classes) => res.status(200).send({ classes }),
            errorHandler(res),
        );
    },
);

// router.get(
//     "/submission",
//     authorizeRequestWithTutorPosition,
//     query("tutorID").isInt().optional(),
//     validateRequest,
//     (req, res) => {
//         if (req.query.tutorID) {

//         } else {

//         }
//     }
// );

router.post(
    "/course",
    authorizeRequestWithAdminPosition,
    body("className").isString(),
    body("quarterID").isInt(),
    body("classSubject").isString(),
    body("classDate").isISO8601(),
    body("tutorID").isInt(),
    validateRequest,
    (req, res) => {
        Class.getInstance().add(
            req.body.className,
            req.body.quarterID,
            req.body.classDate,
            req.body.classSubject,
            req.body.tutorID,
            ClassType.course,
        ).subscribe(completionHandler(res));
    },
);

router.post(
    "/skill",
    authorizeRequestWithAdminPosition,
    body("className").isString(),
    body("quarterID").isInt(),
    body("classSubject").isString(),
    body("classDate").isISO8601(),
    body("tutorID").isInt(),
    validateRequest,
    (req, res) => {
        Class.getInstance().add(
            req.body.className,
            req.body.quarterID,
            req.body.classDate,
            req.body.classSubject,
            req.body.tutorID,
            ClassType.skill,
        ).subscribe(completionHandler(res));
    },
);

router.post(
    "/hybrid",
    authorizeRequestWithAdminPosition,
    body("className").isString(),
    body("quarterID").isInt(),
    body("classSubject").isString(),
    body("classDate").isISO8601(),
    validateRequest,
    (req, res) => {
        Class.getInstance().addWithoutTutor(
            req.body.className,
            req.body.quarterID,
            req.body.classDate,
            req.body.classSubject,
            ClassType.hybrid,
        ).subscribe(completionHandler(res));
    },
);

router.delete(
    "/:classID",
    authorizeRequestWithAdminPosition,
    param("classID").isInt(),
    validateRequest,
    (req, res) => {
        Class.getInstance().delete(req.params.classID).subscribe(completionHandler(res));
    },
);

router.patch(
    "/:classID",
    param("classID").isInt(),
    oneOf([
        body("className").isString(),
        body("quarterID").isInt(),
        body("classDate").isISO8601(),
        body("classSubject").isString(),
        body("grade").isString(),
        body("tutorID").isInt(),
        body("roomID").isInt(),
        body("classDescription").isString(),
        body("classTimes").isInt(),
        body("classType").isIn(Object.keys(ClassType)),
    ]),
    validateRequest,
    (req, res) => {
        Class.getInstance().edit(
            req.params.classID, {
                ClassDate: req.body.classDate,
                ClassDescription: req.body.classDescription,
                ClassName: req.body.className,
                ClassSubject: req.body.classSubject,
                ClassTimes: req.body.classTimes,
                ClassType: req.body.classType,
                Grade: req.body.grade,
                QuarterID: req.body.quarterID,
                RoomID: req.body.roomID,
                TutorID: req.body.tutorID,
            },
        ).subscribe(completionHandler(res));
    },
);
