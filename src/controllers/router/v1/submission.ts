import { Router } from "express";
import { body, param } from "express-validator/check";
import { Submission } from "../../../repositories/Submission";
import { submissionDocuments } from "../util/fileHandler";
import { authorizeRequestWithAdminPosition, authorizeRequestWithTutorPosition, completionHandler, errorHandler, validateFile, validateRequest } from "../util/requestValidator";

export const router = Router();

router.get(
    "/:classID",
    authorizeRequestWithTutorPosition,
    param("classID").isInt(),
    validateRequest,
    (req, res) => {
        Submission
            .getInstance()
            .get(req.params.classID)
            .subscribe(
                (submissions) => res.status(200).send({ submissions }),
                errorHandler(res),
        );
    },
);

router.post(
    "/:classID/:time",
    authorizeRequestWithTutorPosition,
    submissionDocuments,
    validateFile,
    param("classID").isInt(),
    param("time").isInt(),
    validateRequest,
    (req, res) => {
        Submission
            .getInstance()
            .add(req.params.classID, req.params.time, req.files)
            .subscribe(completionHandler(res));
    },
);

router.post(
    "/name/:classID/:time",
    authorizeRequestWithTutorPosition,
    param("classID").isInt(),
    param("time").isInt(),
    body("name").isString(),
    validateRequest,
    (req, res) => {
        Submission
            .getInstance()
            .addTitle(req.params.classID, req.params.time, req.body.name)
            .subscribe(completionHandler(res));
    },
);

router.delete(
    "/:submissionID",
    authorizeRequestWithAdminPosition,
    param("submissionID").isInt(),
    validateRequest,
    (req, res) => {
        Submission
            .getInstance()
            .delete(req.params.submissionID)
            .subscribe(completionHandler(res));
    },
);

router.patch(
    "/:submissionID",
    authorizeRequestWithTutorPosition,
    param("submissionID").isInt(),
    param("submissionName").isString(),
    body("time").isInt(),
    (req, res) => {
        Submission
            .getInstance()
            .edit(
                req.params.submissionID, {
                    SubmissionName: req.body.submissionName,
                    SubmissionTimes: req.body.time,
                },
        ).subscribe(completionHandler(res));
    },
);
